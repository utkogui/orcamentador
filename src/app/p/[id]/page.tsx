import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EstimateClientProposal } from "@/components/estimate-client-proposal";
import { buildApplicationJourneySteps } from "@/lib/client-proposal/build-journey-steps";
import { buildClientScopeItems } from "@/lib/client-proposal/build-scope-items";
import { parseClientProposalContent } from "@/lib/client-proposal/parse-proposal-content";
import { parseApplicationFlow } from "@/lib/application-flow/storage";
import { prisma } from "@/lib/prisma";
import { getEstimateCalculation } from "@/lib/estimate-service";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const estimate = await prisma.estimate.findUnique({
    where: { id },
    select: { name: true, clientName: true },
  });
  if (!estimate) return { title: "Proposta | Matilha" };
  return {
    title: `${estimate.name} · Proposta Matilha`,
    description: estimate.clientName
      ? `Proposta comercial para ${estimate.clientName}`
      : "Proposta comercial Matilha Estúdio",
  };
}

export default async function SharedProposalPage({ params }: Props) {
  const { id } = await params;

  const estimate = await prisma.estimate.findUnique({ where: { id } });
  if (!estimate) notFound();

  const result = await getEstimateCalculation(id);
  if (!result) notFound();

  const clientPrice = estimate.clientProposalPrice ?? result.suggestedPrice;
  const applicationFlow = parseApplicationFlow(estimate.projectFlowJson);
  const proposalContent = parseClientProposalContent(estimate.description);
  const scopeItems = buildClientScopeItems(result);
  const journeySteps = applicationFlow ? buildApplicationJourneySteps(applicationFlow) : [];

  return (
    <EstimateClientProposal
      estimateId={estimate.id}
      projectName={estimate.name}
      clientName={estimate.clientName}
      createdAt={estimate.createdAt.toISOString()}
      clientPrice={clientPrice}
      proposalContent={proposalContent}
      scopeItems={scopeItems}
      applicationFlow={applicationFlow}
      journeySteps={journeySteps}
      variant="shared"
    />
  );
}
