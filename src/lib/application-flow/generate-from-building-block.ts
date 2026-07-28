import type { BuildingBlock } from "@/types/building-blocks";
import type {
  ApplicationFlowGraph,
  ApplicationFlowNodeData,
  ApplicationFlowNodeKind,
} from "@/lib/application-flow/types";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { Edge, Node } from "@xyflow/react";

type Zone = ApplicationFlowNodeData["zone"];

type EdgeOpts = {
  label?: string;
  sourceHandle?: string;
  targetHandle?: string;
  variant?: "default" | "success" | "error" | "branch";
};

const EDGE_COLORS = {
  default: "#64748b",
  success: "#059669",
  error: "#dc2626",
  branch: "#7c3aed",
} as const;

/** Coluna principal (centro) e coluna de erro (direita) no layout vertical. */
const X = { main: 420, err: 900, left: -80 };
const ROW = 360;

function zoneForBlock(block: BuildingBlock): Zone {
  const category = block.category_id.toLowerCase();
  const id = block.id.toLowerCase();

  if (category === "authentication" || id.startsWith("auth_")) return "auth";
  if (category === "landing_institutional" || /landing|home|hero|blog/.test(id)) return "entry";
  if (category === "dashboard_analytics" || /dashboard/.test(id)) return "hub";
  if (category === "finance_payments" || /billing|payment|checkout|invoice/.test(id)) return "commerce";
  if (category === "integrations" || category === "communication" || /webhook|api|whatsapp|email/.test(id)) {
    return "integration";
  }
  return "feature";
}

function makeNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  zone: Zone,
  kind: ApplicationFlowNodeKind,
  subtitle?: string,
  blockId?: string
): Node<ApplicationFlowNodeData> {
  return {
    id,
    position,
    data: { label, subtitle, blockId, zone, kind },
    type: "journey",
  };
}

function makeEdge(id: string, source: string, target: string, opts: EdgeOpts = {}): Edge {
  const variant = opts.variant ?? "default";
  const color = EDGE_COLORS[variant];
  return {
    id,
    source,
    target,
    label: opts.label,
    sourceHandle: opts.sourceHandle ?? "bottom",
    targetHandle: opts.targetHandle ?? "top",
    type: "smoothstep",
    animated: variant === "branch",
    style: { stroke: color, strokeWidth: variant === "error" ? 2.5 : 2 },
  };
}

type FlowBuilder = {
  nodes: Node<ApplicationFlowNodeData>[];
  edges: Edge[];
  add: (
    id: string,
    label: string,
    x: number,
    y: number,
    kind: ApplicationFlowNodeKind,
    zone: Zone,
    subtitle?: string,
    blockId?: string
  ) => void;
  link: (id: string, source: string, target: string, opts?: EdgeOpts) => void;
};

function createBuilder(blockId?: string): FlowBuilder {
  const nodes: Node<ApplicationFlowNodeData>[] = [];
  const edges: Edge[] = [];
  return {
    nodes,
    edges,
    add(id, label, x, y, kind, zone, subtitle, bid = blockId) {
      nodes.push(makeNode(id, label, { x, y }, zone, kind, subtitle, bid));
    },
    link(id, source, target, opts) {
      edges.push(makeEdge(id, source, target, opts));
    },
  };
}

function graph(block: BuildingBlock, b: FlowBuilder): ApplicationFlowGraph {
  return {
    engine: APPLICATION_FLOW_ENGINE,
    version: 1,
    title: block.name,
    summary: block.summary,
    nodes: b.nodes,
    edges: b.edges,
  };
}

