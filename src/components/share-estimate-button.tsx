"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  estimateId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  label?: string;
};

export function ShareEstimateButton({
  estimateId,
  variant = "outline",
  size = "sm",
  label = "Copiar link do comercial",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/p/${estimateId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={() => void handleCopy()}>
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Link copiado" : label}
    </Button>
  );
}
