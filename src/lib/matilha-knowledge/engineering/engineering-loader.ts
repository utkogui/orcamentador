/**
 * Loader + motor de cálculo do Catálogo de Engenharia.
 *
 * O motor NÃO substitui o cálculo atual. Ele existe em paralelo e implementa a
 * cadeia:
 *
 *   Horas Base → Reuso → Modificadores → Dependências → Risco → Horas finais → Preço
 *
 * As funções de cálculo são puras (não dependem de I/O) para serem testáveis e
 * reutilizáveis. O loader lê o JSON do catálogo no servidor.
 */

import { readFile } from "fs/promises";
import path from "path";
import { MATILHA_KNOWLEDGE_PATH } from "@/lib/matilha-knowledge";
import {
  combineModifierFactor,
  resolveAppliedModifiers,
} from "./engineering-modifiers";
import {
  DEFAULT_DISCIPLINE_RATES,
  ENGINEERING_DISCIPLINES,
  type DisciplineHoursMap,
  type EngineeringBlock,
  type EngineeringBlockEstimate,
  type EngineeringCatalog,
  type EngineeringDiscipline,
  type EngineeringEstimateOptions,
  type EngineeringEstimateResult,
} from "./engineering-types";

const CATALOG_FILE = path.join(
  process.cwd(),
  MATILHA_KNOWLEDGE_PATH,
  "engineering",
  "engineering-catalog.json"
);

let cachedCatalog: EngineeringCatalog | null = null;

/**
 * Carrega o catálogo de engenharia (com cache em memória).
 */
export async function loadEngineeringCatalog(): Promise<EngineeringCatalog> {
  if (cachedCatalog) return cachedCatalog;
  const raw = await readFile(CATALOG_FILE, "utf-8");
  cachedCatalog = JSON.parse(raw) as EngineeringCatalog;
  return cachedCatalog;
}

/**
 * Indexa os blocos por id para acesso O(1).
 */
export function indexEngineeringBlocks(
  catalog: EngineeringCatalog
): Map<string, EngineeringBlock> {
  return new Map(catalog.blocks.map((block) => [block.id, block]));
}

export function findEngineeringBlock(
  blockMap: Map<string, EngineeringBlock>,
  blockId: string
): EngineeringBlock | undefined {
  return blockMap.get(blockId);
}

/**
 * Expande uma lista de IDs incluindo dependências transitivas (sem ciclos).
 *
 * Retorna a ordem em que os blocos devem ser considerados e o conjunto dos IDs
 * que foram adicionados exclusivamente por dependência.
 */
export function resolveEngineeringDependencies(
  blockMap: Map<string, EngineeringBlock>,
  requestedIds: string[]
): { orderedIds: string[]; addedDependencyIds: string[]; missingBlockIds: string[] } {
  const requested = new Set(requestedIds);
  const visited = new Set<string>();
  const ordered: string[] = [];
  const addedDependencyIds = new Set<string>();
  const missingBlockIds = new Set<string>();

  const visit = (id: string, isDependency: boolean) => {
    if (visited.has(id)) return;
    const block = blockMap.get(id);
    if (!block) {
      missingBlockIds.add(id);
      return;
    }
    visited.add(id);

    for (const depId of block.dependencies ?? []) {
      if (!requested.has(depId)) addedDependencyIds.add(depId);
      visit(depId, true);
    }

    ordered.push(id);
    if (isDependency && !requested.has(id)) addedDependencyIds.add(id);
  };

  for (const id of requestedIds) visit(id, false);

  return {
    orderedIds: ordered,
    addedDependencyIds: Array.from(addedDependencyIds),
    missingBlockIds: Array.from(missingBlockIds),
  };
}

function sumProfileHours(block: EngineeringBlock): number {
  return Object.values(block.engineeringProfile).reduce(
    (acc, hours) => acc + (hours ?? 0),
    0
  );
}

/**
 * Estima um único bloco seguindo a cadeia completa de cálculo.
 *
 * @param block Bloco de engenharia.
 * @param options Opções (modificadores, taxas, reuso).
 * @param addedAsDependency Marca se veio de dependência automática.
 */
