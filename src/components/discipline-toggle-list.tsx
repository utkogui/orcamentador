"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toggleEstimateDiscipline } from "@/app/actions";
import { formatCurrency } from "@/lib/calculations";
import type { Discipline } from "@prisma/client";

type DisciplineWithEnabled = Discipline & { enabled: boolean };

type Props = {
  estimateId: string;
  disciplines: DisciplineWithEnabled[];
};

export function DisciplineToggleList({ estimateId, disciplines }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disciplinas incluídas</CardTitle>
        <CardDescription>
          Desmarque o que o cliente já faz internamente ou que não faz parte do escopo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {disciplines.map((discipline) => (
          <label
            key={discipline.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border p-4"
          >
            <Checkbox
              checked={discipline.enabled}
              onCheckedChange={(checked) =>
                toggleEstimateDiscipline(estimateId, discipline.id, checked === true)
              }
            />
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{discipline.name}</span>
                <Badge variant="outline">{formatCurrency(discipline.hourlyRate)}/h</Badge>
              </div>
              {discipline.description && (
                <p className="text-sm text-muted-foreground">{discipline.description}</p>
              )}
            </div>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
