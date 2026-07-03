"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Complexity } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { syncEstimateDisciplines, syncEstimateMultipliers, getNextInstanceIndex } from "@/lib/estimate-service";
import {
  buildDefaultProjectFlow,
  getEstimateProjectFlow,
} from "@/lib/estimate-project-flow";
import {
  serializeProjectFlow,
  updateProjectFlowLabels,
  type ProjectFlow,
} from "@/lib/project-flow";
import {
  disciplineSchema,
  estimateSchema,
  moduleSchema,
  multiplierSchema,
} from "@/lib/validations";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createEstimate(formData: FormData) {
  const parsed = estimateSchema.safeParse({
    name: formData.get("name"),
    clientName: formData.get("clientName") || undefined,
    description: formData.get("description") || undefined,
    marginPct: formData.get("marginPct") || 30,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  const estimate = await prisma.estimate.create({ data: parsed.data });
  await syncEstimateMultipliers(estimate.id);
  await syncEstimateDisciplines(estimate.id);
  redirect(`/estimates/${estimate.id}`);
}

export async function toggleEstimateDiscipline(
  estimateId: string,
  disciplineId: string,
  enabled: boolean
) {
  await prisma.estimateDiscipline.upsert({
    where: {
      estimateId_disciplineId: { estimateId, disciplineId },
    },
    create: { estimateId, disciplineId, enabled },
    update: { enabled },
  });
  revalidatePath(`/estimates/${estimateId}`);
  revalidatePath(`/estimates/${estimateId}/result`);
}

export async function saveProjectFlowLabels(
  estimateId: string,
  labels: Record<string, { label?: string; subtitle?: string }>
) {
  const current = await getEstimateProjectFlow(estimateId);
  if (!current) throw new Error("Fluxo não encontrado");

  const updated = updateProjectFlowLabels(current, labels);

  await prisma.estimate.update({
    where: { id: estimateId },
    data: { projectFlowJson: serializeProjectFlow(updated) },
  });

  revalidatePath(`/estimates/${estimateId}`);
  revalidatePath(`/estimates/${estimateId}/result`);
}

export async function resetProjectFlow(estimateId: string): Promise<ProjectFlow> {
  const flow = await buildDefaultProjectFlow(estimateId);
  if (!flow) throw new Error("Estimativa não encontrada");

  await prisma.estimate.update({
    where: { id: estimateId },
    data: { projectFlowJson: serializeProjectFlow(flow) },
  });

  revalidatePath(`/estimates/${estimateId}`);
  revalidatePath(`/estimates/${estimateId}/result`);

  return flow;
}

export async function updateEstimate(id: string, formData: FormData) {
  const parsed = estimateSchema.safeParse({
    name: formData.get("name"),
    clientName: formData.get("clientName") || undefined,
    description: formData.get("description") || undefined,
    marginPct: formData.get("marginPct") || 30,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  await prisma.estimate.update({ where: { id }, data: parsed.data });
  revalidatePath(`/estimates/${id}`);
  revalidatePath("/estimates");
  redirect(`/estimates/${id}`);
}

export async function deleteEstimate(id: string) {
  await prisma.estimate.delete({ where: { id } });
  revalidatePath("/estimates");
  redirect("/estimates");
}

export async function addEstimateModule(estimateId: string, formData: FormData) {
  const moduleId = String(formData.get("moduleId") ?? "");
  const complexity = String(formData.get("complexity") ?? "MEDIUM") as Complexity;
  const quantity = Number(formData.get("quantity") ?? 1);
  const instanceLabel = String(formData.get("instanceLabel") ?? "").trim() || null;

  if (!moduleId) throw new Error("Selecione um módulo");

  const instanceIndex = await getNextInstanceIndex(estimateId, moduleId);

  await prisma.estimateModule.create({
    data: {
      estimateId,
      moduleId,
      complexity,
      quantity,
      instanceLabel,
      instanceIndex,
    },
  });

  revalidatePath(`/estimates/${estimateId}`);
  revalidatePath(`/estimates/${estimateId}/result`);
}

export async function removeEstimateModule(estimateId: string, estimateModuleId: string) {
  await prisma.estimateModule.delete({
    where: { id: estimateModuleId },
  });
  revalidatePath(`/estimates/${estimateId}`);
  revalidatePath(`/estimates/${estimateId}/result`);
}

export async function toggleEstimateMultiplier(
  estimateId: string,
  multiplierId: string,
  enabled: boolean
) {
  await prisma.estimateMultiplier.upsert({
    where: {
      estimateId_multiplierId: { estimateId, multiplierId },
    },
    create: { estimateId, multiplierId, enabled },
    update: { enabled },
  });
  revalidatePath(`/estimates/${estimateId}`);
}

export async function createModule(formData: FormData) {
  const parsed = moduleSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  const mod = await prisma.module.create({ data: parsed.data });
  redirect(`/modules/${mod.id}`);
}

export async function updateModule(id: string, formData: FormData) {
  const parsed = moduleSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  await prisma.module.update({ where: { id }, data: parsed.data });
  revalidatePath(`/modules/${id}`);
  revalidatePath("/modules");
  redirect(`/modules/${id}`);
}

export async function deleteModule(id: string) {
  await prisma.module.delete({ where: { id } });
  revalidatePath("/modules");
  redirect("/modules");
}

export async function saveModuleHours(moduleId: string, formData: FormData) {
  const disciplines = await prisma.discipline.findMany();

  for (const discipline of disciplines) {
    const value = formData.get(`hours_${discipline.id}`);
    const baseHours = value === "" || value === null ? 0 : Number(value);

    if (baseHours > 0) {
      await prisma.moduleDisciplineHour.upsert({
        where: {
          moduleId_disciplineId: {
            moduleId,
            disciplineId: discipline.id,
          },
        },
        create: { moduleId, disciplineId: discipline.id, baseHours },
        update: { baseHours },
      });
    } else {
      await prisma.moduleDisciplineHour.deleteMany({
        where: { moduleId, disciplineId: discipline.id },
      });
    }
  }

  revalidatePath(`/modules/${moduleId}`);
  redirect(`/modules/${moduleId}`);
}

export async function createDiscipline(formData: FormData) {
  const parsed = disciplineSchema.safeParse({
    name: formData.get("name"),
    hourlyRate: formData.get("hourlyRate"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  await prisma.discipline.create({ data: parsed.data });
  revalidatePath("/disciplines");
  redirect("/disciplines");
}

export async function updateDiscipline(id: string, formData: FormData) {
  const parsed = disciplineSchema.safeParse({
    name: formData.get("name"),
    hourlyRate: formData.get("hourlyRate"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  await prisma.discipline.update({ where: { id }, data: parsed.data });
  revalidatePath("/disciplines");
  revalidatePath(`/disciplines/${id}/edit`);
  redirect("/disciplines");
}

export async function deleteDiscipline(id: string) {
  await prisma.discipline.delete({ where: { id } });
  revalidatePath("/disciplines");
  redirect("/disciplines");
}

export async function createMultiplier(formData: FormData) {
  const parsed = multiplierSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") || undefined,
    factor: formData.get("factor"),
    target: formData.get("target"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  await prisma.multiplier.create({ data: parsed.data });
  revalidatePath("/multipliers");
  redirect("/multipliers");
}

export async function updateMultiplier(id: string, formData: FormData) {
  const parsed = multiplierSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    factor: formData.get("factor"),
    target: formData.get("target"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  await prisma.multiplier.update({ where: { id }, data: parsed.data });
  revalidatePath("/multipliers");
  redirect("/multipliers");
}

export async function deleteMultiplier(id: string) {
  await prisma.multiplier.delete({ where: { id } });
  revalidatePath("/multipliers");
  redirect("/multipliers");
}
