import type { BriefingBlockMatch, BriefingInterpretationResult } from "@/types/building-blocks";
import type { ApplicationFlowGraph, ApplicationFlowNodeData } from "@/lib/application-flow/types";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { Edge, Node } from "@xyflow/react";

type BlockRole =
  | "entry"
  | "auth_login"
  | "auth_signup"
  | "auth_recovery"
  | "hub"
  | "commerce"
  | "integration"
  | "ai"
  | "feature";

type ClassifiedBlock = BriefingBlockMatch & { role: BlockRole };

const X = { start: 0, entry: 240, auth: 480, hub: 720, features: 980, commerce: 980 };
const Y = { authRow: 0, featureRow: 220, commerceRow: 420 };

function classifyBlock(match: BriefingBlockMatch): BlockRole {
  const id = match.blockId.toLowerCase();
  const name = match.blockName.toLowerCase();
  const category = match.categoryId?.toLowerCase() ?? "";

  if (/site_home|landing|institutional|portal|home/.test(id) || /home|portal|institucional/.test(name)) {
    return "entry";
  }
  if (/auth_basic_login|basic_login/.test(id) || (category === "authentication" && /login|entrar/.test(name))) {
    return "auth_login";
  }
  if (/auth_user_signup|signup|sign_up/.test(id) || (category === "authentication" && /cadastro|registro/.test(name))) {
    return "auth_signup";
  }
  if (/auth_forgot|forgot|reset|recuper/.test(id) || /esqueci|recuper/.test(name)) {
    return "auth_recovery";
  }
  if (/dashboard/.test(id) || category === "dashboard_analytics" || /dashboard|painel|indicador/.test(name)) {
    return "hub";
  }
  if (/billing|payment|checkout|cart|commerce|catalog|produto|loja|assinatura/.test(id) || category === "finance_payments") {
    return "commerce";
  }
  if (/whatsapp|integration|transactional|webhook|api|email/.test(id) || category === "integrations" || category === "communication") {
    return "integration";
  }
  if (/^ai_|_ai/.test(id) || category === "ai") {
    return "ai";
  }
  return "feature";
}

function dedupeMatches(matches: BriefingBlockMatch[]): BriefingBlockMatch[] {
  const map = new Map<string, BriefingBlockMatch>();
  for (const match of matches) {
    map.set(match.blockId, match);
  }
  return Array.from(map.values());
}

function zoneForRole(role: BlockRole): ApplicationFlowNodeData["zone"] {
  switch (role) {
    case "entry":
      return "entry";
    case "auth_login":
    case "auth_signup":
    case "auth_recovery":
      return "auth";
    case "hub":
      return "hub";
    case "commerce":
      return "commerce";
    case "integration":
      return "integration";
    default:
      return "feature";
  }
}

function makeNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  zone: ApplicationFlowNodeData["zone"],
  subtitle?: string,
  blockId?: string
): Node<ApplicationFlowNodeData> {
  return {
    id,
    position,
    data: { label, subtitle, blockId, zone },
    type: "journey",
  };
}

function makeEdge(id: string, source: string, target: string, label?: string): Edge {
  return {
    id,
    source,
    target,
    label,
    type: "smoothstep",
    style: { stroke: "#64748b", strokeWidth: 2 },
    animated: label === "acesso",
  };
}

