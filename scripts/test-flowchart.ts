import assert from "node:assert/strict";
import {
  buildProjectFlowchartCode,
  generateDefaultProjectFlow,
} from "../src/lib/project-flow";

const flow = generateDefaultProjectFlow({
  projectName: "Central Gospel",
  modules: [
    { id: "1", name: "Base do ecossistema", moduleName: "Core da Plataforma", quantity: 1 },
    { id: "2", name: "Leads (CRM)", moduleName: "Cadastro de Entidade", quantity: 1 },
    { id: "3", name: "Integração Bling", moduleName: "Conector API Externa", quantity: 1 },
  ],
});

assert.ok(flow.nodes.some((n) => n.id === "platform" || n.label.includes("Base")));
assert.ok(flow.nodes.some((n) => n.label.includes("Leads")));
assert.match(buildProjectFlowchartCode(flow), /end=>end:/);

console.log("✅ Testes do fluxo de projeto passaram");
