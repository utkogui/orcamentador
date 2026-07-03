import { prisma } from "@/lib/prisma";
import type { ResolvedBriefing } from "@/lib/ai/briefing-schema";
import { syncEstimateDisciplines, syncEstimateMultipliers } from "@/lib/estimate-service";

export async function createEstimateFromBriefing(resolved: ResolvedBriefing) {
  const estimate = await prisma.estimate.create({
    data: {
      name: resolved.projectName,
      clientName: resolved.clientName,
      description: resolved.summary,
      marginPct: resolved.marginPct,
    },
  });

  await syncEstimateMultipliers(estimate.id);
  await syncEstimateDisciplines(estimate.id);

  for (const item of resolved.items) {
    await prisma.estimateModule.create({
      data: {
        estimateId: estimate.id,
        moduleId: item.moduleId,
        instanceLabel: item.instanceLabel,
        instanceIndex: item.instanceIndex,
        complexity: item.complexity,
        quantity: 1,
      },
    });
  }

  const allMultipliers = await prisma.multiplier.findMany();
  const enabledSet = new Set(resolved.multiplierIds);

  for (const multiplier of allMultipliers) {
    await prisma.estimateMultiplier.update({
      where: {
        estimateId_multiplierId: {
          estimateId: estimate.id,
          multiplierId: multiplier.id,
        },
      },
      data: { enabled: enabledSet.has(multiplier.id) },
    });
  }

  for (const disciplineId of resolved.disabledDisciplineIds) {
    await prisma.estimateDiscipline.update({
      where: {
        estimateId_disciplineId: {
          estimateId: estimate.id,
          disciplineId,
        },
      },
      data: { enabled: false },
    });
  }

  return estimate;
}
