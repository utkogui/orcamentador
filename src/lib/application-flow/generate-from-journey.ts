import type { BuildingBlock } from "@/types/building-blocks";
import { generateApplicationFlowFromBuildingBlock } from "@/lib/application-flow/generate-from-building-block";
import type { ApplicationFlowGraph, ApplicationFlowNodeData } from "@/lib/application-flow/types";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { Edge, Node } from "@xyflow/react";

const SUCCESS_STROKE = "#059669";
const ERROR_STROKE = "#dc2626";
const BRANCH_STROKE = "#7c3aed";
const JOIN_STROKE = "#2563eb";

const Y_GAP = 480;
const X_COLUMN = 0; // layout vertical único — Mermaid organiza; evita colunas desalinhadas

type FlowNode = Node<ApplicationFlowNodeData>;

function kindOf(node: FlowNode) {
  return node.data.kind ?? "screen";
}

function isPlaceholderLanding(node: FlowNode): boolean {
  const text = `${node.data.label} ${node.data.subtitle ?? ""}`.toLowerCase();
  return /área logada|area logada|dashboard\s*\/\s*home|login ou dashboard/.test(text);
}

function prefixId(prefix: string, id: string): string {
  return `${prefix}__${id}`;
}

function remapFlow(
  flow: ApplicationFlowGraph,
  prefix: string,
  index: number,
  block: BuildingBlock
): { nodes: FlowNode[]; edges: Edge[] } {
  const yOffset = index * Y_GAP;
  const nodes = flow.nodes.map((node) => ({
    ...node,
    id: prefixId(prefix, node.id),
    position: {
      x: node.position.x + index * X_COLUMN,
      y: node.position.y + yOffset,
    },
    data: {
      ...node.data,
      blockId: block.id,
      blockName: block.name,
      blockStep: index + 1,
      subtitle: node.data.subtitle,
    },
  }));

  const edges = flow.edges.map((edge) => ({
    ...edge,
    id: prefixId(prefix, edge.id),
    source: prefixId(prefix, edge.source),
    target: prefixId(prefix, edge.target),
  }));

  return { nodes, edges };
}

function findByKind(nodes: FlowNode[], kind: ApplicationFlowNodeData["kind"]) {
  return nodes.find((n) => kindOf(n) === kind);
}

function findEntryNodeIds(nodes: FlowNode[], edges: Edge[]): string[] {
  const start = findByKind(nodes, "start");
  if (!start) {
    const firstScreen = nodes.find((n) => kindOf(n) === "screen");
    return firstScreen ? [firstScreen.id] : [];
  }
  return edges.filter((e) => e.source === start.id).map((e) => e.target);
}

/** Predecessores do Fim no caminho feliz (preferindo arestas verdes). */
function findHappyExitNodeIds(nodes: FlowNode[], edges: Edge[]): string[] {
  const end = findByKind(nodes, "end");
  if (!end) {
    const screens = nodes.filter((n) => kindOf(n) === "screen");
    return screens.length ? [screens[screens.length - 1].id] : [];
  }

  const intoEnd = edges.filter((e) => e.target === end.id);
  const success = intoEnd.filter((e) => e.style?.stroke === SUCCESS_STROKE);
  const chosen = success.length > 0 ? success : intoEnd;
  if (chosen.length > 0) return [...new Set(chosen.map((e) => e.source))];

  const hub = nodes.find((n) => kindOf(n) === "screen" && n.data.zone === "hub");
  return hub ? [hub.id] : [];
}

function edgeStroke(edge: Edge): string | undefined {
  return typeof edge.style?.stroke === "string" ? edge.style.stroke : undefined;
}

function makeJoinEdge(
  id: string,
  source: string,
  target: string,
  label: string,
  stroke: string = JOIN_STROKE
): Edge {
  return {
    id,
    source,
    target,
    label,
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    animated: stroke === JOIN_STROKE || stroke === BRANCH_STROKE,
    style: { stroke, strokeWidth: 2.5 },
  };
}

/**
 * Une fluxos completos dos Building Blocks com junções precisas:
 * - preserva caminhos sim/não das decisões
 * - remove só Início/Fim intermediários e landings placeholder ("Área logada")
 * - redireciona o "sim" original para a entrada do próximo bloco
 */
