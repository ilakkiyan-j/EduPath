import { AIProvider, CompletionOptions } from './ai-provider';

export class MockProvider implements AIProvider {
  name = 'mock';

  async generateStructured<T>(options: CompletionOptions<T>): Promise<T> {
    if (options.fallbackData) {
      if (options.schema) {
        return options.schema.parse(options.fallbackData);
      }
      return options.fallbackData;
    }
    throw new Error('MockProvider requires fallbackData to be defined for structured output simulation.');
  }

  async generateText(prompt: string, _systemInstruction?: string): Promise<string> {
    if (prompt.toLowerCase().includes('why did you change my roadmap')) {
      return (
        'I adapted your roadmap because your recent evaluation for the Weather Agent task revealed a score of 54% with critical failure in Error Handling and Tool Reliability. ' +
        'Specifically, your tool calling code lacked schema validation and crashed on unexpected responses without retry handling. ' +
        'Because Tool Reliability is an essential prerequisite for Multi-Agent Systems, I inserted Week 2: "Error Handling & Tool Reliability" and Week 3: "Agent Evaluation & Guardrails" ' +
        'to build a rock-solid foundation before moving to complex multi-agent orchestration.'
      );
    }
    return 'EduPath AI Agent is tracking your progress, analyzing evidence, and dynamically optimizing your learning path.';
  }
}
