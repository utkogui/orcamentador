import { ModuleLayer } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  calculateEstimate,
  COMPLEXITY_FACTORS,
  formatCurrency,
  formatHours,
  formatPercent,
} from "./calculations";

const disciplines = [
  { id: "d1", name: "Frontend", hourlyRate: 200, enabled: true },
  { id: "d2", name: "Backend", hourlyRate: 220, enabled: true },
];

describe("COMPLEXITY_FACTORS", () => {
  it("mapeia SIMPLE para 0.75", () => {
    expect(COMPLEXITY_FACTORS.SIMPLE).toBe(0.75);
  });
});

describe("calculateEstimate", () => {
  it("aplica reuso 0.4 na segunda instância do mesmo grupo", () => {
    const result = calculateEstimate({
      modules: [
        {
          id: "em1",
          moduleId: "m1",
          moduleName: "Cadastro de Entidade",
          layer: ModuleLayer.CAPABILITY,
          reuseGroup: "entity-registry",
          reuseFactor: 0.4,
          instanceLabel: "Leads",
          instanceIndex: 1,
          complexity: "MEDIUM",
          quantity: 1,
          disciplineHours: [
            { disciplineId: "d1", baseHours: 16 },
            { disciplineId: "d2", baseHours: 14 },
          ],
        },
        {
          id: "em2",
          moduleId: "m1",
          moduleName: "Cadastro de Entidade",
          layer: ModuleLayer.CAPABILITY,
          reuseGroup: "entity-registry",
          reuseFactor: 0.4,
          instanceLabel: "Clientes",
          instanceIndex: 2,
          complexity: "MEDIUM",
          quantity: 1,
          disciplineHours: [
            { disciplineId: "d1", baseHours: 16 },
            { disciplineId: "d2", baseHours: 14 },
          ],
        },
      ],
      disciplines,
      multipliers: [],
      marginPct: 30,
    });

    expect(result.totalBaseHours).toBe(16 + 14 + (16 + 14) * 0.4);
    expect(result.reuseSavingsHours).toBeGreaterThan(0);
    expect(result.lineItems).toHaveLength(2);
    expect(result.lineItems[1]?.reuseMultiplier).toBe(0.4);
  });

  it("aplica margem sobre o subtotal", () => {
    const result = calculateEstimate({
      modules: [
        {
          id: "em1",
          moduleId: "m1",
          moduleName: "Módulo simples",
          layer: ModuleLayer.CAPABILITY,
          reuseGroup: null,
          reuseFactor: 1,
          instanceLabel: null,
          instanceIndex: 1,
          complexity: "MEDIUM",
          quantity: 1,
          disciplineHours: [{ disciplineId: "d1", baseHours: 10 }],
        },
      ],
      disciplines,
      multipliers: [],
      marginPct: 30,
    });

    expect(result.totalAdjustedCost).toBe(10 * 200);
    expect(result.marginValue).toBeCloseTo(result.totalAdjustedCost * 0.3);
    expect(result.suggestedPrice).toBeCloseTo(
      result.totalAdjustedCost + result.marginValue
    );
  });
});

describe("formatters", () => {
  it("formatCurrency / formatHours / formatPercent", () => {
    expect(formatCurrency(1500)).toMatch(/1.?500|1,500/);
    expect(formatHours(12.5)).toMatch(/12/);
    expect(formatPercent(30)).toMatch(/30/);
  });
});
