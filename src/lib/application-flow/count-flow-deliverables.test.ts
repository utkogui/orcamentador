import { describe, expect, it } from "vitest";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";
import { countFlowDeliverables } from "./count-flow-deliverables";

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

describe("countFlowDeliverables", () => {
  it("conta telas, variações, status e feedbacks", () => {
    const flow = makeFlow({
      nodes: [
        {
          id: "s1",
          position: { x: 0, y: 0 },
          data: { label: "Login", zone: "auth", kind: "screen" },
        },
        {
          id: "s2",
          position: { x: 0, y: 100 },
          data: { label: "Dashboard", zone: "hub", kind: "screen" },
        },
        {
          id: "ok",
          position: { x: 0, y: 200 },
          data: { label: "Salvo com sucesso", zone: "feature", kind: "status" },
        },
        {
          id: "err",
          position: { x: 0, y: 300 },
          data: { label: "Mensagem de erro", zone: "feature", kind: "status" },
        },
        {
          id: "generic",
          position: { x: 0, y: 400 },
          data: { label: "Processando", zone: "feature", kind: "status" },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "s2",
          target: "s1",
          style: { stroke: "#dc2626" },
        },
        {
          id: "e2",
          source: "s1",
          target: "s2",
          style: { stroke: "#059669" },
        },
      ],
    });

    expect(countFlowDeliverables(flow)).toEqual({
      telas: 2,
      variacoes: 1,
      status: 2,
      feedbacks: 1,
    });
  });

  it("trata nós sem kind como screen", () => {
    const flow = makeFlow({
      nodes: [
        {
          id: "s1",
          position: { x: 0, y: 0 },
          data: { label: "Tela sem kind", zone: "feature" },
        },
      ],
    });

    expect(countFlowDeliverables(flow).telas).toBe(1);
  });
});
