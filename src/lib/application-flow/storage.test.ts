import { describe, expect, it } from "vitest";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";
import {
  isApplicationFlowJson,
  parseApplicationFlow,
  serializeApplicationFlow,
} from "./storage";

function makeFlow(): ApplicationFlowGraph {
  return {
    engine: APPLICATION_FLOW_ENGINE,
    version: 1,
    title: "Demo",
    summary: "fluxo",
    nodes: [
      {
        id: "s1",
        position: { x: 0, y: 0 },
        data: { label: "Login", zone: "auth", kind: "screen" },
      },
    ],
    edges: [{ id: "e1", source: "s1", target: "s1" }],
  };
}

describe("serializeApplicationFlow / parseApplicationFlow", () => {
  it("round-trip preserva nós e normaliza edges", () => {
    const flow = makeFlow();
    const parsed = parseApplicationFlow(serializeApplicationFlow(flow));
    expect(parsed).not.toBeNull();
    expect(parsed?.title).toBe("Demo");
    expect(parsed?.nodes).toHaveLength(1);
    expect(parsed?.edges[0]?.type).toBe("smoothstep");
    expect(parsed?.edges[0]?.style?.stroke).toBe("#64748b");
  });

  it("retorna null para JSON inválido ou engine errada", () => {
    expect(parseApplicationFlow(null)).toBeNull();
    expect(parseApplicationFlow("{bad")).toBeNull();
    expect(
      parseApplicationFlow(
        JSON.stringify({ engine: "other", nodes: [], edges: [] })
      )
    ).toBeNull();
  });
});

describe("isApplicationFlowJson", () => {
  it("detecta fluxo válido", () => {
    expect(isApplicationFlowJson(serializeApplicationFlow(makeFlow()))).toBe(true);
    expect(isApplicationFlowJson("x")).toBe(false);
  });
});
