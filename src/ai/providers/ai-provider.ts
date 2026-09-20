import { z } from 'zod';

export interface CompletionOptions<T> {
  prompt: string;
  systemInstruction?: string;
  schema?: z.ZodType<T, any, any>;
  fallbackData?: T;
  temperature?: number;
}

export interface AIProvider {
  name: string;
  generateStructured<T>(options: CompletionOptions<T>): Promise<T>;
  generateText(prompt: string, systemInstruction?: string): Promise<string>;
}
