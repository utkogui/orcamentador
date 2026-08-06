import { describe, expect, it } from "vitest";
import type { EngineeringBlock, EngineeringCatalog } from "./engineering-types";
import {
  estimateEngineeringBlock,
  estimateEngineeringScope,
  indexEngineeringBlocks,
  resolveEngineeringDependencies,
} from "./engineering-loader";

function makeBlock(overrides: Partial<EngineeringBlock> & Pick<EngineeringBlock, "id">): EngineeringBlock {
  return {
    name: overrides.id,
    difficulty: "configurable",
    reuseFactor: 0.5,
    engineeringProfile: { frontend: 10, backend: 10 },
    riskFactor: 0.1,
    ...overrides,
  };
}

function makeMap(blocks: EngineeringBlock[]): Map<string, EngineeringBlock> {
  const catalog: EngineeringCatalog = {
    version: "1",
    name: "test",
    description: "",
    disciplines: [],
    blocks,
  };
  return indexEngineeringBlocks(catalog);
}

describe("resolveEngineeringDependencies", () => {
  it("expande dependências transitivas e marca missing", () => {
    const map = makeMap([
      makeBlock({ id: "a", dependencies: ["b"] }),
      makeBlock({ id: "b", dependencies: ["c"] }),
      makeBlock({ id: "c" }),
    ]);

    const result = resolveEngineeringDependencies(map, ["a", "missing"]);
    expect(result.orderedIds).toEqual(["c", "b", "a"]);
    expect(result.addedDependencyIds).toEqual(expect.arrayContaining(["b", "c"]));
    expect(result.missingBlockIds).toContain("missing");
  });
});

describe("estimateEngineeringBlock", () => {
  it("aplica reuso, modificadores e risco na cadeia", () => {
    const block = makeBlock({
      id: "auth_basic_login",
      reuseFactor: 0.5,
      riskFactor: 0.2,
      stackTags: ["auth"],
      engineeringProfile: { frontend: 10, backend: 0 },
    });

    const withoutReuse = estimateEngineeringBlock(block);
    expect(withoutReuse.baseHours).toBe(10);
    expect(withoutReuse.reuseApplied).toBe(false);
    expect(withoutReuse.finalHours).toBeCloseTo(10 * 1.2);

    const withReuse = estimateEngineeringBlock(block, {
      reusedBlockIds: ["auth_basic_login"],
      stackModifierIds: ["nextjs"],
    });
    expect(withReuse.reuseApplied).toBe(true);
    expect(withReuse.hoursAfterReuse).toBe(5);
    expect(withReuse.modifierFactor).toBeCloseTo(0.9);
    expect(withReuse.hoursAfterModifiers).toBeCloseTo(4.5);
    expect(withReuse.finalHours).toBeCloseTo(4.5 * 1.2);
  });
});

describe("estimateEngineeringScope", () => {
  it("agrega blocos e dependências", () => {
    const map = makeMap([
      makeBlock({
        id: "parent",
        dependencies: ["child"],
        engineeringProfile: { frontend: 8 },
        riskFactor: 0,
      }),
      makeBlock({
        id: "child",
        engineeringProfile: { frontend: 4 },
        riskFactor: 0,
      }),
    ]);

    const scope = estimateEngineeringScope(map, ["parent"]);
    expect(scope.blocks).toHaveLength(2);
    expect(scope.addedDependencyIds).toContain("child");
    expect(scope.totalBaseHours).toBe(12);
    expect(scope.totalFinalHours).toBe(12);
  });

  it("pode desligar dependências automáticas", () => {
    const map = makeMap([
      makeBlock({ id: "parent", dependencies: ["child"], engineeringProfile: { frontend: 8 }, riskFactor: 0 }),
      makeBlock({ id: "child", engineeringProfile: { frontend: 4 }, riskFactor: 0 }),
    ]);

    const scope = estimateEngineeringScope(map, ["parent"], { includeDependencies: false });
    expect(scope.blocks).toHaveLength(1);
    expect(scope.addedDependencyIds).toEqual([]);
  });
});
