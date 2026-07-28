/**
 * Catálogo de Engenharia — camada paralela ao cálculo atual.
 *
 * Cada Building Block deixa de ter apenas um "peso" genérico e passa a ter um
 * perfil de engenharia completo: esforço por disciplina, reuso, dificuldade,
 * modificadores, dependências e risco.
 *
 * Esta camada NÃO substitui o motor atual. Ela é construída em paralelo para,
 * futuramente, alimentar o cálculo de estimativas.
 */

/**
 * Disciplinas de engenharia. Cada bloco tem horas independentes por disciplina.
 */
export type EngineeringDiscipline =
  | "ux"
  | "ui"
  | "frontend"
  | "backend"
  | "qa"
  | "devops"
  | "pm"
  | "content"
  | "copywriting"
  | "architecture"
  | "ai";

export const ENGINEERING_DISCIPLINES: EngineeringDiscipline[] = [
  "ux",
  "ui",
  "frontend",
  "backend",
  "qa",
  "devops",
  "pm",
  "content",
  "copywriting",
  "architecture",
  "ai",
];

export const ENGINEERING_DISCIPLINE_LABELS: Record<EngineeringDiscipline, string> = {
  ux: "UX",
  ui: "UI",
  frontend: "Frontend",
  backend: "Backend",
  qa: "QA",
  devops: "DevOps",
  pm: "PM",
  content: "Conteúdo",
  copywriting: "Copywriting",
  architecture: "Arquitetura",
  ai: "IA",
};

/**
 * Perfil de esforço: horas por disciplina. Disciplinas ausentes = 0 horas.
 */
export type EngineeringProfile = Partial<Record<EngineeringDiscipline, number>>;

/**
 * Níveis de dificuldade. Substitui, nesta camada, o conceito de "complexidade".
 *
 * - commodity: praticamente montagem, altíssimo reuso.
 * - configurable: parametrização de algo conhecido.
 * - engineering: exige engenharia dedicada.
 * - product: comportamento de produto, alto risco e baixo reuso.
 */
export type EngineeringDifficulty =
  | "commodity"
  | "configurable"
  | "engineering"
  | "product";

export const ENGINEERING_DIFFICULTY_LABELS: Record<EngineeringDifficulty, string> = {
  commodity: "Commodity",
  configurable: "Configurável",
  engineering: "Engenharia",
  product: "Produto",
};

/**
 * Modificadores específicos do bloco. Cada chave é um modificador nomeado e o
 * valor é o delta percentual em fração (ex.: 0.4 = +40%, -0.1 = -10%).
 *
 * Diferente dos `stackModifiers` (globais, ver engineering-modifiers.ts), estes
 * são particulares de cada bloco (ex.: "mfa", "multi_tenant", "high_volume").
 */
export type ComplexityModifiers = Record<string, number>;

/**
 * Perfil de engenharia de um Building Block.
 */
export interface EngineeringBlock {
  /** Mesmo id do Building Block na Knowledge Base. */
  id: string;
  /** Nome amigável (redundante com a KB, mantido para uso isolado). */
  name?: string;
  /** Categoria do bloco (id da KB). */
  categoryId?: string;
  /** Nível de dificuldade (substitui complexidade nesta camada). */
  difficulty: EngineeringDifficulty;
  /**
   * Fator de reuso entre 0 e 1. Quanto maior, mais barato reutilizar/repetir.
   * Ex.: Login 0.95, CRUD 0.90, Dashboard 0.80, Marketplace 0.30, IA 0.15.
   */
  reuseFactor: number;
  /** Esforço base por disciplina, em horas. */
  engineeringProfile: EngineeringProfile;
  /** Modificadores específicos do bloco (frações). */
  complexityModifiers?: ComplexityModifiers;
  /**
   * Dependências de engenharia. IDs de outros blocos que este bloco puxa
   * automaticamente (ex.: Login → Recuperação de Senha, E-mail Transacional).
   */
  dependencies?: string[];
  /**
   * Tags de stack que habilitam modificadores globais (ex.: "auth", "email",
   * "oauth", "storage"). Ver engineering-modifiers.ts.
   */
  stackTags?: string[];
  /**
   * Fator de risco entre 0 e 1. Vira buffer de horas.
   * Ex.: CRUD 0.05, Marketplace 0.45, OCR 0.60, IA 0.70, ERP 0.80.
   */
  riskFactor: number;
  /**
   * IDs de fontes de esforço (`effort-sources`) que ancoram este perfil.
   * Opcional — também resolvido via blockLinks/categorias no catálogo de fontes.
   */
  sourceIds?: string[];
}

