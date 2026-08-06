import { describe, expect, it } from "vitest";
import {
  formatDifficulty,
  formatSignedPercent,
  SHADOW_STATUS_LABELS,
} from "./shadow-formatters";

describe("formatSignedPercent", () => {
  it("formata com sinal", () => {
    expect(formatSignedPercent(0.2)).toBe("+20%");
    expect(formatSignedPercent(-0.15)).toBe("-15%");
    expect(formatSignedPercent(0)).toBe("0%");
  });
});

describe("formatDifficulty", () => {
  it("traduz dificuldade", () => {
    expect(formatDifficulty("commodity")).toBe("Commodity");
    expect(formatDifficulty("engineering")).toBe("Engenharia");
  });
});

describe("SHADOW_STATUS_LABELS", () => {
  it("tem labels para todos os status", () => {
    expect(SHADOW_STATUS_LABELS.aligned).toBe("Alinhado");
    expect(SHADOW_STATUS_LABELS.divergent).toBe("Divergente");
  });
});
