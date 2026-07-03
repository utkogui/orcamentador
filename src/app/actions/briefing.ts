"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { interpretBriefing } from "@/lib/ai/interpret-briefing";
import { previewBriefingEstimate } from "@/lib/ai/preview-briefing";
import { createEstimateFromBriefing } from "@/lib/ai/create-from-briefing";
import { resolvedBriefingSchema } from "@/lib/ai/briefing-schema";

export async function interpretBriefingAction(formData: FormData) {
  const briefing = String(formData.get("briefing") ?? "");
  const instructions = String(formData.get("instructions") ?? "");

  const resolved = await interpretBriefing(briefing, instructions || undefined);
  const preview = await previewBriefingEstimate(resolved);

  return {
    resolved,
    preview: {
      totalHours: preview.totalAdjustedHours,
      totalCost: preview.totalAdjustedCost,
      suggestedPrice: preview.suggestedPrice,
      priceRangeMin: preview.commercialMin,
      priceRangeMax: preview.commercialMax,
      reuseSavingsHours: preview.reuseSavingsHours,
      reuseSavingsCost: preview.reuseSavingsCost,
    },
  };
}

export async function createEstimateFromBriefingAction(resolvedJson: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(resolvedJson);
  } catch {
    throw new Error("Dados da interpretação inválidos.");
  }

  const validated = resolvedBriefingSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message ?? "Interpretação inválida.");
  }

  const estimate = await createEstimateFromBriefing(validated.data);
  revalidatePath("/estimates");
  redirect(`/estimates/${estimate.id}`);
}
