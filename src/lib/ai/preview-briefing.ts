import { prisma } from "@/lib/prisma";
import { calculateEstimate, type EstimateCalculationResult } from "@/lib/calculations";
import type { ResolvedBriefing } from "@/lib/ai/briefing-schema";

export async function previewBriefingEstimate(
  resolved: ResolvedBriefing
): Promise<EstimateCalculationResult> {
  const [modules, disciplines, multipliers] = await Promise.all([
    prisma.module.findMany({ include: { disciplineHours: true } }),
    prisma.discipline.findMany(),
    prisma.multiplier.findMany(),
  ]);

  const moduleMap = new Map(modules.map((m) => [m.id, m]));
  const disabledSet = new Set(resolved.disabledDisciplineIds);
  const enabledMultiplierSet = new Set(resolved.multiplierIds);

  const estimateModules = resolved.items.map((item, index) => {
    const mod = moduleMap.get(item.moduleId);
    if (!mod) {
      throw new Error(`Módulo não encontrado: ${item.moduleName}`);
    }

    return {
      id: `preview-${index}`,
      moduleId: mod.id,
      moduleName: mod.name,
      layer: mod.layer,
      reuseGroup: mod.reuseGroup,
      reuseFactor: mod.reuseFactor,
      instanceLabel: item.instanceLabel,
      instanceIndex: item.instanceIndex,
      complexity: item.complexity,
      quantity: 1,
      disciplineHours: mod.disciplineHours.map((dh) => ({
        disciplineId: dh.disciplineId,
        baseHours: dh.baseHours,
      })),
    };
  });

  return calculateEstimate({
    modules: estimateModules,
    disciplines: disciplines.map((d) => ({
      id: d.id,
      name: d.name,
      hourlyRate: d.hourlyRate,
      enabled: !disabledSet.has(d.id),
    })),
    multipliers: multipliers.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      factor: m.factor,
      target: m.target,
      enabled: enabledMultiplierSet.has(m.id),
    })),
    marginPct: resolved.marginPct,
  });
}
