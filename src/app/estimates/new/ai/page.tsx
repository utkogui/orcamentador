import Link from "next/link";
import { BriefingKnowledgeLab } from "@/components/briefing-knowledge-lab";
import { Button } from "@/components/ui/button";

export default function EstimateAiLabPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Laboratório interno
          </p>
          <h2 className="mt-1 text-2xl font-bold">Interpretação de Briefing com Knowledge Base</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Analise briefings comerciais usando os Matilha Building Blocks. Esta etapa não gera
            estimativa nem grava dados — apenas estrutura a leitura para revisão manual.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/estimates/new">Voltar para nova estimativa</Link>
        </Button>
      </div>

      <BriefingKnowledgeLab />
    </div>
  );
}
