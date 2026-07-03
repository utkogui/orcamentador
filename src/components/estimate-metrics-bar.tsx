import { cn } from "@/lib/utils";
import { formatCurrency, formatHours } from "@/lib/calculations";
import type { EstimateCalculationResult } from "@/lib/calculations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  result: EstimateCalculationResult;
  compact?: boolean;
};

export function EstimateMetricsBar({ result, compact = false }: Props) {
  const metrics = [
    {
      title: "Horas totais",
      value: `${formatHours(result.totalAdjustedHours)} h`,
      subtitle: `Base: ${formatHours(result.totalBaseHours)} h`,
      highlight: false,
    },
    {
      title: "Custo total",
      value: formatCurrency(result.totalAdjustedCost),
      subtitle: `Base: ${formatCurrency(result.totalBaseCost)}`,
      highlight: false,
    },
    {
      title: "Preço sugerido",
      value: formatCurrency(result.suggestedPrice),
      subtitle: `Margem ${result.marginPct}% · ${formatCurrency(result.marginValue)}`,
      highlight: true,
    },
    {
      title: "Faixa comercial",
      value: `${formatCurrency(result.commercialMin)} – ${formatCurrency(result.commercialMax)}`,
      subtitle: "±10% sobre o preço sugerido",
      highlight: false,
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className={cn(
              "rounded-lg border px-3 py-2",
              metric.highlight && "border-primary/40 bg-primary/5"
            )}
          >
            <p className="text-xs text-muted-foreground">{metric.title}</p>
            <p className="text-sm font-semibold leading-tight sm:text-base">{metric.value}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{metric.subtitle}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          highlight={metric.highlight}
        />
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  highlight,
}: {
  title: string;
  value: string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary/40 bg-primary/5" : undefined}>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
