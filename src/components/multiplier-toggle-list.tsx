"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toggleEstimateMultiplier } from "@/app/actions";
import type { Multiplier, MultiplierTarget } from "@prisma/client";

type MultiplierWithEnabled = Multiplier & { enabled: boolean };

type Props = {
  estimateId: string;
  multipliers: MultiplierWithEnabled[];
};

export function MultiplierToggleList({ estimateId, multipliers }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiplicadores globais</CardTitle>
        <CardDescription>Ative os riscos que se aplicam a este projeto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {multipliers.map((multiplier) => (
          <label
            key={multiplier.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border p-4"
          >
            <Checkbox
              checked={multiplier.enabled}
              onCheckedChange={(checked) =>
                toggleEstimateMultiplier(estimateId, multiplier.id, checked === true)
              }
            />
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{multiplier.name}</span>
                <Badge variant="outline">×{multiplier.factor}</Badge>
                <TargetBadge target={multiplier.target} />
              </div>
              {multiplier.description && (
                <p className="text-sm text-muted-foreground">{multiplier.description}</p>
              )}
            </div>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

function TargetBadge({ target }: { target: MultiplierTarget }) {
  return (
    <Badge variant="secondary">{target === "HOURS" ? "Horas" : "Custo"}</Badge>
  );
}
