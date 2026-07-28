import catalogData from "./effort-sources-catalog.json";
import type { EffortSource, EffortSourcesCatalog } from "./effort-sources-types";

const catalog = catalogData as EffortSourcesCatalog;

export function loadEffortSourcesCatalog(): EffortSourcesCatalog {
  return catalog;
}

export function getAllEffortSources(): EffortSource[] {
  return catalog.sources;
}

export function getEffortSourceById(id: string): EffortSource | undefined {
  return catalog.sources.find((s) => s.id === id);
}

export function indexEffortSources(): Map<string, EffortSource> {
  return new Map(catalog.sources.map((s) => [s.id, s]));
}

/**
 * Fontes ligadas a um Building Block / bloco de engenharia.
 * Une: blockLinks explícitos + relatedBlockIds + relatedCategoryIds das fontes.
 */
export function getEffortSourcesForBlock(
  blockId: string,
  categoryId?: string
): EffortSource[] {
  const byId = indexEffortSources();
  const ids = new Set<string>();

  for (const id of catalog.blockLinks?.[blockId] ?? []) {
    ids.add(id);
  }

  for (const source of catalog.sources) {
    if (source.relatedBlockIds?.includes(blockId)) {
      ids.add(source.id);
    }
    if (categoryId && source.relatedCategoryIds?.includes(categoryId)) {
      ids.add(source.id);
    }
  }

  return [...ids]
    .map((id) => byId.get(id))
    .filter((s): s is EffortSource => Boolean(s));
}

export function getEffortSourcesByType(
  type: EffortSource["type"]
): EffortSource[] {
  return catalog.sources.filter((s) => s.type === type);
}
