import { z } from 'zod';

export const TaskGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  targetSkills: z.array(z.string()),
  requirements: z.array(z.string()),
  expectedOutcome: z.string(),
  starterCode: z.string().optional().default(''),
  evaluationCriteria: z.array(z.string()),
  estimatedMinutes: z.number().min(15).max(300),
});

export type TaskGeneration = z.infer<typeof TaskGenerationSchema>;
