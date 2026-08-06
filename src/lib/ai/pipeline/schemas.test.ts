import { describe, expect, it } from "vitest";
import {
  architectureAiResponseSchema,
  parseCommercialDiscoveryResult,
  parseEstimationPreparationResult,
  parseExpandedBuildingBlocksResult,
  productDiscoveryResultSchema,
} from "./schemas";

describe("productDiscoveryResultSchema", () => {
  it("aceita discovery mínimo", () => {
    const parsed = productDiscoveryResultSchema.parse({
      summary: "SaaS de conteúdo",
      productType: "saas",
      problemStatement: "Publicar conteúdo",
    });
    expect(parsed.platforms).toEqual([]);
    expect(parsed.mvpScope).toEqual([]);
  });
});

describe("architectureAiResponseSchema", () => {
  it("exige ao menos um módulo", () => {
    expect(() =>
      architectureAiResponseSchema.parse({ summary: "ok", modules: [] })
    ).toThrow();

    const parsed = architectureAiResponseSchema.parse({
      summary: "Arquitetura",
      modules: [
        {
          name: "Auth",
          description: "Login",
          parentMajorModule: "Acesso",
          platform: "web",
          businessPurpose: "Entrar",
          complexityHint: "medium",
        },
      ],
    });
    expect(parsed.modules).toHaveLength(1);
  });
});

describe("parsers auxiliares", () => {
  it("parseExpandedBuildingBlocksResult", () => {
    const parsed = parseExpandedBuildingBlocksResult({
      summary: "blocos",
      blocks: [
        {
          blockId: "auth_basic_login",
          blockName: "Login",
          architecturalModuleId: "m1",
          category: "explicit",
        },
      ],
    });
    expect(parsed.blocks).toHaveLength(1);
  });

  it("parseCommercialDiscoveryResult e estimation prep", () => {
    expect(parseCommercialDiscoveryResult({}).ambiguities).toEqual([]);
    expect(parseEstimationPreparationResult({ summary: "ok" }).summary).toBe("ok");
  });
});
