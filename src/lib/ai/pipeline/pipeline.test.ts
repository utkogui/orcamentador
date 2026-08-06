import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/ai/pipeline/product-discovery", () => ({
  runProductDiscovery: vi.fn(),
}));
vi.mock("@/lib/ai/pipeline/software-architecture", () => ({
  runSoftwareArchitecture: vi.fn(),
}));
vi.mock("@/lib/ai/pipeline/building-block-expansion", () => ({
  runBuildingBlockExpansion: vi.fn(),
}));
vi.mock("@/lib/ai/pipeline/commercial-discovery", () => ({
  runCommercialDiscovery: vi.fn(),
}));
vi.mock("@/lib/ai/pipeline/prepare-estimation", () => ({
  runPrepareEstimation: vi.fn(),
}));

import { runProductDiscovery } from "@/lib/ai/pipeline/product-discovery";
import { runSoftwareArchitecture } from "@/lib/ai/pipeline/software-architecture";
import { runBuildingBlockExpansion } from "@/lib/ai/pipeline/building-block-expansion";
import { runCommercialDiscovery } from "@/lib/ai/pipeline/commercial-discovery";
import { runPrepareEstimation } from "@/lib/ai/pipeline/prepare-estimation";
import { runBriefingPipeline } from "./pipeline";

const longBriefing = "x".repeat(80);

const discovery = {
  summary: "SaaS",
  productType: "saas",
  problemStatement: "p",
  platforms: [],
  actors: [],
  majorModules: [],
  mvpScope: [],
  futureScope: [],
  technicalRequirements: [],
  integrations: [],
  nonFunctionalRequirements: [],
};

const architecture = { summary: "a", modules: [] };
const expanded = { summary: "e", blocks: [], dependencies: [] };
const commercial = {
  ambiguities: [],
  commercialQuestions: [],
  scopeRisks: [],
  outOfScope: [],
  missingButCommon: [],
};
const prep = { summary: "prep", modules: [], notesForEstimator: [] };

describe("runBriefingPipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (runProductDiscovery as ReturnType<typeof vi.fn>).mockResolvedValue(discovery);
    (runSoftwareArchitecture as ReturnType<typeof vi.fn>).mockResolvedValue(architecture);
    (runBuildingBlockExpansion as ReturnType<typeof vi.fn>).mockResolvedValue(expanded);
    (runCommercialDiscovery as ReturnType<typeof vi.fn>).mockResolvedValue(commercial);
    (runPrepareEstimation as ReturnType<typeof vi.fn>).mockResolvedValue(prep);
  });

  it("exige briefing com 80+ caracteres", async () => {
    await expect(runBriefingPipeline("curto")).rejects.toThrow(/80 caracteres/);
  });

  it("para após productDiscovery quando stopAfterLayer", async () => {
    const result = await runBriefingPipeline(longBriefing, {
      stopAfterLayer: "productDiscovery",
    });
    expect(result.productDiscovery).toEqual(discovery);
    expect(runSoftwareArchitecture).not.toHaveBeenCalled();
    expect(result.layerMeta).toHaveLength(1);
  });

  it("executa pipeline completo", async () => {
    const result = await runBriefingPipeline(longBriefing);
    expect(runPrepareEstimation).toHaveBeenCalled();
    expect(result.estimationPrep).toEqual(prep);
    expect(result.layerMeta).toHaveLength(5);
  });
});
