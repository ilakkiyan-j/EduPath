import { z } from 'zod';

export const ProfileSkillSchema = z.object({
  name: z.string(),
  level: z.number().min(1).max(5),
  confidence: z.number().min(0).max(1),
  evidence: z.array(
    z.object({
      source: z.string(),
      snippet: z.string(),
    })
  ),
});

export const ProfileExtractionSchema = z.object({
  experienceLevel: z.enum(['entry', 'junior', 'mid', 'senior']),
  summary: z.string(),
  skills: z.array(ProfileSkillSchema),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    })
  ).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
});

export type ProfileExtraction = z.infer<typeof ProfileExtractionSchema>;
export type ProfileSkill = z.infer<typeof ProfileSkillSchema>;
