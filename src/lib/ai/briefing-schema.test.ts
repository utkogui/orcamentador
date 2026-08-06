import { describe, expect, it } from "vitest";
import { aiBriefingResponseSchema } from "./briefing-schema";

describe("aiBriefingResponseSchema", () => {
  it("aceita payload mínimo válido", () => {
    const parsed = aiBriefingResponseSchema.parse({
      projectName: "Portal",
      summary: "CRM simples",
      items: [
        {
          moduleName: "Login",
          instanceLabel: "Auth",
          complexity: "MEDIUM",
        },
      ],
      multiplierSlugs: null,
      disciplinesExcluded: null,
    });

    expect(parsed.multiplierSlugs).toEqual([]);
    expect(parsed.disciplinesExcluded).toEqual([]);
    expect(parsed.clientName).toBeUndefined();
  });

  it("rejeita sem items", () => {
    expect(() =>
      aiBriefingResponseSchema.parse({
        projectName: "X",
        summary: "Y",
        items: [],
      })
    ).toThrow();
  });
});
