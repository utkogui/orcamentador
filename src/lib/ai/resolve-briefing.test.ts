import { describe, expect, it } from "vitest";
import type { AiBriefingResponse } from "./briefing-schema";
import { resolveAiBriefing } from "./resolve-briefing";

const catalog = {
  modules: [
    {
      id: "m-platform",
      name: "Core da Plataforma",
      layer: "PLATFORM",
      reuseGroup: null as string | null,
      reuseFactor: 1,
    },
    {
      id: "m-entity",
      name: "Cadastro de Entidade",
      layer: "CAPABILITY",
      reuseGroup: "entity-registry",
      reuseFactor: 0.4,
    },
  ],
  multipliers: [{ id: "mul-1", slug: "urgency", name: "Urgência" }],
  disciplines: [{ id: "d-qa", name: "QA" }],
  promptText: "",
};

function ai(overrides: Partial<AiBriefingResponse> = {}): AiBriefingResponse {
  return {
    projectName: "Demo",
    summary: "CRM",
    items: [
      {
        moduleName: "Cadastro de Entidade",
        instanceLabel: "Leads",
        complexity: "MEDIUM",
      },
    ],
    multiplierSlugs: [],
    disciplinesExcluded: [],
    ...overrides,
  };
}

describe("resolveAiBriefing", () => {
  it("mapeia módulos, reuso e warnings", () => {
    const resolved = resolveAiBriefing(
      ai({
        items: [
          {
            moduleName: "Cadastro de Entidade",
            instanceLabel: "Leads",
            complexity: "MEDIUM",
          },
          {
            moduleName: "cadastro de entidade",
            instanceLabel: "Clientes",
            complexity: "SIMPLE",
          },
          {
            moduleName: "Inexistente",
            instanceLabel: "X",
            complexity: "MEDIUM",
          },
        ],
        multiplierSlugs: ["urgency", "fake"],
        disciplinesExcluded: ["QA", "Fantasma"],
      }),
      catalog as never
    );

    expect(resolved.items).toHaveLength(2);
    expect(resolved.items[0]?.instanceIndex).toBe(1);
    expect(resolved.items[1]?.instanceIndex).toBe(2);
    expect(resolved.multiplierIds).toEqual(["mul-1"]);
    expect(resolved.disabledDisciplineIds).toEqual(["d-qa"]);
    expect(resolved.warnings.some((w) => w.includes("Inexistente"))).toBe(true);
    expect(resolved.warnings.some((w) => w.includes("Core da Plataforma"))).toBe(true);
  });

  it("lança se nenhum módulo mapear", () => {
    expect(() =>
      resolveAiBriefing(
        ai({
          items: [
            {
              moduleName: "Não existe",
              instanceLabel: "X",
              complexity: "MEDIUM",
            },
          ],
        }),
        catalog as never
      )
    ).toThrow(/Nenhum módulo válido/);
  });
});
