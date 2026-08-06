import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EstimateResultSummary } from "@/components/estimate-result-summary";
import { EstimateStickyPreview } from "@/components/estimate-sticky-preview";
import { EstimateClientPricePanel } from "@/components/estimate-client-price-panel";
import { ApplicationStructureSection } from "@/components/application-structure-section";
import { ProjectFlowSection } from "@/components/project-flow-section";
import { DisciplineToggleList } from "@/components/discipline-toggle-list";
import { MultiplierToggleList } from "@/components/multiplier-toggle-list";
import { prisma } from "@/lib/prisma";
import { getEstimateCalculation, syncEstimateDisciplines } from "@/lib/estimate-service";
import { getEstimateProjectFlow } from "@/lib/estimate-project-flow";
import { parseApplicationFlow } from "@/lib/application-flow/storage";
import { COMPLEXITY_LABELS, MODULE_LAYER_LABELS } from "@/lib/calculations";
import {
  addEstimateModule,
  deleteEstimate,
  removeEstimateModule,
  updateEstimate,
} from "@/app/actions";
import { ShareEstimateButton } from "@/components/share-estimate-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EstimateDetailPage({ params }: Props) {
  const { id } = await params;

  const estimate = await prisma.estimate.findUnique({
    where: { id },
    include: {
      modules: {
        include: { module: true },
        orderBy: [{ instanceIndex: "asc" }, { module: { name: "asc" } }],
      },
      multipliers: {
        include: { multiplier: true },
      },
    },
  });

  if (!estimate) notFound();

  await syncEstimateDisciplines(id);

  const catalogModules = await prisma.module.findMany({ orderBy: { name: "asc" } });
  const allMultipliers = await prisma.multiplier.findMany({ orderBy: { name: "asc" } });
  const allDisciplines = await prisma.discipline.findMany({ orderBy: { name: "asc" } });
  const estimateDisciplines = await prisma.estimateDiscipline.findMany({
    where: { estimateId: id },
  });
  const enabledMultiplierMap = new Map(
    estimate.multipliers.map((em) => [em.multiplierId, em.enabled])
  );
  const enabledDisciplineMap = new Map(
    estimateDisciplines.map((ed) => [ed.disciplineId, ed.enabled])
  );
  const result = await getEstimateCalculation(id);
  const applicationFlow = parseApplicationFlow(estimate.projectFlowJson);
  const projectFlow = applicationFlow ? null : await getEstimateProjectFlow(id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{estimate.name}</h2>
          <p className="text-muted-foreground">
            {estimate.clientName ?? "Sem cliente"} · edite módulos, multiplicadores e margem
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShareEstimateButton estimateId={id} />
          <Button variant="outline" asChild>
            <Link href={`/p/${id}`}>Abrir link do comercial</Link>
          </Button>
          {estimate.clientProposalPrice != null && (
            <Button variant="outline" asChild>
              <Link href={`/estimates/${id}/result`}>Ver proposta salva</Link>
            </Button>
          )}
          <form action={deleteEstimate.bind(null, id)}>
            <Button variant="destructive" type="submit">
              Excluir
            </Button>
          </form>
        </div>
      </div>

      {result && <EstimateStickyPreview result={result} />}

      {result && (
        <EstimateClientPricePanel
          estimateId={id}
          suggestedPrice={result.suggestedPrice}
          commercialMin={result.commercialMin}
          commercialMax={result.commercialMax}
          savedMode={estimate.clientProposalPriceMode}
          savedPrice={estimate.clientProposalPrice}
        />
      )}

      {applicationFlow && <ApplicationStructureSection flow={applicationFlow} />}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateEstimate.bind(null, id)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" defaultValue={estimate.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Cliente</Label>
                <Input id="clientName" name="clientName" defaultValue={estimate.clientName ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={estimate.description ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginPct">Margem (%)</Label>
                <Input
                  id="marginPct"
                  name="marginPct"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={estimate.marginPct}
                />
              </div>
              <Button type="submit">Salvar dados</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar módulo</CardTitle>
            <CardDescription>Selecione do catálogo e defina complexidade</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={addEstimateModule.bind(null, id)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="moduleId">Módulo</Label>
                <select
                  id="moduleId"
                  name="moduleId"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {catalogModules.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      [{MODULE_LAYER_LABELS[mod.layer]}] {mod.name}
                      {mod.reuseGroup ? ` · reuso ${Math.round(mod.reuseFactor * 100)}%` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instanceLabel">Instância / nome no projeto</Label>
                <Input
                  id="instanceLabel"
                  name="instanceLabel"
                  placeholder="Ex.: Leads, Clientes, Integração Bling"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="complexity">Complexidade</Label>
                  <select
                    id="complexity"
                    name="complexity"
                    defaultValue="MEDIUM"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.entries(COMPLEXITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} />
                </div>
              </div>
              <Button type="submit">Adicionar módulo</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulos selecionados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {estimate.modules.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum módulo adicionado.</p>
          ) : (
            estimate.modules.map((em) => (
              <div
                key={em.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {em.instanceLabel ?? em.module.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{em.module.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="outline">{MODULE_LAYER_LABELS[em.module.layer]}</Badge>
                    <Badge variant="outline">{COMPLEXITY_LABELS[em.complexity]}</Badge>
                    {em.module.reuseGroup && (
                      <Badge variant="secondary">
                        Instância {em.instanceIndex}
                        {em.instanceIndex > 1 ? ` · ${Math.round(em.module.reuseFactor * 100)}% reuso` : ""}
                      </Badge>
                    )}
                  </div>
                </div>
                <form action={removeEstimateModule.bind(null, id, em.id)}>
                  <Button variant="outline" size="sm" type="submit">
                    Remover
                  </Button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <DisciplineToggleList
        estimateId={id}
        disciplines={allDisciplines.map((d) => ({
          ...d,
          enabled: enabledDisciplineMap.get(d.id) ?? true,
        }))}
      />

      <MultiplierToggleList
        estimateId={id}
        multipliers={allMultipliers.map((m) => ({
          ...m,
          enabled: enabledMultiplierMap.get(m.id) ?? false,
        }))}
      />

      {projectFlow && <ProjectFlowSection estimateId={id} initialFlow={projectFlow} />}

      {result && (
        <div id="estimate-preview-anchor" className="space-y-4 scroll-mt-4">
          <h3 className="text-xl font-semibold">Prévia do cálculo</h3>
          <EstimateResultSummary result={result} />
        </div>
      )}
    </div>
  );
}
