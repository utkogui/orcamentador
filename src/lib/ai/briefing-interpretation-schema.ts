import { z } from "zod";
import type { BriefingInterpretationResult } from "@/types/building-blocks";

const nullishString = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => (value == null || value === "" ? undefined : value));

const briefingBlockMatchSchema = z.object({
  blockId: z.string().min(1),
  blockName: z.string().min(1),
  categoryId: nullishString,
  categoryName: nullishString,
  reason: nullishString,
  confidence: z.enum(["high", "medium", "low"]).optional(),
});

const needsConfirmationSchema = z.object({
  topic: z.string().min(1),
  reason: z.string().min(1),
  relatedBlockIds: z.array(z.string()).nullish().transform((v) => v ?? undefined),
});

const outOfScopeRiskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  suggestion: nullishString,
});

const commercialQuestionSchema = z.object({
  question: z.string().min(1),
  context: nullishString,
  relatedBlockId: nullishString,
});

export const briefingInterpretationResultSchema = z.object({
  summary: z.string().min(1),
  explicitlyRequested: z.array(briefingBlockMatchSchema).default([]),
  likelyNeeded: z.array(briefingBlockMatchSchema).default([]),
  optional: z.array(briefingBlockMatchSchema).default([]),
  needsConfirmation: z.array(needsConfirmationSchema).default([]),
  outOfScopeRisks: z.array(outOfScopeRiskSchema).default([]),
  commercialQuestions: z.array(commercialQuestionSchema).default([]),
  notesForSalesTeam: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
});

export function parseBriefingInterpretationResult(
  raw: unknown
): BriefingInterpretationResult {
  const parsed = briefingInterpretationResultSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Interpretação inválida: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`
    );
  }
  return parsed.data;
}
