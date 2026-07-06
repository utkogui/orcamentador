"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { saveClientProposalPrice } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CLIENT_PRICE_MODE_LABELS,
  type ClientProposalPriceMode,
  resolveClientProposalPrice,
} from "@/lib/client-proposal/client-price";
import { formatCurrency } from "@/lib/calculations";

type Props = {
  estimateId: string;
  suggestedPrice: number;
  commercialMin: number;
  commercialMax: number;
  savedMode: string | null;
  savedPrice: number | null;
};

const MODES: ClientProposalPriceMode[] = [
  "suggested",
  "commercial_min",
  "commercial_max",
  "custom",
];

export function EstimateClientPricePanel({
  estimateId,
  suggestedPrice,
  commercialMin,
  commercialMax,
  savedMode,
  savedPrice,
}: Props) {
  const router = useRouter();
  const initialMode = (savedMode as ClientProposalPriceMode | null) ?? "suggested";
  const [mode, setMode] = useState<ClientProposalPriceMode>(initialMode);
  const [customPrice, setCustomPrice] = useState(
    savedMode === "custom" && savedPrice ? String(savedPrice) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const previewPrice = useMemo(() => {
    try {
      return resolveClientProposalPrice(
        mode,
        mode === "custom" ? Number(customPrice.replace(",", ".")) : null,
        { suggestedPrice, commercialMin, commercialMax }
      );
    } catch {
      return null;
    }
  }, [mode, customPrice, suggestedPrice, commercialMin, commercialMax]);

  async function handleSubmit(goToProposal: boolean) {
    setError(null);
    setIsSaving(true);

    try {
      const parsedCustom =
        mode === "custom" ? Number(customPrice.replace(/\./g, "").replace(",", ".")) : null;

      await saveClientProposalPrice(estimateId, {
        mode,
        customPrice: parsedCustom,
        redirectToResult: goToProposal,
      });

      if (!goToProposal) {
        router.refresh();
        setIsSaving(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar preço.");
      setIsSaving(false);
    }
  }

  const canProceed = previewPrice != null && previewPrice > 0;

  return (
    <Card className="border-matilha-yellow bg-gradient-to-br from-matilha-yellow-muted to-card">
      <CardHeader>
        <CardTitle>Preço para o cliente</CardTitle>
        <CardDescription>
          Escolha um único valor antes de gerar a proposta. Faixa comercial interna:{" "}
          {formatCurrency(commercialMin)} – {formatCurrency(commercialMax)} · sugerido{" "}
          {formatCurrency(suggestedPrice)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {MODES.map((option) => {
            const value =
              option === "suggested"
                ? suggestedPrice
                : option === "commercial_min"
                  ? commercialMin
                  : option === "commercial_max"
                    ? commercialMax
                    : null;

            return (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition-colors ${
                  mode === option ? "border-matilha-yellow ring-1 ring-matilha-yellow" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="clientPriceMode"
                  value={option}
                  checked={mode === option}
                  onChange={() => setMode(option)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium">{CLIENT_PRICE_MODE_LABELS[option]}</span>
                  {value != null && (
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {formatCurrency(value)}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>

        {mode === "custom" && (
          <div className="max-w-sm space-y-2">
            <Label htmlFor="customClientPrice">Valor personalizado</Label>
            <Input
              id="customClientPrice"
              inputMode="decimal"
              placeholder="Ex.: 45000"
              value={customPrice}
              onChange={(event) => setCustomPrice(event.target.value)}
            />
          </div>
        )}

        <div className="rounded-xl border bg-white px-4 py-3">
          <p className="text-sm text-muted-foreground">Valor que irá na proposta</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {previewPrice != null ? formatCurrency(previewPrice) : "—"}
          </p>
        </div>

        {savedPrice != null && savedMode && (
          <p className="text-sm text-muted-foreground">
            Última escolha salva: {formatCurrency(savedPrice)} (
            {CLIENT_PRICE_MODE_LABELS[savedMode as ClientProposalPriceMode] ?? savedMode})
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={!canProceed || isSaving}
            onClick={() => void handleSubmit(true)}
          >
            {isSaving ? "Gerando..." : "Gerar proposta para cliente"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!canProceed || isSaving}
            onClick={() => void handleSubmit(false)}
          >
            Salvar escolha
          </Button>
          {savedPrice != null && (
            <Button variant="ghost" asChild>
              <Link href={`/estimates/${estimateId}/result`}>Abrir proposta salva</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
