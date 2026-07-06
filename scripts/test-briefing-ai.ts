/**
 * Teste manual: interpretação IA do briefing Central Gospel
 * Uso: npm run test:briefing-ai
 */
import { execSync } from "child_process";
import { interpretBriefingModules } from "../src/lib/ai/interpret-briefing-modules";
import { previewBriefingEstimate } from "../src/lib/ai/preview-briefing";
import { getEstimateCalculation } from "../src/lib/estimate-service";
import { COMPLEXITY_LABELS, formatCurrency } from "../src/lib/calculations";
import { prisma } from "../src/lib/prisma";

function extractBriefingFromDocx(path: string): string {
  const py = `
import zipfile, xml.etree.ElementTree as ET
path = ${JSON.stringify(path)}
with zipfile.ZipFile(path) as z:
    xml = z.read("word/document.xml")
root = ET.fromstring(xml)
ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
paras = []
for p in root.findall(".//w:p", ns):
    texts = [t.text for t in p.findall(".//w:t", ns) if t.text]
    if texts:
        paras.append("".join(texts))
print("\\n".join(paras))
`.trim();
  return execSync(`python3 - <<'PY'\n${py}\nPY`, { encoding: "utf8" }).trim();
}

async function main() {
  const docxPath = "/Users/guiutko/Downloads/Biefing - Central Gospel.docx";
  console.log("📄 Extraindo briefing...");
  const briefing = extractBriefingFromDocx(docxPath);
  console.log(`   ${briefing.length} caracteres\n`);

  console.log("🤖 Chamando GPT-4o-mini...");
  const start = Date.now();
  const resolved = await interpretBriefingModules(
    briefing,
    "Mapeie como plataforma com reuso entre cadastros. Evite VERY_COMPLEX sem necessidade. Margem 30%."
  );
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`   Resposta em ${elapsed}s\n`);

  console.log("📋 Interpretação");
  console.log(`   Projeto: ${resolved.projectName}`);
  console.log(`   Cliente: ${resolved.clientName ?? "—"}`);
  console.log(`   Margem: ${resolved.marginPct}%`);
  console.log(`   Resumo: ${resolved.summary.slice(0, 200)}...\n`);

  if (resolved.warnings.length) {
    console.log("⚠️  Avisos:");
    resolved.warnings.forEach((w) => console.log(`   - ${w}`));
    console.log();
  }

  console.log(`📦 Módulos sugeridos (${resolved.items.length}):`);
  for (const item of resolved.items) {
    console.log(
      `   • ${item.moduleName} — "${item.instanceLabel}" [${COMPLEXITY_LABELS[item.complexity]}${item.instanceIndex > 1 ? `, inst.${item.instanceIndex}` : ""}]`
    );
  }
  console.log();

  const preview = await previewBriefingEstimate(resolved);
  console.log("💰 Prévia calculada (IA)");
  console.log(`   Horas: ${preview.totalAdjustedHours.toFixed(0)} h`);
  console.log(`   Custo: ${formatCurrency(preview.totalAdjustedCost)}`);
  console.log(`   Preço sugerido: ${formatCurrency(preview.suggestedPrice)}`);
  console.log(
    `   Faixa: ${formatCurrency(preview.commercialMin)} – ${formatCurrency(preview.commercialMax)}`
  );
  console.log(
    `   Reuso: ${preview.reuseSavingsHours.toFixed(0)} h (${formatCurrency(preview.reuseSavingsCost)})`
  );
  console.log();

  const reference = await prisma.estimate.findFirst({
    where: { clientName: "Central Gospel" },
    orderBy: { createdAt: "desc" },
  });

  if (reference) {
    const refCalc = await getEstimateCalculation(reference.id);
    if (refCalc) {
      console.log("📊 Referência calibrada (seed)");
      console.log(`   ID: ${reference.id}`);
      console.log(`   Horas: ${refCalc.totalAdjustedHours.toFixed(0)} h`);
      console.log(`   Preço: ${formatCurrency(refCalc.suggestedPrice)}`);
      console.log(
        `   Faixa: ${formatCurrency(refCalc.commercialMin)} – ${formatCurrency(refCalc.commercialMax)}`
      );
      console.log();

      const hoursDiff = preview.totalAdjustedHours - refCalc.totalAdjustedHours;
      const priceDiffPct =
        ((preview.suggestedPrice - refCalc.suggestedPrice) / refCalc.suggestedPrice) * 100;
      console.log("📈 Comparativo IA vs referência");
      console.log(`   Δ horas: ${hoursDiff > 0 ? "+" : ""}${hoursDiff.toFixed(0)} h`);
      console.log(`   Δ preço: ${priceDiffPct > 0 ? "+" : ""}${priceDiffPct.toFixed(1)}%`);
    }
  }
}

main()
  .catch((err) => {
    console.error("❌ Erro:", err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
