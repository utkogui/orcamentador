export type ProjectFlowNodeType = "start" | "end" | "operation" | "condition";

export type ProjectFlowNode = {
  id: string;
  type: ProjectFlowNodeType;
  label: string;
  subtitle?: string;
};

export type ProjectFlowEdge = {
  from: string;
  to: string;
  branch?: "yes" | "no";
};

export type ProjectFlow = {
  nodes: ProjectFlowNode[];
  edges: ProjectFlowEdge[];
};

export type ProjectFlowModule = {
  id: string;
  name: string;
  quantity: number;
  description?: string | null;
  moduleName?: string;
};

function sanitizeLabel(value: string): string {
  return value.replace(/:/g, "·").replace(/->/g, "→").trim();
}

function lines(...parts: string[]): string {
  return parts.map(sanitizeLabel).filter(Boolean).join("\n");
}

function categorizeModule(name: string, moduleName?: string) {
  const normalized = `${name} ${moduleName ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/core|plataforma/.test(normalized)) return "platform";
  if (/vitrine|ecommerce|landing|institucional|loja/.test(normalized)) return "landing";
  if (/autentic|login|acesso/.test(normalized)) return "auth";
  if (/dashboard|indicador|painel/.test(normalized)) return "dashboard";
  if (/cadastro|entidade|lead|cliente|igreja|chamado|sac|crud/.test(normalized)) return "crud";
  if (/conector|integra|bling|whatsapp|meta|api/.test(normalized)) return "integration";
  if (/pipeline|funil|crm|automacao|ia|atendimento|ebd|regra|comercial/.test(normalized))
    return "domain";
  return "other";
}

export function generateDefaultProjectFlow(params: {
  projectName: string;
  modules: ProjectFlowModule[];
}): ProjectFlow {
  const { projectName, modules } = params;
  const nodes: ProjectFlowNode[] = [
    { id: "start", type: "start", label: projectName, subtitle: "Entrada do sistema" },
  ];
  const edges: ProjectFlowEdge[] = [];

  const grouped = {
    platform: [] as ProjectFlowModule[],
    landing: [] as ProjectFlowModule[],
    auth: [] as ProjectFlowModule[],
    dashboard: [] as ProjectFlowModule[],
    crud: [] as ProjectFlowModule[],
    integration: [] as ProjectFlowModule[],
    domain: [] as ProjectFlowModule[],
    other: [] as ProjectFlowModule[],
  };

  for (const mod of modules) {
    grouped[
      categorizeModule(mod.name, mod.moduleName) as keyof typeof grouped
    ].push(mod);
  }

  let previousId = "start";

  const appendNode = (node: ProjectFlowNode) => {
    nodes.push(node);
    edges.push({ from: previousId, to: node.id });
    previousId = node.id;
  };

  if (grouped.platform[0]) {
    appendNode({
      id: "platform",
      type: "operation",
      label: grouped.platform[0].name,
      subtitle: grouped.platform[0].description ?? "Base compartilhada",
    });
  }

  if (grouped.landing[0]) {
    appendNode({
      id: "landing",
      type: "operation",
      label: grouped.landing[0].name,
      subtitle: grouped.landing[0].description ?? "Página inicial",
    });
  }

  const authModule = grouped.auth[0];
  if (authModule) {
    appendNode({
      id: "login",
      type: "operation",
      label: authModule.name,
      subtitle: "Autenticação do usuário",
    });
  }

  const dashboardModule = grouped.dashboard[0];
  if (dashboardModule) {
    appendNode({
      id: "hub",
      type: "operation",
      label: dashboardModule.name,
      subtitle: "Navegação principal",
    });
  }

  const branchFrom = previousId;
  const branchTargets: string[] = [];

  grouped.crud.forEach((mod) => {
    for (let i = 1; i <= mod.quantity; i += 1) {
      const suffix = mod.quantity > 1 ? ` ${i}` : "";
      const id = `crud_${mod.id}_${i}`;
      nodes.push({
        id,
        type: "operation",
        label: `${mod.name}${suffix}`,
        subtitle: mod.description ?? "Cadastro e gestão",
      });
      edges.push({ from: branchFrom, to: id });
      branchTargets.push(id);
    }
  });

  grouped.domain.forEach((mod) => {
    const id = `domain_${mod.id}`;
    nodes.push({
      id,
      type: "operation",
      label: mod.name,
      subtitle: mod.description ?? mod.moduleName ?? undefined,
    });
    edges.push({ from: branchFrom, to: id });
    branchTargets.push(id);
  });

  grouped.other.forEach((mod) => {
    for (let i = 1; i <= mod.quantity; i += 1) {
      const suffix = mod.quantity > 1 ? ` ${i}` : "";
      const id = `other_${mod.id}_${i}`;
      nodes.push({
        id,
        type: "operation",
        label: `${mod.name}${suffix}`,
        subtitle: mod.description ?? undefined,
      });
      edges.push({ from: branchFrom, to: id });
      branchTargets.push(id);
    }
  });

  if (branchTargets.length === 0 && modules.length > 0) {
    modules.forEach((mod) => {
      for (let i = 1; i <= mod.quantity; i += 1) {
        const suffix = mod.quantity > 1 ? ` ${i}` : "";
        const id = `mod_${mod.id}_${i}`;
        nodes.push({
          id,
          type: "operation",
          label: `${mod.name}${suffix}`,
          subtitle: mod.description ?? undefined,
        });
        edges.push({ from: branchFrom, to: id });
        branchTargets.push(id);
      }
    });
  }

  grouped.integration.forEach((mod) => {
    const id = `integration_${mod.id}`;
    nodes.push({
      id,
      type: "operation",
      label: mod.name,
      subtitle: mod.description ?? mod.moduleName ?? "Integração externa",
    });
    edges.push({ from: branchFrom, to: id });
    branchTargets.push(id);
  });

  nodes.push({ id: "end", type: "end", label: "Conclusão", subtitle: "Fluxo principal do projeto" });

  if (branchTargets.length === 0) {
    edges.push({ from: previousId, to: "end" });
  } else {
    branchTargets.forEach((targetId) => {
      edges.push({ from: targetId, to: "end" });
    });
  }

  return { nodes, edges };
}

export function parseProjectFlow(json: string | null | undefined): ProjectFlow | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as ProjectFlow;
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function serializeProjectFlow(flow: ProjectFlow): string {
  return JSON.stringify(flow);
}

export function buildProjectFlowchartCode(flow: ProjectFlow): string {
  const nodeLines = flow.nodes.map((node) => {
    const text = lines(node.label, node.subtitle ?? "");
    return `${node.id}=>${node.type}: ${text}`;
  });

  const edgeLines = flow.edges.map((edge) => {
    if (edge.branch) {
      return `${edge.from}(${edge.branch})->${edge.to}`;
    }
    return `${edge.from}->${edge.to}`;
  });

  return [...nodeLines, ...edgeLines].join("\n");
}

export function updateProjectFlowLabels(
  flow: ProjectFlow,
  labels: Record<string, { label?: string; subtitle?: string }>
): ProjectFlow {
  return {
    ...flow,
    nodes: flow.nodes.map((node) => ({
      ...node,
      label: labels[node.id]?.label ?? node.label,
      subtitle: labels[node.id]?.subtitle ?? node.subtitle,
    })),
  };
}
