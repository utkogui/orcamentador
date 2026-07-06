import type { ProductDiscoveryResult } from "@/types/briefing-pipeline";
import { callJsonCompletion } from "@/lib/ai/pipeline/json-completion";
import { parseProductDiscoveryResult } from "@/lib/ai/pipeline/schemas";

const SYSTEM_PROMPT = `Você é um Product Manager sênior da Matilha Estúdio.

Sua tarefa é ler um briefing comercial e produzir uma descoberta de produto estruturada.

Regras:
1. NÃO identifique Building Blocks nesta etapa.
2. NÃO estime preço, horas ou prazo.
3. NÃO simplifique demais projetos grandes — decomponha em grandes módulos de produto.
4. Diferencie claramente MVP, fase futura e itens ambíguos.
5. Liste plataformas (web, mobile, admin, API, etc.), atores e integrações.
6. Capture requisitos técnicos e não funcionais quando mencionados ou claramente implícitos.
7. Responda SOMENTE com JSON válido em português do Brasil.`;

function buildUserPrompt(briefing: string): string {
  return [
    "BRIEFING DO CLIENTE:",
    briefing.trim(),
    "",
    "Retorne JSON com:",
    "summary, productType, problemStatement, platforms[], actors[{name, description?, responsibilities?[]}],",
    "majorModules[{name, description, scope: mvp|future|unclear}], mvpScope[], futureScope[],",
    "technicalRequirements[], integrations[], nonFunctionalRequirements[]",
  ].join("\n");
}

export async function runProductDiscovery(briefing: string): Promise<ProductDiscoveryResult> {
  const raw = await callJsonCompletion({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildUserPrompt(briefing),
  });

  return parseProductDiscoveryResult(raw);
}
