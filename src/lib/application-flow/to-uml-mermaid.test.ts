import { describe, expect, it } from "vitest";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";
import {
  flowToUmlActivityMermaid,
  flowToUmlMermaid,
  listFlowBlocks,
} from "./to-uml-mermaid";

function makeFlow(): ApplicationFlowGraph {
  return {
    engine: APPLICATION_FLOW_ENGINE,
    version: 1,
    title: "Auth (login)",
    summary: "",
    nodes: [
      {
        id: "start",
        position: { x: 0, y: 0 },
        data: { label: "Início", zone: "start", kind: "start", blockStep: 1 },
      },
      {
        id: "d1",
        position: { x: 0, y: 100 },
        data: {
          label: "Credenciais válidas?",
          zone: "auth",
          kind: "decision",
          blockId: "auth_basic_login",
          blockName: "Login básico",
          blockStep: 1,
        },
      },
      {
        id: "ok",
        position: { x: 0, y: 200 },
        data: { label: "Área logada", zone: "hub", kind: "screen", blockStep: 1 },
      },
    ],
    edges: [
      {
        id: "yes",
        source: "d1",
        target: "ok",
        label: "sim",
        style: { stroke: "#059669" },
      },
      {
        id: "no",
        source: "d1",
        target: "start",
        label: "não",
        style: { stroke: "#dc2626" },
      },
    ],
  };
}

describe("flowToUmlActivityMermaid", () => {
  it("gera flowchart com decisão e labels sanitizados", () => {
    const mermaid = flowToUmlActivityMermaid(makeFlow());
    expect(mermaid).toContain("flowchart TB");
    expect(mermaid).toContain("n_d1{");
    expect(mermaid).toMatch(/sim|não|nao/i);
    // parênteses no título não devem quebrar o parser
    expect(mermaid).not.toMatch(/Auth \(login\)/);
    expect(mermaid).toContain("Auth - login");
  });
});

describe("flowToUmlMermaid", () => {
  it("default é activity", () => {
    expect(flowToUmlMermaid(makeFlow())).toContain("flowchart TB");
  });
});

describe("listFlowBlocks", () => {
  it("lista blocos únicos por step", () => {
    expect(listFlowBlocks(makeFlow())).toEqual([
      expect.objectContaining({
        id: "auth_basic_login",
        name: "Login básico",
        step: 1,
      }),
    ]);
  });
});
