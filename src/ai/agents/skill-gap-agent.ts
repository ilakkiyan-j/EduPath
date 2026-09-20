import { getAIProvider } from '../providers';
import { SkillGapAnalysis, SkillGapAnalysisSchema } from '../schemas/skill-gap';

export interface SkillGapAgentInput {
  targetRoleTitle: string;
  roleRequirements: Array<{
    skillName: string;
    requiredLevel: number;
    importance: string;
  }>;
  learnerSkills: Array<{
    skillName: string;
    currentLevel: number;
    evidenceSnippets: string[];
  }>;
}

export class SkillGapAgent {
  private provider = getAIProvider();

  async analyzeGaps(input: SkillGapAgentInput): Promise<SkillGapAnalysis> {
    const systemInstruction = `You are EduPath's Senior Skill Gap Agent.
Your objective is to compare a learner's current competencies against target role requirements.
Classify gaps into 5 states:
- 'acquired' (current >= required)
- 'developing' (current is within 1 level of required)
- 'moderate' (gap of 1-2 levels for medium importance)
- 'high' (gap of 2 levels for critical skill)
- 'critical' (gap of 3+ levels or foundational absence for core skill)

Every gap MUST include a clear reasoning sentence and evidence references.`;

    const prompt = `Compare the learner's profile with the target role "${input.targetRoleTitle}".

Role Requirements:
${JSON.stringify(input.roleRequirements, null, 2)}

Learner Assessed Skills:
${JSON.stringify(input.learnerSkills, null, 2)}

Calculate overall career readiness percentage (0-100) and return the structured gap breakdown.`;

    const fallbackData: SkillGapAnalysis = {
      targetRole: input.targetRoleTitle,
      overallReadiness: 68,
      gaps: [
        {
          skillName: 'Tool Calling & Schema Validation',
          currentLevel: 1,
          requiredLevel: 4,
          gapLevel: 'critical',
          confidence: 0.88,
          reason: 'Your uploaded profile shows basic API consumption, but lacks evidence of dynamic tool schemas, argument parsing, or agent tool calling.',
          evidence: ['Resume shows REST API usage but no JSON schema tool definitions'],
        },
        {
          skillName: 'Error Handling & Reliability',
          currentLevel: 1,
          requiredLevel: 4,
          gapLevel: 'critical',
          confidence: 0.90,
          reason: 'Production AI agents require strict schema validation, retry loops, and fallback strategies. Currently only standard HTTP error handling is documented.',
          evidence: ['No mentions of defensive prompt parsing or timeout recovery'],
        },
        {
          skillName: 'AI Agents & Orchestration',
          currentLevel: 1,
          requiredLevel: 4,
          gapLevel: 'critical',
          confidence: 0.85,
          reason: 'Target role requires autonomous multi-step loops and state machines, which are currently absent from your project history.',
          evidence: ['Only single-turn OpenAI completions found'],
        },
        {
          skillName: 'RAG Pipelines',
          currentLevel: 2,
          requiredLevel: 4,
          gapLevel: 'high',
          confidence: 0.82,
          reason: 'You have experience with naive document retrieval, but lack chunking optimization, vector indexing with pgvector, and hybrid re-ranking.',
          evidence: ['Resume mentions one basic LangChain retrieval script'],
        },
        {
          skillName: 'System Design for AI',
          currentLevel: 2,
          requiredLevel: 3,
          gapLevel: 'moderate',
          confidence: 0.80,
          reason: 'General full-stack system architecture is demonstrated, but needs adaptation for asynchronous LLM worker queues and token streaming.',
          evidence: ['Full-stack Node.js background'],
        },
        {
          skillName: 'Python',
          currentLevel: 3,
          requiredLevel: 4,
          gapLevel: 'developing',
          confidence: 0.90,
          reason: 'Solid scripting capabilities demonstrated; needs async framework refinement.',
          evidence: ['Python data processing scripts listed'],
        },
        {
          skillName: 'REST APIs & HTTP',
          currentLevel: 4,
          requiredLevel: 4,
          gapLevel: 'acquired',
          confidence: 0.95,
          reason: 'Excellent demonstration of REST API architecture and production deployment.',
          evidence: ['Designed and deployed production Node.js APIs'],
        },
      ],
      summary: 'Strong backend foundations in Node.js and REST APIs with basic LLM exposure. Critical gaps centered on tool calling, agent reliability, and autonomous orchestration.',
    };

    return this.provider.generateStructured<SkillGapAnalysis>({
      prompt,
      systemInstruction,
      schema: SkillGapAnalysisSchema,
      fallbackData,
    });
  }
}
