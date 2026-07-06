"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MatilhaLogo } from "@/components/matilha-logo";
import {
  ApplicationStructureFlow,
  type ApplicationStructureFlowHandle,
} from "@/components/application-structure-flow";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";
import type { ClientScopeItem } from "@/lib/client-proposal/build-scope-items";
import {
  buildProposalPdfFilename,
  exportContinuousPdf,
} from "@/lib/client-proposal/export-continuous-pdf";
import type { ClientProposalContent } from "@/lib/client-proposal/parse-proposal-content";
import { formatProposalDate } from "@/lib/client-proposal/parse-proposal-content";
import { formatCurrency } from "@/lib/calculations";

type Props = {
  estimateId: string;
  projectName: string;
  clientName: string | null;
  createdAt: string;
  clientPrice: number;
  proposalContent: ClientProposalContent;
  scopeItems: ClientScopeItem[];
  applicationFlow: ApplicationFlowGraph | null;
  journeySteps: string[];
};

function ProposalSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-100 px-10 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-8 w-1 rounded-full bg-matilha-yellow" />
        <div>
          <h2 className="text-xl font-bold text-matilha-black">{title}</h2>
          {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function EstimateClientProposal({
  estimateId,
  projectName,
  clientName,
  createdAt,
  clientPrice,
  proposalContent,
  scopeItems,
  applicationFlow,
  journeySteps,
}: Props) {
  const proposalRef = useRef<HTMLElement>(null);
  const flowRef = useRef<ApplicationStructureFlowHandle>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function handleSavePdf() {
    if (!proposalRef.current || isExporting) return;

    setIsExporting(true);
    setExportError(null);

    try {
      await exportContinuousPdf(
        proposalRef.current,
        buildProposalPdfFilename(projectName, clientName),
        {
          captureFlow: flowRef.current ? () => flowRef.current!.captureForPdf() : undefined,
        }
      );
    } catch {
      setExportError("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  }

  const proposalDate = formatProposalDate(new Date(createdAt));
  const recipient = clientName ?? "Cliente";

  return (
    <>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/40 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Visualização para envio ao cliente · PDF contínuo em página única
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/estimates/${estimateId}`}>Voltar para edição interna</Link>
          </Button>
          <Button size="sm" onClick={() => void handleSavePdf()} disabled={isExporting}>
            {isExporting ? "Gerando PDF..." : "Salvar PDF"}
          </Button>
        </div>
      </div>

      {exportError && (
        <p className="no-print mb-4 text-sm text-destructive">{exportError}</p>
      )}

      <article
        ref={proposalRef}
        className="client-proposal mx-auto max-w-4xl overflow-visible bg-matilha-white text-matilha-black shadow-sm"
      >
        <header className="border-b border-matilha-yellow/60 bg-gradient-to-br from-matilha-yellow-muted via-matilha-white to-matilha-white px-10 pb-10 pt-12">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="min-w-[240px]">
              <MatilhaLogo height={40} priority native />
              <h1 className="mt-8 text-3xl font-bold tracking-tight text-matilha-black">
                Proposta comercial
              </h1>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-neutral-700">
                {projectName}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white/80 px-5 py-4 text-right text-sm text-neutral-600">
              <p className="font-medium text-matilha-black">{proposalDate}</p>
              <p className="mt-1">Ref. {estimateId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </header>

        <ProposalSection title="Destinatário">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Para
              </p>
              <p className="mt-2 text-xl font-semibold text-matilha-black">{recipient}</p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Projeto
              </p>
              <p className="mt-2 text-xl font-semibold text-matilha-black">{projectName}</p>
            </div>
          </div>
        </ProposalSection>

        {(proposalContent.summary || proposalContent.scopeHighlights.length > 0) && (
          <ProposalSection title="Resumo do escopo">
            {proposalContent.summary && (
              <p className="leading-relaxed text-neutral-700">{proposalContent.summary}</p>
            )}
            {proposalContent.scopeHighlights.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {proposalContent.scopeHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-lg border border-neutral-100 bg-white px-4 py-3"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-matilha-yellow" />
                    <span className="text-neutral-800">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </ProposalSection>
        )}

        {scopeItems.length > 0 && (
          <ProposalSection
            title="Entregáveis previstos"
            description="Composição funcional do projeto, sem detalhamento de valores unitários."
          >
            <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
              {scopeItems.map((item) => (
                <li key={item.id} className="bg-white px-5 py-4">
                  <p className="font-medium text-matilha-black">{item.label}</p>
                  {item.subtitle && (
                    <p className="mt-1 text-sm text-neutral-500">{item.subtitle}</p>
                  )}
                </li>
              ))}
            </ul>
          </ProposalSection>
        )}

        {(applicationFlow || journeySteps.length > 0) && (
          <ProposalSection
            title="Estrutura provável da aplicação"
            description="Jornada visual inferida a partir do escopo acordado."
          >
            {applicationFlow ? (
              <div className="proposal-flow overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-1">
                <ApplicationStructureFlow
                  ref={flowRef}
                  flow={applicationFlow}
                  className="border-0 bg-transparent"
                  showChrome={false}
                />
              </div>
            ) : (
              <ol className="space-y-3">
                {journeySteps.map((step, index) => (
                  <li
                    key={`${step}-${index}`}
                    className="flex gap-3 rounded-lg border border-neutral-100 px-4 py-3"
                  >
                    <span className="font-semibold text-matilha-black">{index + 1}.</span>
                    <span className="text-neutral-700">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </ProposalSection>
        )}

        <ProposalSection title="Investimento">
          <div className="rounded-2xl border-2 border-matilha-yellow bg-matilha-yellow-muted px-8 py-8">
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-600">
              Valor total do projeto
            </p>
            <p className="mt-3 text-5xl font-black tracking-tight text-matilha-black">
              {formatCurrency(clientPrice)}
            </p>
          </div>
        </ProposalSection>

        <footer className="px-10 pb-16 pt-10 text-sm leading-relaxed text-neutral-600">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-matilha-yellow" />
            <h2 className="text-base font-bold text-matilha-black">Condições gerais</h2>
          </div>
          <ul className="space-y-3 pl-4">
            <li>Proposta válida por 30 dias a partir da data de emissão.</li>
            <li>Escopo, prazos e condições de pagamento podem ser ajustados após alinhamento final.</li>
            <li>Itens não descritos nesta proposta estão fora do escopo acordado.</li>
          </ul>
          <div className="mt-10 border-t border-neutral-100 pt-8">
            <MatilhaLogo height={24} native />
            <p className="mt-4 font-medium text-matilha-black">Matilha Estúdio</p>
            <p className="text-neutral-500">Proposta comercial · {proposalDate}</p>
          </div>
        </footer>
      </article>
    </>
  );
}
