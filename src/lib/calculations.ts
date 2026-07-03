import { Complexity, ModuleLayer, MultiplierTarget } from "@prisma/client";

export const COMPLEXITY_FACTORS: Record<Complexity, number> = {
  SIMPLE: 0.75,
  MEDIUM: 1,
  COMPLEX: 1.5,
  VERY_COMPLEX: 2,
};

export const COMPLEXITY_LABELS: Record<Complexity, string> = {
  SIMPLE: "Simples",
  MEDIUM: "Médio",
  COMPLEX: "Complexo",
  VERY_COMPLEX: "Muito complexo",
};

export const MODULE_LAYER_LABELS: Record<ModuleLayer, string> = {
  PLATFORM: "Plataforma",
  CAPABILITY: "Capacidade",
  DOMAIN: "Domínio",
  INTEGRATION: "Integração",
};

export type DisciplineInput = {
  id: string;
  name: string;
  hourlyRate: number;
  enabled: boolean;
};

export type ModuleDisciplineHourInput = {
  disciplineId: string;
  baseHours: number;
};

export type EstimateModuleInput = {
  id: string;
  moduleId: string;
  moduleName: string;
  layer: ModuleLayer;
  reuseGroup: string | null;
  reuseFactor: number;
  instanceLabel: string | null;
  instanceIndex: number;
  complexity: Complexity;
  quantity: number;
  disciplineHours: ModuleDisciplineHourInput[];
};

export type MultiplierInput = {
  id: string;
  name: string;
  slug: string;
  factor: number;
  target: MultiplierTarget;
  enabled: boolean;
};

export type EstimateLineItem = {
  id: string;
  moduleName: string;
  instanceLabel: string | null;
  layer: ModuleLayer;
  reuseGroup: string | null;
  instanceIndex: number;
  reuseMultiplier: number;
  complexity: Complexity;
  quantity: number;
  baseHours: number;
  baseCost: number;
};

export type DisciplineBreakdown = {
  disciplineId: string;
  disciplineName: string;
  hourlyRate: number;
  baseHours: number;
  adjustedHours: number;
  baseCost: number;
  adjustedCost: number;
};

export type MultiplierImpact = {
  id: string;
  name: string;
  slug: string;
  target: MultiplierTarget;
  factor: number;
  enabled: boolean;
  impactHours: number;
  impactCost: number;
};

export type EstimateCalculationResult = {
  lineItems: EstimateLineItem[];
  disciplines: DisciplineBreakdown[];
  totalBaseHours: number;
  totalAdjustedHours: number;
  totalBaseCost: number;
  totalAdjustedCost: number;
  reuseSavingsHours: number;
  reuseSavingsCost: number;
  hoursMultiplierFactor: number;
  costMultiplierFactor: number;
  multiplierImpacts: MultiplierImpact[];
  marginPct: number;
  marginValue: number;
  suggestedPrice: number;
  commercialMin: number;
  commercialMax: number;
};

function resolveReuseMultiplier(
  module: EstimateModuleInput,
  reuseGroupCounts: Map<string, number>,
  platformIncluded: { value: boolean }
): number {
  if (module.layer === ModuleLayer.PLATFORM) {
    if (platformIncluded.value) return 0;
    platformIncluded.value = true;
    return 1;
  }

  if (!module.reuseGroup) return 1;

  const effectiveIndex =
    module.instanceIndex > 0
      ? module.instanceIndex
      : (reuseGroupCounts.get(module.reuseGroup) ?? 0) + 1;

  reuseGroupCounts.set(
    module.reuseGroup,
    Math.max(reuseGroupCounts.get(module.reuseGroup) ?? 0, effectiveIndex)
  );

  if (effectiveIndex <= 1) return 1;
  return module.reuseFactor;
}

