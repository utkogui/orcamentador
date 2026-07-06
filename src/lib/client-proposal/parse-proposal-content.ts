export type ClientProposalContent = {
  summary: string | null;
  scopeHighlights: string[];
};

function extractSection(text: string, startMarker: string, endMarkers: string[]): string | null {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return null;

  const contentStart = startIndex + startMarker.length;
  let endIndex = text.length;

  for (const marker of endMarkers) {
    const idx = text.indexOf(marker, contentStart);
    if (idx !== -1) endIndex = Math.min(endIndex, idx);
  }

  const section = text.slice(contentStart, endIndex).trim();
  return section || null;
}

function parseBulletSection(section: string | null): string[] {
  if (!section) return [];

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const raw = line.slice(2).trim();
      const withoutId = raw.replace(/\s*\([a-z0-9_]+\)\s*:?/gi, "").trim();
      return withoutId.replace(/:\s*$/, "").trim();
    })
    .filter(Boolean);
}

/**
 * Extrai conteúdo seguro para o cliente a partir da descrição interna da estimativa.
 */
export function parseClientProposalContent(
  description: string | null | undefined
): ClientProposalContent {
  if (!description) {
    return { summary: null, scopeHighlights: [] };
  }

  const summary = extractSection(description, "RESUMO\n", [
    "\n\nBUILDING BLOCKS",
    "\nPONTOS A CONFIRMAR",
    "\n---",
  ]);

  const explicit = parseBulletSection(
    extractSection(description, "BUILDING BLOCKS EXPLICITAMENTE PEDIDOS\n", [
      "\n\nBUILDING BLOCKS PROVAVELMENTE",
      "\nPONTOS A CONFIRMAR",
      "\n---",
    ])
  );

  const likely = parseBulletSection(
    extractSection(description, "BUILDING BLOCKS PROVAVELMENTE NECESSÁRIOS\n", [
      "\n\nBUILDING BLOCKS OPCIONAIS",
      "\nPONTOS A CONFIRMAR",
      "\n---",
    ])
  );

  const scopeHighlights = Array.from(new Set([...explicit, ...likely]));

  return { summary, scopeHighlights };
}

export function formatProposalDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
