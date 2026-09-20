import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EvaluationAgent } from '@/ai/agents/evaluation-agent';
import { AdaptationAgent } from '@/ai/agents/adaptation-agent';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const body = await req.json();
    const { code, text, githubUrl } = body;

    const task = await prisma.task.findFirst({
      where: { id: params.id, profile: { userId: session.user.id } },
      include: {
        profile: true,
        roadmapItem: {
          include: {
            roadmap: {
              include: {
                items: { orderBy: { weekNumber: 'asc' } },
              },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    // 1. Create Task Submission
    const submission = await prisma.taskSubmission.create({
      data: {
        taskId: task.id,
        profileId: task.profileId,
        submittedCode: code,
        submittedText: text,
        githubUrl,
      },
    });

    // 2. Parse criteria and run EvaluationAgent
    let requirements: string[] = [];
    let evaluationCriteria: string[] = [];
    try {
      requirements = JSON.parse(task.requirements);
      evaluationCriteria = JSON.parse(task.evaluationCriteria);
    } catch {
      requirements = [task.requirements];
      evaluationCriteria = [task.evaluationCriteria];
    }

    const evaluationAgent = new EvaluationAgent();
    const evaluation = await evaluationAgent.evaluateSubmission({
      taskTitle: task.title,
      requirements,
      evaluationCriteria,
      submission: { code, text, githubUrl },
    });

    // 3. Persist Task Evaluation
    const savedEvaluation = await prisma.taskEvaluation.create({
      data: {
        submissionId: submission.id,
        overallScore: evaluation.overallScore,
        isPassing: evaluation.isPassing,
        skillsDemonstrated: JSON.stringify(evaluation.skillsDemonstrated),
        weakAreas: JSON.stringify(evaluation.weakAreas),
        strengths: JSON.stringify(evaluation.strengths),
        feedback: JSON.stringify(evaluation.feedback),
        recommendedNextAction: evaluation.recommendedNextAction,
      },
    });

    // 4. Update Learner Skill Confidences & Evidence
    const skillProgress: Array<{ skillName: string; level: number; confidence: number }> = [];
    for (const su of evaluation.skillUpdates) {
      const slug = su.skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const skill = await prisma.skill.findUnique({ where: { slug } });
      if (skill) {
        const learnerSkill = await prisma.learnerSkill.findUnique({
          where: {
            profileId_skillId: {
              profileId: task.profileId,
              skillId: skill.id,
            },
          },
        });

        if (learnerSkill) {
          const newConfidence = Math.max(0.1, Math.min(0.99, learnerSkill.confidence + su.confidenceChange));
          await prisma.learnerSkill.update({
            where: { id: learnerSkill.id },
            data: {
              confidence: newConfidence,
              level: su.newLevel,
            },
          });

          await prisma.skillEvidence.create({
            data: {
              learnerSkillId: learnerSkill.id,
              source: 'evaluation',
              snippet: `Task "${task.title}" scored ${evaluation.overallScore}%. ${su.reason}`,
              confidence: newConfidence,
            },
          });

          skillProgress.push({ skillName: su.skillName, level: su.newLevel, confidence: newConfidence });
        }
      }
    }

    // 4b. Persist Progress History (learner memory telemetry)
    const updatedSkills = await prisma.learnerSkill.findMany({
      where: { profileId: task.profileId },
    });
    const avgConfidence = updatedSkills.length
      ? Math.round((updatedSkills.reduce((a, s) => a + s.confidence, 0) / updatedSkills.length) * 100)
      : 0;

    await prisma.progressHistory.createMany({
      data: [
        {
          profileId: task.profileId,
          metric: 'task_score',
          value: evaluation.overallScore,
          metadata: JSON.stringify({ taskId: task.id, taskTitle: task.title }),
        },
        ...skillProgress.map(sp => ({
          profileId: task.profileId,
          metric: 'skill_confidence',
          value: sp.confidence,
          metadata: JSON.stringify({ skillName: sp.skillName, level: sp.level }),
        })),
        {
          profileId: task.profileId,
          metric: 'readiness',
          value: avgConfidence,
          metadata: JSON.stringify({ source: 'post_evaluation' }),
        },
      ],
    });

    // 4c. Learner Memory — weak & strong area tracking
    for (const weak of evaluation.weakAreas) {
      const existing = await prisma.learnerMemory.findFirst({
        where: { profileId: task.profileId, category: 'weak_area', key: weak },
      });
      const nextConfidence = existing ? Math.max(0.1, existing.confidence - 0.1) : 0.55;
      const memo = `Evaluation failure in "${task.title}" (Score ${evaluation.overallScore}%). Repeated weakness evidence: ${weak}. ${evaluation.recommendedNextAction}`;
      if (existing) {
        await prisma.learnerMemory.update({
          where: { id: existing.id },
          data: {
            value: memo,
            confidence: nextConfidence,
            evidence: `Task "${task.title}" scored ${evaluation.overallScore}%`,
          },
        });
      } else {
        await prisma.learnerMemory.create({
          data: {
            profileId: task.profileId,
            category: 'weak_area',
            key: weak,
            value: memo,
            confidence: nextConfidence,
            evidence: `Task "${task.title}" scored ${evaluation.overallScore}%`,
          },
        });
      }
    }

    for (const strong of evaluation.skillsDemonstrated) {
      const existing = await prisma.learnerMemory.findFirst({
        where: { profileId: task.profileId, category: 'strong_area', key: strong },
      });
      const nextConfidence = existing ? Math.min(0.99, existing.confidence + 0.1) : 0.7;
      const memo = `Demonstrated in "${task.title}" (Score ${evaluation.overallScore}%): ${strong}`;
      if (existing) {
        await prisma.learnerMemory.update({
          where: { id: existing.id },
          data: { value: memo, confidence: nextConfidence, evidence: `Passing evaluation evidence` },
        });
      } else {
        await prisma.learnerMemory.create({
          data: {
            profileId: task.profileId,
            category: 'strong_area',
            key: strong,
            value: memo,
            confidence: nextConfidence,
            evidence: `Passing evaluation evidence`,
          },
        });
      }
    }

    // 5. Check for Adaptation Trigger
    let adaptationData = null;
    const roadmap = task.roadmapItem?.roadmap;

    if (roadmap) {
      const adaptationAgent = new AdaptationAgent();
      const currentMilestones = roadmap.items.map(i => ({
        weekNumber: i.weekNumber,
        title: i.title,
        description: i.description,
        targetSkills: i.targetSkills.split(',').map(s => s.trim()),
        status: i.status,
      }));

      adaptationData = await adaptationAgent.adaptRoadmap({
        currentRoadmapTitle: roadmap.title,
        currentMilestones,
        latestEvaluation: evaluation,
        repeatedWeaknesses: evaluation.weakAreas,
      });

      if (adaptationData.adaptationTriggered) {
        // Save Adaptation Record
        await prisma.roadmapAdaptation.create({
          data: {
            roadmapId: roadmap.id,
            triggerType: 'weak_evaluation',
            reason: adaptationData.reason,
            evidence: adaptationData.evidence,
            diffSummary: adaptationData.agentSummaryForLearner,
          },
        });

        // Delete previous non-completed milestones and recreate adapted milestones
        const completedItems = roadmap.items.filter(i => i.status === 'completed');
        await prisma.roadmapItem.deleteMany({
          where: {
            roadmapId: roadmap.id,
            status: { not: 'completed' },
          },
        });

        for (let idx = 0; idx < adaptationData.modifiedMilestones.length; idx++) {
          const m = adaptationData.modifiedMilestones[idx];
          // If already completed in the past, skip re-creating
          if (completedItems.some(c => c.weekNumber === m.weekNumber)) continue;

          await prisma.roadmapItem.create({
            data: {
              roadmapId: roadmap.id,
              weekNumber: m.weekNumber,
              orderIndex: idx,
              title: m.title,
              description: m.description,
              targetSkills: m.targetSkills.join(', '),
              estimatedHours: 12,
              status: m.status,
              adaptationNote: m.justification,
            },
          });
        }

        // Log Agent Event for Adaptation
        await prisma.agentEvent.create({
          data: {
            profileId: task.profileId,
            agentName: 'AdaptationAgent',
            action: 'adapted_roadmap',
            description: `Dynamic Roadmap Adaptation Triggered! Score ${evaluation.overallScore}% in "${task.title}". Injected prerequisite modules before Multi-Agent Systems.`,
            evidence: adaptationData.evidence,
            outputData: JSON.stringify(adaptationData),
          },
        });

        // Save to Learner Memory
        await prisma.learnerMemory.create({
          data: {
            profileId: task.profileId,
            category: 'weak_area',
            key: 'Tool Reliability & Defensive Error Handling',
            value: `Evaluation failure on ${task.title} (Score ${evaluation.overallScore}%). Missing runtime schemas and retry logic.`,
            evidence: adaptationData.evidence,
          },
        });
      }
    }

    // 6. Log Evaluation Agent Event
    await prisma.agentEvent.create({
      data: {
        profileId: task.profileId,
        agentName: 'EvaluationAgent',
        action: 'evaluated_task',
        description: `Evaluated submission for "${task.title}". Overall Score: ${evaluation.overallScore}%. ${evaluation.isPassing ? 'Passed' : 'Failed'}.`,
        evidence: `Demonstrated: ${evaluation.skillsDemonstrated.join(', ')}. Weaknesses: ${evaluation.weakAreas.join(', ')}.`,
        outputData: JSON.stringify(evaluation),
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: task.id },
      data: { status: evaluation.isPassing ? 'completed' : 'submitted' },
    });

    return NextResponse.json({
      success: true,
      data: {
        evaluation: savedEvaluation,
        parsedEvaluation: evaluation,
        adaptation: adaptationData,
      },
    });
  } catch (error: any) {
    console.error('Error submitting task:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
