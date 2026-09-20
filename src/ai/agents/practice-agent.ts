import { getAIProvider } from '../providers';
import { TaskGeneration, TaskGenerationSchema } from '../schemas/task';

export interface PracticeAgentInput {
  milestoneTitle: string;
  targetSkills: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export class PracticeAgent {
  private provider = getAIProvider();

  async generateTask(input: PracticeAgentInput): Promise<TaskGeneration> {
    const systemInstruction = `You are EduPath's Practice Agent.
Generate hands-on coding and architecture challenges that test practical skill application.
Always provide explicit requirements, evaluation criteria, and starter code boilerplate.
Return pure JSON matching the TaskGeneration schema.`;

    const prompt = `Generate a practical challenge for milestone: "${input.milestoneTitle}".
Target Skills: ${input.targetSkills.join(', ')}
Difficulty: ${input.difficulty || 'intermediate'}

Ensure the task is actionable, realistic for production AI systems, and includes starter code with clear TODO sections.`;

    const fallbackData: TaskGeneration = {
      title: 'Build a Resilient Weather Tool Agent',
      description: 'Implement an autonomous agent that receives natural language queries, validates user intent, invokes a mock weather API via tool calling, handles failures gracefully, and formats responses.',
      difficulty: 'intermediate',
      targetSkills: input.targetSkills,
      requirements: [
        'Accepts a natural-language question (e.g. "What is the weather in Tokyo?")',
        'Defines a strict JSON tool schema for get_current_weather(location, unit)',
        'Calls the API as an autonomous tool when requested by the model',
        'Provides graceful error handling for missing cities or network timeouts',
        'Returns a user-friendly conversational response',
      ],
      expectedOutcome: 'A runnable TypeScript/JavaScript function with mock tool calling and defensive error recovery.',
      starterCode: `// Weather Agent Challenge
interface WeatherToolArgs {
  location: string;
  unit?: 'celsius' | 'fahrenheit';
}

// 1. Define the tool schema
export const weatherToolDefinition = {
  name: 'get_current_weather',
  description: 'Get the current weather for a specified location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'City name or coordinates' },
      unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
    },
    required: ['location']
  }
};

// 2. Implement your agent handler here
export async function runWeatherAgent(userPrompt: string) {
  // TODO: Implement tool invocation and robust error handling
}
`,
      evaluationCriteria: [
        'Tool Schema Completeness (25%)',
        'Invocation Correctness (25%)',
        'Error Handling & API Fallbacks (30%)',
        'Conversational Clarity (20%)',
      ],
      estimatedMinutes: 60,
    };

    return this.provider.generateStructured<TaskGeneration>({
      prompt,
      systemInstruction,
      schema: TaskGenerationSchema,
      fallbackData,
    });
  }
}
