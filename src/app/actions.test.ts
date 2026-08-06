import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    estimate: { update: vi.fn(), create: vi.fn(), delete: vi.fn() },
    estimateDiscipline: { upsert: vi.fn() },
    estimateModule: { create: vi.fn(), delete: vi.fn() },
    estimateMultiplier: { upsert: vi.fn() },
    module: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    moduleDisciplineHour: { upsert: vi.fn(), deleteMany: vi.fn() },
    discipline: { create: vi.fn(), update: vi.fn(), delete: vi.fn(), findMany: vi.fn() },
    multiplier: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock("@/lib/estimate-service", () => ({
  getEstimateCalculation: vi.fn(),
  getNextInstanceIndex: vi.fn(),
  syncEstimateDisciplines: vi.fn(),
  syncEstimateMultipliers: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { getEstimateCalculation, getNextInstanceIndex } from "@/lib/estimate-service";
import { redirect } from "next/navigation";
import {
  addEstimateModule,
  createDiscipline,
  createModule,
  createMultiplier,
  deleteMultiplier,
  removeEstimateModule,
  saveClientProposalPrice,
  saveModuleHours,
  toggleEstimateDiscipline,
  toggleEstimateMultiplier,
} from "./actions";

const getCalc = getEstimateCalculation as ReturnType<typeof vi.fn>;
const nextIndex = getNextInstanceIndex as ReturnType<typeof vi.fn>;
const updateEstimate = prisma.estimate.update as ReturnType<typeof vi.fn>;
const upsertDiscipline = prisma.estimateDiscipline.upsert as ReturnType<typeof vi.fn>;
const createEstimateModule = prisma.estimateModule.create as ReturnType<typeof vi.fn>;
const deleteEstimateModule = prisma.estimateModule.delete as ReturnType<typeof vi.fn>;
const upsertMultiplier = prisma.estimateMultiplier.upsert as ReturnType<typeof vi.fn>;
const createCatalogModule = prisma.module.create as ReturnType<typeof vi.fn>;
const createDisciplineRow = prisma.discipline.create as ReturnType<typeof vi.fn>;
const createMultiplierRow = prisma.multiplier.create as ReturnType<typeof vi.fn>;
const deleteMultiplierRow = prisma.multiplier.delete as ReturnType<typeof vi.fn>;
const findDisciplines = prisma.discipline.findMany as ReturnType<typeof vi.fn>;
const upsertHours = prisma.moduleDisciplineHour.upsert as ReturnType<typeof vi.fn>;
const deleteHours = prisma.moduleDisciplineHour.deleteMany as ReturnType<typeof vi.fn>;

describe("saveClientProposalPrice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persiste preço resolvido", async () => {
    getCalc.mockResolvedValue({
      suggestedPrice: 100_000,
      commercialMin: 90_000,
      commercialMax: 110_000,
    });
    updateEstimate.mockResolvedValue({});

    await saveClientProposalPrice("e1", { mode: "commercial_min" });

    expect(updateEstimate).toHaveBeenCalledWith({
      where: { id: "e1" },
      data: {
        clientProposalPrice: 90_000,
        clientProposalPriceMode: "commercial_min",
      },
    });
  });

  it("falha se estimativa não existe", async () => {
    getCalc.mockResolvedValue(null);
    await expect(
      saveClientProposalPrice("missing", { mode: "suggested" })
    ).rejects.toThrow(/não encontrada/);
  });
});

describe("toggleEstimateDiscipline", () => {
  it("faz upsert do enabled", async () => {
    upsertDiscipline.mockResolvedValue({});
    await toggleEstimateDiscipline("e1", "d1", false);
    expect(upsertDiscipline).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { enabled: false },
      })
    );
  });
});

describe("addEstimateModule", () => {
  it("exige moduleId e cria com instanceIndex", async () => {
    await expect(addEstimateModule("e1", new FormData())).rejects.toThrow(/Selecione/);

    nextIndex.mockResolvedValue(2);
    createEstimateModule.mockResolvedValue({});
    const fd = new FormData();
    fd.set("moduleId", "m1");
    fd.set("complexity", "SIMPLE");
    fd.set("quantity", "1");
    fd.set("instanceLabel", "Leads");

    await addEstimateModule("e1", fd);
    expect(createEstimateModule).toHaveBeenCalledWith({
      data: expect.objectContaining({
        estimateId: "e1",
        moduleId: "m1",
        instanceIndex: 2,
        instanceLabel: "Leads",
        complexity: "SIMPLE",
      }),
    });
  });
});

describe("removeEstimateModule / toggleEstimateMultiplier", () => {
  it("remove módulo da estimativa", async () => {
    deleteEstimateModule.mockResolvedValue({});
    await removeEstimateModule("e1", "em1");
    expect(deleteEstimateModule).toHaveBeenCalledWith({ where: { id: "em1" } });
  });

  it("liga multiplicador", async () => {
    upsertMultiplier.mockResolvedValue({});
    await toggleEstimateMultiplier("e1", "mul1", true);
    expect(upsertMultiplier).toHaveBeenCalledWith(
      expect.objectContaining({ update: { enabled: true } })
    );
  });
});

describe("CRUD catálogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createModule valida e redireciona", async () => {
    const fd = new FormData();
    await expect(createModule(fd)).rejects.toThrow();

    fd.set("name", "Login");
    createCatalogModule.mockResolvedValue({ id: "m1" });
    await createModule(fd);
    expect(createCatalogModule).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/modules/m1");
  });

  it("createDiscipline / createMultiplier / deleteMultiplier", async () => {
    const disc = new FormData();
    disc.set("name", "QA");
    disc.set("hourlyRate", "180");
    createDisciplineRow.mockResolvedValue({});
    await createDiscipline(disc);
    expect(createDisciplineRow).toHaveBeenCalled();

    const mul = new FormData();
    mul.set("name", "Urgência");
    mul.set("factor", "1.2");
    mul.set("target", "HOURS");
    createMultiplierRow.mockResolvedValue({});
    await createMultiplier(mul);
    expect(createMultiplierRow).toHaveBeenCalledWith({
      data: expect.objectContaining({ slug: "urgencia", factor: 1.2 }),
    });

    deleteMultiplierRow.mockResolvedValue({});
    await deleteMultiplier("mul1");
    expect(deleteMultiplierRow).toHaveBeenCalledWith({ where: { id: "mul1" } });
  });

  it("saveModuleHours upserta ou apaga conforme valor", async () => {
    findDisciplines.mockResolvedValue([{ id: "d1" }, { id: "d2" }]);
    upsertHours.mockResolvedValue({});
    deleteHours.mockResolvedValue({});

    const fd = new FormData();
    fd.set("hours_d1", "12");
    fd.set("hours_d2", "");

    await saveModuleHours("m1", fd);
    expect(upsertHours).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ baseHours: 12 }),
      })
    );
    expect(deleteHours).toHaveBeenCalledWith({
      where: { moduleId: "m1", disciplineId: "d2" },
    });
  });
});
