"use client";

import { useEffect, useRef } from "react";
import type FlowChart from "flowchart.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  code: string;
  title?: string;
  description?: string;
};

export function EstimateFlowchart({
  code,
  title = "Fluxo do projeto",
  description = "Estrutura visual gerada a partir da estimativa",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !code) return;

    let chart: FlowChart.Instance | null = null;
    let cancelled = false;

    import("flowchart.js").then((flowchartModule) => {
      if (cancelled || !containerRef.current) return;

      container.innerHTML = "";
      chart = flowchartModule.parse(code);
      chart.drawSVG(container, {
        "line-width": 2,
        "font-size": 13,
        "font-color": "#292524",
        "line-color": "#ea580c",
        "element-color": "#44403c",
        fill: "#fff7ed",
        "arrow-end": "block-wide-long",
        scale: 1,
        symbols: {
          start: { fill: "#ffedd5", "font-color": "#9a3412" },
          end: { fill: "#ffedd5", "font-color": "#9a3412" },
          operation: { fill: "#ffffff" },
        },
      });
    });

    return () => {
      cancelled = true;
      chart?.clean();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [code]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="min-h-[280px] overflow-x-auto rounded-lg border bg-white p-4 [&_svg]:mx-auto"
        />
      </CardContent>
    </Card>
  );
}
