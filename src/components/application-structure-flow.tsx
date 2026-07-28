"use client";

import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ApplicationFlowGraph, ApplicationFlowNodeData } from "@/lib/application-flow/types";
import { cropPngDataUrl, getFlowContentBounds, hardenFlowSvg } from "@/lib/client-proposal/flow-svg-export";
import { cn } from "@/lib/utils";

const zoneStyles: Record<ApplicationFlowNodeData["zone"], string> = {
  start: "border-emerald-500 bg-emerald-50",
  entry: "border-sky-500 bg-sky-50",
  auth: "border-violet-500 bg-violet-50",
  hub: "border-matilha-yellow bg-matilha-yellow-muted",
  feature: "border-neutral-400 bg-white",
  commerce: "border-amber-500 bg-amber-50",
  integration: "border-teal-500 bg-teal-50",
  end: "border-rose-500 bg-rose-50",
};

function FourHandles() {
  return (
    <>
      <Handle id="top" type="target" position={Position.Top} className="!bg-neutral-400" />
      <Handle id="left" type="target" position={Position.Left} className="!bg-neutral-400" />
      <Handle id="right" type="source" position={Position.Right} className="!bg-neutral-400" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-neutral-400" />
      <Handle id="top-source" type="source" position={Position.Top} className="!bg-neutral-400 !opacity-0" />
      <Handle id="left-source" type="source" position={Position.Left} className="!bg-neutral-400 !opacity-0" />
      <Handle id="right-target" type="target" position={Position.Right} className="!bg-neutral-400 !opacity-0" />
      <Handle id="bottom-target" type="target" position={Position.Bottom} className="!bg-neutral-400 !opacity-0" />
    </>
  );
}

