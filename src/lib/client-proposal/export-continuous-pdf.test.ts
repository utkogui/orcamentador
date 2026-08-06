import { describe, expect, it } from "vitest";
import { buildProposalPdfFilename } from "./export-continuous-pdf";

describe("buildProposalPdfFilename", () => {
  it("sanitiza nome do cliente e projeto", () => {
    expect(buildProposalPdfFilename("Central Gospel!", "João & Cia")).toBe(
      "proposta-joao-cia-central-gospel.pdf"
    );
  });

  it("usa fallback cliente quando null", () => {
    expect(buildProposalPdfFilename("Projeto X", null)).toBe(
      "proposta-cliente-projeto-x.pdf"
    );
  });
});
