import { AIProvider } from './ai-provider';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import { MockProvider } from './mock';

export function getAIProvider(): AIProvider {
  const preferred = (process.env.AI_PROVIDER || 'mock').toLowerCase();

  if (preferred === 'gemini' && process.env.GEMINI_API_KEY) {
    try {
      return new GeminiProvider();
    } catch (e) {
      console.warn('Failed to initialize GeminiProvider, falling back to mock provider:', e);
    }
  }

  if (preferred === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      return new OpenAIProvider();
    } catch (e) {
      console.warn('Failed to initialize OpenAIProvider, falling back to mock provider:', e);
    }
  }

  // If Gemini key is set even without AI_PROVIDER='gemini'
  if (process.env.GEMINI_API_KEY) {
    try {
      return new GeminiProvider();
    } catch {
      // ignore
    }
  }

  // If OpenAI key is set even without AI_PROVIDER='openai'
  if (process.env.OPENAI_API_KEY) {
    try {
      return new OpenAIProvider();
    } catch {
      // ignore
    }
  }

  return new MockProvider();
}
