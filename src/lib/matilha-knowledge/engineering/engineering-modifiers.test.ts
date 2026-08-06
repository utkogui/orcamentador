import { describe, expect, it } from "vitest";
import type { EngineeringBlock } from "./engineering-types";
import {
  combineModifierFactor,
  findStackModifier,
  resolveAppliedModifiers,
} from "./engineering-modifiers";

function makeBlock(overrides: Partial<EngineeringBlock> = {}): EngineeringBlock {
  return {
    id: "auth_basic_login",
    difficulty: "medium",
    reuseFactor: 0.9,
    engineeringProfile: {
      frontend: 8,
      backend: 8,
      qa: 4,
      devops: 2,
      pm: 2,
    },
    riskFactor: 0.1,
    stackTags: ["auth"],
    complexityModifiers: {
      oauth_extra: 0.2,
    },
    ...overrides,
  };
}

describe("findStackModifier", () => {
  it("encontra modificador conhecido", () => {
    expect(findStackModifier("nextjs")?.factor).toBe(-0.1);
  });

  it("retorna undefined para id inexistente", () => {
    expect(findStackModifier("nao-existe")).toBeUndefined();
  });
});

describe("resolveAppliedModifiers", () => {
  it("aplica stack modifiers com appliesTo *", () => {
    const applied = resolveAppliedModifiers(makeBlock(), ["nextjs"]);
    expect(applied).toEqual([
      expect.objectContaining({ id: "nextjs", source: "stack", factor: -0.1 }),
    ]);
  });

  it("só aplica modifiers de auth quando o bloco tem tag auth", () => {
    const withAuth = resolveAppliedModifiers(makeBlock({ stackTags: ["auth"] }), ["clerk"]);
    expect(withAuth).toHaveLength(1);

    const withoutAuth = resolveAppliedModifiers(makeBlock({ stackTags: [] }), ["clerk"]);
    expect(withoutAuth).toHaveLength(0);
  });

  it("inclui complexityModifiers do bloco quando ativos", () => {
    const applied = resolveAppliedModifiers(makeBlock(), [], ["oauth_extra"]);
    expect(applied).toEqual([
      expect.objectContaining({ id: "oauth_extra", source: "block", factor: 0.2 }),
    ]);
  });
});

describe("combineModifierFactor", () => {
  it("soma deltas aditivamente a partir de 1", () => {
    expect(
      combineModifierFactor([
        { id: "a", label: "A", factor: -0.1, source: "stack" },
        { id: "b", label: "B", factor: 0.4, source: "stack" },
      ])
    ).toBeCloseTo(1.3);
  });

  it("garante piso de 0.1 mesmo com muitos redutores", () => {
    expect(
      combineModifierFactor([
        { id: "a", label: "A", factor: -0.5, source: "stack" },
        { id: "b", label: "B", factor: -0.5, source: "stack" },
        { id: "c", label: "C", factor: -0.5, source: "stack" },
      ])
    ).toBe(0.1);
  });
});
