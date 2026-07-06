"use client";

import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
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

function JourneyNode({ data }: NodeProps<Node<ApplicationFlowNodeData>>) {
  return (
    <div
      className={cn(
        "min-w-[140px] max-w-[180px] rounded-lg border-2 px-3 py-2 shadow-sm",
        zoneStyles[data.zone]
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-neutral-400" />
      <p className="text-sm font-semibold leading-tight text-matilha-black">{data.label}</p>
      {data.subtitle && (
        <p className="mt-1 text-[11px] leading-snug text-neutral-600">{data.subtitle}</p>
      )}
      <Handle type="source" position={Position.Right} className="!bg-neutral-400" />
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
        edges={flow.edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
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