function JourneyNode({ data }: NodeProps<Node<ApplicationFlowNodeData>>) {
  const kind = data.kind ?? "screen";

  if (kind === "decision") {
    return (
      <div className="relative flex h-[100px] w-[100px] items-center justify-center">
        <FourHandles />
        <div
          className={cn(
            "flex h-[70px] w-[70px] rotate-45 items-center justify-center border-2 shadow-sm",
            zoneStyles[data.zone]
          )}
        >
          <div className="-rotate-45 px-1 text-center">
            <p className="text-[11px] font-bold leading-tight text-matilha-black">{data.label}</p>
            {data.subtitle && (
              <p className="mt-0.5 text-[9px] leading-tight text-neutral-600">{data.subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (kind === "status") {
    return (
      <div
        className={cn(
          "relative min-w-[140px] max-w-[170px] rounded-md border-2 border-dashed px-3 py-2 shadow-sm",
          zoneStyles[data.zone]
        )}
      >
        <FourHandles />
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Status</p>
        <p className="text-sm font-semibold leading-tight text-matilha-black">{data.label}</p>
        {data.subtitle && (
          <p className="mt-1 text-[11px] leading-snug text-neutral-600">{data.subtitle}</p>
        )}
      </div>
    );
  }

  if (kind === "system") {
    return (
      <div
        className={cn(
          "relative min-w-[140px] max-w-[170px] rounded-full border-2 px-3 py-2 text-center shadow-sm",
          zoneStyles[data.zone]
        )}
      >
        <FourHandles />
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Sistema</p>
        <p className="text-sm font-semibold leading-tight text-matilha-black">{data.label}</p>
        {data.subtitle && (
          <p className="mt-1 text-[11px] leading-snug text-neutral-600">{data.subtitle}</p>
        )}
      </div>
    );
  }

  if (kind === "start" || kind === "end") {
    return (
      <div
        className={cn(
          "relative min-w-[130px] max-w-[160px] rounded-full border-2 px-4 py-3 text-center shadow-sm",
          zoneStyles[data.zone]
        )}
      >
        <FourHandles />
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
          {kind === "start" ? "Início" : "Fim"}
        </p>
        <p className="text-sm font-semibold leading-tight text-matilha-black">{data.label}</p>
        {data.subtitle && (
          <p className="mt-1 text-[11px] leading-snug text-neutral-600">{data.subtitle}</p>
        )}
      </div>
    );
  }

  // Tela: mini frame de browser + skeleton
  return (
    <div
      className={cn(
        "relative w-[188px] overflow-hidden rounded-lg border-2 bg-white shadow-md",
        zoneStyles[data.zone]
      )}
    >
      <FourHandles />
      <div className="flex items-center gap-1 border-b border-neutral-200 bg-neutral-100 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
        <span className="ml-1 flex-1 truncate rounded bg-white px-1.5 py-0.5 text-[9px] text-neutral-400">
          app / tela
        </span>
      </div>
      <div className="space-y-1.5 px-2.5 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">Tela</p>
        <p className="text-sm font-semibold leading-tight text-matilha-black">{data.label}</p>
        {data.subtitle && (
          <p className="text-[11px] leading-snug text-neutral-600">{data.subtitle}</p>
        )}
        <div className="space-y-1 pt-1">
          <div className="h-2 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-2 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-2 w-5/6 animate-pulse rounded bg-neutral-100" />
          <div className="mt-1 h-5 w-1/2 rounded bg-neutral-200/80" />
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { journey: JourneyNode };

export type ApplicationStructureFlowHandle = {
  fitViewForExport: () => Promise<void>;
  captureForPdf: () => Promise<string | null>;
};

type InnerProps = {
  flow: ApplicationFlowGraph;
  className?: string;
  showChrome?: boolean;
};

const ApplicationStructureFlowInner = forwardRef<
  ApplicationStructureFlowHandle,
  InnerProps
>(function ApplicationStructureFlowInner({ flow, className, showChrome = true }, ref) {
  const { fitView, getNodes } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      async fitViewForExport() {
        await fitView({ padding: 0.12, duration: 0, includeHiddenNodes: false });
        await new Promise((resolve) => setTimeout(resolve, 150));
      },
      async captureForPdf() {
        const inner = containerRef.current;
        if (!inner) return null;

        const nodes = getNodes();
        if (nodes.length === 0) return null;

        await fitView({ padding: 0.1, duration: 0, includeHiddenNodes: false });
        await new Promise((resolve) => setTimeout(resolve, 350));

        hardenFlowSvg(inner);

        const width = inner.clientWidth;
        const height = inner.clientHeight;
        const scale = 2;
        const contentBounds = getFlowContentBounds(inner);

        const { domToPng } = await import("modern-screenshot");
        const dataUrl = await domToPng(inner, {
          scale,
          backgroundColor: "#fafafa",
          width,
          height,
        });

        if (contentBounds) {
          return cropPngDataUrl(dataUrl, contentBounds, scale);
        }

        return dataUrl;
      },
    }),
    [fitView, getNodes]
  );

  const edgesWithMarkers: Edge[] = flow.edges.map((edge) => ({
    ...edge,
    markerEnd: edge.markerEnd ?? {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: (edge.style?.stroke as string) || "#64748b",
    },
    labelStyle: edge.labelStyle ?? { fill: "#334155", fontWeight: 700, fontSize: 11 },
    labelBgStyle: edge.labelBgStyle ?? { fill: "#ffffff", fillOpacity: 0.95 },
    labelBgPadding: edge.labelBgPadding ?? [4, 6],
    labelBgBorderRadius: edge.labelBgBorderRadius ?? 4,
  }));

  return (
    <div
      ref={containerRef}
      className={cn(
        "proposal-flow-inner h-[520px] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50",
        className
      )}
    >
      <ReactFlow
        nodes={flow.nodes}
        edges={edgesWithMarkers}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35, maxZoom: 0.85 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        edgesFocusable={false}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { stroke: "#64748b", strokeWidth: 2 },
          type: "smoothstep",
        }}
      >
        <Background gap={20} size={1} color="#d4d4d4" />
        {showChrome && (
          <>
            <Controls showInteractive={false} className="pdf-exclude" />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="pdf-exclude !bg-white/90"
            />
          </>
        )}
      </ReactFlow>
    </div>
  );
});

type Props = {
  flow: ApplicationFlowGraph;
  className?: string;
  showChrome?: boolean;
};

export const ApplicationStructureFlow = memo(
  forwardRef<ApplicationStructureFlowHandle, Props>(function ApplicationStructureFlow(
    props,
    ref
  ) {
    return (
      <ReactFlowProvider>
        <ApplicationStructureFlowInner ref={ref} {...props} />
      </ReactFlowProvider>
    );
  })
);
