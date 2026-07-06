import type {
  ArchitectureResult,
  CommercialDiscoveryResult,
  EstimationPreparationResult,
  ExpandedBuildingBlocksResult,
  ProductDiscoveryResult,
} from "@/types/briefing-pipeline";

/**
 * Camada 5 — stub.
 * Próxima etapa: mapear blocos expandidos para candidatos do motor de estimativa existente.
 */
export async function runPrepareEstimation(
  discovery: ProductDiscoveryResult,
  architecture: ArchitectureResult,
  _expandedBlocks: ExpandedBuildingBlocksResult,
  commercial: CommercialDiscoveryResult
): Promise<EstimationPreparationResult> {
  const modules = architecture.modules
    .filter((module) => !module.parentId)
    .map((module) => ({
      name: module.name,
      instanceLabel: module.name,
      suggestedComplexity: "MEDIUM" as const,
      buildingBlockIds: [],
      disciplines: [],
      dependencies: [],
      notes: "Candidato preliminar — aguardando expansão de Building Blocks e mapeamento para o catálogo.",
    }));

  return {
    summary: `Preparação preliminar com ${modules.length} candidatos a módulo. Horas ainda não calculadas.`,
    modules,
    notesForEstimator: [
      "Pipeline em migração: camadas 2–5 ainda são stubs ou parcialmente implementadas.",
      `Produto: ${discovery.productType}`,
      commercial.outOfScope.length > 0
        ? `Itens de fase futura identificados: ${commercial.outOfScope.join("; ")}`
        : "Nenhuma fase futura explicitamente listada.",
    ],
  };
}
