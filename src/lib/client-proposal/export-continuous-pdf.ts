import { jsPDF } from "jspdf";
import {
  captureElementAsPng,
  inlineImagesAsDataUrls,
  injectFlowSnapshot,
} from "./capture-proposal-image";

const PDF_WIDTH_MM = 210;
const PDF_MARGIN_MM = 12;
const PROPOSAL_CAPTURE_WIDTH_PX = 896;

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function buildProposalPdfFilename(projectName: string, clientName: string | null): string {
  const clientPart = sanitizeFilename(clientName ?? "cliente");
  const projectPart = sanitizeFilename(projectName).slice(0, 40);
  return `proposta-${clientPart}-${projectPart}.pdf`;
}

export type ExportContinuousPdfOptions = {
  captureFlow?: () => Promise<string | null>;
};

/**
 * PDF contínuo: snapshot dedicado do React Flow + captura modern-screenshot do artigo.
 */
export async function exportContinuousPdf(
  element: HTMLElement,
  filename: string,
  options: ExportContinuousPdfOptions = {}
): Promise<void> {
  const excludedElements = Array.from(
    element.querySelectorAll(".pdf-exclude, .no-print")
  ) as HTMLElement[];
  const previousDisplay = excludedElements.map((el) => el.style.display);
  excludedElements.forEach((el) => {
    el.style.display = "none";
  });

  const restores: Array<() => void> = [];

  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    element.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });

    const previousPadding = element.style.padding;
    const previousBoxSizing = element.style.boxSizing;
    const previousWidth = element.style.width;
    const previousMaxWidth = element.style.maxWidth;
    const previousMargin = element.style.margin;

    element.style.boxSizing = "border-box";
    element.style.width = `${PROPOSAL_CAPTURE_WIDTH_PX}px`;
    element.style.maxWidth = `${PROPOSAL_CAPTURE_WIDTH_PX}px`;
    element.style.margin = "0 auto";
    element.style.padding = "48px 40px 140px";
    restores.push(() => {
      element.style.padding = previousPadding;
      element.style.boxSizing = previousBoxSizing;
      element.style.width = previousWidth;
      element.style.maxWidth = previousMaxWidth;
      element.style.margin = previousMargin;
    });

    restores.push(await inlineImagesAsDataUrls(element));

    const flowContainer = element.querySelector(".proposal-flow") as HTMLElement | null;
    if (flowContainer && options.captureFlow) {
      const flowSnapshot = await options.captureFlow();
      if (flowSnapshot) {
        restores.push(injectFlowSnapshot(flowContainer, flowSnapshot));
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    const imgData = await captureElementAsPng(element);

    const image = await loadImage(imgData);
    const contentWidthMm = PDF_WIDTH_MM - PDF_MARGIN_MM * 2;
    const contentHeightMm = (image.height * contentWidthMm) / image.width;
    const pdfHeightMm = contentHeightMm + PDF_MARGIN_MM * 2;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [PDF_WIDTH_MM, pdfHeightMm],
      compress: true,
    });

    pdf.addImage(
      imgData,
      "PNG",
      PDF_MARGIN_MM,
      PDF_MARGIN_MM,
      contentWidthMm,
      contentHeightMm,
      undefined,
      "SLOW"
    );
    pdf.save(filename);
  } finally {
    for (const restore of restores.reverse()) restore();
    excludedElements.forEach((el, index) => {
      el.style.display = previousDisplay[index] ?? "";
    });
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
