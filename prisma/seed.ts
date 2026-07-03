import { Complexity, ModuleLayer, MultiplierTarget, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ModuleSeed = {
  name: string;
  description: string;
  layer: ModuleLayer;
  reuseGroup?: string;
  reuseFactor?: number;
  tags?: string[];
  hours: Record<string, number>;
};

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.estimateDiscipline.deleteMany();
  await prisma.estimateMultiplier.deleteMany();
  await prisma.estimateModule.deleteMany();
  await prisma.estimate.deleteMany();
  await prisma.moduleDisciplineHour.deleteMany();
  await prisma.module.deleteMany();
  await prisma.multiplier.deleteMany();
  await prisma.discipline.deleteMany();

  const disciplines = await Promise.all([
    prisma.discipline.create({
      data: { name: "UX/UI Design", hourlyRate: 180, description: "Pesquisa, wireframes e interface" },
    }),
    prisma.discipline.create({
      data: { name: "Frontend", hourlyRate: 200, description: "Desenvolvimento de interface" },
    }),
    prisma.discipline.create({
      data: { name: "Backend", hourlyRate: 220, description: "APIs, regras de negócio e integrações" },
    }),
    prisma.discipline.create({
      data: { name: "QA", hourlyRate: 150, description: "Testes funcionais e regressão" },
    }),
    prisma.discipline.create({
      data: { name: "Gestão de Projeto", hourlyRate: 170, description: "Planejamento, rituais e acompanhamento" },
    }),
  ]);

  const [ux, frontend, backend, qa, pm] = disciplines;

  const multipliers = await Promise.all([
    prisma.multiplier.create({
      data: {
        name: "Prazo curto",
        slug: "prazo-curto",
        description: "Entrega acelerada com equipe dedicada",
        factor: 1.25,
        target: MultiplierTarget.HOURS,
      },
    }),
    prisma.multiplier.create({
      data: {
        name: "Cliente enterprise",
        slug: "cliente-enterprise",
        description: "Governança, alinhamentos e stakeholders extras",
        factor: 1.15,
        target: MultiplierTarget.COST,
      },
    }),
    prisma.multiplier.create({
      data: {
        name: "Integração legada",
        slug: "integracao-legada",
        description: "Sistemas antigos ou documentação limitada",
        factor: 1.25,
        target: MultiplierTarget.HOURS,
      },
    }),
    prisma.multiplier.create({
      data: {
        name: "LGPD",
        slug: "lgpd",
        description: "Requisitos de privacidade e conformidade",
        factor: 1.1,
        target: MultiplierTarget.COST,
      },
    }),
    prisma.multiplier.create({
      data: {
        name: "Alta incerteza",
        slug: "alta-incerteza",
        description: "Escopo ou requisitos ainda em definição",
        factor: 1.15,
        target: MultiplierTarget.HOURS,
      },
    }),
    prisma.multiplier.create({
      data: {
        name: "Multiempresa",
        slug: "multiempresa",
        description: "Múltiplas unidades de negócio ou tenants",
        factor: 1.2,
        target: MultiplierTarget.HOURS,
      },
    }),
  ]);

  const moduleTemplates: ModuleSeed[] = [
    {
      name: "Core da Plataforma",
      description: "Auth, perfis, layout, design system e motor base de entidades",
      layer: ModuleLayer.PLATFORM,
      tags: ["plataforma", "auth", "base"],
      hours: { [ux.id]: 40, [frontend.id]: 48, [backend.id]: 80, [qa.id]: 24, [pm.id]: 16 },
    },
    {
      name: "Cadastro de Entidade",
      description: "Instância configurável do motor de cadastro (listagem, filtros, detalhe)",
      layer: ModuleLayer.CAPABILITY,
      reuseGroup: "entity-registry",
      reuseFactor: 0.4,
      tags: ["cadastro", "entidade", "crud"],
      hours: { [ux.id]: 6, [frontend.id]: 16, [backend.id]: 14, [qa.id]: 8, [pm.id]: 3 },
    },
    {
      name: "Pipeline Comercial",
      description: "Funil, distribuição de leads e acompanhamento comercial",
      layer: ModuleLayer.CAPABILITY,
      reuseGroup: "pipeline-commercial",
      reuseFactor: 0.5,
      tags: ["crm", "pipeline", "leads"],
      hours: { [ux.id]: 10, [frontend.id]: 20, [backend.id]: 24, [qa.id]: 10, [pm.id]: 4 },
    },
    {
      name: "Dashboard Comercial",
      description: "Painel com indicadores e filtros",
      layer: ModuleLayer.CAPABILITY,
      reuseGroup: "dashboard",
      reuseFactor: 0.45,
      tags: ["dashboard", "metricas"],
      hours: { [ux.id]: 12, [frontend.id]: 24, [backend.id]: 20, [qa.id]: 8, [pm.id]: 4 },
    },
    {
      name: "Conector API Externa",
      description: "Integração bidirecional com sistema terceiro",
      layer: ModuleLayer.INTEGRATION,
      reuseGroup: "integration-connector",
      reuseFactor: 0.45,
      tags: ["integracao", "api", "bling", "whatsapp"],
      hours: { [backend.id]: 32, [frontend.id]: 4, [qa.id]: 12, [pm.id]: 6 },
    },
    {
      name: "Automação IA — Atendimento",
      description: "Primeiro atendimento automatizado e handoff para humano",
      layer: ModuleLayer.CAPABILITY,
      tags: ["ia", "atendimento", "whatsapp"],
      hours: { [backend.id]: 40, [frontend.id]: 8, [qa.id]: 16, [pm.id]: 8 },
    },
    {
      name: "Gestão EBD",
      description: "Acompanhamento de currículo e alertas comerciais para igrejas",
      layer: ModuleLayer.DOMAIN,
      tags: ["ebd", "igrejas", "dominio"],
      hours: { [ux.id]: 16, [frontend.id]: 24, [backend.id]: 32, [qa.id]: 12, [pm.id]: 8 },
    },
    {
      name: "Regras Comerciais",
      description: "Descontos, aprovações e tabelas de preço por perfil de cliente",
      layer: ModuleLayer.DOMAIN,
      tags: ["comercial", "desconto", "aprovacao"],
      hours: { [ux.id]: 8, [frontend.id]: 16, [backend.id]: 28, [qa.id]: 10, [pm.id]: 6 },
    },
    {
      name: "Vitrine E-commerce",
      description: "Catálogo e jornada de compra integrada ao backoffice",
      layer: ModuleLayer.CAPABILITY,
      reuseGroup: "commerce-surface",
      reuseFactor: 0.5,
      tags: ["ecommerce", "catalogo"],
      hours: { [ux.id]: 20, [frontend.id]: 32, [backend.id]: 24, [qa.id]: 10, [pm.id]: 6 },
    },
  ];

  const moduleMap = new Map<string, string>();

  for (const template of moduleTemplates) {
    const mod = await prisma.module.create({
      data: {
        name: template.name,
        description: template.description,
        layer: template.layer,
        reuseGroup: template.reuseGroup,
        reuseFactor: template.reuseFactor ?? 0.4,
        tags: template.tags ? JSON.stringify(template.tags) : null,
      },
    });

    moduleMap.set(template.name, mod.id);

    for (const [disciplineId, baseHours] of Object.entries(template.hours)) {
      await prisma.moduleDisciplineHour.create({
        data: { moduleId: mod.id, disciplineId, baseHours },
      });
    }
  }

  const getModule = (name: string) => {
    const id = moduleMap.get(name);
    if (!id) throw new Error(`Módulo não encontrado: ${name}`);
    return id;
  };

  const centralGospel = await prisma.estimate.create({
    data: {
      name: "Central Gospel — Ecossistema Digital",
      clientName: "Central Gospel",
      description:
        "Reconstrução do ecossistema proprietário (e-commerce, CRM, Gestão EBD, SAC, integrações Bling/WhatsApp/Meta). Estimativa calibrada com base compartilhada e reuso entre cadastros.",
      marginPct: 30,
    },
  });

  const gospelModules: Array<{
    moduleName: string;
    instanceLabel: string;
    instanceIndex: number;
    complexity: Complexity;
  }> = [
    { moduleName: "Core da Plataforma", instanceLabel: "Base do ecossistema", instanceIndex: 1, complexity: "MEDIUM" },
    { moduleName: "Cadastro de Entidade", instanceLabel: "Leads (CRM)", instanceIndex: 1, complexity: "MEDIUM" },
    { moduleName: "Cadastro de Entidade", instanceLabel: "Clientes / Igrejas", instanceIndex: 2, complexity: "MEDIUM" },
    { moduleName: "Cadastro de Entidade", instanceLabel: "Chamados SAC", instanceIndex: 3, complexity: "SIMPLE" },
    { moduleName: "Pipeline Comercial", instanceLabel: "Funil comercial", instanceIndex: 1, complexity: "COMPLEX" },
    { moduleName: "Dashboard Comercial", instanceLabel: "Indicadores de vendas", instanceIndex: 1, complexity: "MEDIUM" },
    { moduleName: "Conector API Externa", instanceLabel: "Integração Bling", instanceIndex: 1, complexity: "COMPLEX" },
    { moduleName: "Conector API Externa", instanceLabel: "WhatsApp / Meta", instanceIndex: 2, complexity: "COMPLEX" },
    { moduleName: "Automação IA — Atendimento", instanceLabel: "Primeiro atendimento", instanceIndex: 1, complexity: "MEDIUM" },
    { moduleName: "Gestão EBD", instanceLabel: "Currículo e alertas", instanceIndex: 1, complexity: "COMPLEX" },
    { moduleName: "Regras Comerciais", instanceLabel: "Descontos e aprovações", instanceIndex: 1, complexity: "COMPLEX" },
    { moduleName: "Vitrine E-commerce", instanceLabel: "Loja online", instanceIndex: 1, complexity: "MEDIUM" },
  ];

  for (const item of gospelModules) {
    await prisma.estimateModule.create({
      data: {
        estimateId: centralGospel.id,
        moduleId: getModule(item.moduleName),
        instanceLabel: item.instanceLabel,
        instanceIndex: item.instanceIndex,
        complexity: item.complexity,
        quantity: 1,
      },
    });
  }

  const enabledSlugs = ["alta-incerteza", "integracao-legada", "lgpd"];
  for (const slug of enabledSlugs) {
    const multiplier = multipliers.find((m) => m.slug === slug);
    if (!multiplier) continue;
    await prisma.estimateMultiplier.create({
      data: { estimateId: centralGospel.id, multiplierId: multiplier.id, enabled: true },
    });
  }

  for (const multiplier of multipliers) {
    if (enabledSlugs.includes(multiplier.slug)) continue;
    await prisma.estimateMultiplier.create({
      data: { estimateId: centralGospel.id, multiplierId: multiplier.id, enabled: false },
    });
  }

  await prisma.estimateDiscipline.createMany({
    data: disciplines.map((discipline) => ({
      estimateId: centralGospel.id,
      disciplineId: discipline.id,
      enabled: true,
    })),
  });

  console.log(
    `✅ Seed concluído: ${disciplines.length} disciplinas, ${moduleTemplates.length} módulos, estimativa Central Gospel (${centralGospel.id})`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
