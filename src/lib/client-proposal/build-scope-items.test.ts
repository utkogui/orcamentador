import { ModuleLayer } from "@prisma/client";
import { describe, expect, it } from "vitest";
import type { EstimateCalculationResult, EstimateLineItem } from "@/lib/calculations";
import { buildClientScopeItems } from "./build-scope-items";

function line(partial: Partial<EstimateLineItem> & Pick<EstimateLineItem, "id" | "moduleName">): EstimateLineItem {
  return {
    moduleId: "m1",
    instanceLabel: null,
    layer: ModuleLayer.CAPABILITY,
    reuseGroup: null,
    instanceIndex: 1,
    reuseMultiplier: 1,
    complexity: "MEDIUM",
    quantity: 1,
    baseHours: 10,
    baseCost: 2000,
    ...partial,
  };
}

function result(lineItems: EstimateLineItem[]): EstimateCalculationResult {
  return {
    lineItems,
    disciplines: [],
    totalBaseHours: 0,
    totalAdjustedHours: 0,
    totalBaseCost: 0,
    totalAdjustedCost: 0,
    reuseSavingsHours: 0,
    reuseSavingsCost: 0,
    hoursMultiplierFactor: 1,
    costMultiplierFactor: 1,
    multiplierImpacts: [],
    marginPct: 30,
    marginValue: 0,
    suggestedPrice: 0,
    commercialMin: 0,
    commercialMax: 0,
  };
}

describe("buildClientScopeItems", () => {
  it("usa instanceLabel quando existe e deduplica", () => {
    const items = buildClientScopeItems(
      result([
        line({ id: "1", moduleName: "Cadastro de Entidade", instanceLabel: "Leads" }),
        line({ id: "2", moduleName: "Cadastro de Entidade", instanceLabel: "Leads" }),
        line({ id: "3", moduleName: "Login", instanceLabel: null }),
      ])
    );

    expect(items).toEqual([
      { id: "1", label: "Leads", subtitle: "Cadastro de Entidade" },
      { id: "3", label: "Login", subtitle: undefined },
    ]);
  });
});
