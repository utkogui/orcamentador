import { describe, expect, it } from "vitest";
import {
  formatProposalDate,
  parseClientProposalContent,
} from "./parse-proposal-content";

const SAMPLE = `RESUMO
Portal de leads com CRM e integração Bling.

BUILDING BLOCKS EXPLICITAMENTE PEDIDOS
- Login básico (auth_basic_login):
- Cadastro de entidade (entity_registry):

BUILDING BLOCKS PROVAVELMENTE NECESSÁRIOS
- Dashboard com gráficos (dashboard_charts)
- Login básico (auth_basic_login):

PONTOS A CONFIRMAR
- Escopo de mobile
`;

describe("parseClientProposalContent", () => {
  it("retorna vazio sem descrição", () => {
    expect(parseClientProposalContent(null)).toEqual({
      summary: null,
      scopeHighlights: [],
    });
  });

  it("extrai resumo e highlights sem ids internos, deduplicando", () => {
    const parsed = parseClientProposalContent(SAMPLE);
    expect(parsed.summary).toContain("Portal de leads");
    expect(parsed.scopeHighlights).toEqual([
      "Login básico",
      "Cadastro de entidade",
      "Dashboard com gráficos",
    ]);
  });
});

describe("formatProposalDate", () => {
  it("formata em pt-BR", () => {
    const formatted = formatProposalDate(new Date(2026, 0, 15));
    expect(formatted).toMatch(/15/);
    expect(formatted).toMatch(/2026/);
  });
});
