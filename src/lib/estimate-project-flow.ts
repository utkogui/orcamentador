import { prisma } from "@/lib/prisma";
import {
  generateDefaultProjectFlow,
  parseProjectFlow,
  type ProjectFlow,
  type ProjectFlowModule,
} from "@/lib/project-flow";

export async function getEstimateProjectFlow(estimateId: string): Promise<ProjectFlow | null> {
  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
    include: {
      modules: {
        include: { module: true },
        orderBy: { module: { name: "asc" } },
      },
    },
  });

  if (!estimate) return null;

  const saved = parseProjectFlow(estimate.projectFlowJson);
  if (saved) return saved;

  const modules: ProjectFlowModule[] = estimate.modules.map((em) => ({
    id: em.id,
    name: em.instanceLabel ?? em.module.name,
    moduleName: em.module.name,
    quantity: em.quantity,
    description: em.module.description,
  }));

  return generateDefaultProjectFlow({
    projectName: estimate.name,
    modules,
  });
}

export async function buildDefaultProjectFlow(estimateId: string): Promise<ProjectFlow | null> {
  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
    include: {
      modules: {
        include: { module: true },
        orderBy: { module: { name: "asc" } },
      },
    },
  });

  if (!estimate) return null;

  return generateDefaultProjectFlow({
    projectName: estimate.name,
    modules: estimate.modules.map((em) => ({
      id: em.id,
      name: em.instanceLabel ?? em.module.name,
      moduleName: em.module.name,
      quantity: em.quantity,
      description: em.module.description,
    })),
  });
}
