import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/matilha-knowledge/loaders/building-blocks-loader", () => ({
  loadAllBuildingBlocks: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    module: { findMany: vi.fn() },
  },
}));

import { loadAllBuildingBlocks } from "@/lib/matilha-knowledge/loaders/building-blocks-loader";
import { prisma } from "@/lib/prisma";
import { mapKnowledgeInterpretationToCatalog } from "./map-knowledge-to-catalog";

const loadBlocks = loadAllBuildingBlocks as ReturnType<typeof vi.fn>;
const findModules = prisma.module.findMany as ReturnType<typeof vi.fn>;

describe("mapKnowledgeInterpretationToCatalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadBlocks.mockResolvedValue({
      blocks: [
        {
          id: "auth_basic_login",
          category_id: "authentication",
          complexity: "baixa",
        },
        {
          id: "cms_simple",
          category_id: "crud_forms",
          complexity: "média",
        },
      ],
    });
    findModules.mockResolvedValue([
      { id: "core", name: "Core da Plataforma", reuseGroup: null },
      { id: "entity", name: "Cadastro de Entidade", reuseGroup: "entity-registry" },
    ]);
  });

  it("retorna vazio sem matches", async () => {
    const items = await mapKnowledgeInterpretationToCatalog({
      summary: "x",
      explicitlyRequested: [],
      likelyNeeded: [],
      optional: [],
      needsConfirmation: [],
      outOfScopeRisks: [],
      commercialQuestions: [],
      notesForSalesTeam: [],
    });
    expect(items).toEqual([]);
  });

  it("inclui Core + módulos mapeados com reuso", async () => {
    const items = await mapKnowledgeInterpretationToCatalog({
      summary: "Portal",
      explicitlyRequested: [
        { blockId: "auth_basic_login", blockName: "Login" },
        { blockId: "cms_simple", blockName: "CMS" },
      ],
      likelyNeeded: [],
      optional: [],
      needsConfirmation: [],
      outOfScopeRisks: [],
      commercialQuestions: [],
      notesForSalesTeam: [],
    });

    expect(items[0]).toMatchObject({
      moduleName: "Core da Plataforma",
      instanceLabel: "Base da plataforma",
      sourceBlockIds: ["auth_basic_login"],
    });
    const entity = items.find((i) => i.moduleName === "Cadastro de Entidade");
    expect(entity).toBeDefined();
    expect(entity?.instanceLabel).toBe("CMS");
    expect(entity?.complexity).toBe("MEDIUM");
    expect(entity?.sourceBlockIds).toEqual(["cms_simple"]);
  });
});
