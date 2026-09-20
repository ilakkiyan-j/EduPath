import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RoadmapAgent } from '@/ai/agents/roadmap-agent';
import { PracticeAgent } from '@/ai/agents/practice-agent';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const body = await req.json().catch(() => ({}));
    const weeklyHours = body.weeklyHours || 15;
    const learningPreference = body.learningPreference || 'hands-on';

    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        targetRole: true,
        gaps: { include: { skill: true } },
      },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const targetRoleTitle = profile.targetRole?.title || 'AI Engineer';

    const gaps = profile.gaps.map(g => ({
      skillName: g.skill.name,
      currentLevel: g.currentLevel,
      requiredLevel: g.requiredLevel,
      gapLevel: g.gapLevel as any,
      confidence: g.confidence,
      reason: g.reason || '',
      evidence: [],
    }));

    const roadmapAgent = new RoadmapAgent();
    const plan = await roadmapAgent.generateRoadmap({
      targetRoleTitle,
      gaps,
      weeklyHours,
      learningPreference,
    });

    // Archive previous active roadmaps
    await prisma.roadmap.updateMany({
      where: { profileId: profile.id, status: 'active' },
      data: { status: 'archived' },
    });

    // Create new active roadmap
    const roadmap = await prisma.roadmap.create({
      data: {
        profileId: profile.id,
        title: plan.title,
        totalWeeks: plan.totalWeeks,
        status: 'active',
        items: {
          create: plan.milestones.map((m, idx) => ({
            weekNumber: m.weekNumber,
            orderIndex: idx,
            title: m.title,
            description: m.description,
            targetSkills: m.targetSkills.join(', '),
            estimatedHours: m.estimatedHours,
            status: m.status,
          })),
        },
      },
      include: { items: true },
    });

    // Generate Practice Task for the in-progress milestone
    const inProgressItem = roadmap.items.find(i => i.status === 'in_progress') || roadmap.items[0];
    if (inProgressItem) {
      const practiceAgent = new PracticeAgent();
      const taskGen = await practiceAgent.generateTask({
        milestoneTitle: inProgressItem.title,
        targetSkills: inProgressItem.targetSkills.split(',').map(s => s.trim()),
      });

      await prisma.task.create({
        data: {
          profileId: profile.id,
          roadmapItemId: inProgressItem.id,
          title: taskGen.title,
          description: taskGen.description,
          difficulty: taskGen.difficulty,
          targetSkills: JSON.stringify(taskGen.targetSkills),
          requirements: JSON.stringify(taskGen.requirements),
          expectedOutcome: taskGen.expectedOutcome,
          starterCode: taskGen.starterCode,
          evaluationCriteria: JSON.stringify(taskGen.evaluationCriteria),
          estimatedMinutes: taskGen.estimatedMinutes,
          status: 'in_progress',
        },
      });
    }

    // Log Agent Event
    await prisma.agentEvent.create({
      data: {
        profileId: profile.id,
        agentName: 'RoadmapAgent',
        action: 'generated_roadmap',
        description: `Synthesized ${plan.totalWeeks}-week personalized learning roadmap for ${targetRoleTitle}.`,
        evidence: `Organized by skill dependencies: ${plan.milestones.map(m => m.title).join(' → ')}`,
        outputData: JSON.stringify(plan),
      },
    });

    return NextResponse.json({
      success: true,
      data: roadmap,
    });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
