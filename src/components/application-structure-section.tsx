"use client";

import { ApplicationStructureFlow } from "@/components/application-structure-flow";
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
            Jornada visual inferida a partir dos Building Blocks — use com o cliente para mostrar a
            amplitude do produto (login, navegação, módulos e integrações).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationStructureFlow flow={flow} />
          <p className="mt-3 text-xs text-muted-foreground">
            {flow.nodes.length} telas/fluxos mapeados · visualização interativa (React Flow)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
