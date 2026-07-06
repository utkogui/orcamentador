import type { ApplicationFlowGraph } from "@/lib/application-flow/types";

export function buildApplicationJourneySteps(flow: ApplicationFlowGraph): string[] {
  return flow.nodes
    .filter((node) => node.data.zone !== "start" && node.data.zone !== "end")
    .map((node) => node.data.label)
    .filter(Boolean);
}
