import { describe, expect, it } from "vitest";
import {
  getClientPriceModeLabel,
  resolveClientProposalPrice,
} from "./client-price";

const prices = {
  suggestedPrice: 100_000,
  commercialMin: 90_000,
  commercialMax: 110_000,
};

describe("resolveClientProposalPrice", () => {
  it("resolve modes pré-definidos", () => {
    expect(resolveClientProposalPrice("suggested", null, prices)).toBe(100_000);
    expect(resolveClientProposalPrice("commercial_min", null, prices)).toBe(90_000);
    expect(resolveClientProposalPrice("commercial_max", null, prices)).toBe(110_000);
  });

  it("aceita custom válido", () => {
    expect(resolveClientProposalPrice("custom", 95_000, prices)).toBe(95_000);
  });

  it("rejeita custom inválido", () => {
    expect(() => resolveClientProposalPrice("custom", null, prices)).toThrow(
      /valor válido/
    );
    expect(() => resolveClientProposalPrice("custom", 0, prices)).toThrow(/valor válido/);
    expect(() => resolveClientProposalPrice("custom", NaN, prices)).toThrow(/valor válido/);
  });
});

describe("getClientPriceModeLabel", () => {
  it("traduz modes conhecidos e fallback", () => {
    expect(getClientPriceModeLabel("suggested")).toBe("Preço sugerido");
    expect(getClientPriceModeLabel(null)).toBe("Não definido");
    expect(getClientPriceModeLabel("outro")).toBe("outro");
  });
});