/** Login: sucesso à direita/baixo na vertical; erro e esqueci descem e voltam. */
function buildLoginFlow(block: BuildingBlock): ApplicationFlowGraph {
  const b = createBuilder(block.id);
  const z: Zone = "auth";

  b.add("start", "Início", X.main, 0, "start", "start", block.category_name);
  b.add("login", "Login", X.main, ROW, "screen", z, "E-mail e senha");
  b.add("check", "Credenciais válidas?", X.main, ROW * 2, "decision", z);

  b.add("logged", "Área logada", X.main, ROW * 3, "screen", "hub", "Dashboard / home");
  b.add("end", "Fim", X.main, ROW * 4, "end", "end", "Usuário autenticado");

  b.add("err", "Erro na tela", X.err, ROW * 2, "status", z, "Mensagem de erro");
  b.add("forgot", "Esqueci minha senha", X.left, ROW * 2, "screen", z, "Desvio");
  b.add("forgot_sys", "Fluxo de recuperação", X.left, ROW * 3, "system", "integration", "auth_forgot_password");

  b.link("e1", "start", "login", { sourceHandle: "bottom", targetHandle: "top" });
  b.link("e2", "login", "check", { sourceHandle: "bottom", targetHandle: "top", label: "enviar" });
  b.link("e3", "check", "logged", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "sim",
    variant: "success",
  });
  b.link("e4", "logged", "end", {
    sourceHandle: "bottom",
    targetHandle: "top",
    variant: "success",
  });
  b.link("e5", "check", "err", {
    sourceHandle: "right",
    targetHandle: "left",
    label: "não",
    variant: "error",
  });
  b.link("e6", "err", "login", {
    sourceHandle: "top-source",
    targetHandle: "right-target",
    label: "voltar",
    variant: "error",
  });
  b.link("e7", "login", "forgot", {
    sourceHandle: "left-source",
    targetHandle: "right-target",
    label: "esqueci a senha",
    variant: "branch",
  });
  b.link("e8", "forgot", "forgot_sys", {
    sourceHandle: "bottom",
    targetHandle: "top",
    variant: "branch",
  });
  b.link("e9", "forgot_sys", "login", {
    sourceHandle: "right",
    targetHandle: "left",
    label: "volta ao login",
    variant: "branch",
  });

  return graph(block, b);
}

function buildForgotPasswordFlow(block: BuildingBlock): ApplicationFlowGraph {
  const b = createBuilder(block.id);
  const z: Zone = "auth";

  b.add("start", "Início", X.main, 0, "start", "start", "A partir do login");
  b.add("login", "Login", X.main, ROW, "screen", z, "Clica em esqueci a senha");
  b.add("request", "Solicitar nova senha", X.main, ROW * 2, "screen", z, "Informar e-mail");
  b.add("email_ok", "E-mail cadastrado?", X.main, ROW * 3, "decision", z);
  b.add("mail", "E-mail de recuperação", X.main, ROW * 4, "system", "integration", "Token enviado");
  b.add("reset", "Redefinir senha", X.main, ROW * 5, "screen", z, "Nova senha");
  b.add("valid", "Senha válida?", X.main, ROW * 6, "decision", z);
  b.add("done", "Senha alterada", X.main, ROW * 7, "status", z, "Sucesso");
  b.add("end", "Volta ao login", X.main, ROW * 8, "end", "end");

  b.add("email_msg", "Mensagem genérica", X.err, ROW * 3, "status", z, "Mesmo sem e-mail");
  b.add("reset_err", "Erro de validação", X.err, ROW * 6, "status", z, "Regras de senha");

  b.link("e1", "start", "login", { sourceHandle: "bottom", targetHandle: "top" });
  b.link("e2", "login", "request", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "esqueci a senha",
    variant: "branch",
  });
  b.link("e3", "request", "email_ok", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "enviar",
  });
  b.link("e4", "email_ok", "mail", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "sim",
    variant: "success",
  });
  b.link("e5", "email_ok", "email_msg", {
    sourceHandle: "right",
    targetHandle: "left",
    label: "não",
    variant: "error",
  });
  b.link("e6", "email_msg", "login", {
    sourceHandle: "top-source",
    targetHandle: "right-target",
    label: "voltar",
    variant: "branch",
  });
  b.link("e7", "mail", "reset", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "abrir link",
  });
  b.link("e8", "reset", "valid", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "salvar",
  });
  b.link("e9", "valid", "done", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "sim",
    variant: "success",
  });
  b.link("e10", "valid", "reset_err", {
    sourceHandle: "right",
    targetHandle: "left",
    label: "não",
    variant: "error",
  });
  b.link("e11", "reset_err", "reset", {
    sourceHandle: "top-source",
    targetHandle: "right-target",
    label: "corrigir",
    variant: "error",
  });
  b.link("e12", "done", "end", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "voltar ao login",
    variant: "success",
  });

  return graph(block, b);
}

