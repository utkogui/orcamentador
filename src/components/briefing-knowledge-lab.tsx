"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { interpretBriefingKnowledgeAction, createEstimateFromKnowledgeAction } from "@/app/actions/interpret-briefing";
import { ApplicationStructureSection } from "@/components/application-structure-section";
import { generateApplicationFlowFromBlocks } from "@/lib/application-flow/generate-from-blocks";
import type {
  BriefingBlockMatch,
  BriefingInterpretationResult,
  CommercialQuestion,
  NeedsConfirmationItem,
  OutOfScopeRisk,
} from "@/types/building-blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BriefingKnowledgeLab() {
  const [briefing, setBriefing] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BriefingInterpretationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();

  const applicationFlow = useMemo(
    () => (result ? generateApplicationFlowFromBlocks(result) : null),
    [result]
  );

  function handleInterpret() {
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const interpretation = await interpretBriefingKnowledgeAction(briefing);
        setResult(interpretation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao interpretar briefing.");
      }
    });
  }

  function handleCreateEstimate() {
    if (!result) return;

    setError(null);
    startCreateTransition(async () => {
      try {
        await createEstimateFromKnowledgeAction(JSON.stringify(result));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao gerar estimativa.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Briefing Interpreter</CardTitle>
          </div>
          <CardDescription>
            Interpreta o briefing usando a Matilha Knowledge Base. Ao gerar a estimativa, os
            building blocks são mapeados para módulos do catálogo para calcular horas e preço.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="briefing">Cole aqui o briefing do cliente</Label>
            <Textarea
              id="briefing"
              rows={14}
              placeholder="Cole o briefing comercial completo..."
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              disabled={isPending || isCreating}
            />
          </div>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            onClick={handleInterpret}
            disabled={isPending || isCreating || briefing.trim().length < 80}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Interpretando...
              </>
            ) : (
              "Interpretar Briefing"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <ResultCard title="Resumo" description="Visão geral do escopo interpretado">
            <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
          </ResultCard>

          {applicationFlow && <ApplicationStructureSection flow={applicationFlow} />}

          <BlockMatchesCard
            title="Building Blocks explicitamente pedidos"
            description="Itens claramente solicitados no briefing"
            items={result.explicitlyRequested}
            emptyMessage="Nenhum building block identificado como explicitamente pedido."
          />

          <BlockMatchesCard
            title="Building Blocks provavelmente necessários"
            description="Itens que tendem a acompanhar o escopo, mesmo sem menção direta"
            items={result.likelyNeeded}
            emptyMessage="Nenhum building block identificado como provavelmente necessário."
          />

          <BlockMatchesCard
            title="Building Blocks opcionais"
            description="Upsell ou evoluções possíveis"
            items={result.optional}
            emptyMessage="Nenhum building block opcional identificado."
          />

          <ListCard
            title="Itens que precisam ser confirmados"
            description="Ambiguidades que o comercial deve validar com o cliente"
            emptyMessage="Nenhum ponto pendente de confirmação."
            isEmpty={result.needsConfirmation.length === 0}
          >
            {result.needsConfirmation.map((item) => (
              <ConfirmationItem key={`${item.topic}-${item.reason}`} item={item} />
            ))}
          </ListCard>

          <ListCard
            title="Riscos de escopo"
            description="Possíveis interpretações perigosas ou fora de escopo"
            emptyMessage="Nenhum risco de escopo identificado."
            isEmpty={result.outOfScopeRisks.length === 0}
          >
            {result.outOfScopeRisks.map((risk) => (
              <RiskItem key={`${risk.title}-${risk.description}`} risk={risk} />
            ))}
          </ListCard>

          <ListCard
            title="Perguntas para o comercial"
            description="Perguntas objetivas para alinhar expectativa"
            emptyMessage="Nenhuma pergunta comercial sugerida."
            isEmpty={result.commercialQuestions.length === 0}
          >
            {result.commercialQuestions.map((question) => (
              <QuestionItem
                key={`${question.question}-${question.context ?? ""}`}
                question={question}
              />
            ))}
          </ListCard>

          <ListCard
            title="Notas para equipe comercial"
            description="Orientações internas de leitura do briefing"
            emptyMessage="Nenhuma nota adicional."
            isEmpty={result.notesForSalesTeam.length === 0}
          >
            {result.notesForSalesTeam.map((note) => (
              <p key={note} className="rounded-lg border p-3 text-sm text-muted-foreground">
                {note}
              </p>
            ))}
          </ListCard>

          <div className="flex justify-end border-t pt-6">
            <Button onClick={handleCreateEstimate} disabled={isCreating || isPending}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando estimativa...
                </>
              ) : (
                "Gerar estimativa"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function BlockMatchesCard({
  title,
  description,
  items,
  emptyMessage,
}: {
  title: string;
  description: string;
  items: BriefingBlockMatch[];
  emptyMessage: string;
}) {
  return (
    <ResultCard title={title} description={description}>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <BlockMatchItem key={`${item.blockId}-${item.reason ?? title}`} item={item} />
          ))}
        </div>
      )}
    </ResultCard>
  );
}

function BlockMatchItem({ item }: { item: BriefingBlockMatch }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">{item.blockName}</p>
          <p className="text-xs text-muted-foreground">{item.blockId}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.categoryName && <Badge variant="outline">{item.categoryName}</Badge>}
          {item.confidence && <Badge variant="secondary">{item.confidence}</Badge>}
        </div>
      </div>
      {item.reason && <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>}
    </div>
  );
}

function ConfirmationItem({ item }: { item: NeedsConfirmationItem }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium">{item.topic}</p>
      <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>
      {item.relatedBlockIds && item.relatedBlockIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.relatedBlockIds.map((id) => (
            <Badge key={id} variant="outline">
              {id}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskItem({ risk }: { risk: OutOfScopeRisk }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
      <p className="font-medium text-amber-950">{risk.title}</p>
      <p className="mt-1 text-sm text-amber-900/80">{risk.description}</p>
      {risk.suggestion && (
        <p className="mt-2 text-sm text-amber-900/70">
          <span className="font-medium">Sugestão:</span> {risk.suggestion}
        </p>
      )}
    </div>
  );
}

function QuestionItem({ question }: { question: CommercialQuestion }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium">{question.question}</p>
      {question.context && (
        <p className="mt-1 text-sm text-muted-foreground">{question.context}</p>
      )}
      {question.relatedBlockId && (
        <Badge className="mt-2" variant="outline">
          {question.relatedBlockId}
        </Badge>
      )}
    </div>
  );
}

function ListCard({
  title,
  description,
  emptyMessage,
  isEmpty,
  children,
}: {
  title: string;
  description: string;
  emptyMessage: string;
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  return (
    <ResultCard title={title} description={description}>
      {isEmpty ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </ResultCard>
  );
}
