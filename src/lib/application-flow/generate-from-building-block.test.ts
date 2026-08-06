import { describe, expect, it } from "vitest";
import type { BuildingBlock } from "@/types/building-blocks";
import { generateApplicationFlowFromBuildingBlock } from "./generate-from-building-block";
import { findDecisionsMissingBranches } from "./generate-from-journey";

function makeBlock(overrides: Partial<BuildingBlock> = {}): BuildingBlock {
  return {
    id: "feature_generic",
    name: "Bloco genérico",
    client_terms: [],
    summary: "resumo",
    includes: [],
    excludes: [],
    pages: ["Lista", "Detalhe"],
    dependencies: [],
    usually_with: [],
    commercial_questions: [],
    commercial_notes: [],
    disciplines: ["frontend"],
    complexity: "MEDIUM",
    category_id: "core",
    category_name: "Core",
    ...overrides,
  };
}

describe("generateApplicationFlowFromBuildingBlock", () => {
  it("gera fluxo de login com decisão e ramos sim/não", () => {
    const flow = generateApplicationFlowFromBuildingBlock(
      makeBlock({
        id: "auth_basic_login",
        name: "Login básico",
        category_id: "authentication",
        pages: ["Login"],
      })
    );

    expect(flow.engine).toBe("reactflow-v1");
    expect(flow.nodes.some((n) => n.data.kind === "start")).toBe(true);
    expect(flow.nodes.some((n) => n.data.kind === "decision")).toBe(true);
    expect(findDecisionsMissingBranches(flow)).toEqual([]);
  });

  it("gera fluxo genérico com telas a partir de pages", () => {
    const flow = generateApplicationFlowFromBuildingBlock(
      makeBlock({ id: "custom_widget", pages: ["A", "B"] })
    );
    const screens = flow.nodes.filter((n) => (n.data.kind ?? "screen") === "screen");
    expect(screens.length).toBeGreaterThanOrEqual(1);
    expect(flow.nodes.some((n) => n.data.kind === "end")).toBe(true);
  });
});
