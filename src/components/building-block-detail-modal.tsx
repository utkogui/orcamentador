"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UmlJourneyDiagram } from "@/components/uml-journey-diagram";
import { countFlowDeliverables } from "@/lib/application-flow/count-flow-deliverables";
import { generateApplicationFlowFromBuildingBlock } from "@/lib/application-flow/generate-from-building-block";
import type { BuildingBlockJourney } from "@/lib/matilha-knowledge/journeys";
import type { BuildingBlock } from "@/types/building-blocks";

type Props = {
  block: BuildingBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journeys?: BuildingBlockJourney[];
  onOpenJourney?: (journeyId: string) => void;
};

export function BuildingBlockDetailModal({
  block,
  open,
  onOpenChange,
  journeys = [],
  onOpenJourney,
}: Props) {
  const flow = useMemo(
    () => (block ? generateApplicationFlowFromBuildingBlock(block) : null),
    [block]
  );

  const counts = useMemo(() => (flow ? countFlowDeliverables(flow) : null), [flow]);

  if (!block || !flow || !counts) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[min(1100px,96vw)] max-w-none overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <Badge variant="outline">{block.category_name}</Badge>
            <span className="font-mono text-xs text-muted-foreground">{block.id}</span>
            <Badge variant="secondary">{block.complexity}</Badge>
          </div>
          <DialogTitle className="text-2xl">{block.name}</DialogTitle>
          <DialogDescription className="text-base">{block.summary}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Diagramas UML da jornada
            </h3>
            <span className="text-xs text-muted-foreground">
              Atividade e estados · {flow.nodes.length} elementos
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-5 rounded-full border border-emerald-600 bg-emerald-50" />{" "}
              início / fim
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-5 rounded-sm border border-slate-600 bg-white" /> tela / ação
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rotate-45 border border-violet-500 bg-violet-50" />{" "}
              decisão
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-6 rounded border border-dashed border-amber-600" /> status /
              feedback
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> sim
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> não / erro
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-600" /> desvio
            </span>
          </div>
          <UmlJourneyDiagram flow={flow} />
          <p className="text-xs text-muted-foreground">
            UML de atividade = fluxo de telas e decisões. UML de estados = transições entre
            telas/status.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                {
                  label: "Telas",
                  value: counts.telas,
                  hint: "Telas distintas no fluxo",
                },
                {
                  label: "Variações de telas",
                  value: counts.variacoes,
                  hint: "Estados de erro que voltam à tela",
                },
                {
                  label: "Status",
                  value: counts.status,
                  hint: "Estados de sucesso / conclusão",
                },
                {
                  label: "Feedbacks",
                  value: counts.feedbacks,
                  hint: "Mensagens de erro, aviso ou retorno",
                },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-muted/40 px-3 py-2.5 text-center"
              >
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums text-matilha-black">
                  {item.value}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{item.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="mb-2 text-sm font-semibold">Inclui</h4>
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              {block.includes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="mb-2 text-sm font-semibold">Não inclui</h4>
            {block.excludes.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {block.excludes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sem exclusões explícitas neste bloco.</p>
            )}
          </div>
        </div>

        {(block.pages?.length > 0 ||
          block.usually_with?.length > 0 ||
          block.dependencies?.length > 0 ||
          journeys.length > 0) && (
          <div className="grid gap-4 md:grid-cols-3">
            {block.pages?.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Páginas / fluxos
                </h4>
                <div className="flex flex-wrap gap-1">
                  {block.pages.map((page) => (
                    <Badge key={page} variant="outline" className="font-normal">
                      {page}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {block.dependencies?.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dependências
                </h4>
                <div className="flex flex-wrap gap-1">
                  {block.dependencies.map((dep) => (
                    <Badge key={dep} variant="secondary" className="font-mono text-xs font-normal">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {block.usually_with?.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Normalmente acompanha
                </h4>
                <div className="flex flex-wrap gap-1">
                  {block.usually_with.map((item) => (
                    <Badge key={item} variant="secondary" className="font-mono text-xs font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {journeys.length > 0 && (
              <div className="md:col-span-3">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Jornadas que incluem este bloco
                </h4>
                <div className="flex flex-wrap gap-2">
                  {journeys.map((journey) => (
                    <button
                      key={journey.id}
                      type="button"
                      onClick={() => onOpenJourney?.(journey.id)}
                      className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-muted/60"
                    >
                      <span className="font-medium">{journey.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {journey.blockIds.join(" → ")}
                      </span>
                      {journey.commercialBundle ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Pacote
                        </Badge>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
