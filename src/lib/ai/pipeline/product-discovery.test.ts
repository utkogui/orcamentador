import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/ai/pipeline/json-completion", () => ({
  callJsonCompletion: vi.fn(),
}));

import { callJsonCompletion } from "@/lib/ai/pipeline/json-completion";
import { runProductDiscovery } from "./product-discovery";
import { runCommercialDiscovery } from "./commercial-discovery";
import { runPrepareEstimation } from "./prepare-estimation";

const callJson = callJsonCompletion as ReturnType<typeof vi.fn>;

const discovery = {
  summary: "SaaS",
  productType: "saas",
  problemStatement: "Conteúdo",
  platforms: [],
  actors: [],
  majorModules: [
    { name: "Auth", description: "login", scope: "mvp" as const },
    { name: "Mobile", description: "app", scope: "unclear" as const },
  ],
  mvpScope: [],
  futureScope: ["Push"],
  technicalRequirements: [],
  integrations: [],
  nonFunctionalRequirements: [],
};

const architecture = {
  summary: "Arch",
  modules: [
    {
      id: "m1",
      name: "Auth",
      description: "Login",
      parentMajorModule: "Acesso",
      platform: "web",
      businessPurpose: "Entrar",
      functionalAreas: [],
      complexityHint: "medium" as const,
      assumptions: [],
      openQuestions: [],
    },
  ],
};

describe("runProductDiscovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida resposta da IA", async () => {
    callJson.mockResolvedValue({
      summary: "SaaS",
      productType: "saas",
      problemStatement: "Conteúdo",
    });

    const result = await runProductDiscovery("briefing longo");
    expect(result.summary).toBe("SaaS");
    expect(callJson).toHaveBeenCalled();
  });

  it("propaga erro de schema", async () => {
    callJson.mockResolvedValue({ summary: "" });
    await expect(runProductDiscovery("x")).rejects.toThrow(/Product Discovery/);
  });
});

describe("runCommercialDiscovery (stub)", () => {
  it("marca ambiguidades e outOfScope", async () => {
    const result = await runCommercialDiscovery(discovery, {
      summary: "exp",
      blocks: [],
      dependencies: [],
    });
    expect(result.ambiguities).toHaveLength(1);
    expect(result.outOfScope).toEqual(["Push"]);
    expect(result.missingButCommon.length).toBeGreaterThan(0);
  });
});

describe("runPrepareEstimation (stub)", () => {
  it("gera candidatos a partir da arquitetura", async () => {
    const result = await runPrepareEstimation(
      discovery,
      architecture,
      { summary: "exp", blocks: [{ blockId: "a", blockName: "A", architecturalModuleId: "m1", category: "explicit" }], dependencies: [] },
      {
        ambiguities: [],
        commercialQuestions: [],
        scopeRisks: [],
        outOfScope: [],
        missingButCommon: [],
      }
    );
    expect(result.modules).toHaveLength(1);
    expect(result.summary).toMatch(/1 candidatos/);
  });
});