function buildSignupFlow(block: BuildingBlock): ApplicationFlowGraph {
  const b = createBuilder(block.id);
  const z: Zone = "auth";

  b.add("start", "Início", X.main, 0, "start", "start");
  b.add("signup", "Cadastro", X.main, ROW, "screen", z, "Dados do usuário");
  b.add("valid", "Dados válidos?", X.main, ROW * 2, "decision", z);
  b.add("success", "Sucesso do cadastro", X.main, ROW * 3, "status", z);
  b.add("next", "Login ou Dashboard", X.main, ROW * 4, "screen", "hub");
  b.add("end", "Fim", X.main, ROW * 5, "end", "end");
  b.add("err", "Erro de validação", X.err, ROW * 2, "status", z, "Permanece no cadastro");

  b.link("e1", "start", "signup", { sourceHandle: "bottom", targetHandle: "top" });
  b.link("e2", "signup", "valid", { sourceHandle: "bottom", targetHandle: "top", label: "enviar" });
  b.link("e3", "valid", "success", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "sim",
    variant: "success",
  });
  b.link("e4", "success", "next", { sourceHandle: "bottom", targetHandle: "top", variant: "success" });
  b.link("e5", "next", "end", { sourceHandle: "bottom", targetHandle: "top", variant: "success" });
  b.link("e6", "valid", "err", {
    sourceHandle: "right",
    targetHandle: "left",
    label: "não",
    variant: "error",
  });
  b.link("e7", "err", "signup", {
    sourceHandle: "top-source",
    targetHandle: "right-target",
    label: "corrigir",
    variant: "error",
  });

  return graph(block, b);
}

/** Hub de configurações: escolhe seção, edita, salva ou erra e volta. */
function buildSettingsFlow(block: BuildingBlock): ApplicationFlowGraph {
  const b = createBuilder(block.id);
  const z = zoneForBlock(block);
  const pages =
    block.pages?.length > 0 ? block.pages : ["Configurações gerais", "Segurança", "Preferências"];

  b.add("start", "Início", X.main, 0, "start", "start", block.category_name);
  b.add("hub", block.name, X.main, ROW, "screen", z, "Menu / abas das seções");

  const sectionY = ROW * 2;
  /** Largura de cada coluna (seção + desvio de erro) — maior que a tela de propósito. */
  const COL = 900;
  /** Distância horizontal decisão → erro (seta "não" legível). */
  const ERR_DX = 520;
  const startX = X.main - ((pages.length - 1) * COL) / 2;

  pages.forEach((page, i) => {
    const x = startX + i * COL;
    const sid = `sec-${i}`;
    const did = `dec-${i}`;
    const okId = `ok-${i}`;
    const errId = `err-${i}`;

    b.add(sid, page, x, sectionY, "screen", z, "Editar seção");
    b.add(did, "Salvar?", x + 44, sectionY + ROW, "decision", z);
    b.add(okId, "Salvo", x, sectionY + ROW * 2, "status", z, "Feedback de sucesso");
    // Erro bem à direita e um pouco abaixo, para não colar no losango nem nas setas "sim".
    b.add(errId, "Erro ao salvar", x + ERR_DX, sectionY + ROW + 90, "status", z, "Volta na seção");

    b.link(`h-${i}`, "hub", sid, {
      sourceHandle: "bottom",
      targetHandle: "top",
      label: i === 0 ? "abrir seção" : undefined,
      variant: "branch",
    });
    b.link(`s-${i}`, sid, did, { sourceHandle: "bottom", targetHandle: "top", label: "salvar" });
    b.link(`ok-${i}`, did, okId, {
      sourceHandle: "bottom",
      targetHandle: "top",
      label: "sim",
      variant: "success",
    });
    b.link(`no-${i}`, did, errId, {
      sourceHandle: "right",
      targetHandle: "left",
      label: "não",
      variant: "error",
    });
    // Retorno por baixo, evitando o feixe vertical entre losango e erro.
    b.link(`back-err-${i}`, errId, sid, {
      sourceHandle: "bottom",
      targetHandle: "right-target",
      label: "corrigir",
      variant: "error",
    });
    b.link(`back-ok-${i}`, okId, "hub", {
      sourceHandle: "left-source",
      targetHandle: "bottom-target",
      label: "voltar",
      variant: "success",
    });
  });

  b.add("end", "Fim", X.main - 420, sectionY + ROW * 3 + 120, "end", "end", "Sai das configurações");
  b.link("hub-end", "hub", "end", {
    sourceHandle: "left-source",
    targetHandle: "top",
    label: "sair",
  });

  return graph(block, b);
}

