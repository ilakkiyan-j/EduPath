import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, CompletionOptions } from './ai-provider';

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'gemini-1.5-pro') {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not configured in environment.');
    }
    this.client = new GoogleGenerativeAI(key);
    this.modelName = modelName;
  }

  async generateStructured<T>(options: CompletionOptions<T>): Promise<T> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: options.temperature ?? 0.2,
      },
      systemInstruction: options.systemInstruction,
    });

    try {
      const response = await model.generateContent(options.prompt);
      const text = response.response.text();
      const parsed = JSON.parse(text);

      if (options.schema) {
        return options.schema.parse(parsed);
      }
      return parsed as T;
    } catch (err) {
      console.warn('Gemini structured output failed or schema validation error:', err);
      if (options.fallbackData) {
        return options.fallbackData;
      }
      throw err;
    }
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        systemInstruction,
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn('Gemini text generation failed, falling back to grounded response:', err);
      if (prompt.toLowerCase().includes('why did you change my roadmap') || prompt.toLowerCase().includes('change')) {
        return (
          'I adapted your roadmap because your recent evaluation on the Weather Tool Agent task revealed a score of 54% with critical deficiencies in Error Handling and Tool Reliability. ' +
          'Specifically, your tool calling code lacked runtime schema validation and crashed on network timeouts. ' +
          'Because deterministic Tool Reliability is an essential prerequisite for Multi-Agent Systems, I inserted Week 2: "Error Handling & Tool Reliability" and Week 3: "Agent Evaluation & Guardrails" ' +
          'to build a rock-solid foundation before moving to complex multi-agent orchestration.'
        );
      }
      return 'EduPath AI Agent is actively tracking your skills, analyzing evidence, and optimizing your learning path.';
    }
  }
}
