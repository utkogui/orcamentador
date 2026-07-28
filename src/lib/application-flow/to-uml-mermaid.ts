import type { ApplicationFlowGraph, ApplicationFlowNodeKind } from "@/lib/application-flow/types";

const ERROR_STROKE = "#dc2626";
const SUCCESS_STROKE = "#059669";
const BRANCH_STROKE = "#7c3aed";
const JOIN_STROKE = "#2563eb";

const BLOCK_COLORS = [
  { fill: "#eff6ff", stroke: "#2563eb" },
  { fill: "#f0fdf4", stroke: "#16a34a" },
  { fill: "#fff7ed", stroke: "#ea580c" },
  { fill: "#faf5ff", stroke: "#9333ea" },
  { fill: "#fdf2f8", stroke: "#db2777" },
  { fill: "#ecfeff", stroke: "#0891b2" },
];

function esc(text: string): string {
  return text
    .replace(/"/g, "'")
    .replace(/[\[\]{}<>|]/g, " ")
    .replace(/\(/g, " - ")
    .replace(/\)/g, "")
    .replace(/→/g, "->")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+-\s*$/g, "")
    .trim();
}

function safeId(id: string): string {
  return `n_${id.replace(/[^a-zA-Z0-9_]/g, "_")}`;
}

function q(text: string): string {
  return `"${esc(text)}"`;
}

function nodeLabel(label: string, subtitle?: string, kind?: ApplicationFlowNodeKind): string {
  if ((kind === "start" || kind === "end") && subtitle) {
    return `${label} · ${subtitle}`;
  }
  return label;
}

function nodeShape(id: string, label: string, kind: ApplicationFlowNodeKind): string {
  const mid = safeId(id);
  const text = q(label);

  switch (kind) {
    case "start":
      return `  ${mid}([${text}]):::umlStart`;
    case "end":
      return `  ${mid}([${text}]):::umlEnd`;
    case "decision":
      return `  ${mid}{${text}}:::umlDecision`;
    case "status":
      return `  ${mid}[[${text}]]:::umlStatus`;
    case "system":
      return `  ${mid}>${text}]:::umlSystem`;
    case "screen":
    default:
      return `  ${mid}[${text}]:::umlScreen`;
  }
}

function shortEdgeLabel(raw: string): string {
  return esc(raw)
    .replace(/^segue para /i, "segue: ")
    .slice(0, 40);
}

/**
 * Diagrama de atividade SEM subgraphs cruzados (eles quebram visualmente o caminho "sim").
 * Blocos ficam distinguíveis por cor de borda via classDef por step.
 */