export function calculateEstimate(params: {
  modules: EstimateModuleInput[];
  disciplines: DisciplineInput[];
  multipliers: MultiplierInput[];
  marginPct: number;
}): EstimateCalculationResult {
  const { modules, disciplines, multipliers, marginPct } = params;

  const disciplineMap = new Map(disciplines.map((d) => [d.id, d]));
  const hoursByDiscipline = new Map<string, number>();
  const lineItems: EstimateLineItem[] = [];

  const reuseGroupCounts = new Map<string, number>();
  const platformIncluded = { value: false };

  let reuseSavingsHours = 0;
  let reuseSavingsCost = 0;

  for (const estimateModule of modules) {
    const complexityFactor = COMPLEXITY_FACTORS[estimateModule.complexity];
    const reuseMultiplier = resolveReuseMultiplier(
      estimateModule,
      reuseGroupCounts,
      platformIncluded
    );

    if (reuseMultiplier === 0) continue;

    let lineBaseHours = 0;
    let lineBaseCost = 0;

    for (const hour of estimateModule.disciplineHours) {
      const discipline = disciplineMap.get(hour.disciplineId);
      if (!discipline?.enabled) continue;

      const fullHours =
        hour.baseHours * complexityFactor * estimateModule.quantity * reuseMultiplier;
      const fullHoursWithoutReuse =
        hour.baseHours * complexityFactor * estimateModule.quantity;

      lineBaseHours += fullHours;
      lineBaseCost += fullHours * discipline.hourlyRate;

      if (reuseMultiplier < 1) {
        reuseSavingsHours += fullHoursWithoutReuse - fullHours;
        reuseSavingsCost +=
          (fullHoursWithoutReuse - fullHours) * discipline.hourlyRate;
      }

      hoursByDiscipline.set(
        hour.disciplineId,
        (hoursByDiscipline.get(hour.disciplineId) ?? 0) + fullHours
      );
    }

    lineItems.push({
      id: estimateModule.id,
      moduleName: estimateModule.moduleName,
      instanceLabel: estimateModule.instanceLabel,
      layer: estimateModule.layer,
      reuseGroup: estimateModule.reuseGroup,
      instanceIndex: estimateModule.instanceIndex,
      reuseMultiplier,
      complexity: estimateModule.complexity,
      quantity: estimateModule.quantity,
      baseHours: lineBaseHours,
      baseCost: lineBaseCost,
    });
  }

  const enabledMultipliers = multipliers.filter((m) => m.enabled);

  const hoursMultiplierFactor = enabledMultipliers
    .filter((m) => m.target === MultiplierTarget.HOURS)
    .reduce((acc, m) => acc * m.factor, 1);

  const costMultiplierFactor = enabledMultipliers
    .filter((m) => m.target === MultiplierTarget.COST)
    .reduce((acc, m) => acc * m.factor, 1);

  const disciplineBreakdown: DisciplineBreakdown[] = [];

  let totalBaseHours = 0;
  let totalAdjustedHours = 0;
  let totalBaseCost = 0;
  let totalAdjustedCost = 0;

  for (const [disciplineId, baseHours] of hoursByDiscipline.entries()) {
    const discipline = disciplineMap.get(disciplineId);
    if (!discipline) continue;

    const adjustedHours = baseHours * hoursMultiplierFactor;
    const baseCost = baseHours * discipline.hourlyRate;
    const adjustedCost = adjustedHours * discipline.hourlyRate * costMultiplierFactor;

    disciplineBreakdown.push({
      disciplineId,
      disciplineName: discipline.name,
      hourlyRate: discipline.hourlyRate,
      baseHours,
      adjustedHours,
      baseCost,
      adjustedCost,
    });

    totalBaseHours += baseHours;
    totalAdjustedHours += adjustedHours;
    totalBaseCost += baseCost;
    totalAdjustedCost += adjustedCost;
  }

  disciplineBreakdown.sort((a, b) => a.disciplineName.localeCompare(b.disciplineName));

  const costBeforeCostMultipliers = disciplineBreakdown.reduce(
    (acc, d) => acc + d.adjustedHours * d.hourlyRate,
    0
  );

  const multiplierImpacts: MultiplierImpact[] = enabledMultipliers.map((multiplier) => {
    if (multiplier.target === MultiplierTarget.HOURS) {
      const hoursBefore = totalBaseHours;
      const hoursAfter = totalBaseHours * multiplier.factor;
      const impactHours = hoursAfter - hoursBefore;
      const avgRate = totalBaseCost / (totalBaseHours || 1);
      return {
        id: multiplier.id,
        name: multiplier.name,
        slug: multiplier.slug,
        target: multiplier.target,
        factor: multiplier.factor,
        enabled: multiplier.enabled,
        impactHours,
        impactCost: impactHours * avgRate,
      };
    }

    const impactCost = costBeforeCostMultipliers * (multiplier.factor - 1);
    return {
      id: multiplier.id,
      name: multiplier.name,
      slug: multiplier.slug,
      target: multiplier.target,
      factor: multiplier.factor,
      enabled: multiplier.enabled,
      impactHours: 0,
      impactCost,
    };
  });

  const marginValue = totalAdjustedCost * (marginPct / 100);
  const suggestedPrice = totalAdjustedCost + marginValue;
  const commercialMin = suggestedPrice * 0.9;
  const commercialMax = suggestedPrice * 1.1;

  return {
    lineItems,
    disciplines: disciplineBreakdown,
    totalBaseHours,
    totalAdjustedHours,
    totalBaseCost,
    totalAdjustedCost,
    reuseSavingsHours,
    reuseSavingsCost,
    hoursMultiplierFactor,
    costMultiplierFactor,
    multiplierImpacts,
    marginPct,
    marginValue,
    suggestedPrice,
    commercialMin,
    commercialMax,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatHours(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}
