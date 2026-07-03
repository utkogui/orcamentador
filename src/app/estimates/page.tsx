import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getEstimateCalculation } from "@/lib/estimate-service";
import { formatCurrency } from "@/lib/calculations";
import { deleteEstimate } from "@/app/actions";

export default async function EstimatesPage() {
  const estimates = await prisma.estimate.findMany({
    include: {
      _count: { select: { modules: true, multipliers: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const summaries = await Promise.all(
    estimates.map(async (estimate) => ({
      id: estimate.id,
      result: await getEstimateCalculation(estimate.id),
    }))
  );

  const summaryMap = new Map(summaries.map((s) => [s.id, s.result]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Estimativas</h2>
          <p className="text-muted-foreground">Crie, edite e acompanhe propostas de projeto.</p>
        </div>
        <Button asChild>
          <Link href="/estimates/new">
            <Plus className="h-4 w-4" />
            Nova estimativa
          </Link>
        </Button>
      </div>

      {estimates.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma estimativa cadastrada ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {estimates.map((estimate) => {
            const result = summaryMap.get(estimate.id);
            return (
              <Card key={estimate.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      <Link href={`/estimates/${estimate.id}`} className="hover:underline">
                        {estimate.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {estimate.clientName ? `${estimate.clientName} · ` : ""}
                      {estimate._count.modules} módulo(s) · margem {estimate.marginPct}%
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/estimates/${estimate.id}`}>Editar</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/estimates/${estimate.id}/result`}>Resultado</Link>
                    </Button>
                    <form action={deleteEstimate.bind(null, estimate.id)}>
                      <Button variant="destructive" size="sm" type="submit">
                        Excluir
                      </Button>
                    </form>
                  </div>
                </CardHeader>
                {result && (
                  <CardContent className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{formatCurrency(result.suggestedPrice)} sugerido</Badge>
                    <Badge variant="outline">
                      {formatCurrency(result.commercialMin)} – {formatCurrency(result.commercialMax)}
                    </Badge>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
