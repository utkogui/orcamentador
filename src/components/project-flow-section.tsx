"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EstimateFlowchart } from "@/components/estimate-flowchart";
import { buildProjectFlowchartCode, type ProjectFlow } from "@/lib/project-flow";
import { resetProjectFlow, saveProjectFlowLabels } from "@/app/actions";

type Props = {
  estimateId: string;
  initialFlow: ProjectFlow;
};

export function ProjectFlowSection({ estimateId, initialFlow }: Props) {
  const [flow, setFlow] = useState(initialFlow);
  const [isPending, startTransition] = useTransition();

  const flowCode = useMemo(() => buildProjectFlowchartCode(flow), [flow]);

  const handleSave = () => {
    const labels = Object.fromEntries(
      flow.nodes.map((node) => [node.id, { label: node.label, subtitle: node.subtitle }])
    );

    startTransition(async () => {
      await saveProjectFlowLabels(estimateId, labels);
    });
  };

  const handleReset = () => {
    startTransition(async () => {
      const regenerated = await resetProjectFlow(estimateId);
      if (regenerated) setFlow(regenerated);
    });
  };

  const updateNode = (id: string, field: "label" | "subtitle", value: string) => {
    setFlow((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === id ? { ...node, [field]: value } : node
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <EstimateFlowchart
        code={flowCode}
        title="Fluxo do projeto"
        description="Jornada do usuário para apresentar ao cliente — login, telas e integrações"
      />

      <Card>
        <CardHeader>
          <CardTitle>Personalizar fluxo</CardTitle>
          <CardDescription>
            Renomeie as etapas para a linguagem do cliente. Use &quot;Regenerar&quot; quando
            adicionar ou remover módulos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {flow.nodes.map((node) => (
            <div key={node.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{node.type}</p>
                <p className="text-sm font-medium">{node.id}</p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`${node.id}-label`}>Título</Label>
                  <Input
                    id={`${node.id}-label`}
                    value={node.label}
                    onChange={(e) => updateNode(node.id, "label", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${node.id}-subtitle`}>Descrição</Label>
                  <Input
                    id={`${node.id}-subtitle`}
                    value={node.subtitle ?? ""}
                    onChange={(e) => updateNode(node.id, "subtitle", e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={isPending}>
              Salvar fluxo
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isPending}>
              Regenerar a partir dos módulos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
