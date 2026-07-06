"use server";

import { runBriefingPipeline } from "@/lib/ai/pipeline/pipeline";
import type {
  BriefingPipelineOptions,
  BriefingPipelineResult,
} from "@/types/briefing-pipeline";

/**
 * Nova interpretação em pipeline (paralela à interpretação legada).
 * Não substitui interpretBriefingKnowledgeAction.
 */
export async function interpretBriefingPipelineAction(
  briefing: string,
  options?: BriefingPipelineOptions
): Promise<BriefingPipelineResult> {
  return runBriefingPipeline(briefing, options);
}
