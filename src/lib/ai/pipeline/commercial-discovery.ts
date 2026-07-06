import type {
  CommercialDiscoveryResult,
  ExpandedBuildingBlocksResult,
  ProductDiscoveryResult,
} from "@/types/briefing-pipeline";

/**
 * Camada 4 — stub.
 * Próxima etapa: análise comercial sobre blocos expandidos + produto.
 */
export async function runCommercialDiscovery(
  discovery: ProductDiscoveryResult,
  expandedBlocks: ExpandedBuildingBlocksResult
): Promise<CommercialDiscoveryResult> {
  const ambiguities = discovery.majorModules
    .filter((module) => module.scope === "unclear")
    .map((module) => ({
      topic: module.name,
      reason: "Escopo marcado como ambíguo na descoberta de produto.",
    }));

  const outOfScope = discovery.futureScope;

  return {
    ambiguities,
    commercialQuestions: [],
    scopeRisks: [],
    outOfScope,
    missingButCommon: expandedBlocks.blocks.length === 0
      ? [
          {
            feature: "Expansão completa de Building Blocks",
            reason:
              "A camada 3 ainda não expandiu funcionalidades implícitas. A análise comercial completa depende dessa etapa.",
          },
        ]
      : [],
  };
}