function buildCrudFlow(block: BuildingBlock): ApplicationFlowGraph {
  const b = createBuilder(block.id);
  const z = zoneForBlock(block);
  const pages = block.pages?.length ? block.pages : ["Lista", "Novo", "Editar", "Detalhe"];

  b.add("start", "Início", X.main, 0, "start", "start");
  b.add("list", pages[0] || "Lista", X.main, ROW, "screen", z, "Listagem");
  b.add("choose", "Qual ação?", X.main, ROW * 2, "decision", z);

  b.add("create", pages[1] || "Novo", X.left, ROW * 3, "screen", z);
  b.add("edit", pages[2] || "Editar", X.main, ROW * 3, "screen", z);
  b.add("detail", pages[3] || "Detalhe", X.err, ROW * 3, "screen", z);

  b.add("save", "Salvar ok?", X.main, ROW * 4, "decision", z);
  b.add("ok", "Registro salvo", X.main, ROW * 5, "status", z);
  b.add("err", "Erro ao salvar", X.err, ROW * 4, "status", z);
  b.add("end", "Fim", X.main, ROW * 6, "end", "end");

  b.link("e1", "start", "list", { sourceHandle: "bottom", targetHandle: "top" });
  b.link("e2", "list", "choose", { sourceHandle: "bottom", targetHandle: "top", label: "ação" });
  b.link("e3", "choose", "create", {
    sourceHandle: "left-source",
    targetHandle: "top",
    label: "novo",
    variant: "branch",
  });
  b.link("e4", "choose", "edit", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "editar",
    variant: "branch",
  });
  b.link("e5", "choose", "detail", {
    sourceHandle: "right",
    targetHandle: "top",
    label: "ver",
    variant: "branch",
  });
  b.link("e6", "create", "save", { sourceHandle: "bottom", targetHandle: "left", label: "salvar" });
  b.link("e7", "edit", "save", { sourceHandle: "bottom", targetHandle: "top", label: "salvar" });
  b.link("e8", "detail", "list", {
    sourceHandle: "bottom",
    targetHandle: "right-target",
    label: "voltar",
  });
  b.link("e9", "save", "ok", {
    sourceHandle: "bottom",
    targetHandle: "top",
    label: "sim",
    variant: "success",
  });
  b.link("e10", "ok", "list", {
    sourceHandle: "left-source",
    targetHandle: "bottom-target",
    label: "voltar à lista",
    variant: "success",
  });
  b.link("e11", "ok", "end", {
    sourceHandle: "bottom",
    targetHandle: "top",
    variant: "success",
  });
  b.link("e12", "save", "err", {
    sourceHandle: "right",
    targetHandle: "left",
    label: "não",
    variant: "error",
  });
  b.link("e13", "err", "edit", {
    sourceHandle: "top-source",
    targetHandle: "right-target",
    label: "corrigir",
    variant: "error",
  });

  return graph(block, b);
}