export function generateApplicationFlowFromBlocks(
  result: BriefingInterpretationResult,
  projectTitle?: string
): ApplicationFlowGraph {
  const classified = dedupeMatches([...result.explicitlyRequested, ...result.likelyNeeded]).map(
    (match) => ({ ...match, role: classifyBlock(match) })
  );

  const nodes: Node<ApplicationFlowNodeData>[] = [];
  const edges: Edge[] = [];

  nodes.push(
    makeNode("start", "Início", { x: X.start, y: Y.authRow + 40 }, "start", "Entrada do usuário")
  );

  const byRole = (role: BlockRole) => classified.filter((block) => block.role === role);

  const entryBlocks = byRole("entry");
  const loginBlocks = byRole("auth_login");
  const signupBlocks = byRole("auth_signup");
  const recoveryBlocks = byRole("auth_recovery");
  const hubBlocks = byRole("hub");
  const commerceBlocks = byRole("commerce");
  const integrationBlocks = byRole("integration");
  const aiBlocks = byRole("ai");
  const featureBlocks = byRole("feature");

  let anchorAfterStart = "start";

  if (entryBlocks.length > 0) {
    entryBlocks.forEach((block, index) => {
      const id = `entry_${block.blockId}`;
      nodes.push(
        makeNode(
          id,
          block.blockName,
          { x: X.entry, y: Y.authRow + index * 90 },
          "entry",
          "Portal / vitrine pública",
          block.blockId
        )
      );
      edges.push(makeEdge(`e_start_${id}`, anchorAfterStart, id));
      anchorAfterStart = id;
    });
  }

  const authNodeIds: string[] = [];
  let authY = Y.authRow;

  if (signupBlocks.length > 0) {
    signupBlocks.forEach((block) => {
      const id = `auth_${block.blockId}`;
      nodes.push(
        makeNode(id, block.blockName, { x: X.auth, y: authY }, "auth", "Cadastro de conta", block.blockId)
      );
      authNodeIds.push(id);
      authY += 80;
    });
  }

  let loginNodeId: string | null = null;
  if (loginBlocks.length > 0) {
    const block = loginBlocks[0];
    loginNodeId = `auth_${block.blockId}`;
    nodes.push(
      makeNode(
        loginNodeId,
        block.blockName,
        { x: X.auth, y: authY },
        "auth",
        "Acesso autenticado",
        block.blockId
      )
    );
    authNodeIds.push(loginNodeId);
    authY += 80;
  } else if (classified.length > 0) {
    loginNodeId = "auth_synthetic_login";
    nodes.push(
      makeNode(loginNodeId, "Login", { x: X.auth, y: authY }, "auth", "Acesso inferido pelo escopo")
    );
    authNodeIds.push(loginNodeId);
    authY += 80;
  }

  if (recoveryBlocks.length > 0) {
    recoveryBlocks.forEach((block) => {
      const id = `auth_${block.blockId}`;
      nodes.push(
        makeNode(id, block.blockName, { x: X.auth, y: authY }, "auth", "Recuperação de acesso", block.blockId)
      );
      if (loginNodeId) {
        edges.push(makeEdge(`e_${loginNodeId}_${id}`, loginNodeId, id, "esqueci senha"));
        edges.push(makeEdge(`e_${id}_${loginNodeId}`, id, loginNodeId, "voltar"));
      }
      authY += 80;
    });
  }

  if (loginNodeId) {
    nodes.push(
      makeNode("auth_logout", "Logout", { x: X.auth, y: authY }, "auth", "Encerrar sessão")
    );
    edges.push(makeEdge(`e_logout_${loginNodeId}`, "auth_logout", loginNodeId));
  }

  for (const signupId of authNodeIds.filter((id) => id.includes("signup") || signupBlocks.some((b) => id.includes(b.blockId)))) {
    if (loginNodeId) {
      edges.push(makeEdge(`e_${signupId}_${loginNodeId}`, signupId, loginNodeId, "após cadastro"));
    }
  }

  if (anchorAfterStart !== "start" && loginNodeId) {
    edges.push(makeEdge(`e_entry_login`, anchorAfterStart, loginNodeId, "acesso"));
  } else if (loginNodeId && anchorAfterStart === "start") {
    edges.push(makeEdge(`e_start_login`, "start", loginNodeId, "acesso"));
  } else if (anchorAfterStart !== "start") {
    // sem login explícito — portal leva ao hub/features
  } else if (classified.length > 0 && !loginNodeId) {
    edges.push(makeEdge("e_start_features", "start", "end", "explorar"));
  }

  let hubNodeId: string | null = null;
  if (hubBlocks.length > 0) {
    const block = hubBlocks[0];
    hubNodeId = `hub_${block.blockId}`;
    nodes.push(
      makeNode(
        hubNodeId,
        block.blockName,
        { x: X.hub, y: Y.authRow + 40 },
        "hub",
        "Central de navegação",
        block.blockId
      )
    );
    if (loginNodeId) {
      edges.push(makeEdge(`e_login_hub`, loginNodeId, hubNodeId, "após login"));
    } else if (anchorAfterStart !== "start") {
      edges.push(makeEdge(`e_entry_hub`, anchorAfterStart, hubNodeId));
    } else {
      edges.push(makeEdge(`e_start_hub`, "start", hubNodeId));
    }
  }

  const featureLike = [...featureBlocks, ...aiBlocks];
  featureLike.forEach((block, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const id = `feature_${block.blockId}`;
    nodes.push(
      makeNode(
        id,
        block.blockName,
        { x: X.features + col * 200, y: Y.featureRow + row * 100 },
        block.role === "ai" ? "integration" : "feature",
        "Módulo funcional",
        block.blockId
      )
    );
    const source = hubNodeId ?? loginNodeId ?? anchorAfterStart;
    edges.push(makeEdge(`e_hub_feature_${id}`, source, id));
  });

  let previousCommerceId: string | null = hubNodeId ?? loginNodeId ?? anchorAfterStart;
  commerceBlocks.forEach((block, index) => {
    const id = `commerce_${block.blockId}`;
    nodes.push(
      makeNode(
        id,
        block.blockName,
        { x: X.commerce + index * 180, y: Y.commerceRow },
        "commerce",
        "Jornada comercial",
        block.blockId
      )
    );
    if (previousCommerceId) {
      edges.push(makeEdge(`e_commerce_${index}`, previousCommerceId, id));
    }
    previousCommerceId = id;
  });

  integrationBlocks.forEach((block, index) => {
    const id = `integration_${block.blockId}`;
    nodes.push(
      makeNode(
        id,
        block.blockName,
        { x: X.hub, y: Y.commerceRow + 120 + index * 90 },
        "integration",
        "Integração / serviço externo",
        block.blockId
      )
    );
    const source = hubNodeId ?? loginNodeId ?? anchorAfterStart;
    edges.push(makeEdge(`e_integration_${id}`, source, id, "integra"));
  });

  nodes.push(
    makeNode(
      "end",
      "Fim da jornada",
      { x: X.features + 400, y: Y.authRow + 40 },
      "end",
      "Conclusão de fluxo principal"
    )
  );

  const leafCandidates = nodes.filter(
    (node) => node.id !== "start" && node.id !== "end" && !edges.some((edge) => edge.source === node.id)
  );
  const branchSources = nodes.filter(
    (node) => node.id !== "start" && node.id !== "end" && edges.some((edge) => edge.source === node.id)
  );

  for (const leaf of leafCandidates.length > 0 ? leafCandidates : branchSources.slice(-3)) {
    if (leaf.id === "end") continue;
    if (!edges.some((edge) => edge.source === leaf.id && edge.target === "end")) {
      edges.push(makeEdge(`e_${leaf.id}_end`, leaf.id, "end"));
    }
  }

  if (nodes.length <= 2) {
    nodes.push(
      makeNode("feature_placeholder", "Módulos do escopo", { x: X.hub, y: Y.featureRow }, "feature", "Adicione blocos na interpretação")
    );
    edges.push(makeEdge("e_start_placeholder", "start", "feature_placeholder"));
    edges.push(makeEdge("e_placeholder_end", "feature_placeholder", "end"));
  }

  return {
    engine: APPLICATION_FLOW_ENGINE,
    version: 1,
    title: projectTitle ?? "Estrutura provável da aplicação",
    summary: result.summary,
    nodes,
    edges,
  };
}
