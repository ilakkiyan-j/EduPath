import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ChatAgent } from '@/ai/agents/chat-agent';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        targetRole: true,
        preference: true,
        skills: { include: { skill: true } },
        gaps: { include: { skill: true } },
        roadmaps: {
          where: { status: 'active' },
          include: {
            items: { orderBy: { weekNumber: 'asc' } },
            adaptations: { orderBy: { createdAt: 'desc' }, take: 3 },
          },
        },
        submissions: {
          include: { evaluation: true, task: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        memories: {
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Learner profile not found' }, { status: 404 });
    }

    const activeRoadmap = profile.roadmaps[0];
    const activeMilestone =
      activeRoadmap?.items.find(i => i.status === 'in_progress') ||
      activeRoadmap?.items[0];

    const latestSubmission = profile.submissions[0];
    const latestEval = latestSubmission?.evaluation;

    let parsedWeakAreas: string[] = [];
    if (latestEval?.weakAreas) {
      try {
        parsedWeakAreas = JSON.parse(latestEval.weakAreas);
      } catch {
        parsedWeakAreas = [latestEval.weakAreas];
      }
    }

    const chatContext = {
      targetRole: profile.targetRole?.title || 'AI Engineer',
      readinessScore: profile.careerReadiness,
      extractedSkills: profile.skills.map(s => s.skill.name),
      criticalGaps: profile.gaps
        .filter(g => g.gapLevel === 'critical' || g.gapLevel === 'high')
        .map(g => g.skill.name),
      currentRoadmapTitle: activeRoadmap?.title || 'Personalized Learning Plan',
      activeMilestoneTitle: activeMilestone?.title || 'Initial Milestone',
      recentAdaptations: activeRoadmap?.adaptations.map(a => ({
        reason: a.reason,
        evidence: a.evidence,
        date: a.createdAt.toISOString(),
      })) || [],
      latestEvaluation: latestEval
        ? {
            score: latestEval.overallScore,
            weakAreas: parsedWeakAreas,
            feedback: latestEval.recommendedNextAction,
          }
        : undefined,
      weeklyHours: profile.preference?.weeklyHours || 15,
      learnerMemory: {
        weakAreas: profile.memories
          .filter(m => m.category === 'weak_area')
          .map(m => ({ key: m.key, value: m.value, confidence: m.confidence })),
        strongAreas: profile.memories
          .filter(m => m.category === 'strong_area')
          .map(m => ({ key: m.key, value: m.value, confidence: m.confidence })),
      },
    };

    // Persist a snapshot of learner memory for auditability
    await prisma.learnerMemory.create({
      data: {
        profileId: profile.id,
        category: 'milestone_note',
        key: activeMilestone?.title || 'initial',
        value: `Discussed "${message.slice(0, 60)}..." while on milestone: ${activeMilestone?.title || 'n/a'}`,
        evidence: 'ChatAgent grounding snapshot',
      },
    });

    const chatAgent = new ChatAgent();
    const answer = await chatAgent.answerQuestion(message, chatContext, history || []);

    // Save interaction to AgentEvent
    await prisma.agentEvent.create({
      data: {
        profileId: profile.id,
        agentName: 'ChatAgent',
        action: 'answered_question',
        description: `Answered question: "${message.slice(0, 60)}..."`,
        evidence: `Directly referenced ${chatContext.recentAdaptations.length} adaptations and evaluation score ${latestEval?.overallScore ?? 'N/A'}%`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        reply: answer,
        groundingContext: {
          role: chatContext.targetRole,
          readiness: chatContext.readinessScore,
          activeMilestone: chatContext.activeMilestoneTitle,
        },
      },
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
