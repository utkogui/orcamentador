import type { Edge, Node } from "@xyflow/react";

export const APPLICATION_FLOW_ENGINE = "reactflow-v1" as const;

export type ApplicationFlowNodeData = {
  label: string;
  subtitle?: string;
  blockId?: string;
  zone: "start" | "entry" | "auth" | "hub" | "feature" | "commerce" | "integration" | "end";
};

export type ApplicationFlowGraph = {
  engine: typeof APPLICATION_FLOW_ENGINE;
  version: 1;
  title: string;
  summary: string;
  nodes: Node<ApplicationFlowNodeData>[];
  edges: Edge[];
};

export type StoredApplicationFlow = ApplicationFlowGraph;
