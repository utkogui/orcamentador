import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatHours } from "@/lib/calculations";
import {
  SHADOW_STATUS_BADGE_CLASSES,
  SHADOW_STATUS_DESCRIPTIONS,
  SHADOW_STATUS_LABELS,
  formatDifficulty,
  formatSignedPercent,
} from "@/lib/engineering-validation/shadow-formatters";
import type { ShadowResult } from "@/lib/engineering-validation/shadow-types";
import { cn } from "@/lib/utils";

type Props = {
  shadow: ShadowResult;
};

export function ShadowModeSection({ shadow }: Props) {
  if (!shadow.available) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-xl">Shadow Mode — Engineering Engine</CardTitle>
          <CardDescription>Comparação experimental com o novo motor de engenharia</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{shadow.reason}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">Shadow Mode — Engineering Engine</CardTitle>
            <CardDescription>
              Comparação experimental — não altera o preço oficial da estimativa
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={cn("text-sm", SHADOW_STATUS_BADGE_CLASSES[shadow.status])}
          >
            {SHADOW_STATUS_LABELS[shadow.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {SHADOW_STATUS_DESCRIPTIONS[shadow.status]}
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Preço oficial</p>
            <p className="mt-1 text-2xl font-bold">{formatCurrency(shadow.price.official)}</p>
          </div>
          <div className="rounded-xl border bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Preço Engineering Engine
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {formatCurrency(shadow.price.engineering)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              margem de {shadow.marginPct}% aplicada igual à oficial
            </p>
          </div>
          <div className="rounded-xl border bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Diferença</p>
            <p className="mt-1 text-2xl font-bold">{formatSignedPercent(shadow.price.diffPct)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(shadow.price.diffAbs)} vs. oficial
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-slate-50/60 px-4 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium">Horas totais</p>
            <p className="text-sm text-muted-foreground">
              Oficial: <span className="font-semibold">{formatHours(shadow.hours.official)} h</span>{" "}
              · Engineering:{" "}
              <span className="font-semibold">{formatHours(shadow.hours.engineering)} h</span> ·{" "}
              <span className="font-semibold">{formatSignedPercent(shadow.hours.diffPct)}</span>
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Horas por disciplina (Engineering Engine)</p>
          <div className="flex flex-wrap gap-2">
            {shadow.disciplineHours.map((entry) => (
              <span
                key={entry.discipline}
                className="rounded-full border bg-white px-3 py-1 text-xs"
              >
                {entry.label}: <span className="font-semibold">{formatHours(entry.hours)} h</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Principais Building Blocks</p>
          <div className="space-y-2">
            {shadow.topBlocks.map((block) => (
              <div
                key={block.blockId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{block.blockName}</span>
                  <Badge variant="secondary" className="text-[11px]">
                    {formatDifficulty(block.difficulty)}
                  </Badge>
                  {block.addedAsDependency && (
                    <Badge variant="outline" className="text-[11px]">
                      dependência
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatHours(block.finalHours)} h · {formatCurrency(block.cost)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {(shadow.addedDependencyIds.length > 0 || shadow.missingBlockIds.length > 0) && (
          <div className="space-y-1 text-xs text-muted-foreground">
            {shadow.addedDependencyIds.length > 0 && (
              <p>
                Dependências adicionadas automaticamente: {shadow.addedDependencyIds.length}
              </p>
            )}
            {shadow.missingBlockIds.length > 0 && (
              <p>
                Blocos sem perfil de engenharia (ignorados): {shadow.missingBlockIds.join(", ")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