export function estimateEngineeringBlock(
  block: EngineeringBlock,
  options: EngineeringEstimateOptions = {},
  addedAsDependency = false
): EngineeringBlockEstimate {
  const rates = { ...DEFAULT_DISCIPLINE_RATES, ...(options.disciplineRates ?? {}) };

  // Etapa 1 — Horas Base
  const baseHours = sumProfileHours(block);

  // Etapa 2 — Reuso
  const reuseApplied = (options.reusedBlockIds ?? []).includes(block.id);
  const reuseMultiplier = reuseApplied ? block.reuseFactor : 1;
  const hoursAfterReuse = baseHours * reuseMultiplier;

  // Etapa 3 — Modificadores (stack + bloco)
  const appliedModifiers = resolveAppliedModifiers(
    block,
    options.stackModifierIds ?? [],
    options.activeComplexityModifiers ?? []
  );
  const modifierFactor = combineModifierFactor(appliedModifiers);
  const hoursAfterModifiers = hoursAfterReuse * modifierFactor;

  // Etapa 5 — Risco (buffer proporcional)
  const riskHours = hoursAfterModifiers * block.riskFactor;
  const finalHours = hoursAfterModifiers + riskHours;

  // Distribui as horas finais mantendo a proporção do perfil e calcula custo
  const hoursByDiscipline: DisciplineHoursMap = {};
  let cost = 0;
  const scale = baseHours > 0 ? finalHours / baseHours : 0;

  for (const discipline of ENGINEERING_DISCIPLINES) {
    const profileHours = block.engineeringProfile[discipline] ?? 0;
    if (profileHours <= 0) continue;
    const disciplineFinalHours = profileHours * scale;
    hoursByDiscipline[discipline] = disciplineFinalHours;
    cost += disciplineFinalHours * (rates[discipline] ?? 0);
  }

  return {
    blockId: block.id,
    blockName: block.name ?? block.id,
    difficulty: block.difficulty,
    addedAsDependency,
    baseHours,
    reuseFactor: block.reuseFactor,
    reuseApplied,
    hoursAfterReuse,
    appliedModifiers,
    modifierFactor,
    hoursAfterModifiers,
    riskFactor: block.riskFactor,
    riskHours,
    finalHours,
    hoursByDiscipline,
    cost,
  };
}

function addDisciplineHours(
  target: DisciplineHoursMap,
  source: DisciplineHoursMap
): void {
  for (const discipline of ENGINEERING_DISCIPLINES) {
    const value = source[discipline];
    if (!value) continue;
    target[discipline] = (target[discipline] ?? 0) + value;
  }
}

/**
 * Estima um escopo completo (vários blocos), resolvendo dependências e agregando.
 *
 * Etapa 4 (Dependências) é resolvida aqui: blocos dependentes entram no cálculo
 * automaticamente. As demais etapas são aplicadas por bloco.
 */
export function estimateEngineeringScope(
  blockMap: Map<string, EngineeringBlock>,
  requestedIds: string[],
  options: EngineeringEstimateOptions = {}
): EngineeringEstimateResult {
  const includeDependencies = options.includeDependencies ?? true;

  const resolution = includeDependencies
    ? resolveEngineeringDependencies(blockMap, requestedIds)
    : {
        orderedIds: requestedIds.filter((id) => blockMap.has(id)),
        addedDependencyIds: [] as string[],
        missingBlockIds: requestedIds.filter((id) => !blockMap.has(id)),
      };

  const addedSet = new Set(resolution.addedDependencyIds);
  const blocks: EngineeringBlockEstimate[] = [];
  const hoursByDiscipline: DisciplineHoursMap = {};

  let totalBaseHours = 0;
  let totalFinalHours = 0;
  let totalCost = 0;

  for (const id of resolution.orderedIds) {
    const block = blockMap.get(id);
    if (!block) continue;
    const estimate = estimateEngineeringBlock(block, options, addedSet.has(id));
    blocks.push(estimate);
    totalBaseHours += estimate.baseHours;
    totalFinalHours += estimate.finalHours;
    totalCost += estimate.cost;
    addDisciplineHours(hoursByDiscipline, estimate.hoursByDiscipline);
  }

  return {
    blocks,
    addedDependencyIds: resolution.addedDependencyIds,
    missingBlockIds: resolution.missingBlockIds,
    totalBaseHours,
    totalFinalHours,
    totalCost,
    hoursByDiscipline,
  };
}

/**
 * Atalho: carrega o catálogo e estima um escopo em uma chamada (server-side).
 */
export async function estimateEngineeringScopeFromCatalog(
  requestedIds: string[],
  options: EngineeringEstimateOptions = {}
): Promise<EngineeringEstimateResult> {
  const catalog = await loadEngineeringCatalog();
  const blockMap = indexEngineeringBlocks(catalog);
  return estimateEngineeringScope(blockMap, requestedIds, options);
}

export function resetEngineeringCatalogCache(): void {
  cachedCatalog = null;
}

export type { EngineeringDiscipline };
