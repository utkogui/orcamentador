import type { EstimateCalculationResult } from "@/lib/calculations";

export type ClientProposalPriceMode =
  | "suggested"
  | "commercial_min"
  | "commercial_max"
  | "custom";

export const CLIENT_PRICE_MODE_LABELS: Record<ClientProposalPriceMode, string> = {
  suggested: "Preço sugerido",
  commercial_min: "Mínimo da faixa comercial",
  commercial_max: "Máximo da faixa comercial",
  custom: "Outro valor",
};

export function resolveClientProposalPrice(
  mode: ClientProposalPriceMode,
  customPrice: number | null | undefined,
  result: Pick<
    EstimateCalculationResult,
    "suggestedPrice" | "commercialMin" | "commercialMax"
  >
): number {
  switch (mode) {
    case "suggested":
      return result.suggestedPrice;
    case "commercial_min":
      return result.commercialMin;
    case "commercial_max":
      return result.commercialMax;
    case "custom":
      if (customPrice == null || Number.isNaN(customPrice) || customPrice <= 0) {
        throw new Error("Informe um valor válido para a proposta.");
      }
      return customPrice;
    default:
      throw new Error("Selecione como o preço será enviado ao cliente.");
  }
}

export function getClientPriceModeLabel(mode: string | null | undefined): string {
  if (!mode) return "Não definido";
  return CLIENT_PRICE_MODE_LABELS[mode as ClientProposalPriceMode] ?? mode;
}