export interface EngineeringCatalog {
  version: string;
  name: string;
  description: string;
  disciplines: EngineeringDiscipline[];
  blocks: EngineeringBlock[];
}

/**
 * Valor-hora padrão por disciplina (R$). Usado apenas como fallback quando o
 * chamador não fornece as taxas reais (ex.: das disciplinas cadastradas).
 */
export const DEFAULT_DISCIPLINE_RATES: Record<EngineeringDiscipline, number> = {
  ux: 180,
  ui: 180,
  frontend: 170,
  backend: 190,
  qa: 140,
  devops: 200,
  pm: 210,
  content: 120,
  copywriting: 130,
  architecture: 260,
  ai: 240,
};

/**
 * Horas por disciplina resultantes de um cálculo.
 */
export type DisciplineHoursMap = Partial<Record<EngineeringDiscipline, number>>;

/**
 * Registro de um modificador efetivamente aplicado a um bloco.
 */
export interface AppliedModifier {
  id: string;
  label: string;
  /** Fração aplicada (ex.: -0.1, +0.4). */
  factor: number;
  source: "stack" | "block";
}

/**
 * Estimativa de engenharia de um único bloco, com rastreabilidade completa.
 */
export interface EngineeringBlockEstimate {
  blockId: string;
  blockName: string;
  difficulty: EngineeringDifficulty;
  /** true quando o bloco foi puxado por dependência, não selecionado direto. */
  addedAsDependency: boolean;

  /** Etapa 1 — soma bruta do engineeringProfile. */
  baseHours: number;

  /** Etapa 2 — reuso. */
  reuseFactor: number;
  reuseApplied: boolean;
  hoursAfterReuse: number;

  /** Etapa 3 — modificadores (stack + bloco). */
  appliedModifiers: AppliedModifier[];
  modifierFactor: number;
  hoursAfterModifiers: number;

  /** Etapa 5 — risco. */
  riskFactor: number;
  riskHours: number;
  finalHours: number;

  /** Distribuição final por disciplina e custo. */
  hoursByDiscipline: DisciplineHoursMap;
  cost: number;
}

/**
 * Resultado consolidado de uma estimativa de engenharia sobre um escopo.
 */
export interface EngineeringEstimateResult {
  blocks: EngineeringBlockEstimate[];
  /** IDs adicionados automaticamente via dependências. */
  addedDependencyIds: string[];
  /** IDs solicitados mas ausentes do catálogo de engenharia. */
  missingBlockIds: string[];

  totalBaseHours: number;
  totalFinalHours: number;
  totalCost: number;
  hoursByDiscipline: DisciplineHoursMap;
}

/**
 * Opções de cálculo do escopo.
 */
export interface EngineeringEstimateOptions {
  /** IDs de stack modifiers globais ativos (ver STACK_MODIFIERS). */
  stackModifierIds?: string[];
  /** IDs de complexityModifiers de bloco ativos (por bloco ou globais por chave). */
  activeComplexityModifiers?: string[];
  /** Se true, puxa dependências automaticamente. Default: true. */
  includeDependencies?: boolean;
  /** Valores-hora por disciplina. Default: DEFAULT_DISCIPLINE_RATES. */
  disciplineRates?: Partial<Record<EngineeringDiscipline, number>>;
  /**
   * Instâncias já existentes por bloco (para reuso). Se um bloco aparece com
   * índice > 1, aplica-se o reuseFactor. Default: primeira instância (sem reuso).
   */
  reusedBlockIds?: string[];
}
