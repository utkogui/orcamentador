import { z } from "zod";

const nullishString = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => (value == null || value === "" ? undefined : value));

const scopePhaseSchema = z.enum(["mvp", "future", "unclear"]);

export const productDiscoveryResultSchema = z.object({
  summary: z.string().min(1),
  productType: z.string().min(1),
  problemStatement: z.string().min(1),
  platforms: z.array(z.string()).default([]),
  actors: z
    .array(
      z.object({
        name: z.string().min(1),
        description: nullishString,
        responsibilities: z.array(z.string()).nullish().transform((v) => v ?? undefined),
      })
    )
    .default([]),
  majorModules: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        scope: scopePhaseSchema,
      })
    )
    .default([]),
  mvpScope: z.array(z.string()).default([]),
  futureScope: z.array(z.string()).default([]),
  technicalRequirements: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
  nonFunctionalRequirements: z.array(z.string()).default([]),
});

const complexityHintSchema = z.enum(["low", "medium", "high", "very_high"]);

const architecturalModuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  parentMajorModule: z.string().min(1),
  platform: z.string().min(1),
  businessPurpose: z.string().min(1),
  functionalAreas: z.array(z.string()).default([]),
  complexityHint: complexityHintSchema,
  assumptions: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
  parentId: nullishString,
  sourceMajorModule: nullishString,
});

export const architecturalModuleAiSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  parentMajorModule: z.string().min(1),
  platform: z.string().min(1),
  businessPurpose: z.string().min(1),
  functionalAreas: z.array(z.string()).default([]),
  complexityHint: complexityHintSchema,
  assumptions: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
});

export const architectureAiResponseSchema = z.object({
  summary: z.string().min(1),
  modules: z.array(architecturalModuleAiSchema).min(1),
});

export const architectureResultSchema = z.object({
  summary: z.string().min(1),
  modules: z.array(architecturalModuleSchema).min(1),
});

export const expandedBuildingBlocksResultSchema = z.object({
  summary: z.string().min(1),
  blocks: z
    .array(
      z.object({
        blockId: z.string().min(1),
        blockName: z.string().min(1),
        architecturalModuleId: z.string().min(1),
        category: z.enum(["explicit", "implicit", "dependency", "required_flow", "optional_flow"]),
        reason: nullishString,
      })
    )
    .default([]),
  dependencies: z
    .array(
      z.object({
        fromBlockId: z.string().min(1),
        toBlockId: z.string().min(1),
        reason: nullishString,
      })
    )
    .default([]),
});

export const commercialDiscoveryResultSchema = z.object({
  ambiguities: z
    .array(
      z.object({
        topic: z.string().min(1),
        reason: z.string().min(1),
        relatedModuleIds: z.array(z.string()).nullish().transform((v) => v ?? undefined),
      })
    )
    .default([]),
  commercialQuestions: z
    .array(
      z.object({
        question: z.string().min(1),
        context: nullishString,
        relatedBlockId: nullishString,
      })
    )
    .default([]),
  scopeRisks: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        suggestion: nullishString,
      })
    )
    .default([]),
  outOfScope: z.array(z.string()).default([]),
  missingButCommon: z
    .array(
      z.object({
        feature: z.string().min(1),
        reason: z.string().min(1),
      })
    )
    .default([]),
});

export const estimationPreparationResultSchema = z.object({
  summary: z.string().min(1),
  modules: z
    .array(
      z.object({
        name: z.string().min(1),
        instanceLabel: z.string().min(1),
        suggestedComplexity: z.enum(["SIMPLE", "MEDIUM", "COMPLEX", "VERY_COMPLEX"]),
        buildingBlockIds: z.array(z.string()).default([]),
        disciplines: z.array(z.string()).default([]),
        dependencies: z.array(z.string()).default([]),
        notes: nullishString,
      })
    )
    .default([]),
  notesForEstimator: z.array(z.string()).default([]),
});

function parseWithSchema<T>(schema: z.ZodType<T>, raw: unknown, layerName: string): T {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `${layerName}: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`
    );
  }
  return parsed.data;
}

export const parseProductDiscoveryResult = (raw: unknown) =>
  parseWithSchema(productDiscoveryResultSchema, raw, "Product Discovery");

export const parseArchitectureResult = (raw: unknown) =>
  parseWithSchema(architectureResultSchema, raw, "Software Architecture");

export const parseExpandedBuildingBlocksResult = (raw: unknown) =>
  parseWithSchema(expandedBuildingBlocksResultSchema, raw, "Building Block Expansion");

export const parseCommercialDiscoveryResult = (raw: unknown) =>
  parseWithSchema(commercialDiscoveryResultSchema, raw, "Commercial Discovery");

export const parseEstimationPreparationResult = (raw: unknown) =>
  parseWithSchema(estimationPreparationResultSchema, raw, "Estimation Preparation");
