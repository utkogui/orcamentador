import { prisma } from "@/lib/prisma";
import { MODULE_LAYER_LABELS } from "@/lib/calculations";

export async function getCatalogContextForPrompt() {
  const [modules, multipliers, disciplines] = await Promise.all([
    prisma.module.findMany({
      include: { disciplineHours: true },
      orderBy: [{ layer: "asc" }, { name: "asc" }],
    }),
    prisma.multiplier.findMany({ orderBy: { name: "asc" } }),
    prisma.discipline.findMany({ orderBy: { name: "asc" } }),
  ]);

  const moduleLines = modules.map((mod) => {
    const tags = mod.tags ? (JSON.parse(mod.tags) as string[]).join(", ") : "";
    const reuse = mod.reuseGroup
      ? ` | reuso: grupo "${mod.reuseGroup}", fator ${mod.reuseFactor} na 2ª+ instância`
      : " | cobrado uma vez";
    return `- "${mod.name}" [${MODULE_LAYER_LABELS[mod.layer]}] — ${mod.description}${reuse}${tags ? ` | tags: ${tags}` : ""}`;
  });

  const multiplierLines = multipliers.map(
    (m) => `- slug: "${m.slug}" — ${m.name} (×${m.factor}, alvo: ${m.target})`
  );

  const disciplineLines = disciplines.map((d) => `- "${d.name}" (R$ ${d.hourlyRate}/h)`);

  return {
    modules,
    multipliers,
    disciplines,
    promptText: [
      "CATÁLOGO DE MÓDULOS (use os nomes EXATAMENTE como listados):",
      ...moduleLines,
      "",
      "MULTIPLICADORES (retorne apenas slugs da lista):",
      ...multiplierLines,
      "",
      "DISCIPLINAS (retorne nomes EXATOS para excluir, se aplicável):",
      ...disciplineLines,
    ].join("\n"),
  };
}
