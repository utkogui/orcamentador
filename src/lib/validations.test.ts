import { describe, expect, it } from "vitest";
import {
  disciplineSchema,
  estimateModuleSchema,
  estimateSchema,
  moduleHourSchema,
  moduleSchema,
  multiplierSchema,
} from "./validations";

describe("estimateSchema", () => {
  it("aceita estimativa válida", () => {
    const parsed = estimateSchema.parse({
      name: "Projeto X",
      marginPct: 30,
    });
    expect(parsed.name).toBe("Projeto X");
    expect(parsed.marginPct).toBe(30);
  });

  it("rejeita nome vazio e margem fora do intervalo", () => {
    expect(() => estimateSchema.parse({ name: "", marginPct: 30 })).toThrow();
    expect(() => estimateSchema.parse({ name: "Ok", marginPct: -1 })).toThrow();
    expect(() => estimateSchema.parse({ name: "Ok", marginPct: 101 })).toThrow();
  });
});

describe("moduleSchema", () => {
  it("exige nome", () => {
    expect(moduleSchema.parse({ name: "Login" }).name).toBe("Login");
    expect(() => moduleSchema.parse({ name: "" })).toThrow();
  });
});

describe("disciplineSchema", () => {
  it("exige hourlyRate positivo", () => {
    expect(
      disciplineSchema.parse({ name: "Frontend", hourlyRate: 200 }).hourlyRate
    ).toBe(200);
    expect(() => disciplineSchema.parse({ name: "Frontend", hourlyRate: 0 })).toThrow();
    expect(() => disciplineSchema.parse({ name: "Frontend", hourlyRate: -10 })).toThrow();
  });
});

describe("moduleHourSchema / estimateModuleSchema", () => {
  it("valida horas e quantidade", () => {
    expect(moduleHourSchema.parse({ disciplineId: "d1", baseHours: 0 }).baseHours).toBe(0);
    expect(() => moduleHourSchema.parse({ disciplineId: "d1", baseHours: -1 })).toThrow();
    expect(
      estimateModuleSchema.parse({
        moduleId: "m1",
        complexity: "MEDIUM",
        quantity: 2,
      }).quantity
    ).toBe(2);
    expect(() =>
      estimateModuleSchema.parse({
        moduleId: "m1",
        complexity: "MEDIUM",
        quantity: 0,
      })
    ).toThrow();
  });
});

describe("multiplierSchema", () => {
  it("valida factor positivo e target enum", () => {
    expect(
      multiplierSchema.parse({
        name: "Urgência",
        slug: "urgency",
        factor: 1.2,
        target: "HOURS",
      }).factor
    ).toBe(1.2);

    expect(() =>
      multiplierSchema.parse({
        name: "X",
        slug: "x",
        factor: 0,
        target: "COST",
      })
    ).toThrow();
  });
});
