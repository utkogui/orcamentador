"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { interpretBriefing } from "@/lib/ai/interpret-briefing";
import { createEstimateFromKnowledgeInterpretation } from "@/lib/ai/create-estimate-from-knowledge";
import { parseBriefingInterpretationResult } from "@/lib/ai/briefing-interpretation-schema";
import type { BriefingInterpretationResult } from "@/types/building-blocks";

export async function interpretBriefingKnowledgeAction(
  briefing: string
): Promise<BriefingInterpretationResult> {
  return interpretBriefing(briefing);
}

export async function createEstimateFromKnowledgeAction(interpretationJson: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(interpretationJson);
  } catch {
    throw new Error("Dados da interpretação inválidos.");
  }

  const result = parseBriefingInterpretationResult(parsed);
  const { estimate } = await createEstimateFromKnowledgeInterpretation(result);

  revalidatePath("/estimates");
  redirect(`/estimates/${estimate.id}`);
}
