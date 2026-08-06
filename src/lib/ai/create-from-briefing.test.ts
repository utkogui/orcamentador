import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    estimate: { create: vi.fn() },
    estimateModule: { create: vi.fn() },
    estimateMultiplier: { update: vi.fn() },
    estimateDiscipline: { update: vi.fn() },
    multiplier: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/estimate-service", () => ({
  syncEstimateDisciplines: vi.fn(),
  syncEstimateMultipliers: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { syncEstimateDisciplines, syncEstimateMultipliers } from "@/lib/estimate-service";
import { createEstimateFromBriefing } from "./create-from-briefing";

const createEstimate = prisma.estimate.create as ReturnType<typeof vi.fn>;
const createModule = prisma.estimateModule.create as ReturnType<typeof vi.fn>;
const findMultipliers = prisma.multiplier.findMany as ReturnType<typeof vi.fn>;
const updateMultiplier = prisma.estimateMultiplier.update as ReturnType<typeof vi.fn>;
const updateDiscipline = prisma.estimateDiscipline.update as ReturnType<typeof vi.fn>;

describe("createEstimateFromBriefing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createEstimate.mockResolvedValue({ id: "e1" });
    createModule.mockResolvedValue({});
    findMultipliers.mockResolvedValue([{ id: "mul-1" }, { id: "mul-2" }]);
    updateMultiplier.mockResolvedValue({});
    updateDiscipline.mockResolvedValue({});
  });

  it("cria estimativa, módulos e aplica multipliers/disciplinas", async () => {
    const estimate = await createEstimateFromBriefing({
      projectName: "Demo",
      clientName: "Cliente",
      summary: "resumo",
      marginPct: 25,
      items: [
        {
          moduleId: "m1",
          moduleName: "Login",
          instanceLabel: "Auth",
          instanceIndex: 1,
          complexity: "MEDIUM",
        },
      ],
      multiplierIds: ["mul-1"],
      disabledDisciplineIds: ["d1"],
      warnings: [],
    });

    expect(estimate.id).toBe("e1");
    expect(syncEstimateMultipliers).toHaveBeenCalledWith("e1");
    expect(syncEstimateDisciplines).toHaveBeenCalledWith("e1");
    expect(createModule).toHaveBeenCalledTimes(1);
    expect(updateMultiplier).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { enabled: true },
      })
    );
    expect(updateDiscipline).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { enabled: false },
      })
    );
  });
});
