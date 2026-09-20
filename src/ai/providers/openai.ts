import OpenAI from 'openai';
import { AIProvider, CompletionOptions } from './ai-provider';

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'gpt-4o-mini') {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OPENAI_API_KEY is not configured in environment.');
    }
    this.client = new OpenAI({ apiKey: key });
    this.modelName = modelName;
  }

  async generateStructured<T>(options: CompletionOptions<T>): Promise<T> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.modelName,
        temperature: options.temperature ?? 0.2,
        response_format: { type: 'json_object' },
        messages: [
          ...(options.systemInstruction
            ? [{ role: 'system' as const, content: options.systemInstruction }]
            : []),
          { role: 'user' as const, content: options.prompt },
        ],
      });

      const content = response.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(content);

      if (options.schema) {
        return options.schema.parse(parsed);
      }
      return parsed as T;
    } catch (err) {
      console.warn('OpenAI structured output failed or schema validation error:', err);
      if (options.fallbackData) {
        return options.fallbackData;
      }
      throw err;
    }
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        ...(systemInstruction
          ? [{ role: 'system' as const, content: systemInstruction }]
          : []),
        { role: 'user' as const, content: prompt },
      ],
    });
    return response.choices[0]?.message?.content ?? '';
  }
}
