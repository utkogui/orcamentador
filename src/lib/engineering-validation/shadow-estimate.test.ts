import { beforeEach, describe, expect, it, vi } from "vitest";
import { APPLICATION_FLOW_ENGINE } from "@/lib/application-flow/types";
import type { StoredApplicationFlow } from "@/lib/application-flow/types";
import { serializeApplicationFlow } from "@/lib/application-flow/storage";
import {
  classifyShadowStatus,
  extractSourceBlockIds,
  generateShadowEstimate,
  SHADOW_UNAVAILABLE_MESSAGE,
} from "./shadow-estimate";

vi.mock("@/lib/matilha-knowledge/engineering/engineering-loader", () => ({
  estimateEngineeringScopeFromCatalog: vi.fn(),
}));

import { estimateEngineeringScopeFromCatalog } from "@/lib/matilha-knowledge/engineering/engineering-loader";

const mockScope = vi.mocked(estimateEngineeringScopeFromCatalog);

describe("classifyShadowStatus", () => {
  it("classifica aligned até 15%", () => {
    expect(classifyShadowStatus(0)).toBe("aligned");
    expect(classifyShadowStatus(0.15)).toBe("aligned");
    expect(classifyShadowStatus(-0.1)).toBe("aligned");
  });

  it("classifica attention entre 15% e 35%", () => {
    expect(classifyShadowStatus(0.16)).toBe("attention");
    expect(classifyShadowStatus(0.35)).toBe("attention");
    expect(classifyShadowStatus(-0.2)).toBe("attention");
  });

  it("classifica divergent acima de 35%", () => {
    expect(classifyShadowStatus(0.36)).toBe("divergent");
    expect(classifyShadowStatus(-0.5)).toBe("divergent");
  });
});

describe("extractSourceBlockIds", () => {
  it("retorna lista vazia quando não há fluxo", () => {
    expect(extractSourceBlockIds(null)).toEqual([]);
  });

  it("extrai blockIds únicos e ignora nós sem blockId", () => {
    const flow: StoredApplicationFlow = {
      engine: APPLICATION_FLOW_ENGINE,
      version: 1,
      title: "Demo",
      summary: "",
      nodes: [
        {
          id: "a",
          position: { x: 0, y: 0 },
          data: { label: "Login", zone: "auth", blockId: "auth_basic_login" },
        },
        {
          id: "b",
          position: { x: 0, y: 100 },
          data: { label: "Dashboard", zone: "hub", blockId: "dashboard_charts" },
        },
        {
          id: "c",
          position: { x: 0, y: 200 },
          data: { label: "Sintético", zone: "auth" },
        },
        {
          id: "d",
          position: { x: 0, y: 300 },
          data: { label: "Login 2", zone: "auth", blockId: "auth_basic_login" },
        },
      ],
      edges: [],
    };

    expect(extractSourceBlockIds(flow)).toEqual(["auth_basic_login", "dashboard_charts"]);
  });
});

describe("generateShadowEstimate", () => {
  beforeEach(() => {
    mockScope.mockReset();
  });

  it("retorna indisponível sem building blocks no fluxo", async () => {
    const result = await generateShadowEstimate({
      officialPrice: 100_000,
      officialHours: 200,
      marginPct: 30,
      projectFlowJson: null,
    });
    expect(result).toEqual({
      available: false,
      reason: SHADOW_UNAVAILABLE_MESSAGE,
    });
    expect(mockScope).not.toHaveBeenCalled();
  });

  it("compara preço/horas e classifica status", async () => {
    const flowJson = serializeApplicationFlow({
      engine: APPLICATION_FLOW_ENGINE,
      version: 1,
      title: "Demo",
      summary: "",
      nodes: [
        {
          id: "a",
          position: { x: 0, y: 0 },
          data: { label: "Login", zone: "auth", blockId: "auth_basic_login" },
        },
      ],
      edges: [],
    });

    mockScope.mockResolvedValue({
      blocks: [
        {
          blockId: "auth_basic_login",
          blockName: "Login",
          difficulty: "commodity",
          addedAsDependency: false,
          baseHours: 20,
          reuseFactor: 1,
          reuseApplied: false,
          hoursAfterReuse: 20,
          appliedModifiers: [],
          modifierFactor: 1,
          hoursAfterModifiers: 20,
          riskFactor: 0,
          riskHours: 0,
          finalHours: 20,
          hoursByDiscipline: { frontend: 20 },
          cost: 4_000,
        },
      ],
      addedDependencyIds: [],
      missingBlockIds: [],
      totalBaseHours: 20,
      totalFinalHours: 20,
      totalCost: 4_000,
      hoursByDiscipline: { frontend: 20 },
    });

    const result = await generateShadowEstimate({
      officialPrice: 5_200,
      officialHours: 20,
      marginPct: 30,
      projectFlowJson: flowJson,
    });

    expect(result.available).toBe(true);
    if (!result.available) return;
    // engineeringPrice = 4000 * 1.3 = 5200 → aligned
    expect(result.status).toBe("aligned");
    expect(result.price.engineering).toBeCloseTo(5_200);
    expect(result.hours.engineering).toBe(20);
    expect(result.sourceBlockIds).toEqual(["auth_basic_login"]);
  });
});
