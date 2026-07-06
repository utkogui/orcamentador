import type {
  BriefingPipelineOptions,
  BriefingPipelineResult,
  PipelineLayerMeta,
  PipelineLayerName,
} from "@/types/briefing-pipeline";
import { runProductDiscovery } from "@/lib/ai/pipeline/product-discovery";
import { runSoftwareArchitecture } from "@/lib/ai/pipeline/software-architecture";
import { runBuildingBlockExpansion } from "@/lib/ai/pipeline/building-block-expansion";
import { runCommercialDiscovery } from "@/lib/ai/pipeline/commercial-discovery";
import { runPrepareEstimation } from "@/lib/ai/pipeline/prepare-estimation";

const LAYER_ORDER: PipelineLayerName[] = [
  "productDiscovery",
  "architecture",
  "buildingBlockExpansion",
  "commercialDiscovery",
  "estimationPreparation",
];

function shouldStop(current: PipelineLayerName, stopAfter?: PipelineLayerName): boolean {
  if (!stopAfter) return false;
  return LAYER_ORDER.indexOf(current) >= LAYER_ORDER.indexOf(stopAfter);
}

function validateBriefing(briefing: string) {
  const trimmed = briefing.trim();
  if (trimmed.length < 80) {
    throw new Error("Cole um briefing com pelo menos 80 caracteres para interpretação.");
  }
  return trimmed;
}

export async function runBriefingPipeline(
  briefing: string,
  options: BriefingPipelineOptions = {}
): Promise<BriefingPipelineResult> {
  const trimmed = validateBriefing(briefing);
  const layerMeta: PipelineLayerMeta[] = [];

  const productDiscovery = await runProductDiscovery(trimmed);
  layerMeta.push({
    layer: "productDiscovery",
    status: "implemented",
  });

  if (shouldStop("productDiscovery", options.stopAfterLayer)) {
    return buildPartialResult(trimmed, layerMeta, { productDiscovery });
  }

  const architecture = await runSoftwareArchitecture(productDiscovery);
  layerMeta.push({
    layer: "architecture",
    status: "implemented",
  });

  if (shouldStop("architecture", options.stopAfterLayer)) {
    return buildPartialResult(trimmed, layerMeta, { productDiscovery, architecture });
  }

  const expandedBlocks = await runBuildingBlockExpansion(architecture);
  layerMeta.push({
    layer: "buildingBlockExpansion",
    status: "stub",
    note: "Knowledge Base ainda não aplicada nesta camada.",
  });

  if (shouldStop("buildingBlockExpansion", options.stopAfterLayer)) {
    return buildPartialResult(trimmed, layerMeta, {
      productDiscovery,
      architecture,
      expandedBlocks,
    });
  }

  const commercialDiscovery = await runCommercialDiscovery(productDiscovery, expandedBlocks);
  layerMeta.push({
    layer: "commercialDiscovery",
    status: "stub",
    note: "Análise comercial parcial — depende da expansão de blocos.",
  });

  if (shouldStop("commercialDiscovery", options.stopAfterLayer)) {
    return buildPartialResult(trimmed, layerMeta, {
      productDiscovery,
      architecture,
      expandedBlocks,
      commercialDiscovery,
    });
  }

  const estimationPrep = await runPrepareEstimation(
    productDiscovery,
    architecture,
    expandedBlocks,
    commercialDiscovery
  );
  layerMeta.push({
    layer: "estimationPreparation",
    status: "stub",
    note: "Candidatos preliminares — sem cálculo de horas.",
  });

  return {
    briefing: trimmed,
    productDiscovery,
    architecture,
    expandedBlocks,
    commercialDiscovery,
    estimationPrep,
    layerMeta,
    completedAt: new Date().toISOString(),
  };
}

type PartialPipelineData = Partial<
  Pick<
    BriefingPipelineResult,
    | "productDiscovery"
    | "architecture"
    | "expandedBlocks"
    | "commercialDiscovery"
    | "estimationPrep"
  >
>;

function buildPartialResult(
  briefing: string,
  layerMeta: PipelineLayerMeta[],
  data: PartialPipelineData
): BriefingPipelineResult {
  return {
    briefing,
    productDiscovery: data.productDiscovery!,
    architecture: data.architecture ?? emptyArchitecture(),
    expandedBlocks: data.expandedBlocks ?? emptyExpandedBlocks(),
    commercialDiscovery: data.commercialDiscovery ?? emptyCommercialDiscovery(),
    estimationPrep: data.estimationPrep ?? emptyEstimationPrep(),
    layerMeta,
    completedAt: new Date().toISOString(),
  };
}

function emptyArchitecture(): BriefingPipelineResult["architecture"] {
  return { summary: "Camada não executada.", modules: [] };
}

function emptyExpandedBlocks(): BriefingPipelineResult["expandedBlocks"] {
  return { summary: "Camada não executada.", blocks: [], dependencies: [] };
}

function emptyCommercialDiscovery(): BriefingPipelineResult["commercialDiscovery"] {
  return {
    ambiguities: [],
    commercialQuestions: [],
    scopeRisks: [],
    outOfScope: [],
    missingButCommon: [],
  };
}

function emptyEstimationPrep(): BriefingPipelineResult["estimationPrep"] {
  return {
    summary: "Camada não executada.",
    modules: [],
    notesForEstimator: [],
  };
}
