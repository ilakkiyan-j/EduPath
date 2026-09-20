import { z } from 'zod';
import { RoadmapMilestoneSchema } from './roadmap';

export const ModifiedMilestoneActionSchema = z.object({
  action: z.enum(['kept', 'inserted', 'modified', 'removed', 'accelerated']),
  weekNumber: z.number().min(1),
  title: z.string(),
  description: z.string(),
  targetSkills: z.array(z.string()),
  justification: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'adapted', 'skipped']).default('pending'),
});

export const AdaptationResultSchema = z.object({
  adaptationTriggered: z.boolean(),
  adaptationType: z.enum([
    'continue',
    'accelerate',
    'repeat',
    'simplify',
    'inject_prerequisite',
    'reorder',
  ]),
  reason: z.string(),
  evidence: z.string(),
  modifiedMilestones: z.array(ModifiedMilestoneActionSchema),
  agentSummaryForLearner: z.string(),
});

export type ModifiedMilestoneAction = z.infer<typeof ModifiedMilestoneActionSchema>;
export type AdaptationResult = z.infer<typeof AdaptationResultSchema>;
