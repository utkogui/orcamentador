import type { Edge, Node } from "@xyflow/react";

export const APPLICATION_FLOW_ENGINE = "reactflow-v1" as const;

export type ApplicationFlowNodeKind =
  | "start"
  | "end"
  | "screen"
  | "decision"
  | "status"
  | "system";

export type ApplicationFlowNodeData = {
  label: string;
  subtitle?: string;
  blockId?: string;
  /** Nome do Building Block (para agrupamento visual no UML composto). */
  blockName?: string;
  /** Ordem do bloco na jornada composta (1-based). */
  blockStep?: number;
  zone: "start" | "entry" | "auth" | "hub" | "feature" | "commerce" | "integration" | "end";
  kind?: ApplicationFlowNodeKind;
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
