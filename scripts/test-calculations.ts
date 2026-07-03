import assert from "node:assert/strict";
import { ModuleLayer } from "@prisma/client";
import { calculateEstimate, COMPLEXITY_FACTORS } from "../src/lib/calculations";

const disciplines = [
  { id: "d1", name: "Frontend", hourlyRate: 200, enabled: true },
  { id: "d2", name: "Backend", hourlyRate: 220, enabled: true },
];

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

assert.equal(result.totalBaseHours, 16 + 14 + (16 + 14) * 0.4);
assert.ok(result.reuseSavingsHours > 0);
assert.equal(result.lineItems.length, 2);
assert.equal(result.lineItems[1]?.reuseMultiplier, 0.4);
assert.equal(COMPLEXITY_FACTORS.SIMPLE, 0.75);

console.log("✅ Testes de cálculo passaram");