export function flowToUmlActivityMermaid(flow: ApplicationFlowGraph): string {
  const lines: string[] = [
    "%%{init: {'flowchart': {'htmlLabels': false, 'curve': 'linear', 'nodeSpacing': 42, 'rankSpacing': 70, 'padding': 16}, 'themeVariables': {'fontFamily': 'ui-sans-serif, system-ui, sans-serif', 'fontSize': '14px'}}}%%",
    "flowchart TB",
    `  %% UML Activity — ${esc(flow.title)}`,
  ];

  const stepByNode = new Map<string, number>();
  for (const node of flow.nodes) {
    stepByNode.set(node.id, node.data.blockStep ?? 0);
  }

  for (const node of flow.nodes) {
    const kind = node.data.kind ?? "screen";
    const label = nodeLabel(node.data.label, node.data.subtitle, kind);
    lines.push(nodeShape(node.id, label, kind));
  }

  lines.push("");

  const linkStyles: string[] = [];
  let linkIndex = 0;

  // Ordena arestas: caminhos do mesmo bloco primeiro, junções depois — leitura mais estável
  const edges = [...flow.edges].sort((a, b) => {
    const aJoin = a.id.startsWith("join_") ? 1 : 0;
    const bJoin = b.id.startsWith("join_") ? 1 : 0;
    return aJoin - bJoin;
  });

  for (const edge of edges) {
    const from = safeId(edge.source);
    const to = safeId(edge.target);
    const stroke = typeof edge.style?.stroke === "string" ? edge.style.stroke : undefined;
    const label = edge.label ? `|"${shortEdgeLabel(String(edge.label))}"|` : "";
    lines.push(`  ${from} -->${label} ${to}`);

    if (stroke === ERROR_STROKE) {
      linkStyles.push(
        `  linkStyle ${linkIndex} stroke:${ERROR_STROKE},stroke-width:2.5px,color:${ERROR_STROKE}`
      );
    } else if (stroke === SUCCESS_STROKE) {
      linkStyles.push(
        `  linkStyle ${linkIndex} stroke:${SUCCESS_STROKE},stroke-width:2.5px,color:${SUCCESS_STROKE}`
      );
    } else if (stroke === JOIN_STROKE) {
      linkStyles.push(
        `  linkStyle ${linkIndex} stroke:${JOIN_STROKE},stroke-width:2.5px,color:${JOIN_STROKE}`
      );
    } else if (stroke === BRANCH_STROKE) {
      linkStyles.push(
        `  linkStyle ${linkIndex} stroke:${BRANCH_STROKE},stroke-width:2px,color:${BRANCH_STROKE}`
      );
    }
    linkIndex += 1;
  }

  lines.push("");
  lines.push("  classDef umlStart fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#064e3b");
  lines.push("  classDef umlEnd fill:#fff1f2,stroke:#e11d48,stroke-width:2px,color:#881337");
  lines.push("  classDef umlScreen fill:#ffffff,stroke:#334155,stroke-width:1.5px,color:#0f172a");
  lines.push("  classDef umlDecision fill:#f5f3ff,stroke:#7c3aed,stroke-width:1.5px,color:#4c1d95");
  lines.push(
    "  classDef umlStatus fill:#fffbeb,stroke:#d97706,stroke-width:1.5px,stroke-dasharray: 4 3,color:#78350f"
  );
  lines.push("  classDef umlSystem fill:#f0fdfa,stroke:#0d9488,stroke-width:1.5px,color:#115e59");

  // Cores por bloco (borda) — sem subgraph
  const maxStep = Math.max(0, ...flow.nodes.map((n) => n.data.blockStep ?? 0));
  for (let step = 1; step <= maxStep; step++) {
    const palette = BLOCK_COLORS[(step - 1) % BLOCK_COLORS.length];
    lines.push(
      `  classDef blockStep${step} fill:${palette.fill},stroke:${palette.stroke},stroke-width:2px,color:#0f172a`
    );
  }

  for (const node of flow.nodes) {
    const step = node.data.blockStep ?? 0;
    const kind = node.data.kind ?? "screen";
    if (step > 0 && kind !== "start" && kind !== "end") {
      lines.push(`  class ${safeId(node.id)} blockStep${step}`);
    }
  }

  lines.push(...linkStyles);

  return lines.join("\n");
}

export function flowToUmlStateMermaid(flow: ApplicationFlowGraph): string {
  const lines: string[] = [
    "stateDiagram-v2",
    `  %% UML State — ${esc(flow.title)}`,
  ];

  const kindById = new Map(
    flow.nodes.map((n) => [n.id, n.data.kind ?? ("screen" as ApplicationFlowNodeKind)])
  );

  for (const node of flow.nodes) {
    const kind = node.data.kind ?? "screen";
    if (kind === "start" || kind === "end") continue;
    const prefix =
      node.data.blockStep && node.data.blockName
        ? `${node.data.blockStep}.${node.data.blockName}: `
        : "";
    lines.push(`  state "${esc(prefix + node.data.label)}" as ${safeId(node.id)}`);
  }

  for (const edge of flow.edges) {
    const sourceKind = kindById.get(edge.source);
    const targetKind = kindById.get(edge.target);
    const raw = edge.label ? String(edge.label) : "";
    const label = raw ? ` : ${shortEdgeLabel(raw)}` : "";

    if (sourceKind === "start") {
      lines.push(`  [*] --> ${safeId(edge.target)}${label}`);
      continue;
    }
    if (targetKind === "end") {
      lines.push(`  ${safeId(edge.source)} --> [*]${label}`);
      continue;
    }
    if (sourceKind === "end" || targetKind === "start") continue;

    lines.push(`  ${safeId(edge.source)} --> ${safeId(edge.target)}${label}`);
  }

  return lines.join("\n");
}

export type UmlDiagramKind = "activity" | "state";

export function flowToUmlMermaid(
  flow: ApplicationFlowGraph,
  kind: UmlDiagramKind = "activity"
): string {
  return kind === "state" ? flowToUmlStateMermaid(flow) : flowToUmlActivityMermaid(flow);
}

export function listFlowBlocks(flow: ApplicationFlowGraph): Array<{
  id: string;
  name: string;
  step: number;
  nodeCount: number;
}> {
  const map = new Map<string, { id: string; name: string; step: number; nodeCount: number }>();
  for (const node of flow.nodes) {
    if (!node.data.blockId) continue;
    const cur = map.get(node.data.blockId);
    if (cur) {
      cur.nodeCount += 1;
    } else {
      map.set(node.data.blockId, {
        id: node.data.blockId,
        name: node.data.blockName ?? node.data.blockId,
        step: node.data.blockStep ?? 0,
        nodeCount: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) => a.step - b.step);
}
