import type {
  ArchitectureResult,
  ProductDiscoveryResult,
} from "@/types/briefing-pipeline";
import { callJsonCompletion } from "@/lib/ai/pipeline/json-completion";
import {
  architectureAiResponseSchema,
  architectureResultSchema,
} from "@/lib/ai/pipeline/schemas";

const SYSTEM_PROMPT = `Você é um Arquiteto de Software sênior da Matilha Estúdio.

Sua tarefa é receber uma descoberta de produto (ProductDiscoveryResult) e decompor cada majorModule em módulos arquiteturais concretos.

Regras obrigatórias:
1. NÃO use Building Blocks nesta etapa.
2. NÃO estime horas, preço ou prazo.
3. NÃO simplifique demais — expanda módulos grandes em dezenas de capacidades arquiteturais quando fizer sentido.
4. Cada majorModule deve gerar VÁRIOS módulos arquiteturais específicos (não apenas 1 item genérico).
5. Inclua fluxos implícitos comuns (auth, admin, relatórios, notificações, permissões) quando aplicáveis ao módulo.
6. Respeite MVP vs fase futura do discovery — marque módulos futuros nas assumptions ou openQuestions se necessário.
7. platform deve indicar onde o módulo vive: web, mobile, admin, api, backend, multiplataforma, etc.
8. Responda SOMENTE JSON válido em português do Brasil.

Exemplos de decomposição esperada:

Marketplace → catálogo de produtos, categorias, carrinho, checkout, pedidos, estoque, pagamentos, cupons, relatórios financeiros, área administrativa da loja

Portal institucional → home, páginas institucionais, destinos, rotas, agenda de eventos, notícias, conteúdo multimídia, busca, SEO, CMS

Aplicativo mobile → onboarding, login/cadastro, perfil, consulta de destinos, passaporte digital, notificações, loja, geolocalização

Painel administrativo → dashboard, gestão de usuários, permissões, gestão de conteúdo, aprovação de conteúdo, gestão de parceiros, relatórios, analytics

Passaporte digital → registro de visitas, histórico do peregrino, validação por responsável, QR Code, geolocalização, check-in, comprovante digital`;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "");
}

function buildUserPrompt(discovery: ProductDiscoveryResult): string {
  return [
    "PRODUCT DISCOVERY RESULT (JSON):",
    JSON.stringify(discovery, null, 2),
    "",
    "Decomponha cada majorModule em módulos arquiteturais.",
    "",
    "Retorne JSON com:",
    "summary,",
    "modules[{",
    "  name,",
    "  description,",
    "  parentMajorModule,",
    "  platform,",
    "  businessPurpose,",
    "  functionalAreas[],",
    "  complexityHint: low|medium|high|very_high,",
    "  assumptions[],",
    "  openQuestions[]",
    "}]",
  ].join("\n");
}

function normalizeArchitectureResult(
  raw: ReturnType<typeof architectureAiResponseSchema.parse>
): ArchitectureResult {
  const usedIds = new Set<string>();

  const modules = raw.modules.map((module, index) => {
    const baseId = slugify(`${module.parentMajorModule}_${module.name}`) || `arch_${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${baseId}_${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);

    return {
      id,
      name: module.name,
      description: module.description,
      parentMajorModule: module.parentMajorModule,
      platform: module.platform,
      businessPurpose: module.businessPurpose,
      functionalAreas: module.functionalAreas,
      complexityHint: module.complexityHint,
      assumptions: module.assumptions,
      openQuestions: module.openQuestions,
      sourceMajorModule: module.parentMajorModule,
    };
  });

  return { summary: raw.summary, modules };
}

export async function runSoftwareArchitecture(
  discovery: ProductDiscoveryResult
): Promise<ArchitectureResult> {
  if (discovery.majorModules.length === 0) {
    throw new Error("Software Architecture: nenhum majorModule encontrado no Product Discovery.");
  }

  const raw = await callJsonCompletion({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildUserPrompt(discovery),
  });

  const aiParsed = architectureAiResponseSchema.safeParse(raw);
  if (!aiParsed.success) {
    throw new Error(
      `Software Architecture: ${aiParsed.error.issues.map((issue) => issue.message).join("; ")}`
    );
  }

  const normalized = normalizeArchitectureResult(aiParsed.data);

  const finalParsed = architectureResultSchema.safeParse(normalized);
  if (!finalParsed.success) {
    throw new Error(
      `Software Architecture: ${finalParsed.error.issues.map((issue) => issue.message).join("; ")}`
    );
  }

  return finalParsed.data;
}
