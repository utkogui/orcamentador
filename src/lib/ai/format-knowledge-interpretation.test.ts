import { describe, expect, it } from "vitest";
import type { BriefingInterpretationResult } from "@/types/building-blocks";
import {
  buildEstimateName,
  formatInterpretationAsDescription,
} from "./format-knowledge-interpretation";

const sample: BriefingInterpretationResult = {
  summary: "Portal de leads com CRM integrado ao Bling.",
  explicitlyRequested: [
    { blockId: "auth_basic_login", blockName: "Login básico", reason: "acesso" },
  ],
  likelyNeeded: [],
  optional: [],
  needsConfirmation: [{ topic: "Mobile", reason: "não citado" }],
  outOfScopeRisks: [],
  commercialQuestions: [{ question: "Há app nativo?" }],
  notesForSalesTeam: ["Validar Bling"],
};

describe("buildEstimateName", () => {
  it("usa a primeira frase e corta longo", () => {
    expect(buildEstimateName("Portal de leads. Mais texto")).toBe("Portal de leads");
    expect(buildEstimateName("")).toBe("Nova estimativa");
    expect(buildEstimateName("x".repeat(120)).endsWith("...")).toBe(true);
  });
});

describe("formatInterpretationAsDescription", () => {
  it("monta seções legíveis", () => {
    const text = formatInterpretationAsDescription(sample);
    expect(text).toContain("RESUMO");
    expect(text).toContain("Login básico (auth_basic_login)");
    expect(text).toContain("PONTOS A CONFIRMAR");
    expect(text).toContain("PERGUNTAS COMERCIAIS");
  });
});
