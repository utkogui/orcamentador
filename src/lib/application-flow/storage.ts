import type { ApplicationFlowGraph, StoredApplicationFlow } from "@/lib/application-flow/types";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";

function normalizeFlowEdges(flow: StoredApplicationFlow): StoredApplicationFlow {
  return {
    ...flow,
    edges: flow.edges.map((edge) => ({
      ...edge,
      type: edge.type ?? "smoothstep",
      style: {
        stroke: "#64748b",
        strokeWidth: 2,
        ...edge.style,
      },
    })),
  };
}

export function serializeApplicationFlow(flow: ApplicationFlowGraph): string {
  return JSON.stringify(flow);
}

export function parseApplicationFlow(json: string | null | undefined): StoredApplicationFlow | null {
  if (!json) return null;

  try {
    const parsed = JSON.parse(json) as Partial<StoredApplicationFlow>;
    if (parsed.engine !== APPLICATION_FLOW_ENGINE || !parsed.nodes || !parsed.edges) {
      return null;
    }
    return normalizeFlowEdges(parsed as StoredApplicationFlow);
  } catch {
    return null;
  }
}

export function isApplicationFlowJson(json: string | null | undefined): boolean {
  return parseApplicationFlow(json) !== null;
}
