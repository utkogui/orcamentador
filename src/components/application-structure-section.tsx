"use client";

import { UmlJourneyDiagram } from "@/components/uml-journey-diagram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";

type Props = {
  flow: ApplicationFlowGraph;
};

export function ApplicationStructureSection({ flow }: Props) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle>Estrutura provável da aplicação</CardTitle>
          <CardDescription>
            Diagramas UML inferidos a partir dos Building Blocks — atividade (fluxo) e estados
            (transições) para alinhar escopo com o cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UmlJourneyDiagram flow={flow} />
          <p className="mt-3 text-xs text-muted-foreground">
            {flow.nodes.length} elementos mapeados · notação UML (atividade / estados)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
