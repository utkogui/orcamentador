import { loadAllBuildingBlocks } from "@/lib/matilha-knowledge/loaders/building-blocks-loader";
import { loadEngineeringCatalog } from "@/lib/matilha-knowledge/engineering/engineering-loader";
import { getDesignProfiles, getDesignLibraries } from "@/lib/matilha-knowledge/design-intelligence";
import { getAllEffortSources } from "@/lib/matilha-knowledge/effort-sources";
import { getJourneys } from "@/lib/matilha-knowledge/journeys";
import { KnowledgeTabs } from "@/components/knowledge-tabs";

export const metadata = {
  title: "Matilha Knowledge | Estimador",
  description: "Base de conhecimento da Matilha",
};

export default async function KnowledgePage() {
  const buildingBlocksData = await loadAllBuildingBlocks();
  const engineeringCatalog = await loadEngineeringCatalog();
  const designProfiles = getDesignProfiles();
  const designLibraries = getDesignLibraries();
  const effortSources = getAllEffortSources();
  const journeys = getJourneys();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Matilha Knowledge</h1>
        <p className="text-muted-foreground mt-2">
          Escopo comercial, jornadas compostas, horas de engenharia, padrões de design, fontes de
          esforço e calibração do motor.
        </p>
      </div>

      <KnowledgeTabs
        buildingBlocks={buildingBlocksData.blocks}
        engineeringBlocks={engineeringCatalog.blocks}
        designProfiles={designProfiles}
        designLibraries={designLibraries}
        effortSources={effortSources}
        journeys={journeys}
      />
    </div>
  );
}
