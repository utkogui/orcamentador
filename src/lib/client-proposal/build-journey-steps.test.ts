import { describe, expect, it } from "vitest";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";
import { buildApplicationJourneySteps } from "./build-journey-steps";

describe("buildApplicationJourneySteps", () => {
  it("lista labels ignorando zonas start/end", () => {
    const flow: ApplicationFlowGraph = {
      engine: APPLICATION_FLOW_ENGINE,
      version: 1,
      title: "Demo",
      summary: "",
      nodes: [
        {
          id: "start",
          position: { x: 0, y: 0 },
          data: { label: "Início", zone: "start" },
        },
        {
          id: "login",
          position: { x: 0, y: 100 },
          data: { label: "Tela de login", zone: "auth" },
        },
        {
          id: "hub",
          position: { x: 0, y: 200 },
          data: { label: "Dashboard", zone: "hub" },
        },
        {
          id: "end",
          position: { x: 0, y: 300 },
          data: { label: "Fim", zone: "end" },
        },
      ],
      edges: [],
    };

    expect(buildApplicationJourneySteps(flow)).toEqual(["Tela de login", "Dashboard"]);
  });
});
