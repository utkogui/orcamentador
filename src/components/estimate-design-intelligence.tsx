import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EstimateCalculationResult } from "@/lib/calculations";
import { recommendDesignPatterns } from "@/lib/matilha-knowledge/design-intelligence";

type Props = {
  result: EstimateCalculationResult;
};

export function EstimateDesignIntelligence({ result }: Props) {
  // Extract unique module IDs from the estimate
  const moduleIds = Array.from(new Set(result.lineItems.map((item) => item.moduleId)));
  
  // Get recommendations for these modules
  const recommendations = recommendDesignPatterns(moduleIds);

  if (recommendations.length === 0) {
    return null;
  }

  // Map module IDs to their names for display
  const moduleNames = new Map(result.lineItems.map((item) => [item.moduleId, item.moduleName]));

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle>Design reutilizável</CardTitle>
        <CardDescription>
          Padrões prontos (bibliotecas) sugeridos para os Building Blocks desta estimativa —
          para não desenhar do zero. Os % abaixo são economia estimada de UI/Frontend e ainda
          não entram automaticamente no preço oficial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => {
            const moduleName = moduleNames.get(rec.buildingBlockId) || rec.buildingBlockId;
            return (
              <div key={rec.buildingBlockId} className="flex flex-col rounded-lg border bg-background p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold">{moduleName}</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    {rec.library.name}
                  </Badge>
                </div>
                
                <div className="mb-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bloco:</span>
                    <span className="font-medium">{rec.pattern.reference}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {rec.pattern.description}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t">
                  <p className="text-xs font-medium mb-2 text-muted-foreground">Impacto estimado</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.pattern.uiReduction > 0 && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        UI -{Math.round(rec.pattern.uiReduction * 100)}%
                      </Badge>
                    )}
                    {rec.pattern.frontendReduction > 0 && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        Frontend -{Math.round(rec.pattern.frontendReduction * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
