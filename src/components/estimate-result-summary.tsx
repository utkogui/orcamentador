import { formatCurrency, formatHours, MODULE_LAYER_LABELS } from "@/lib/calculations";
import type { EstimateCalculationResult } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EstimateMetricsBar } from "@/components/estimate-metrics-bar";
import { EstimateDesignIntelligence } from "@/components/estimate-design-intelligence";

type Props = {
  result: EstimateCalculationResult;
};

export function EstimateResultSummary({ result }: Props) {
  return (
    <div className="space-y-6">
      <EstimateMetricsBar result={result} />

      {result.reuseSavingsHours > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Economia por reuso de plataforma</CardTitle>
            <CardDescription>
              Cadastros e conectores reutilizam a mesma base — não são estimados como produtos do zero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <span className="font-semibold">{formatHours(result.reuseSavingsHours)} h</span> e{" "}
              <span className="font-semibold">{formatCurrency(result.reuseSavingsCost)}</span> a
              menos do que um modelo sem reuso
            </p>
          </CardContent>
        </Card>
      )}

      <EstimateDesignIntelligence result={result} />

      <Card>
        <CardHeader>
          <CardTitle>Composição do escopo</CardTitle>
          <CardDescription>Itens da estimativa com camada, instância e fator de reuso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Item</th>
                  <th className="pb-3 pr-4 font-medium">Camada</th>
                  <th className="pb-3 pr-4 font-medium">Reuso</th>
                  <th className="pb-3 pr-4 font-medium">Horas</th>
                  <th className="pb-3 font-medium">Custo base</th>
                </tr>
              </thead>
              <tbody>
                {result.lineItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{item.instanceLabel ?? item.moduleName}</p>
                      {item.instanceLabel && (
                        <p className="text-xs text-muted-foreground">{item.moduleName}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4">{MODULE_LAYER_LABELS[item.layer]}</td>
                    <td className="py-3 pr-4">
                      {item.reuseMultiplier < 1
                        ? `${Math.round(item.reuseMultiplier * 100)}%`
                        : "100%"}
                    </td>
                    <td className="py-3 pr-4">{formatHours(item.baseHours)} h</td>
                    <td className="py-3">{formatCurrency(item.baseCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horas e custo por disciplina</CardTitle>
          <CardDescription>Valores após complexidade, multiplicadores e disciplinas selecionadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Disciplina</th>
                  <th className="pb-3 pr-4 font-medium">Valor/h</th>
                  <th className="pb-3 pr-4 font-medium">Horas base</th>
                  <th className="pb-3 pr-4 font-medium">Horas finais</th>
                  <th className="pb-3 font-medium">Custo final</th>
                </tr>
              </thead>
              <tbody>
                {result.disciplines.map((discipline) => (
                  <tr key={discipline.disciplineId} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{discipline.disciplineName}</td>
                    <td className="py-3 pr-4">{formatCurrency(discipline.hourlyRate)}</td>
                    <td className="py-3 pr-4">{formatHours(discipline.baseHours)} h</td>
                    <td className="py-3 pr-4">{formatHours(discipline.adjustedHours)} h</td>
                    <td className="py-3">{formatCurrency(discipline.adjustedCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impacto dos multiplicadores</CardTitle>
          <CardDescription>
            Fatores acumulados: horas ×{result.hoursMultiplierFactor.toFixed(2)} · custo ×
            {result.costMultiplierFactor.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.multiplierImpacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum multiplicador ativo.</p>
          ) : (
            result.multiplierImpacts.map((impact) => (
              <div
                key={impact.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{impact.name}</span>
                    <Badge variant="outline">×{impact.factor}</Badge>
                    <Badge variant="secondary">
                      {impact.target === "HOURS" ? "Horas" : "Custo"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm">
                  {impact.impactHours > 0 && (
                    <p>+{formatHours(impact.impactHours)} h</p>
                  )}
                  {impact.impactCost > 0 && (
                    <p className="text-muted-foreground">+{formatCurrency(impact.impactCost)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