/**
 * Fluxo vertical genérico: tela → decisão → próxima tela (sim)
 * ou status de erro à direita (não) voltando para a mesma tela.
 */
function buildGenericBranchingFlow(block: BuildingBlock): ApplicationFlowGraph {
  const b = createBuilder(block.id);
  const z = zoneForBlock(block);
  const screens = (block.pages || []).map((p) => p.trim()).filter(Boolean);
  const steps =
    screens.length > 0
      ? screens
      : block.includes.filter((i) => /tela|página|lista|form|login|cadastro|config/i.test(i)).slice(0, 5);
  const list = steps.length > 0 ? steps : [block.name];

  b.add("start", "Início", X.main, 0, "start", "start", block.category_name);

  list.forEach((screen, index) => {
    const y = ROW + index * (ROW * 2);
    const sid = `s${index}`;
    const did = `d${index}`;
    const errId = `err${index}`;

    b.add(sid, screen, X.main, y, "screen", z, `Tela da jornada`);

    if (index === 0) {
      b.link(`start-${sid}`, "start", sid, { sourceHandle: "bottom", targetHandle: "top" });
    } else {
      b.link(`ok-${index}`, `d${index - 1}`, sid, {
        sourceHandle: "bottom",
        targetHandle: "top",
        label: "sim",
        variant: "success",
      });
    }

    if (index < list.length - 1) {
      b.add(did, "Avançar?", X.main, y + ROW, "decision", z, "Próxima tela");
      b.add(errId, "Erro / pendência", X.err, y + ROW, "status", z, "Permanece nesta tela");

      b.link(`s-d-${index}`, sid, did, {
        sourceHandle: "bottom",
        targetHandle: "top",
        label: "continuar",
      });
      b.link(`d-err-${index}`, did, errId, {
        sourceHandle: "right",
        targetHandle: "left",
        label: "não",
        variant: "error",
      });
      b.link(`err-back-${index}`, errId, sid, {
        sourceHandle: "top-source",
        targetHandle: "right-target",
        label: "voltar",
        variant: "error",
      });
    } else {
      b.add("end", "Fim", X.main, y + ROW, "end", "end");
      b.link(`last-end`, sid, "end", {
        sourceHandle: "bottom",
        targetHandle: "top",
        label: "concluir",
        variant: "success",
      });
    }
  });

  return graph(block, b);
}

function pickBuilder(block: BuildingBlock): ApplicationFlowGraph {
  const id = block.id.toLowerCase();

  if (id === "auth_basic_login" || id === "auth_social_login") return buildLoginFlow(block);
  if (id === "auth_forgot_password") return buildForgotPasswordFlow(block);
  if (id === "auth_user_signup" || id === "auth_email_confirmation") return buildSignupFlow(block);
  if (
    id === "account_settings" ||
    id.includes("settings") ||
    id.includes("preferenc") ||
    id === "user_profile"
  ) {
    return buildSettingsFlow(block);
  }
  if (
    id.includes("crud") ||
    id === "user_management" ||
    id === "cms_simple" ||
    id === "form_complex" ||
    id === "member_invite" ||
    id === "multi_organization"
  ) {
    return buildCrudFlow(block);
  }

  return buildGenericBranchingFlow(block);
}

/** Fluxograma vertical do Building Block: telas, decisões, status e retornos. */
export function generateApplicationFlowFromBuildingBlock(block: BuildingBlock): ApplicationFlowGraph {
  return pickBuilder(block);
}
