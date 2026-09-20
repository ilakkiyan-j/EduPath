import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentProfile, getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const profile = await getCurrentProfile();

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const [history, evaluations, adaptations, memories, tasksCompleted, submissions] = await Promise.all([
      prisma.progressHistory.findMany({
        where: { profileId: profile.id },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.taskEvaluation.findMany({
        include: { submission: { include: { task: true } } },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.roadmapAdaptation.findMany({
        where: { roadmap: { profileId: profile.id } },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.learnerMemory.findMany({
        where: { profileId: profile.id },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.task.count({ where: { profileId: profile.id, status: 'completed' } }),
      prisma.taskSubmission.count({ where: { profileId: profile.id } }),
    ]);

    const parseMeta = (raw: string | null) => {
      if (!raw) return {};
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    };

    const readinessHistory = history
      .filter(h => h.metric === 'readiness')
      .map(h => ({ value: h.value, createdAt: h.createdAt }));

    const skillConfidenceHistory = history
      .filter(h => h.metric === 'skill_confidence')
      .map(h => ({ ...parseMeta(h.metadata), value: h.value, createdAt: h.createdAt }));

    const taskScoreHistory = history
      .filter(h => h.metric === 'task_score')
      .map(h => ({ ...parseMeta(h.metadata), value: h.value, createdAt: h.createdAt }));

    const evaluationSeries = evaluations.map(e => ({
      score: e.overallScore,
      isPassing: e.isPassing,
      taskTitle: e.submission?.task?.title || 'Unknown task',
      createdAt: e.createdAt,
    }));

    const memoryStats = {
      weakAreas: memories
        .filter(m => m.category === 'weak_area')
        .sort((a, b) => a.confidence - b.confidence)
        .map(m => ({ key: m.key, value: m.value, confidence: m.confidence, updatedAt: m.updatedAt })),
      strongAreas: memories
        .filter(m => m.category === 'strong_area')
        .sort((a, b) => b.confidence - a.confidence)
        .map(m => ({ key: m.key, value: m.value, confidence: m.confidence, updatedAt: m.updatedAt })),
    };

    const passingCount = evaluations.filter(e => e.isPassing).length;

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          careerReadiness: profile.careerReadiness,
          targetRole: profile.targetRole?.title || 'AI Engineer',
          name: profile.summary,
        },
        stats: {
          evaluationsCompleted: evaluations.length,
          passingCount,
          adaptedCount: adaptations.length,
          tasksCompleted,
          submissions,
        },
        evaluationSeries,
        readinessHistory,
        skillConfidenceHistory,
        taskScoreHistory,
        memoryStats,
      },
    });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}