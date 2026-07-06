/**
 * Shadow Mode — motor de comparação.
 *
 * Recebe dados da estimativa OFICIAL, recupera os Building Blocks de origem
 * (a partir do fluxo salvo em projectFlowJson), roda o Engineering Engine e
 * devolve um relatório comparativo. NÃO altera preço oficial nem persiste nada.
 */

import { parseApplicationFlow } from "@/lib/application-flow/storage";
import type { StoredApplicationFlow } from "@/lib/application-flow/types";
import {
  estimateEngineeringScopeFromCatalog,
} from "@/lib/matilha-knowledge/engineering/engineering-loader";
import {
  ENGINEERING_DISCIPLINES,
  ENGINEERING_DISCIPLINE_LABELS,
  type EngineeringEstimateOptions,
} from "@/lib/matilha-knowledge/engineering/engineering-types";
import type {
  ShadowBlockUsage,
  ShadowComparison,
  ShadowDisciplineHours,
  ShadowResult,
  ShadowStatus,
} from "./shadow-types";

export const SHADOW_UNAVAILABLE_MESSAGE =
  "Shadow Mode indisponível: esta estimativa não possui Building Blocks de origem.";

const ALIGNED_THRESHOLD = 0.15;
const ATTENTION_THRESHOLD = 0.35;

/**
 * Classifica a divergência (em fração) entre os motores.
 */
export function classifyShadowStatus(diffPct: number): ShadowStatus {
  const magnitude = Math.abs(diffPct);
  if (magnitude <= ALIGNED_THRESHOLD) return "aligned";
  if (magnitude <= ATTENTION_THRESHOLD) return "attention";
  return "divergent";
}

/**
 * Recupera os IDs de Building Blocks de origem a partir do fluxo salvo.
 * Nós sintéticos (login/logout inferidos) não possuem blockId e são ignorados.
 */
export function extractSourceBlockIds(flow: StoredApplicationFlow | null): string[] {
  if (!flow) return [];
  const ids = flow.nodes
    .map((node) => node.data?.blockId)
    .filter((id): id is string => Boolean(id));
  return Array.from(new Set(ids));
}

function buildComparison(official: number, engineering: number): ShadowComparison {
  const diffAbs = engineering - official;
  const diffPct = official > 0 ? diffAbs / official : 0;
  return { official, engineering, diffAbs, diffPct };
}

export interface ShadowEstimateInput {
  /** Preço sugerido oficial (com margem). */
  officialPrice: number;
  /** Horas oficiais (ajustadas) da estimativa atual. */
  officialHours: number;
  /** Margem da estimativa (para aplicar o mesmo % ao Engineering Engine). */
  marginPct: number;
  /** JSON do fluxo salvo (projectFlowJson) de onde vêm os Building Blocks. */
  projectFlowJson: string | null | undefined;
  /** Opções extras do Engineering Engine (stack modifiers, taxas, etc.). */
  engineeringOptions?: EngineeringEstimateOptions;
}

/**
 * Gera o relatório do Shadow Mode. Retorna indisponível se não houver blocos.
 */
export async function generateShadowEstimate(
  input: ShadowEstimateInput
): Promise<ShadowResult> {
  const flow = parseApplicationFlow(input.projectFlowJson);
  const sourceBlockIds = extractSourceBlockIds(flow);

  if (sourceBlockIds.length === 0) {
    return { available: false, reason: SHADOW_UNAVAILABLE_MESSAGE };
  }

  const scope = await estimateEngineeringScopeFromCatalog(
    sourceBlockIds,
    input.engineeringOptions
  );

  if (scope.blocks.length === 0) {
    return { available: false, reason: SHADOW_UNAVAILABLE_MESSAGE };
  }

  const engineeringPrice = scope.totalCost * (1 + input.marginPct / 100);

  const price = buildComparison(input.officialPrice, engineeringPrice);
  const hours = buildComparison(input.officialHours, scope.totalFinalHours);

  const disciplineHours: ShadowDisciplineHours[] = ENGINEERING_DISCIPLINES.map(
    (discipline) => ({
      discipline,
      label: ENGINEERING_DISCIPLINE_LABELS[discipline],
      hours: scope.hoursByDiscipline[discipline] ?? 0,
    })
  )
    .filter((entry) => entry.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const topBlocks: ShadowBlockUsage[] = [...scope.blocks]
    .sort((a, b) => b.finalHours - a.finalHours)
    .slice(0, 6)
    .map((block) => ({
      blockId: block.blockId,
      blockName: block.blockName,
      difficulty: block.difficulty,
      finalHours: block.finalHours,
      cost: block.cost,
      addedAsDependency: block.addedAsDependency,
    }));

  return {
    available: true,
    status: classifyShadowStatus(price.diffPct),
    price,
    hours,
    marginPct: input.marginPct,
    disciplineHours,
    topBlocks,
    sourceBlockIds,
    addedDependencyIds: scope.addedDependencyIds,
    missingBlockIds: scope.missingBlockIds,
  };
}
