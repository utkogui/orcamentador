"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ApplicationFlowGraph } from "@/lib/application-flow/types";
import {
  flowToUmlMermaid,
  listFlowBlocks,
  type UmlDiagramKind,
} from "@/lib/application-flow/to-uml-mermaid";

type Props = {
  flow: ApplicationFlowGraph;
  className?: string;
  defaultKind?: UmlDiagramKind;
};

export function UmlJourneyDiagram({ flow, className, defaultKind = "activity" }: Props) {
  const reactId = useId().replace(/:/g, "");
  const [kind, setKind] = useState<UmlDiagramKind>(defaultKind);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const definition = useMemo(() => flowToUmlMermaid(flow, kind), [flow, kind]);
  const blocks = useMemo(() => listFlowBlocks(flow), [flow]);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: "14px",
            primaryColor: "#ffffff",
            primaryTextColor: "#0f172a",
            primaryBorderColor: "#334155",
            lineColor: "#64748b",
            secondaryColor: "#f8fafc",
            tertiaryColor: "#f1f5f9",
          },
          flowchart: {
            htmlLabels: false,
            curve: "linear",
            padding: 20,
            nodeSpacing: 40,
            rankSpacing: 64,
            subGraphTitleMargin: { top: 8, bottom: 8 },
          },
        });

        const renderId = `uml_${reactId}_${kind}_${Date.now()}`;
        const { svg: nextSvg } = await mermaid.render(renderId, definition);
        if (!cancelled) {
          setSvg(nextSvg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setSvg("");
          setError(err instanceof Error ? err.message : "Falha ao renderizar diagrama UML");
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [definition, kind, reactId]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setKind("activity")}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              kind === "activity"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50"
            )}
          >
            Diagrama de atividade
          </button>
          <button
            type="button"
            onClick={() => setKind("state")}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              kind === "state"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50"
            )}
          >
            Diagrama de estados
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Role para navegar · {flow.nodes.length} elementos
          {blocks.length > 0 ? ` · ${blocks.length} blocos` : ""}
        </p>
      </div>

      {blocks.length > 0 ? (
        <ol className="flex flex-wrap gap-2">
          {blocks.map((block, index) => (
            <li
              key={block.id}
              className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                {block.step || index + 1}
              </span>
              <span className="font-medium text-slate-800">{block.name}</span>
              <span className="text-muted-foreground">{block.nodeCount} nós</span>
              {index < blocks.length - 1 ? (
                <span className="text-muted-foreground" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}

      <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border bg-white px-3 py-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-full border border-emerald-600 bg-emerald-50" /> início /
          fim
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-sm border border-slate-500 bg-white" /> tela
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rotate-45 border border-violet-500 bg-violet-50" />{" "}
          decisão
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded border border-dashed border-amber-600" /> status
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" /> sim / sucesso
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-600" /> não / erro
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-600" /> desvio
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600" /> segue para próximo bloco
        </span>
      </div>

      <div className="max-h-[min(72vh,820px)] overflow-auto rounded-xl border bg-slate-50/80 p-5 shadow-inner">
        {error ? (
          <div className="space-y-2">
            <p className="text-sm text-red-600">Não foi possível montar o UML: {error}</p>
            <pre className="max-h-48 overflow-auto rounded bg-muted p-3 text-[10px] text-muted-foreground">
              {definition}
            </pre>
          </div>
        ) : svg ? (
          <div
            className="uml-mermaid mx-auto flex min-h-[360px] w-max min-w-full justify-center [&_svg]:h-auto [&_svg]:max-w-none"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">Gerando diagrama UML…</p>
        )}
      </div>
    </div>
  );
}
