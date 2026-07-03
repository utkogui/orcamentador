import { z } from "zod";

const nullishString = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => (value == null || value === "" ? undefined : value));

export const aiBriefingResponseSchema = z.object({
  projectName: z.string().min(1),
  clientName: nullishString,
  summary: z.string().min(1),
  marginPct: z.number().min(0).max(100).optional(),
  items: z
    .array(
      z.object({
        moduleName: z.string().min(1),
        instanceLabel: z.string().min(1),
        complexity: z.enum(["SIMPLE", "MEDIUM", "COMPLEX", "VERY_COMPLEX"]),
        reason: nullishString,
      })
    )
    .min(1),
  multiplierSlugs: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  disciplinesExcluded: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
});

export type AiBriefingResponse = z.infer<typeof aiBriefingResponseSchema>;

export const resolvedBriefingItemSchema = z.object({
  moduleId: z.string(),
  moduleName: z.string(),
  instanceLabel: z.string(),
  instanceIndex: z.number().int().positive(),
  complexity: z.enum(["SIMPLE", "MEDIUM", "COMPLEX", "VERY_COMPLEX"]),
  reason: z.string().optional(),
});

export const resolvedBriefingSchema = z.object({
  projectName: z.string(),
  clientName: z.string().optional(),
  summary: z.string(),
  marginPct: z.number(),
  items: z.array(resolvedBriefingItemSchema).min(1),
  multiplierIds: z.array(z.string()),
  disabledDisciplineIds: z.array(z.string()),
  warnings: z.array(z.string()),
});

export type ResolvedBriefing = z.infer<typeof resolvedBriefingSchema>;
