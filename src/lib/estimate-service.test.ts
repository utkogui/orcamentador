import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModuleLayer } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    estimate: { findUnique: vi.fn() },
    estimateDiscipline: { findMany: vi.fn(), upsert: vi.fn() },
    estimateMultiplier: { upsert: vi.fn() },
    estimateModule: { findMany: vi.fn() },
    discipline: { findMany: vi.fn() },
    multiplier: { findMany: vi.fn() },
    module: { findUnique: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getEstimateCalculation,
  getNextInstanceIndex,
  syncEstimateDisciplines,
} from "./estimate-service";

const mockedPrisma = prisma as unknown as {
  estimate: { findUnique: ReturnType<typeof vi.fn> };
  estimateDiscipline: { findMany: ReturnType<typeof vi.fn>; upsert: ReturnType<typeof vi.fn> };
  estimateModule: { findMany: ReturnType<typeof vi.fn> };
  discipline: { findMany: ReturnType<typeof vi.fn> };
  multiplier: { findMany: ReturnType<typeof vi.fn> };
  module: { findUnique: ReturnType<typeof vi.fn> };
};

describe("getNextInstanceIndex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 1 sem reuseGroup", async () => {
    mockedPrisma.module.findUnique.mockResolvedValue({ id: "m1", reuseGroup: null });
    await expect(getNextInstanceIndex("e1", "m1")).resolves.toBe(1);
  });

  it("incrementa com base nas instâncias do grupo", async () => {
    mockedPrisma.module.findUnique.mockResolvedValue({ id: "m1", reuseGroup: "entity" });
    mockedPrisma.estimateModule.findMany.mockResolvedValue([
      { instanceIndex: 1 },
      { instanceIndex: 2 },
    ]);
    await expect(getNextInstanceIndex("e1", "m1")).resolves.toBe(3);
  });
});

describe("syncEstimateDisciplines", () => {
  it("faz upsert para cada disciplina", async () => {
    mockedPrisma.discipline.findMany.mockResolvedValue([
      { id: "d1" },
      { id: "d2" },
    ]);
    mockedPrisma.estimateDiscipline.upsert.mockResolvedValue({});

    await syncEstimateDisciplines("e1");
    expect(mockedPrisma.estimateDiscipline.upsert).toHaveBeenCalledTimes(2);
  });
});

describe("getEstimateCalculation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna null quando estimativa não existe", async () => {
    mockedPrisma.estimate.findUnique.mockResolvedValue(null);
    await expect(getEstimateCalculation("missing")).resolves.toBeNull();
  });

  it("calcula a partir dos dados do Prisma", async () => {
    mockedPrisma.estimate.findUnique.mockResolvedValue({
      id: "e1",
      marginPct: 30,
      modules: [
        {
          id: "em1",
          moduleId: "m1",
          instanceLabel: "Leads",
          instanceIndex: 1,
          complexity: "MEDIUM",
          quantity: 1,
          module: {
            name: "Cadastro",
            layer: ModuleLayer.CAPABILITY,
            reuseGroup: null,
            reuseFactor: 1,
            disciplineHours: [{ disciplineId: "d1", baseHours: 10 }],
          },
        },
      ],
      multipliers: [],
    });
    mockedPrisma.discipline.findMany.mockResolvedValue([
      { id: "d1", name: "Frontend", hourlyRate: 200 },
    ]);
    mockedPrisma.estimateDiscipline.findMany.mockResolvedValue([
      { disciplineId: "d1", enabled: true },
    ]);
    mockedPrisma.multiplier.findMany.mockResolvedValue([]);
    mockedPrisma.estimateDiscipline.upsert.mockResolvedValue({});

    const result = await getEstimateCalculation("e1");
    expect(result?.totalBaseHours).toBe(10);
    expect(result?.suggestedPrice).toBeGreaterThan(0);
  });
});
