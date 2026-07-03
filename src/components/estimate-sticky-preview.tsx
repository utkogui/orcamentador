"use client";

import { useEffect, useState } from "react";
import type { EstimateCalculationResult } from "@/lib/calculations";
import { EstimateMetricsBar } from "@/components/estimate-metrics-bar";
import { cn } from "@/lib/utils";

type Props = {
  result: EstimateCalculationResult;
  previewAnchorId?: string;
};

export function EstimateStickyPreview({
  result,
  previewAnchorId = "estimate-preview-anchor",
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const anchor = document.getElementById(previewAnchorId);
    if (!anchor) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [previewAnchorId]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 shadow-sm backdrop-blur transition-all duration-200 supports-[backdrop-filter]:bg-background/80",
        "w-screen",
        visible
          ? "opacity-100"
          : "pointer-events-none h-0 overflow-hidden border-transparent opacity-0 shadow-none"
      )}
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-3">
        <EstimateMetricsBar result={result} compact />
      </div>
    </div>
  );
}
