import { prisma } from "@/lib/prisma";
import { syncEstimateDisciplines, syncEstimateMultipliers } from "@/lib/estimate-service";
import {
  buildEstimateName,
  formatInterpretationAsDescription,
} from "@/lib/ai/format-knowledge-interpretation";
import { mapKnowledgeInterpretationToCatalog } from "@/lib/ai/map-knowledge-to-catalog";
import { generateApplicationFlowFromBlocks } from "@/lib/application-flow/generate-from-blocks";
import { serializeApplicationFlow } from "@/lib/application-flow/storage";
import type { BriefingInterpretationResult } from "@/types/building-blocks";

export async function createEstimateFromKnowledgeInterpretation(
  result: BriefingInterpretationResult
) {
  const mappedItems = await mapKnowledgeInterpretationToCatalog(result);
  if (mappedItems.length === 0) {
    throw new Error(
      "Nenhum Building Block calculável foi identificado. Revise o briefing ou crie a estimativa manualmente."
    );
  }

  const estimateName = buildEstimateName(result.summary);
  const applicationFlow = generateApplicationFlowFromBlocks(result, estimateName);

  const estimate = await prisma.estimate.create({
    data: {
      name: estimateName,
      description: formatInterpretationAsDescription(result),
      marginPct: 30,
      projectFlowJson: serializeApplicationFlow(applicationFlow),
    },
  });

  await syncEstimateMultipliers(estimate.id);
  await syncEstimateDisciplines(estimate.id);

  for (const item of mappedItems) {
    await prisma.estimateModule.create({
      data: {
        estimateId: estimate.id,
        moduleId: item.moduleId,
        instanceLabel: item.instanceLabel,
        instanceIndex: item.instanceIndex,
        complexity: item.complexity,
        quantity: 1,
      },
    });
  }

  return { estimate, mappedItemsCount: mappedItems.length };
}
