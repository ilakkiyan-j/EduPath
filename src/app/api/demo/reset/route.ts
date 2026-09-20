import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession, getCurrentProfileId, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const profileId = await getCurrentProfileId();
    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const profile = await prisma.learnerProfile.findUnique({
      where: { id: profileId },
      include: { roadmaps: { include: { items: true } } },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const activeRoadmap = profile.roadmaps.find(r => r.status === 'active');
    if (activeRoadmap) {
      // Clear adaptations
      await prisma.roadmapAdaptation.deleteMany({
        where: { roadmapId: activeRoadmap.id },
      });

      // Reset milestones to initial state
      await prisma.roadmapItem.deleteMany({
        where: { roadmapId: activeRoadmap.id },
      });

      await prisma.roadmapItem.createMany({
        data: [
          {
            roadmapId: activeRoadmap.id,
            weekNumber: 1,
            orderIndex: 0,
            title: 'Week 1: Advanced RAG & Vector Retrieval',
            description: 'Implement hybrid search, vector embeddings with pgvector, and chunking evaluation.',
            targetSkills: 'RAG Pipelines, Embeddings & Vector Databases',
            estimatedHours: 12,
            status: 'completed',
          },
          {
            roadmapId: activeRoadmap.id,
            weekNumber: 2,
            orderIndex: 1,
            title: 'Week 2: Tool Calling & Agentic Execution',
            description: 'Design deterministic tool schemas, function execution, and agent response parsing.',
            targetSkills: 'Tool Calling & Schema Validation',
            estimatedHours: 14,
            status: 'in_progress',
          },
          {
            roadmapId: activeRoadmap.id,
            weekNumber: 3,
            orderIndex: 2,
            title: 'Week 3: Multi-Agent Systems & Collaboration',
            description: 'Orchestrate supervisor and worker agents with shared state and handoffs.',
            targetSkills: 'Multi-Agent Systems, AI Agents & Orchestration',
            estimatedHours: 15,
            status: 'pending',
          },
          {
            roadmapId: activeRoadmap.id,
            weekNumber: 4,
            orderIndex: 3,
            title: 'Week 4: Production AI Deployment & Telemetry',
            description: 'Deploy resilient agent APIs with streaming, monitoring, and rate limiting.',
            targetSkills: 'Production AI Deployment, System Design for AI',
            estimatedHours: 15,
            status: 'pending',
          },
        ],
      });
    }

    // Reset task submission
    const weatherTask = await prisma.task.findFirst({
      where: { profileId: profile.id },
    });

    if (weatherTask) {
      await prisma.taskSubmission.deleteMany({
        where: { taskId: weatherTask.id },
      });
      await prisma.task.update({
        where: { id: weatherTask.id },
        data: { status: 'in_progress' },
      });
    }

    // Reset skill confidences
    const toolSkill = await prisma.skill.findUnique({ where: { slug: 'tool-calling' } });
    if (toolSkill) {
      await prisma.learnerSkill.updateMany({
        where: { profileId: profile.id, skillId: toolSkill.id },
        data: { level: 1, confidence: 0.5 },
      });
    }

    const errorSkill = await prisma.skill.findUnique({ where: { slug: 'error-handling' } });
    if (errorSkill) {
      await prisma.learnerSkill.updateMany({
        where: { profileId: profile.id, skillId: errorSkill.id },
        data: { level: 1, confidence: 0.45 },
      });
    }

    // Log Event
    await prisma.agentEvent.create({
      data: {
        profileId: profile.id,
        agentName: 'System',
        action: 'demo_reset',
        description: 'Reset state to pristine baseline (before flawed submission).',
        evidence: 'Initial 4-milestone roadmap restored.',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Demo state reset successfully!',
    });
  } catch (error: any) {
    console.error('Error resetting demo state:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
