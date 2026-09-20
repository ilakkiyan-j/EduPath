import { getAIProvider } from '../providers';
import { RoadmapPlan, RoadmapPlanSchema } from '../schemas/roadmap';
import { SkillGapItem } from '../schemas/skill-gap';

export interface RoadmapAgentInput {
  targetRoleTitle: string;
  gaps: SkillGapItem[];
  weeklyHours: number;
  learningPreference: string;
}

export class RoadmapAgent {
  private provider = getAIProvider();

  async generateRoadmap(input: RoadmapAgentInput): Promise<RoadmapPlan> {
    const systemInstruction = `You are EduPath's Dynamic Roadmap Agent.
Synthesize a personalized, weekly milestone learning plan that respects skill dependency order and the learner's weekly hour budget.
Do NOT generate a generic course list. Target the specific skill gaps identified.
Output pure JSON matching the RoadmapPlan schema.`;

    const prompt = `Target Role: ${input.targetRoleTitle}
Weekly Time Budget: ${input.weeklyHours} hours
Learning Preference: ${input.learningPreference}

Identified Skill Gaps:
${JSON.stringify(input.gaps, null, 2)}

Create an ordered multi-week milestone journey. Focus first on foundational prerequisites (RAG, Tool Calling), progressing towards advanced orchestrations.`;

    const fallbackData: RoadmapPlan = {
      title: `${input.targetRoleTitle} Accelerated Mastery Path`,
      totalWeeks: 4,
      weeklyCommitmentHours: input.weeklyHours,
      rationale: `Structured specifically around your critical gaps in Tool Calling and Agent Orchestration while leveraging your existing REST API and TypeScript strengths.`,
      milestones: [
        {
          weekNumber: 1,
          title: 'Week 1: Advanced RAG & Vector Retrieval',
          description: 'Implement hybrid search, vector embeddings with pgvector, and chunking evaluation.',
          targetSkills: ['RAG Pipelines', 'Embeddings & Vector Databases'],
          estimatedHours: Math.min(input.weeklyHours, 12),
          prerequisites: ['Python', 'REST APIs & HTTP'],
          status: 'completed',
        },
        {
          weekNumber: 2,
          title: 'Week 2: Tool Calling & Agentic Execution',
          description: 'Design deterministic tool schemas, function execution, and agent response parsing.',
          targetSkills: ['Tool Calling & Schema Validation', 'Error Handling & Reliability'],
          estimatedHours: Math.min(input.weeklyHours, 14),
          prerequisites: ['REST APIs & HTTP'],
          status: 'in_progress',
        },
        {
          weekNumber: 3,
          title: 'Week 3: Multi-Agent Systems & Collaboration',
          description: 'Orchestrate supervisor and worker agents with shared state, handoffs, and tool collaboration.',
          targetSkills: ['Multi-Agent Systems', 'AI Agents & Orchestration'],
          estimatedHours: Math.min(input.weeklyHours, 15),
          prerequisites: ['Tool Calling & Schema Validation'],
          status: 'pending',
        },
        {
          weekNumber: 4,
          title: 'Week 4: Production AI Deployment & Telemetry',
          description: 'Deploy resilient agent APIs with streaming tokens, latency monitoring, and rate limiting.',
          targetSkills: ['Production AI Deployment', 'System Design for AI'],
          estimatedHours: Math.min(input.weeklyHours, 15),
          prerequisites: ['Multi-Agent Systems'],
          status: 'pending',
        },
      ],
    };

    return this.provider.generateStructured<RoadmapPlan>({
      prompt,
      systemInstruction,
      schema: RoadmapPlanSchema,
      fallbackData,
    });
  }
}
