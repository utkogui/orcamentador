import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EstimateResultSummary } from "@/components/estimate-result-summary";
import { EstimateFlowchart } from "@/components/estimate-flowchart";
import { prisma } from "@/lib/prisma";
import { getEstimateCalculation } from "@/lib/estimate-service";
import { getEstimateProjectFlow } from "@/lib/estimate-project-flow";
import { buildProjectFlowchartCode } from "@/lib/project-flow";
import { formatCurrency } from "@/lib/calculations";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EstimateResultPage({ params }: Props) {
  const { id } = await params;

  const estimate = await prisma.estimate.findUnique({ where: { id } });
  if (!estimate) notFound();

  const result = await getEstimateCalculation(id);
  if (!result) notFound();

  const projectFlow = await getEstimateProjectFlow(id);
  const flowCode = projectFlow ? buildProjectFlowchartCode(projectFlow) : "";

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-gradient-to-br from-orange-50 to-white p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Resultado</p>
        <h2 className="mt-2 text-3xl font-bold">{estimate.name}</h2>
        <p className="mt-2 text-muted-foreground">
          {estimate.clientName ? `Cliente: ${estimate.clientName}` : "Proposta interna"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Preço sugerido</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(result.suggestedPrice)}</p>
          </div>
          <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Faixa comercial</p>
            <p className="text-xl font-semibold">
              {formatCurrency(result.commercialMin)} – {formatCurrency(result.commercialMax)}
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/estimates/${id}`}>Editar estimativa</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/estimates">Voltar à lista</Link>
          </Button>
        </div>
      </div>

      {flowCode && (
        <EstimateFlowchart
          code={flowCode}
          title="Fluxo do projeto"
          description="Jornada do usuário para apresentação ao cliente"
        />
      )}

      <EstimateResultSummary result={result} />
    </div>
  );
}
