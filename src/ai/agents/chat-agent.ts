import { getAIProvider } from '../providers';

export interface ChatAgentContext {
  targetRole: string;
  readinessScore: number;
  extractedSkills: string[];
  criticalGaps: string[];
  currentRoadmapTitle: string;
  activeMilestoneTitle: string;
  recentAdaptations: Array<{ reason: string; evidence: string; date: string }>;
  latestEvaluation?: { score: number; weakAreas: string[]; feedback: string };
  weeklyHours: number;
  learnerMemory?: {
    weakAreas: Array<{ key: string; value: string; confidence: number }>;
    strongAreas: Array<{ key: string; value: string; confidence: number }>;
  };
}

export class ChatAgent {
  private provider = getAIProvider();

  async answerQuestion(
    userMessage: string,
    context: ChatAgentContext,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    const weakMemory = context.learnerMemory?.weakAreas || [];
    const strongMemory = context.learnerMemory?.strongAreas || [];

    const systemInstruction = `You are EduPath's Natural Language Learning Assistant.
You have direct, real-time access to the learner's complete state: their profile, active roadmap, recent evaluations, persistent learner memory, and agent decision logs.

CRITICAL RULES:
1. Always answer grounded in the learner's ACTUAL state. Never give generic, boilerplate textbook replies when personalized context is available.
2. If asked "Why did you change my roadmap?", explain the exact decision made by the Adaptation Agent using the score, specific failed skills, and the architectural reason why those skills are prerequisites for subsequent milestones.
3. Be encouraging, highly technical, and concise.`;

    const prompt = `Learner Context:
- Target Role: ${context.targetRole} (${context.readinessScore}% Career Readiness)
- Key Skills: ${context.extractedSkills.join(', ')}
- Critical Gaps: ${context.criticalGaps.join(', ')}
- Active Milestone: ${context.activeMilestoneTitle}
- Weekly Availability: ${context.weeklyHours} hrs/week
- Recent Roadmap Adaptations: ${JSON.stringify(context.recentAdaptations)}
- Latest Evaluation: ${JSON.stringify(context.latestEvaluation)}
- Persistent Learner Memory - Weak Areas: ${JSON.stringify(weakMemory)}
- Persistent Learner Memory - Strong Areas: ${JSON.stringify(strongMemory)}

Recent Conversation:
${conversationHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER QUESTION: "${userMessage}"

Provide your grounded response:`;

    // High fidelity fallback for offline / mock testing
    if (this.provider.name === 'mock' || !process.env.GEMINI_API_KEY) {
      const lower = userMessage.toLowerCase();
      if (lower.includes('why did you change my roadmap') || lower.includes('why was my roadmap changed') || lower.includes('change')) {
        const evalRef = context.latestEvaluation
          ? `your latest evaluation on **${context.activeMilestoneTitle}** scored **${context.latestEvaluation.score}%** with critical deficiencies in **${context.latestEvaluation.weakAreas.join(', ')}**`
          : `a recent evaluation flagged weaknesses in your tool reliability`;
        const memoryRef = weakMemory.length
          ? ` My learner memory for you now records: ${weakMemory.map(w => `${w.key} (confidence ${Math.round(w.confidence * 100)}%)`).join('; ')}.`
          : '';
        return (
          `I changed your roadmap because ${evalRef}.${memoryRef}\n\n` +
          `**Evidence from your submission:**\n` +
          `- Your tool calling handler lacked runtime schema validation against the parameters schema.\n` +
          `- Uncaught network exceptions and timeouts resulted in unhandled crashes.\n\n` +
          `**Why this required adapting your roadmap:**\n` +
          `Multi-Agent Systems rely on deterministic, self-healing tool calling. Attempting to orchestrate multi-agent swarms without solid error recovery leads to compounding cascading failures. ` +
          `Therefore, I injected remedial prerequisite weeks to reinforce tool reliability before you advance to Multi-Agent Systems.`
        );
      }
      if (lower.includes('what am i weakest at') || lower.includes('weakness')) {
        if (weakMemory.length) {
          const top = weakMemory[0];
          return `Based on my persistent learner memory, your top weaknesses are **${weakMemory.map(w => w.key).slice(0, 3).join(', ')}** (strongest signal: "${top.value}"). I recommend a remediation week before advancing to advanced orchestration.`;
        }
        return `Based on your recent evaluations and skill gap analysis, your top critical weaknesses are **Error Handling & Reliability** and **Tool Schema Validation**. Your foundational skills in REST APIs and TypeScript are strong, but production resilience needs reinforcement.`;
      }
      if (lower.includes('today') || lower.includes('what should i learn')) {
        const fixFocus = context.latestEvaluation?.feedback || context.activeMilestoneTitle;
        return `Today you should focus on **${context.activeMilestoneTitle}**. Priority action: **${fixFocus}**. ${strongMemory.length ? `You've already demonstrated ${strongMemory.map(s => s.key).slice(0, 2).join(' and ')}, so keep pushing the weak areas.` : ''}`;
      }
      if (lower.includes('how close') || lower.includes('readiness')) {
        return `You are currently at **${context.readinessScore}% Career Readiness** for the **${context.targetRole}** role. Closing your critical gaps in Tool Calling, Error Handling, and Autonomous Orchestration will bring you above 85%.`;
      }
    }

    return this.provider.generateText(prompt, systemInstruction);
  }
}
