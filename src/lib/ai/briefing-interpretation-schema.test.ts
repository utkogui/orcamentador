import { describe, expect, it } from "vitest";
import { parseBriefingInterpretationResult } from "./briefing-interpretation-schema";

describe("parseBriefingInterpretationResult", () => {
  it("preenche defaults e aceita matches", () => {
    const result = parseBriefingInterpretationResult({
      summary: "Portal de leads",
      explicitlyRequested: [
        { blockId: "auth_basic_login", blockName: "Login", confidence: "high" },
      ],
    });

    expect(result.summary).toBe("Portal de leads");
    expect(result.likelyNeeded).toEqual([]);
    expect(result.notesForSalesTeam).toEqual([]);
    expect(result.explicitlyRequested[0]?.blockId).toBe("auth_basic_login");
  });

  it("lança erro em payload inválido", () => {
    expect(() => parseBriefingInterpretationResult({ summary: "" })).toThrow(
      /Interpretação inválida/
    );
  });
});
