import type { BriefingInterpretationResult } from "@/types/building-blocks";

function formatBlockList(
  title: string,
  items: BriefingInterpretationResult["explicitlyRequested"]
): string {
  if (items.length === 0) return `${title}\n— Nenhum item identificado.\n`;
  const lines = items.map(
    (item) => `- ${item.blockName} (${item.blockId})${item.reason ? `: ${item.reason}` : ""}`
  );
  return `${title}\n${lines.join("\n")}\n`;
}

export function buildEstimateName(summary: string): string {
  const firstLine = summary.split(/[.!?\n]/)[0]?.trim() ?? summary.trim();
  if (!firstLine) return "Nova estimativa";
  return firstLine.length > 100 ? `${firstLine.slice(0, 97)}...` : firstLine;
}

export function formatInterpretationAsDescription(
  result: BriefingInterpretationResult
): string {
  const sections = [
    "Interpretação IA — Matilha Building Blocks",
    "",
    "RESUMO",
    result.summary,
    "",
    formatBlockList("BUILDING BLOCKS EXPLICITAMENTE PEDIDOS", result.explicitlyRequested),
    formatBlockList("BUILDING BLOCKS PROVAVELMENTE NECESSÁRIOS", result.likelyNeeded),
    formatBlockList("BUILDING BLOCKS OPCIONAIS", result.optional),
  ];

  if (result.needsConfirmation.length > 0) {
    sections.push(
      "PONTOS A CONFIRMAR",
      ...result.needsConfirmation.map((item) => `- ${item.topic}: ${item.reason}`),
      ""
    );
  }

  if (result.outOfScopeRisks.length > 0) {
    sections.push(
      "RISCOS DE ESCOPO",
      ...result.outOfScopeRisks.map(
        (risk) => `- ${risk.title}: ${risk.description}${risk.suggestion ? ` (${risk.suggestion})` : ""}`
      ),
      ""
    );
  }

  if (result.commercialQuestions.length > 0) {
    sections.push(
      "PERGUNTAS COMERCIAIS",
      ...result.commercialQuestions.map((q) => `- ${q.question}`),
      ""
    );
  }

  if (result.notesForSalesTeam.length > 0) {
    sections.push("NOTAS PARA O COMERCIAL", ...result.notesForSalesTeam.map((n) => `- ${n}`), "");
  }

  sections.push(
    "---",
    "Próximo passo: mapear building blocks para módulos do catálogo e ajustar multiplicadores na estimativa."
  );

  return sections.join("\n");
}
