import { describe, expect, it } from "vitest";
import {
  buildProjectFlowchartCode,
  generateDefaultProjectFlow,
  parseProjectFlow,
  serializeProjectFlow,
} from "./project-flow";

describe("generateDefaultProjectFlow", () => {
  it("gera nós a partir dos módulos do projeto", () => {
    const flow = generateDefaultProjectFlow({
      projectName: "Central Gospel",
      modules: [
        { id: "1", name: "Base do ecossistema", moduleName: "Core da Plataforma", quantity: 1 },
        { id: "2", name: "Leads (CRM)", moduleName: "Cadastro de Entidade", quantity: 1 },
        { id: "3", name: "Integração Bling", moduleName: "Conector API Externa", quantity: 1 },
      ],
    });

    expect(flow.nodes.some((n) => n.id === "platform" || n.label.includes("Base"))).toBe(true);
    expect(flow.nodes.some((n) => n.label.includes("Leads"))).toBe(true);
    expect(buildProjectFlowchartCode(flow)).toMatch(/end=>end:/);
  });
});

describe("parseProjectFlow / serializeProjectFlow", () => {
  it("serializa e volta ao mesmo grafo", () => {
    const flow = generateDefaultProjectFlow({
      projectName: "Demo",
      modules: [{ id: "1", name: "Auth", moduleName: "Login", quantity: 1 }],
    });
    const json = serializeProjectFlow(flow);
    const parsed = parseProjectFlow(json);
    expect(parsed).toEqual(flow);
  });

  it("retorna null para JSON inválido ou vazio", () => {
    expect(parseProjectFlow(null)).toBeNull();
    expect(parseProjectFlow("")).toBeNull();
    expect(parseProjectFlow("{not-json")).toBeNull();
    expect(parseProjectFlow(JSON.stringify({ nodes: "x" }))).toBeNull();
  });
});
