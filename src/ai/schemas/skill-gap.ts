import { z } from 'zod';

export const SkillGapItemSchema = z.object({
  skillName: z.string(),
  currentLevel: z.number().min(0).max(5),
  requiredLevel: z.number().min(1).max(5),
  gapLevel: z.enum(['acquired', 'developing', 'moderate', 'high', 'critical']),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
  evidence: z.array(z.string()).optional().default([]),
});

export const SkillGapAnalysisSchema = z.object({
  targetRole: z.string(),
  overallReadiness: z.number().min(0).max(100),
  gaps: z.array(SkillGapItemSchema),
  summary: z.string(),
});

export type SkillGapItem = z.infer<typeof SkillGapItemSchema>;
export type SkillGapAnalysis = z.infer<typeof SkillGapAnalysisSchema>;
