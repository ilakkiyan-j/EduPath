import { z } from 'zod';

export const EvaluationFeedbackItemSchema = z.object({
  category: z.string(),
  comment: z.string(),
  severity: z.enum(['info', 'warning', 'error']),
});

export const SkillUpdateItemSchema = z.object({
  skillName: z.string(),
  previousLevel: z.number().min(0).max(5),
  newLevel: z.number().min(0).max(5),
  confidenceChange: z.number(), // e.g. -0.15 or +0.20
  reason: z.string(),
});

export const TaskEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  isPassing: z.boolean(),
  skillsDemonstrated: z.array(z.string()),
  weakAreas: z.array(z.string()),
  strengths: z.array(z.string()),
  feedback: z.array(EvaluationFeedbackItemSchema),
  skillUpdates: z.array(SkillUpdateItemSchema),
  recommendedNextAction: z.string(),
  detailedReasoning: z.string(),
});

export type TaskEvaluationResult = z.infer<typeof TaskEvaluationSchema>;
