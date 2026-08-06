import { describe, expect, it } from "vitest";
import type { BuildingBlock } from "@/types/building-blocks";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";
import {
  findDecisionsMissingBranches,
  generateApplicationFlowFromJourney,
} from "./generate-from-journey";

function makeFlow(partial: Partial<ApplicationFlowGraph> = {}): ApplicationFlowGraph {
  return {
    engine: APPLICATION_FLOW_ENGINE,
    version: 1,
    title: "Demo",
    summary: "",
    nodes: [],
    edges: [],
    ...partial,
  };
}

function makeBlock(overrides: Partial<BuildingBlock> = {}): BuildingBlock {
  return {
    id: "feature_generic",
    name: "Bloco genérico",
    client_terms: [],
    summary: "resumo",
    includes: [],
    excludes: [],
    pages: ["Lista"],
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

describe("findDecisionsMissingBranches", () => {
  it("retorna vazio quando toda decisão tem pelo menos 2 saídas", () => {
    const flow = makeFlow({
      nodes: [
        {
          id: "d1",
          position: { x: 0, y: 0 },
          data: { label: "Credenciais válidas?", zone: "auth", kind: "decision" },
        },
      ],
      edges: [
        { id: "yes", source: "d1", target: "ok", label: "sim" },
        { id: "no", source: "d1", target: "err", label: "não" },
      ],
    });

    expect(findDecisionsMissingBranches(flow)).toEqual([]);
  });

  it("lista decisões com menos de 2 saídas", () => {
    const flow = makeFlow({
      nodes: [
        {
          id: "d1",
          position: { x: 0, y: 0 },
          data: { label: "Credenciais válidas?", zone: "auth", kind: "decision" },
        },
        {
          id: "d2",
          position: { x: 0, y: 100 },
          data: { label: "Tem 2FA?", zone: "auth", kind: "decision" },
        },
      ],
      edges: [
        { id: "only-no", source: "d1", target: "err", label: "não" },
        { id: "yes", source: "d2", target: "ok", label: "sim" },
        { id: "no", source: "d2", target: "err", label: "não" },
      ],
    });

    const missing = findDecisionsMissingBranches(flow);
    expect(missing).toHaveLength(1);
    expect(missing[0]).toContain("d1");
    expect(missing[0]).toContain("outs=1");
  });
});

describe("generateApplicationFlowFromJourney", () => {
  it("retorna grafo vazio sem blocos", () => {
    const flow = generateApplicationFlowFromJourney([]);
    expect(flow.nodes).toEqual([]);
    expect(flow.edges).toEqual([]);
  });

  it("compõe dois blocos com blockStep e junção", () => {
    const flow = generateApplicationFlowFromJourney(
      [
        makeBlock({
          id: "auth_basic_login",
          name: "Login básico",
          category_id: "authentication",
          pages: ["Login"],
        }),
        makeBlock({
          id: "dashboard_charts",
          name: "Dashboard",
          category_id: "dashboard_analytics",
          pages: ["Painel"],
        }),
      ],
      { title: "Jornada Auth → Dashboard" }
    );

    expect(flow.title).toBe("Jornada Auth → Dashboard");
    expect(flow.nodes.some((n) => n.data.blockStep === 1)).toBe(true);
    expect(flow.nodes.some((n) => n.data.blockStep === 2)).toBe(true);
    expect(flow.nodes.some((n) => n.data.blockId === "auth_basic_login")).toBe(true);
    expect(flow.nodes.some((n) => n.data.blockId === "dashboard_charts")).toBe(true);
    expect(findDecisionsMissingBranches(flow)).toEqual([]);
  });
});
