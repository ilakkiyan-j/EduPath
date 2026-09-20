import { getAIProvider } from '../providers';

export interface ResourceItem {
  title: string;
  type: 'documentation' | 'article' | 'video' | 'course' | 'tutorial' | 'exercise';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  reason: string;
}

export class ResourceAgent {
  private provider = getAIProvider();

  async recommendResources(skillName: string, gapLevel: string): Promise<ResourceItem[]> {
    if (skillName.toLowerCase().includes('tool') || skillName.toLowerCase().includes('error')) {
      return [
        {
          title: 'Anthropic: Tool Calling & Schema Validation Deep Dive',
          type: 'documentation',
          url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use',
          difficulty: 'intermediate',
          estimatedMinutes: 30,
          reason: 'Explains strict parameter schemas and defensive argument parsing to avoid runtime crashes during tool execution.',
        },
        {
          title: 'Building Resilient Agents: Retries, Timeouts, and Circuit Breakers',
          type: 'article',
          url: 'https://e2b.dev/blog/ai-agent-reliability',
          difficulty: 'intermediate',
          estimatedMinutes: 25,
          reason: 'Directly addresses the error handling weaknesses found in your recent submission.',
        },
        {
          title: 'Hands-On: Type-Safe Function Calling with Zod',
          type: 'tutorial',
          url: 'https://github.com/features/actions',
          difficulty: 'intermediate',
          estimatedMinutes: 40,
          reason: 'Provides code patterns for validating tool responses before returning to the model.',
        },
      ];
    }

    return [
      {
        title: `Comprehensive Guide to ${skillName}`,
        type: 'documentation',
        url: 'https://docs.python.org/3/',
        difficulty: 'intermediate',
        estimatedMinutes: 30,
        reason: `Recommended to bridge your ${gapLevel} gap in ${skillName}.`,
      },
    ];
  }
}
