import { describe, expect, it } from "vitest";
import type { BriefingInterpretationResult } from "@/types/building-blocks";
import {
  generateApplicationFlowFromBlocks,
  isPublicMarketingSite,
} from "./generate-from-blocks";

function emptyInterpretation(
  overrides: Partial<BriefingInterpretationResult> = {}
): BriefingInterpretationResult {
  return {
    summary: "resumo",
    explicitlyRequested: [],
    likelyNeeded: [],
    optional: [],
    needsConfirmation: [],
    outOfScopeRisks: [],
    commercialQuestions: [],
    notesForSalesTeam: [],
    ...overrides,
  };
}

describe("generateApplicationFlowFromBlocks", () => {
  it("gera grafo SaaS com login antes do dashboard", () => {
    const flow = generateApplicationFlowFromBlocks(
      emptyInterpretation({
        explicitlyRequested: [
          {
            blockId: "auth_basic_login",
            blockName: "Login básico",
            categoryId: "authentication",
          },
          {
            blockId: "dashboard_charts",
            blockName: "Dashboard",
            categoryId: "dashboard_analytics",
          },
        ],
      }),
      "Projeto Demo"
    );

    expect(flow.title).toContain("Projeto Demo");
    expect(flow.nodes.some((n) => n.id === "start")).toBe(true);
    expect(flow.nodes.some((n) => n.data.label === "Login básico")).toBe(true);
    expect(flow.nodes.some((n) => n.data.label === "Dashboard")).toBe(true);

    const loginId = flow.nodes.find((n) => n.data.blockId === "auth_basic_login")?.id;
    const dashId = flow.nodes.find((n) => n.data.blockId === "dashboard_charts")?.id;
    expect(loginId).toBeTruthy();
    expect(dashId).toBeTruthy();
    expect(
      flow.edges.some((e) => e.source === loginId || e.label === "após login")
    ).toBe(true);
  });

  it("site institucional: páginas públicas sem login; CMS no ramo admin", () => {
    const interpretation = emptyInterpretation({
      summary: "Site institucional WordPress da Venn com páginas públicas e CMS.",
      explicitlyRequested: [
        {
          blockId: "site_home",
          blockName: "Página Home institucional",
          categoryId: "landing_institutional",
        },
        {
          blockId: "cms_simple",
          blockName: "CMS simples",
          categoryId: "crud_forms",
        },
        {
          blockId: "lp_benefits",
          blockName: "Seção de benefícios",
          categoryId: "landing_institutional",
        },
        {
          blockId: "blog_news",
          blockName: "Blog / Notícias",
          categoryId: "landing_institutional",
        },
      ],
    });

    const flow = generateApplicationFlowFromBlocks(interpretation, "Venn");

    const homeId = flow.nodes.find((n) => n.data.blockId === "site_home")?.id;
    const benefitsId = flow.nodes.find((n) => n.data.blockId === "lp_benefits")?.id;
    const blogId = flow.nodes.find((n) => n.data.blockId === "blog_news")?.id;
    const cmsId = flow.nodes.find((n) => n.data.blockId === "cms_simple")?.id;

    expect(homeId).toBeTruthy();
    expect(benefitsId).toBeTruthy();
    expect(blogId).toBeTruthy();
    expect(cmsId).toBeTruthy();

    // Páginas públicas saem da home (ou start), não de um login genérico
    expect(
      flow.edges.some((e) => e.target === benefitsId && e.source === homeId && e.label === "navegar")
    ).toBe(true);
    expect(
      flow.edges.some((e) => e.target === blogId && e.source === homeId && e.label === "navegar")
    ).toBe(true);

    // Não deve haver login sintético como portão das páginas públicas
    expect(flow.nodes.some((n) => n.id === "auth_synthetic_login")).toBe(false);

    // CMS vem depois do login admin
    const adminLogin = flow.nodes.find(
      (n) => n.id === "auth_cms_admin_login" || n.data.subtitle?.includes("CMS")
    );
    expect(adminLogin).toBeTruthy();
    expect(
      flow.edges.some((e) => e.target === cmsId && e.source === adminLogin?.id)
    ).toBe(true);

    // Aresta home → admin (não home → login → benefits)
    expect(
      flow.edges.some((e) => e.source === homeId && e.target === adminLogin?.id && e.label === "admin")
    ).toBe(true);
  });
});

describe("isPublicMarketingSite", () => {
  it("detecta site com CMS e home institucional", () => {
    const classified = [
      {
        blockId: "site_home",
        blockName: "Home",
        categoryId: "landing_institutional",
        role: "entry" as const,
      },
      {
        blockId: "cms_simple",
        blockName: "CMS",
        categoryId: "crud_forms",
        role: "cms" as const,
      },
    ];
    expect(
      isPublicMarketingSite(
        classified,
        emptyInterpretation({ summary: "Site WordPress institucional" })
      )
    ).toBe(true);
  });
});
