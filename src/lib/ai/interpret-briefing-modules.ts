import OpenAI from "openai";
import { aiBriefingResponseSchema } from "@/lib/ai/briefing-schema";
import { getCatalogContextForPrompt } from "@/lib/ai/catalog-context";
import { resolveAiBriefing } from "@/lib/ai/resolve-briefing";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada. Adicione ao arquivo .env.");
  }
  return new OpenAI({ apiKey });
}

const SYSTEM_PROMPT = `Você é um estimador de projetos digitais da Matilha Estúdio.
Sua tarefa é interpretar briefings de clientes e mapear o escopo para um catálogo fixo de módulos reutilizáveis.

Regras importantes:
1. Use SOMENTE nomes de módulos exatamente como aparecem no catálogo.
2. Inclua "Core da Plataforma" uma única vez quando o projeto for um sistema/produto digital.
3. Para cadastros distintos (leads, clientes, produtos etc.), use várias instâncias de "Cadastro de Entidade" com instanceLabel descritivo — NÃO multiplique CRUDs como projetos greenfield separados.
4. Integrações externas → instâncias de "Conector API Externa" (uma por sistema).
5. Prefira complexidade MEDIUM; use COMPLEX só com justificativa clara; evite VERY_COMPLEX salvo exceção extrema.
6. Multiplicadores: inclua apenas os claramente aplicáveis (ex.: integracao-legada, lgpd, alta-incerteza).
7. Não invente módulos fora do catálogo.
8. Responda APENAS com JSON válido no schema solicitado, em português nos campos textuais.`;

export async function interpretBriefingModules(briefing: string, instructions?: string) {
  const trimmed = briefing.trim();
  if (trimmed.length < 80) {
    throw new Error("Cole um briefing com pelo menos 80 caracteres para interpretação.");
  }

  const catalog = await getCatalogContextForPrompt();
  const client = getOpenAIClient();

  const userContent = [
    catalog.promptText,
    "",
    "BRIEFING DO CLIENTE:",
    trimmed,
    instructions?.trim() ? `\nINSTRUÇÕES ADICIONAIS:\n${instructions.trim()}` : "",
    "",
    "Retorne JSON com: projectName, clientName (opcional), summary, marginPct (opcional, padrão 30), items[{moduleName, instanceLabel, complexity, reason?}], multiplierSlugs[], disciplinesExcluded[]",
  ].join("\n");

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("A IA não retornou conteúdo. Tente novamente.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new Error("Resposta da IA não é JSON válido. Tente novamente.");
  }

  const parsed = aiBriefingResponseSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error(
      `Interpretação inválida: ${parsed.error.issues.map((i) => i.message).join("; ")}`
    );
  }

  return resolveAiBriefing(parsed.data, catalog);
}
