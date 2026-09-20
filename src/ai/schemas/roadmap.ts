import { z } from 'zod';

export const RoadmapMilestoneSchema = z.object({
  weekNumber: z.number().min(1),
  title: z.string(),
  description: z.string(),
  targetSkills: z.array(z.string()),
  estimatedHours: z.number().min(1),
  prerequisites: z.array(z.string()).optional().default([]),
  status: z.enum(['pending', 'in_progress', 'completed', 'adapted', 'skipped']).default('pending'),
});

export const RoadmapPlanSchema = z.object({
  title: z.string(),
  totalWeeks: z.number().min(1),
  weeklyCommitmentHours: z.number().min(1),
  milestones: z.array(RoadmapMilestoneSchema),
  rationale: z.string(),
});

export type RoadmapMilestone = z.infer<typeof RoadmapMilestoneSchema>;
export type RoadmapPlan = z.infer<typeof RoadmapPlanSchema>;
