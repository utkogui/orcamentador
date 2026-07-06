import { Complexity } from "@prisma/client";
import { loadAllBuildingBlocks } from "@/lib/matilha-knowledge/loaders/building-blocks-loader";
import { prisma } from "@/lib/prisma";
import type { BriefingBlockMatch, BriefingInterpretationResult } from "@/types/building-blocks";

export type MappedCatalogItem = {
  moduleId: string;
  moduleName: string;
  instanceLabel: string;
  instanceIndex: number;
  complexity: Complexity;
  sourceBlockIds: string[];
};

const CORE_MODULE = "Core da Plataforma";

const BLOCK_MODULE_OVERRIDES: Record<string, string> = {
  billing_subscription: "Vitrine E-commerce",
  invoice_billing: "Vitrine E-commerce",
  payment_gateway: "Vitrine E-commerce",
  commerce_checkout: "Vitrine E-commerce",
  cms_simple: "Cadastro de Entidade",
  site_home: "Cadastro de Entidade",
  institutional_pages: "Cadastro de Entidade",
  dashboard_simple: "Dashboard Comercial",
  dashboard_bi: "Dashboard Comercial",
  dashboard_executive: "Dashboard Comercial",
  ai_chat: "Automação IA — Atendimento",
  ai_classification: "Automação IA — Atendimento",
  transactional_email: "Conector API Externa",
  whatsapp_integration: "Conector API Externa",
  pipeline_leads: "Pipeline Comercial",
  approval_workflow: "Regras Comerciais",
  discount_rules: "Regras Comerciais",
};

const CATEGORY_MODULE_DEFAULT: Record<string, string> = {
  authentication: CORE_MODULE,
  users_permissions: CORE_MODULE,
  saas_essentials: CORE_MODULE,
  dashboard_analytics: "Dashboard Comercial",
  crud_forms: "Cadastro de Entidade",
  files_documents: "Cadastro de Entidade",
  communication: "Conector API Externa",
  reports_exports: "Dashboard Comercial",
  workflow: "Pipeline Comercial",
  integrations: "Conector API Externa",
  ai: "Automação IA — Atendimento",
  landing_institutional: "Cadastro de Entidade",
  finance_payments: "Vitrine E-commerce",
};

function mapBlockComplexity(value?: string): Complexity {
  const normalized = (value ?? "média")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("muito") || normalized.includes("very")) return "VERY_COMPLEX";
  if (normalized.includes("alta") || normalized.includes("high")) return "COMPLEX";
  if (normalized.includes("baixa") || normalized.includes("low") || normalized.includes("simples")) {
    return "SIMPLE";
  }
  return "MEDIUM";
}

function resolveCatalogModuleName(
  match: BriefingBlockMatch,
  blockMap: Map<string, { category_id: string; complexity: string }>
): string {
  if (BLOCK_MODULE_OVERRIDES[match.blockId]) {
    return BLOCK_MODULE_OVERRIDES[match.blockId];
  }

  const block = blockMap.get(match.blockId);
  if (block?.category_id && CATEGORY_MODULE_DEFAULT[block.category_id]) {
    return CATEGORY_MODULE_DEFAULT[block.category_id];
  }

  if (match.categoryId && CATEGORY_MODULE_DEFAULT[match.categoryId]) {
    return CATEGORY_MODULE_DEFAULT[match.categoryId];
  }

  return "Cadastro de Entidade";
}

function dedupeMatches(matches: BriefingBlockMatch[]): BriefingBlockMatch[] {
  const map = new Map<string, BriefingBlockMatch>();
  for (const match of matches) {
    map.set(match.blockId, match);
  }
  return Array.from(map.values());
}

export async function mapKnowledgeInterpretationToCatalog(
  result: BriefingInterpretationResult
): Promise<MappedCatalogItem[]> {
  const knowledge = await loadAllBuildingBlocks();
  const blockMap = new Map(
    knowledge.blocks.map((block) => [
      block.id,
      { category_id: block.category_id, complexity: block.complexity },
    ])
  );

  const catalogModules = await prisma.module.findMany();
  const moduleByName = new Map(catalogModules.map((module) => [module.name, module]));

  const matches = dedupeMatches([...result.explicitlyRequested, ...result.likelyNeeded]);
  if (matches.length === 0) {
    return [];
  }

  type PendingItem = {
    moduleName: string;
    instanceLabel: string;
    complexity: Complexity;
    blockId: string;
  };

  const pending: PendingItem[] = [];
  const coreBlockIds: string[] = [];

  for (const match of matches) {
    const moduleName = resolveCatalogModuleName(match, blockMap);
    const block = blockMap.get(match.blockId);

    if (moduleName === CORE_MODULE) {
      coreBlockIds.push(match.blockId);
      continue;
    }

    pending.push({
      moduleName,
      instanceLabel: match.blockName,
      complexity: mapBlockComplexity(block?.complexity),
      blockId: match.blockId,
    });
  }

  const items: MappedCatalogItem[] = [];

  if (coreBlockIds.length > 0 || pending.length > 0) {
    const coreModule = moduleByName.get(CORE_MODULE);
    if (coreModule) {
      items.push({
        moduleId: coreModule.id,
        moduleName: CORE_MODULE,
        instanceLabel: "Base da plataforma",
        instanceIndex: 1,
        complexity: "MEDIUM",
        sourceBlockIds: coreBlockIds,
      });
    }
  }

  const reuseCounters = new Map<string, number>();

  for (const entry of pending) {
    const catalogModule = moduleByName.get(entry.moduleName);
    if (!catalogModule) continue;

    let instanceIndex = 1;
    if (catalogModule.reuseGroup) {
      const next = (reuseCounters.get(catalogModule.reuseGroup) ?? 0) + 1;
      reuseCounters.set(catalogModule.reuseGroup, next);
      instanceIndex = next;
    }

    items.push({
      moduleId: catalogModule.id,
      moduleName: entry.moduleName,
      instanceLabel: entry.instanceLabel,
      instanceIndex,
      complexity: entry.complexity,
      sourceBlockIds: [entry.blockId],
    });
  }

  return items;
}
