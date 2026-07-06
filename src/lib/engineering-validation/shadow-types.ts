/**
 * Shadow Mode — tipos.
 *
 * Camada de validação que compara o motor OFICIAL de estimativa com o novo
 * Engineering Engine, sem substituir, salvar ou alterar nada. É puramente
 * informativa (somente cálculo e exibição).
 */

import type {
  EngineeringDifficulty,
  EngineeringDiscipline,
} from "@/lib/matilha-knowledge/engineering/engineering-types";

/**
 * Classificação da divergência entre os dois motores.
 * - aligned: diferença até 15%
 * - attention: diferença entre 15% e 35%
 * - divergent: diferença acima de 35%
 */
export type ShadowStatus = "aligned" | "attention" | "divergent";

/**
 * Comparação de um número oficial vs. Engineering Engine.
 */
export interface ShadowComparison {
  official: number;
  engineering: number;
  /** Diferença absoluta (engineering - official). */
  diffAbs: number;
  /** Diferença percentual em fração (ex.: 0.2 = +20%). Relativa ao oficial. */
  diffPct: number;
}

export interface ShadowDisciplineHours {
  discipline: EngineeringDiscipline;
  label: string;
  hours: number;
}

export interface ShadowBlockUsage {
  blockId: string;
  blockName: string;
  difficulty: EngineeringDifficulty;
  finalHours: number;
  cost: number;
  addedAsDependency: boolean;
}

/**
 * Relatório completo do Shadow Mode quando há Building Blocks de origem.
 */
export interface ShadowReport {
  available: true;
  status: ShadowStatus;
  price: ShadowComparison;
  hours: ShadowComparison;
  /** Margem aplicada (a mesma da estimativa oficial), para comparação justa. */
  marginPct: number;
  disciplineHours: ShadowDisciplineHours[];
  topBlocks: ShadowBlockUsage[];
  /** IDs recuperados da estimativa (Building Blocks de origem). */
  sourceBlockIds: string[];
  /** IDs adicionados automaticamente por dependência no Engineering Engine. */
  addedDependencyIds: string[];
  /** IDs de origem ausentes do catálogo de engenharia. */
  missingBlockIds: string[];
}

/**
 * Resultado indisponível: a estimativa não possui Building Blocks de origem.
 */
export interface ShadowUnavailable {
  available: false;
  reason: string;
}

export type ShadowResult = ShadowReport | ShadowUnavailable;
