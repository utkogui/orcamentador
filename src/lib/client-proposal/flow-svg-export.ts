/** Garante stroke visível nos paths SVG do React Flow (capturas ignoram CSS). */
export function hardenFlowSvg(root: ParentNode): void {
  root.querySelectorAll(".react-flow__edges path, .react-flow__edge-path").forEach((node) => {
    if (!(node instanceof SVGPathElement)) return;

    const stroke = node.getAttribute("stroke") || node.style.stroke || "#64748b";
    const strokeWidth = node.getAttribute("stroke-width") || node.style.strokeWidth || "2";

    node.setAttribute("stroke", stroke);
    node.setAttribute("stroke-width", strokeWidth);
    node.setAttribute("fill", "none");
    node.style.stroke = stroke;
    node.style.strokeWidth = typeof strokeWidth === "string" ? strokeWidth : `${strokeWidth}px`;
    node.style.fill = "none";
    node.style.opacity = "1";
  });

  root.querySelectorAll(".react-flow__edges marker path").forEach((node) => {
    if (!(node instanceof SVGPathElement)) return;
    node.setAttribute("fill", node.getAttribute("fill") || "#64748b");
  });
}

export type FlowContentBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Bounds visíveis dos nós/edges dentro do container — ignora espaço vazio do canvas. */
export function getFlowContentBounds(
  inner: HTMLElement,
  padding = 24
): FlowContentBounds | null {
  const innerRect = inner.getBoundingClientRect();
  const elements = inner.querySelectorAll(".react-flow__node, .react-flow__edge-path");

  if (elements.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    minX = Math.min(minX, rect.left - innerRect.left);
    minY = Math.min(minY, rect.top - innerRect.top);
    maxX = Math.max(maxX, rect.right - innerRect.left);
    maxY = Math.max(maxY, rect.bottom - innerRect.top);
  });

  const x = Math.max(0, Math.floor(minX - padding));
  const y = Math.max(0, Math.floor(minY - padding));
  const width = Math.min(
    inner.clientWidth - x,
    Math.ceil(maxX - minX + padding * 2)
  );
  const height = Math.min(
    inner.clientHeight - y,
    Math.ceil(maxY - minY + padding * 2)
  );

  if (width <= 0 || height <= 0) return null;

  return { x, y, width, height };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/** Recorta PNG gerado pelo domToPng usando coordenadas do DOM (scale = pixelRatio). */
export async function cropPngDataUrl(
  dataUrl: string,
  bounds: FlowContentBounds,
  scale: number
): Promise<string> {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = bounds.width * scale;
  canvas.height = bounds.height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  ctx.drawImage(
    image,
    bounds.x * scale,
    bounds.y * scale,
    bounds.width * scale,
    bounds.height * scale,
    0,
    0,
    bounds.width * scale,
    bounds.height * scale
  );

  return canvas.toDataURL("image/png");
}

