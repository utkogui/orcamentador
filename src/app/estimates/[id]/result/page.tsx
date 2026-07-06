import { notFound, redirect } from "next/navigation";
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

export default async function EstimateResultPage({ params }: Props) {
  const { id } = await params;

  const estimate = await prisma.estimate.findUnique({ where: { id } });
  if (!estimate) notFound();

  if (estimate.clientProposalPrice == null) {
    redirect(`/estimates/${id}`);
  }

  const result = await getEstimateCalculation(id);
  if (!result) notFound();

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
      clientPrice={estimate.clientProposalPrice}
      proposalContent={proposalContent}
      scopeItems={scopeItems}
      applicationFlow={applicationFlow}
      journeySteps={journeySteps}
    />
  );
}
