import { prisma } from "@/lib/prisma";
import {
  calculateEstimate,
  type EstimateCalculationResult,
  type EstimateModuleInput,
  type MultiplierInput,
} from "@/lib/calculations";

export async function getEstimateCalculation(
  estimateId: string
): Promise<EstimateCalculationResult | null> {
  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
    include: {
      modules: {
        include: {
          module: {
            include: {
              disciplineHours: true,
            },
          },
        },
        orderBy: [{ module: { layer: "asc" } }, { instanceIndex: "asc" }],
      },
      multipliers: {
        include: {
          multiplier: true,
        },
      },
    },
  });

  if (!estimate) return null;

  await syncEstimateDisciplines(estimateId);

  const estimateDisciplines = await prisma.estimateDiscipline.findMany({
    where: { estimateId },
  });
  const enabledDisciplineMap = new Map(
    estimateDisciplines.map((ed) => [ed.disciplineId, ed.enabled])
  );

  const disciplines = await prisma.discipline.findMany();

  const modules: EstimateModuleInput[] = estimate.modules.map((em) => ({
    id: em.id,
    moduleId: em.moduleId,
    moduleName: em.module.name,
    layer: em.module.layer,
    reuseGroup: em.module.reuseGroup,
    reuseFactor: em.module.reuseFactor,
    instanceLabel: em.instanceLabel,
    instanceIndex: em.instanceIndex,
    complexity: em.complexity,
    quantity: em.quantity,
    disciplineHours: em.module.disciplineHours.map((dh) => ({
      disciplineId: dh.disciplineId,
      baseHours: dh.baseHours,
    })),
  }));

  const allMultipliers = await prisma.multiplier.findMany();
  const enabledMap = new Map(
    estimate.multipliers.map((em) => [em.multiplierId, em.enabled])
  );

  const multipliers: MultiplierInput[] = allMultipliers.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    factor: m.factor,
    target: m.target,
    enabled: enabledMap.get(m.id) ?? false,
  }));

  return calculateEstimate({
    modules,
    disciplines: disciplines.map((d) => ({
      id: d.id,
      name: d.name,
      hourlyRate: d.hourlyRate,
      enabled: enabledDisciplineMap.get(d.id) ?? true,
    })),
    multipliers,
    marginPct: estimate.marginPct,
  });
}

export async function syncEstimateDisciplines(estimateId: string) {
  const disciplines = await prisma.discipline.findMany();

  for (const discipline of disciplines) {
    await prisma.estimateDiscipline.upsert({
      where: {
        estimateId_disciplineId: {
          estimateId,
          disciplineId: discipline.id,
        },
      },
      create: {
        estimateId,
        disciplineId: discipline.id,
        enabled: true,
      },
      update: {},
    });
  }
}

export async function syncEstimateMultipliers(estimateId: string) {
  const multipliers = await prisma.multiplier.findMany();

  for (const multiplier of multipliers) {
    await prisma.estimateMultiplier.upsert({
      where: {
        estimateId_multiplierId: {
          estimateId,
          multiplierId: multiplier.id,
        },
      },
      create: {
        estimateId,
        multiplierId: multiplier.id,
        enabled: false,
      },
      update: {},
    });
  }
}

export async function getNextInstanceIndex(
  estimateId: string,
  moduleId: string
): Promise<number> {
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod?.reuseGroup) return 1;

  const existing = await prisma.estimateModule.findMany({
    where: {
      estimateId,
      module: { reuseGroup: mod.reuseGroup },
    },
  });

  if (existing.length === 0) return 1;
  return Math.max(...existing.map((e) => e.instanceIndex)) + 1;
}
