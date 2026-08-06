import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    estimate: { findUnique: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { getEstimateProjectFlow, buildDefaultProjectFlow } from "./estimate-project-flow";

const findUnique = prisma.estimate.findUnique as ReturnType<typeof vi.fn>;

describe("getEstimateProjectFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna null se não existe", async () => {
    findUnique.mockResolvedValue(null);
    await expect(getEstimateProjectFlow("x")).resolves.toBeNull();
  });

  it("prioriza projectFlowJson salvo", async () => {
    findUnique.mockResolvedValue({
      name: "Demo",
      projectFlowJson: JSON.stringify({
        nodes: [{ id: "n1", type: "process", label: "Salvo" }],
        edges: [],
      }),
      modules: [],
    });

    const flow = await getEstimateProjectFlow("e1");
    expect(flow?.nodes[0]?.label).toBe("Salvo");
  });

  it("gera default quando não há JSON", async () => {
    findUnique.mockResolvedValue({
      name: "Demo",
      projectFlowJson: null,
      modules: [
        {
          id: "em1",
          instanceLabel: "Leads",
          quantity: 1,
          module: { name: "Cadastro", description: null },
        },
      ],
    });

    const flow = await getEstimateProjectFlow("e1");
    expect(flow?.nodes.some((n) => n.label.includes("Leads"))).toBe(true);
  });
});

describe("buildDefaultProjectFlow", () => {
  it("sempre regenera a partir dos módulos", async () => {
    findUnique.mockResolvedValue({
      name: "Demo",
      modules: [
        {
          id: "em1",
          instanceLabel: null,
          quantity: 1,
          module: { name: "Login", description: "auth" },
        },
      ],
    });

    const flow = await buildDefaultProjectFlow("e1");
    expect(flow?.nodes.some((n) => n.label.includes("Login"))).toBe(true);
  });
});
