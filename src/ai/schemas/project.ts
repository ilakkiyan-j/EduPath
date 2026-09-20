import { z } from 'zod';

export const GeneratedProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  skillsDeveloped: z.array(z.string()),
  whyThisProject: z.string(),
  requirements: z.array(z.string()),
  evaluationCriteria: z.array(z.string()),
  estimatedHours: z.number().min(4).max(60),
});

export type GeneratedProjectData = z.infer<typeof GeneratedProjectSchema>;
