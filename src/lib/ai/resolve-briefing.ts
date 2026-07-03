import { Complexity } from "@prisma/client";
import type { AiBriefingResponse, ResolvedBriefing } from "@/lib/ai/briefing-schema";
import type { getCatalogContextForPrompt } from "@/lib/ai/catalog-context";

type Catalog = Awaited<ReturnType<typeof getCatalogContextForPrompt>>;

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function findModuleByName(catalog: Catalog, moduleName: string) {
  const exact = catalog.modules.find((m) => m.name === moduleName);
  if (exact) return exact;

  const normalized = normalizeName(moduleName);
  return catalog.modules.find((m) => normalizeName(m.name) === normalized);
}

export function resolveAiBriefing(
  ai: AiBriefingResponse,
  catalog: Catalog
): ResolvedBriefing {
  const warnings: string[] = [];
  const items: ResolvedBriefing["items"] = [];
  const reuseCounters = new Map<string, number>();

  for (const item of ai.items) {
    const mod = findModuleByName(catalog, item.moduleName);
    if (!mod) {
      warnings.push(`Módulo ignorado (não encontrado no catálogo): "${item.moduleName}"`);
      continue;
    }

    let instanceIndex = 1;
    if (mod.reuseGroup) {
      const next = (reuseCounters.get(mod.reuseGroup) ?? 0) + 1;
      reuseCounters.set(mod.reuseGroup, next);
      instanceIndex = next;
    }

    items.push({
      moduleId: mod.id,
      moduleName: mod.name,
      instanceLabel: item.instanceLabel,
      instanceIndex,
      complexity: item.complexity as Complexity,
      reason: item.reason,
    });
  }

  if (items.length === 0) {
    throw new Error("Nenhum módulo válido foi mapeado a partir da interpretação da IA.");
  }

  const platformCount = items.filter((i) => {
    const mod = catalog.modules.find((m) => m.id === i.moduleId);
    return mod?.layer === "PLATFORM";
  }).length;

  if (platformCount === 0) {
    warnings.push('Nenhum "Core da Plataforma" incluído — considere adicionar manualmente.');
  }
  if (platformCount > 1) {
    warnings.push("Mais de uma instância de plataforma — revise antes de confirmar.");
  }

  const multiplierIds: string[] = [];
  for (const slug of ai.multiplierSlugs) {
    const multiplier = catalog.multipliers.find((m) => m.slug === slug);
    if (multiplier) {
      multiplierIds.push(multiplier.id);
    } else {
      warnings.push(`Multiplicador ignorado (slug inválido): "${slug}"`);
    }
  }

  const disabledDisciplineIds: string[] = [];
  for (const name of ai.disciplinesExcluded) {
    const discipline = catalog.disciplines.find(
      (d) => normalizeName(d.name) === normalizeName(name)
    );
    if (discipline) {
      disabledDisciplineIds.push(discipline.id);
    } else {
      warnings.push(`Disciplina ignorada (nome inválido): "${name}"`);
    }
  }

  return {
    projectName: ai.projectName,
    clientName: ai.clientName,
    summary: ai.summary,
    marginPct: ai.marginPct ?? 30,
    items,
    multiplierIds,
    disabledDisciplineIds,
    warnings,
  };
}
