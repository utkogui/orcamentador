import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModuleLayer } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    module: { findMany: vi.fn() },
    discipline: { findMany: vi.fn() },
    multiplier: { findMany: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { previewBriefingEstimate } from "./preview-briefing";

const findModules = prisma.module.findMany as ReturnType<typeof vi.fn>;
const findDisciplines = prisma.discipline.findMany as ReturnType<typeof vi.fn>;
const findMultipliers = prisma.multiplier.findMany as ReturnType<typeof vi.fn>;

describe("previewBriefingEstimate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findModules.mockResolvedValue([
      {
        id: "m1",
        name: "Login",
        layer: ModuleLayer.CAPABILITY,
        reuseGroup: null,
        reuseFactor: 1,
        disciplineHours: [{ disciplineId: "d1", baseHours: 10 }],
      },
    ]);
    findDisciplines.mockResolvedValue([{ id: "d1", name: "FE", hourlyRate: 200 }]);
    findMultipliers.mockResolvedValue([]);
  });

  it("calcula preview a partir do resolved", async () => {
    const result = await previewBriefingEstimate({
      projectName: "Demo",
      summary: "ok",
      marginPct: 30,
      items: [
        {
          moduleId: "m1",
          moduleName: "Login",
          instanceLabel: "Auth",
          instanceIndex: 1,
          complexity: "MEDIUM",
        },
      ],
      multiplierIds: [],
      disabledDisciplineIds: [],
      warnings: [],
    });

    expect(result.totalBaseHours).toBe(10);
    expect(result.suggestedPrice).toBeGreaterThan(0);
  });

  it("falha se módulo não existe no catálogo", async () => {
    await expect(
      previewBriefingEstimate({
        projectName: "Demo",
        summary: "ok",
        marginPct: 30,
        items: [
          {
            moduleId: "missing",
            moduleName: "X",
            instanceLabel: "X",
            instanceIndex: 1,
            complexity: "MEDIUM",
          },
        ],
        multiplierIds: [],
        disabledDisciplineIds: [],
        warnings: [],
      })
    ).rejects.toThrow(/não encontrado/);
  });
});
