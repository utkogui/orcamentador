import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    estimate: { create: vi.fn() },
    estimateModule: { create: vi.fn() },
  },
}));

vi.mock("@/lib/estimate-service", () => ({
  syncEstimateDisciplines: vi.fn(),
  syncEstimateMultipliers: vi.fn(),
}));

vi.mock("@/lib/ai/map-knowledge-to-catalog", () => ({
  mapKnowledgeInterpretationToCatalog: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { mapKnowledgeInterpretationToCatalog } from "@/lib/ai/map-knowledge-to-catalog";
import { createEstimateFromKnowledgeInterpretation } from "./create-estimate-from-knowledge";

const mapCatalog = mapKnowledgeInterpretationToCatalog as ReturnType<typeof vi.fn>;
const createEstimate = prisma.estimate.create as ReturnType<typeof vi.fn>;
const createModule = prisma.estimateModule.create as ReturnType<typeof vi.fn>;

const emptyResult = {
  summary: "Portal de leads.",
  explicitlyRequested: [{ blockId: "auth_basic_login", blockName: "Login" }],
  likelyNeeded: [],
  optional: [],
  needsConfirmation: [],
  outOfScopeRisks: [],
  commercialQuestions: [],
  notesForSalesTeam: [],
};

describe("createEstimateFromKnowledgeInterpretation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createEstimate.mockResolvedValue({ id: "e1" });
    createModule.mockResolvedValue({});
  });

  it("falha sem items mapeados", async () => {
    mapCatalog.mockResolvedValue([]);
    await expect(createEstimateFromKnowledgeInterpretation(emptyResult)).rejects.toThrow(
      /Nenhum Building Block calculável/
    );
  });

  it("cria estimativa com fluxo e módulos", async () => {
    mapCatalog.mockResolvedValue([
      {
        moduleId: "m1",
        moduleName: "Core da Plataforma",
        instanceLabel: "Base",
        instanceIndex: 1,
        complexity: "MEDIUM",
        sourceBlockIds: ["auth_basic_login"],
      },
    ]);

    const result = await createEstimateFromKnowledgeInterpretation(emptyResult);
    expect(result.estimate.id).toBe("e1");
    expect(result.mappedItemsCount).toBe(1);
    expect(createEstimate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Portal de leads",
          projectFlowJson: expect.any(String),
        }),
      })
    );
    expect(createModule).toHaveBeenCalledTimes(1);
  });
});
