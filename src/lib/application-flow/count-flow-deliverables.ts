import type { ApplicationFlowGraph } from "@/lib/application-flow/types";

export type FlowDeliverableCounts = {
  telas: number;
  variacoes: number;
  status: number;
  feedbacks: number;
};

const ERROR_STROKE = "#dc2626";

const FEEDBACK_RE =
  /erro|falha|pendência|pendencia|mensagem|feedback|aviso|validação|validacao|genérica|generica/i;

const STATUS_OK_RE =
  /salvo|sucesso|alterada|ok|conclu|registro|confirmad|enviad/i;

/**
 * Contagem efetiva a partir do fluxograma gerado (não só a lista de pages do bloco).
 * - Telas: nós tipo screen
 * - Variações: retornos de erro que voltam para uma tela (estado alternativo)
 * - Status: nós status de sucesso / estado concluído
 * - Feedbacks: nós status de erro, aviso ou mensagem ao usuário
 */
export function countFlowDeliverables(flow: ApplicationFlowGraph): FlowDeliverableCounts {
  const screens = flow.nodes.filter((n) => (n.data.kind ?? "screen") === "screen");
  const screenIds = new Set(screens.map((n) => n.id));

  const statusNodes = flow.nodes.filter((n) => n.data.kind === "status");

  const variacoes = flow.edges.filter(
    (e) => e.style?.stroke === ERROR_STROKE && screenIds.has(e.target)
  ).length;

  let status = 0;
  let feedbacks = 0;

  for (const node of statusNodes) {
    const text = `${node.data.label} ${node.data.subtitle ?? ""}`;
    if (FEEDBACK_RE.test(text)) {
      feedbacks += 1;
    } else if (STATUS_OK_RE.test(text)) {
      status += 1;
    } else {
      // Status genérico sem classificação clara conta como status de processo.
      status += 1;
    }
  }

  return {
    telas: screens.length,
    variacoes,
    status,
    feedbacks,
  };
}
