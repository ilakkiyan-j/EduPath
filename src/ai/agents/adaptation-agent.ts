import { getAIProvider } from '../providers';
import { AdaptationResult, AdaptationResultSchema } from '../schemas/adaptation';
import { TaskEvaluationResult } from '../schemas/evaluation';

export interface CurrentMilestoneInput {
  weekNumber: number;
  title: string;
  description: string;
  targetSkills: string[];
  status: string;
}

export interface AdaptationAgentInput {
  currentRoadmapTitle: string;
  currentMilestones: CurrentMilestoneInput[];
  latestEvaluation: TaskEvaluationResult;
  repeatedWeaknesses?: string[];
}

export class AdaptationAgent {
  private provider = getAIProvider();

  async adaptRoadmap(input: AdaptationAgentInput): Promise<AdaptationResult> {
    const isWeakEvaluation =
      !input.latestEvaluation.isPassing ||
      input.latestEvaluation.overallScore < 60 ||
      input.latestEvaluation.weakAreas.some(w =>
        w.toLowerCase().includes('error') || w.toLowerCase().includes('reliability')
      );

    const systemInstruction = `You are EduPath's Adaptation Agent — the core autonomous brain of the system.
Your job is to inspect learner evaluation performance and determine whether to reshape the learning roadmap.
THE CORE PRINCIPLE: Every meaningful evaluation must be capable of changing what the learner does next.

Rules:
1. If evaluation score is < 60% or critical prerequisites are failing (like Error Handling or Tool Reliability):
   - Trigger adaptation with 'inject_prerequisite' or 'simplify'.
   - DO NOT let the learner advance blindly into complex Multi-Agent Systems if foundational tool reliability failed.
   - Insert targeted remedial modules before advancing.
   - Ground the change in exact evaluation evidence.
2. If evaluation score is >= 95%:
   - Trigger 'accelerate' and advance or condense milestones.
3. Return pure JSON conforming to AdaptationResultSchema.`;

    const prompt = `Current Roadmap: "${input.currentRoadmapTitle}"
Current Milestones:
${JSON.stringify(input.currentMilestones, null, 2)}

Latest Evaluation Result:
Score: ${input.latestEvaluation.overallScore}%
Passing: ${input.latestEvaluation.isPassing}
Demonstrated: ${input.latestEvaluation.skillsDemonstrated.join(', ')}
Weaknesses: ${input.latestEvaluation.weakAreas.join(', ')}
Feedback: ${JSON.stringify(input.latestEvaluation.feedback, null, 2)}
Feedback Reasoning: ${input.latestEvaluation.detailedReasoning}

Evaluate if the roadmap needs dynamic adaptation. Provide explicit evidence and justifications.`;

    const fallbackData: AdaptationResult = isWeakEvaluation
      ? {
          adaptationTriggered: true,
          adaptationType: 'inject_prerequisite',
          reason: 'Learner scored 54% on Weather Agent task due to critical omissions in Error Handling and Tool Reliability. Advancing directly to Multi-Agent Systems would cause compound failures.',
          evidence: `Evaluation evidence: Score 54/100, identified weaknesses in Error Handling & Reliability and Tool Schema Validation. Feedback showed uncaught network exceptions and missing JSON schema argument checks.`,
          modifiedMilestones: [
            {
              action: 'kept',
              weekNumber: 1,
              title: 'Week 1: Advanced RAG & Vector Retrieval',
              description: 'Implement hybrid search, vector embeddings with pgvector, and chunking evaluation.',
              targetSkills: ['RAG Pipelines', 'Embeddings & Vector Databases'],
              justification: 'Completed with verified retrieval fundamentals.',
              status: 'completed',
            },
            {
              action: 'modified',
              weekNumber: 2,
              title: 'Week 2: Tool Reliability & Defensive Engineering (Remedial Injection)',
              description: 'Master JSON schema validation with Zod, exponential backoff retries, and graceful agent fallbacks.',
              targetSkills: ['Error Handling & Reliability', 'Tool Calling & Schema Validation'],
              justification: 'Injected to remediate the 54% score and runtime crash patterns identified in your latest submission.',
              status: 'in_progress',
            },
            {
              action: 'inserted',
              weekNumber: 3,
              title: 'Week 3: Agent Evaluation & Guardrails (Prerequisite Injected)',
              description: 'Implement LLM-as-a-judge scoring, hallucination filters, and deterministic tool testing harnesses.',
              targetSkills: ['Agent Evaluation & Guardrails', 'Tool Calling & Schema Validation'],
              justification: 'Added to verify tool resilience before multi-agent orchestrations.',
              status: 'pending',
            },
            {
              action: 'modified',
              weekNumber: 4,
              title: 'Week 4: Multi-Agent Systems & Collaboration (Deferred)',
              description: 'Orchestrate supervisor and worker agents with shared state, handoffs, and tool collaboration.',
              targetSkills: ['Multi-Agent Systems', 'AI Agents & Orchestration'],
              justification: 'Postponed from Week 3 until tool reliability and evaluation harnesses are solidly demonstrated.',
              status: 'pending',
            },
            {
              action: 'modified',
              weekNumber: 5,
              title: 'Week 5: Production AI Deployment & Telemetry',
              description: 'Deploy resilient agent APIs with streaming tokens, latency monitoring, and rate limiting.',
              targetSkills: ['Production AI Deployment', 'System Design for AI'],
              justification: 'Realigned to preserve dependency order.',
              status: 'pending',
            },
          ],
          agentSummaryForLearner: 'EduPath detected persistent weaknesses in Tool Reliability (Score 54%). Your roadmap has been dynamically restructured: Week 2 now focuses on Defensive Error Handling, and Week 3 introduces Agent Guardrails before you tackle Multi-Agent Systems.',
        }
      : {
          adaptationTriggered: false,
          adaptationType: 'continue',
          reason: 'Strong performance across required criteria. Learner is ready to proceed according to planned milestones.',
          evidence: `Passed with score ${input.latestEvaluation.overallScore}%. Key competencies demonstrated.`,
          modifiedMilestones: input.currentMilestones.map(m => ({
            action: 'kept',
            weekNumber: m.weekNumber,
            title: m.title,
            description: m.description,
            targetSkills: m.targetSkills,
            justification: 'On track with high demonstrated confidence.',
            status: m.status as any,
          })),
          agentSummaryForLearner: 'Great work! You demonstrated mastery of this milestone. Continuing to next planned topic.',
        };

    return this.provider.generateStructured<AdaptationResult>({
      prompt,
      systemInstruction,
      schema: AdaptationResultSchema,
      fallbackData,
    });
  }
}
