/**
 * Fontes de esforço / horas — tipos.
 *
 * Camada de proveniência: ancora o catálogo de engenharia em benchmarks,
 * modelos paramétricos e práticas de mercado (sem substituir as horas do bloco).
 */

export type EffortSourceType =
  | "benchmark_db"
  | "parametric_model"
  | "sizing_standard"
  | "industry_report"
  | "activity_catalog"
  | "agency_practice"
  | "reuse_library"
  | "internal";

export type EffortSourceReliability = "high" | "medium" | "exploratory";

export type EffortSourceMetric = {
  label: string;
  value: string;
  unit?: string;
  note?: string;
};

export type EffortSource = {
  id: string;
  title: string;
  shortTitle: string;
  type: EffortSourceType;
  publisher: string;
  year?: number;
  url?: string;
  language: "pt" | "en";
  reliability: EffortSourceReliability;
  /** O que a fonte mede / entrega. */
  whatItGives: string;
  /** Como a Matilha usa isso na calibração de horas. */
  howWeUseIt: string;
  keyTakeaways: string[];
  metrics?: EffortSourceMetric[];
  relatedCategoryIds?: string[];
  relatedBlockIds?: string[];
  tags?: string[];
};

export type EffortSourcesCatalog = {
  version: string;
  name: string;
  description: string;
  lastReviewed: string;
  sources: EffortSource[];
  /**
   * Mapeamento explícito bloco → fontes (além de relatedBlockIds/category).
   * Útil para reforçar proveniência nos cards de engenharia.
   */
  blockLinks?: Record<string, string[]>;
};

export const EFFORT_SOURCE_TYPE_LABELS: Record<EffortSourceType, string> = {
  benchmark_db: "Base de benchmarks",
  parametric_model: "Modelo paramétrico",
  sizing_standard: "Padrão de sizing",
  industry_report: "Relatório de mercado",
  activity_catalog: "Catálogo de atividades",
  agency_practice: "Prática de agência / studio",
  reuse_library: "Biblioteca de reuso",
  internal: "Histórico interno",
};

export const EFFORT_SOURCE_RELIABILITY_LABELS: Record<EffortSourceReliability, string> = {
  high: "Alta",
  medium: "Média",
  exploratory: "Exploratória",
};
