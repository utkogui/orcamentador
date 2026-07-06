/**
 * Shadow Mode — formatadores e helpers de apresentação.
 */

import type { EngineeringDifficulty } from "@/lib/matilha-knowledge/engineering/engineering-types";
import { ENGINEERING_DIFFICULTY_LABELS } from "@/lib/matilha-knowledge/engineering/engineering-types";
import type { ShadowStatus } from "./shadow-types";

export const SHADOW_STATUS_LABELS: Record<ShadowStatus, string> = {
  aligned: "Alinhado",
  attention: "Atenção",
  divergent: "Divergente",
};

export const SHADOW_STATUS_DESCRIPTIONS: Record<ShadowStatus, string> = {
  aligned: "Diferença de até 15% entre os motores.",
  attention: "Diferença entre 15% e 35% — vale revisar o escopo.",
  divergent: "Diferença acima de 35% — recalibrar cálculo ou catálogo.",
};

/**
 * Classes utilitárias (Tailwind) para o badge de status.
 */
export const SHADOW_STATUS_BADGE_CLASSES: Record<ShadowStatus, string> = {
  aligned: "border-emerald-300 bg-emerald-50 text-emerald-700",
  attention: "border-amber-300 bg-amber-50 text-amber-700",
  divergent: "border-rose-300 bg-rose-50 text-rose-700",
};

/**
 * Formata uma fração como percentual com sinal (ex.: 0.2 → "+20%").
 */
export function formatSignedPercent(fraction: number): string {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(Math.abs(fraction));
  const sign = fraction > 0 ? "+" : fraction < 0 ? "-" : "";
  return `${sign}${formatted}`;
}

export function formatDifficulty(difficulty: EngineeringDifficulty): string {
  return ENGINEERING_DIFFICULTY_LABELS[difficulty];
}