export function generateApplicationFlowFromJourney(
  blocks: BuildingBlock[],
  options?: {
    title?: string;
    summary?: string;
    commercialBundle?: boolean;
  }
): ApplicationFlowGraph {
  const title = options?.title ?? "Jornada composta";
  const commercial = options?.commercialBundle ?? false;
  const summary =
    options?.summary ??
    "UML unificado: todas as telas/ações de cada bloco, com junção no caminho feliz.";

  if (blocks.length === 0) {
    return {
      engine: APPLICATION_FLOW_ENGINE,
      version: 1,
      title,
      summary,
      nodes: [],
      edges: [],
    };
  }

  const segments = blocks.map((block, index) => {
    const raw = generateApplicationFlowFromBuildingBlock(block);
    const prefix = `j${index}_${block.id}`;
    const remapped = remapFlow(raw, prefix, index, block);
    return { block, prefix, index, ...remapped };
  });

  const allNodes: FlowNode[] = segments.flatMap((s) => s.nodes);
  const allEdges: Edge[] = segments.flatMap((s) => s.edges);
  const removeNodeIds = new Set<string>();
  const removeEdgeIds = new Set<string>();
  const addEdges: Edge[] = [];

  // 1) Remover Início dos blocos 2..N e Fim dos blocos 1..N-1
  segments.forEach((segment, index) => {
    const start = findByKind(segment.nodes, "start");
    const end = findByKind(segment.nodes, "end");

    if (index > 0 && start) {
      removeNodeIds.add(start.id);
      for (const edge of segment.edges) {
        if (edge.source === start.id || edge.target === start.id) {
          removeEdgeIds.add(edge.id);
        }
      }
    }

    if (index < segments.length - 1 && end) {
      removeNodeIds.add(end.id);
      for (const edge of segment.edges) {
        if (edge.source === end.id || edge.target === end.id) {
          removeEdgeIds.add(edge.id);
        }
      }
    }
  });

  // 2) Junção precisa entre segmentos consecutivos
  for (let i = 0; i < segments.length - 1; i++) {
    const from = segments[i];
    const to = segments[i + 1];
    const entryIds = findEntryNodeIds(to.nodes, to.edges).filter((id) => !removeNodeIds.has(id));
    if (entryIds.length === 0) continue;

    const happyExits = findHappyExitNodeIds(from.nodes, from.edges).filter(
      (id) => !removeNodeIds.has(id)
    );

    let joined = false;

    for (const exitId of happyExits) {
      const exitNode = from.nodes.find((n) => n.id === exitId);
      if (!exitNode) continue;

      if (isPlaceholderLanding(exitNode)) {
        // Ex.: Credenciais válidas? --sim--> Área logada --sucesso--> Fim
        // Vira: Credenciais válidas? --sim--> Dashboard (entrada do próximo)
        removeNodeIds.add(exitNode.id);

        const incoming = from.edges.filter(
          (e) => e.target === exitNode.id && !removeEdgeIds.has(e.id)
        );

        for (const edge of incoming) {
          removeEdgeIds.add(edge.id);
          const label =
            typeof edge.label === "string" && edge.label.trim()
              ? edge.label.trim()
              : edgeStroke(edge) === SUCCESS_STROKE
                ? "sim"
                : "segue";

          for (const entryId of entryIds) {
            addEdges.push({
              ...edge,
              id: `join_keep_${edge.id}__${entryId}`,
              target: entryId,
              label, // preserva "sim"
              style: {
                ...(edge.style ?? {}),
                stroke: edgeStroke(edge) === ERROR_STROKE ? ERROR_STROKE : SUCCESS_STROKE,
                strokeWidth: 2.5,
              },
            });
            joined = true;
          }
        }

        for (const edge of from.edges) {
          if (edge.source === exitNode.id || edge.target === exitNode.id) {
            removeEdgeIds.add(edge.id);
          }
        }
      } else {
        // Saída real (ex.: tela Dashboard) → entrada do próximo bloco
        for (const entryId of entryIds) {
          addEdges.push(
            makeJoinEdge(
              `join_${from.prefix}__${exitId}__${entryId}`,
              exitId,
              entryId,
              `segue para ${to.block.name}`,
              JOIN_STROKE
            )
          );
          joined = true;
        }
      }
    }

    // Fallback: se nada juntou, liga a última tela do bloco à entrada do próximo
    if (!joined) {
      const lastScreen = [...from.nodes]
        .reverse()
        .find((n) => !removeNodeIds.has(n.id) && kindOf(n) === "screen");
      if (lastScreen) {
        for (const entryId of entryIds) {
          addEdges.push(
            makeJoinEdge(
              `join_fallback_${from.prefix}__${entryId}`,
              lastScreen.id,
              entryId,
              `segue para ${to.block.name}`,
              JOIN_STROKE
            )
          );
        }
      }
    }
  }

  // Metadados início/fim
  const firstStart = findByKind(segments[0].nodes, "start");
  if (firstStart) {
    const idx = allNodes.findIndex((n) => n.id === firstStart.id);
    if (idx >= 0) {
      allNodes[idx] = {
        ...allNodes[idx],
        data: {
          ...allNodes[idx].data,
          subtitle: commercial ? "Pacote comercial" : "Jornada",
        },
      };
    }
  }

  const lastEnd = findByKind(segments[segments.length - 1].nodes, "end");
  if (lastEnd) {
    const idx = allNodes.findIndex((n) => n.id === lastEnd.id);
    if (idx >= 0) {
      allNodes[idx] = {
        ...allNodes[idx],
        data: {
          ...allNodes[idx].data,
          subtitle: "Fim",
        },
      };
    }
  }

  const nodes = allNodes.filter((n) => !removeNodeIds.has(n.id));
  const edges = [...allEdges, ...addEdges].filter(
    (e) =>
      !removeEdgeIds.has(e.id) &&
      !removeNodeIds.has(e.source) &&
      !removeNodeIds.has(e.target)
  );

  return {
    engine: APPLICATION_FLOW_ENGINE,
    version: 1,
    title,
    summary,
    nodes,
    edges,
  };
}

/** Diagnóstico: decisões sem pelo menos 2 saídas (ex.: só "não", sem "sim"). */
export function findDecisionsMissingBranches(flow: ApplicationFlowGraph): string[] {
  const decisions = flow.nodes.filter((n) => (n.data.kind ?? "screen") === "decision");
  const missing: string[] = [];
  for (const d of decisions) {
    const outs = flow.edges.filter((e) => e.source === d.id);
    if (outs.length < 2) {
      missing.push(`${d.id} (${d.data.label}) outs=${outs.length}`);
    }
  }
  return missing;
}
