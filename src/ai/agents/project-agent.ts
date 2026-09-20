import { getAIProvider } from '../providers';
import { GeneratedProjectData, GeneratedProjectSchema } from '../schemas/project';

export interface ProjectAgentInput {
  targetRoleTitle: string;
  existingSkills: string[];
  missingSkills: string[];
}

export class ProjectAgent {
  private provider = getAIProvider();

  async generateProject(input: ProjectAgentInput): Promise<GeneratedProjectData> {
    const systemInstruction = `You are EduPath's Project Synthesis Agent.
Your objective is to invent an end-to-end practical project that simultaneously builds and proves multiple missing technical skills while leveraging existing competencies.
Always explain 'whyThisProject' explicitly detailing which skill gaps it resolves.`;

    const prompt = `Target Role: ${input.targetRoleTitle}
Learner Existing Skills: ${input.existingSkills.join(', ')}
Missing Skills to Close: ${input.missingSkills.join(', ')}

Synthesize a comprehensive capstone project.`;

    const fallbackData: GeneratedProjectData = {
      title: 'Autonomous AI Support Agent with RAG & Resilient Tool Calling',
      description: 'An enterprise-grade customer support copilot that indexes documentation via vector RAG, interacts with simulated ticketing and billing APIs via strict tool calling, and features self-healing retry strategies.',
      difficulty: 'advanced',
      skillsDeveloped: [
        'Tool Calling & Schema Validation',
        'Error Handling & Reliability',
        'AI Agents & Orchestration',
        'RAG Pipelines',
        'System Design for AI',
      ],
      whyThisProject: 'Directly develops your 3 most critical gaps (Tool Calling, Error Handling, and Orchestration) within a single production-caliber repository to prove your capability to employers.',
      requirements: [
        'Interactive Next.js chat interface with streaming tokens and thought indicators',
        'PostgreSQL with pgvector knowledge base ingestion pipeline with chunking evaluation',
        'Autonomous tool calling engine interacting with Order, Refund, and Shipping APIs',
        'Defensive error handling wrapper with timeout triggers, backoff retries, and fallback messages',
        'Docker containerization with health checks and latency telemetry',
      ],
      evaluationCriteria: [
        'Architecture and separation of tool schemas from business logic',
        'Correctness of retrieval precision and source attribution in citations',
        'Resilience under simulated 500 error spikes and malformed API payloads',
      ],
      estimatedHours: 18,
    };

    return this.provider.generateStructured<GeneratedProjectData>({
      prompt,
      systemInstruction,
      schema: GeneratedProjectSchema,
      fallbackData,
    });
  }
}
