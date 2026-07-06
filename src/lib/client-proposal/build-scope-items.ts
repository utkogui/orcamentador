import type { EstimateCalculationResult } from "@/lib/calculations";

export type ClientScopeItem = {
  id: string;
  label: string;
  subtitle?: string;
};

export function buildClientScopeItems(result: EstimateCalculationResult): ClientScopeItem[] {
  const seen = new Set<string>();
  const items: ClientScopeItem[] = [];

  for (const line of result.lineItems) {
    const label = line.instanceLabel ?? line.moduleName;
    const key = `${label}:${line.moduleName}`;
    if (seen.has(key)) continue;
    seen.add(key);

    items.push({
      id: line.id,
      label,
      subtitle: line.instanceLabel ? line.moduleName : undefined,
    });
  }

  return items.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}
