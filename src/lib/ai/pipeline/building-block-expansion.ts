import type {
  ArchitectureResult,
  ExpandedBuildingBlocksResult,
} from "@/types/briefing-pipeline";

/**
 * Camada 3 — stub.
 * Próxima etapa: expandir cada módulo arquitetural usando a Matilha Knowledge Base.
 */
export async function runBuildingBlockExpansion(
  architecture: ArchitectureResult
): Promise<ExpandedBuildingBlocksResult> {
  return {
    summary: `Expansão de Building Blocks pendente para ${architecture.modules.length} módulos arquiteturais. A Knowledge Base será aplicada nesta camada.`,
    blocks: [],
    dependencies: [],
  };
}
