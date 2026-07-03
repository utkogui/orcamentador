"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { createEstimateFromBriefingAction, interpretBriefingAction } from "@/app/actions/briefing";
import type { ResolvedBriefing } from "@/lib/ai/briefing-schema";
import { COMPLEXITY_LABELS } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Preview = {
  totalHours: number;
  totalCost: number;
  suggestedPrice: number;
  priceRangeMin: number;
  priceRangeMax: number;
  reuseSavingsHours: number;
  reuseSavingsCost: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function BriefingInterpreter() {
  const [briefing, setBriefing] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ResolvedBriefing | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();

  function handleInterpret() {
    setError(null);
    setResolved(null);
    setPreview(null);

    const formData = new FormData();
    formData.set("briefing", briefing);
    formData.set("instructions", instructions);

    startTransition(async () => {
      try {
        const result = await interpretBriefingAction(formData);
        setResolved(result.resolved);
        setPreview(result.preview);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao interpretar briefing.");
      }
    });
  }

  function handleConfirm() {
    if (!resolved) return;

    startCreateTransition(async () => {
      try {
        await createEstimateFromBriefingAction(JSON.stringify(resolved));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao criar estimativa.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Interpretar briefing com IA</CardTitle>
          </div>
          <CardDescription>
            Cole o briefing do cliente. A IA mapeia para o catálogo de módulos em camadas — você revisa
            antes de criar a estimativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="briefing">Briefing</Label>
            <Textarea
              id="briefing"
              rows={12}
              placeholder="Cole aqui o documento ou texto do briefing do cliente..."
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              disabled={isPending || isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instruções opcionais</Label>
            <Textarea
              id="instructions"
              rows={3}
              placeholder="Ex.: priorizar MVP, excluir e-commerce, margem 25%..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isPending || isCreating}
            />
          </div>
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button onClick={handleInterpret} disabled={isPending || isCreating || briefing.trim().length < 80}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Interpretando...
              </>
            ) : (
              "Interpretar briefing"
            )}
          </Button>
        </CardContent>
      </Card>

      {resolved && preview && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia — confirme antes de criar</CardTitle>
            <CardDescription>
              {resolved.projectName}
              {resolved.clientName ? ` · ${resolved.clientName}` : ""} · margem {resolved.marginPct}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">{resolved.summary}</p>

            {resolved.warnings.length > 0 && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                <p className="font-medium">Avisos</p>
                <ul className="mt-1 list-inside list-disc">
                  {resolved.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Horas" value={`${preview.totalHours.toFixed(0)} h`} />
              <Metric label="Preço sugerido" value={formatCurrency(preview.suggestedPrice)} />
              <Metric
                label="Faixa comercial"
                value={`${formatCurrency(preview.priceRangeMin)} – ${formatCurrency(preview.priceRangeMax)}`}
              />
            </div>

            {(preview.reuseSavingsHours > 0 || preview.reuseSavingsCost > 0) && (
              <p className="text-sm text-muted-foreground">
                Economia por reuso: {preview.reuseSavingsHours.toFixed(0)} h (
                {formatCurrency(preview.reuseSavingsCost)})
              </p>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Composição sugerida ({resolved.items.length} itens)</p>
              <div className="divide-y rounded-md border">
                {resolved.items.map((item) => (
                  <div key={`${item.moduleId}-${item.instanceIndex}-${item.instanceLabel}`} className="flex flex-wrap items-start justify-between gap-2 px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">{item.moduleName}</p>
                      <p className="text-muted-foreground">{item.instanceLabel}</p>
                      {item.reason && <p className="mt-1 text-xs text-muted-foreground">{item.reason}</p>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">{COMPLEXITY_LABELS[item.complexity]}</Badge>
                      {item.instanceIndex > 1 && (
                        <Badge variant="outline">Instância {item.instanceIndex}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleConfirm} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Criando estimativa...
                  </>
                ) : (
                  "Confirmar e criar estimativa"
                )}
              </Button>
              <Button variant="outline" onClick={() => { setResolved(null); setPreview(null); }} disabled={isCreating}>
                Descartar e editar briefing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
