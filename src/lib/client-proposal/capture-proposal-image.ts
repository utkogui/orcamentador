import { hardenFlowSvg } from "./flow-svg-export";

const FLOW_ROOT_SELECTOR = ".proposal-flow .react-flow";

export function injectFlowSnapshot(flowContainer: HTMLElement, dataUrl: string): () => void {
  const reactFlow = flowContainer.querySelector(FLOW_ROOT_SELECTOR) as HTMLElement | null;
  if (!reactFlow) {
    return () => {};
  }

  const snapshot = document.createElement("img");
  snapshot.src = dataUrl;
  snapshot.alt = "Estrutura da aplicação";
  snapshot.className = "proposal-flow-snapshot";
  snapshot.style.cssText =
    "display:block;width:100%;height:auto;border-radius:12px;background:#fafafa;vertical-align:top";

  const wrapper = document.createElement("div");
  wrapper.className = "proposal-flow-snapshot-wrap";
  wrapper.style.cssText = "width:100%;overflow:hidden;line-height:0";
  wrapper.appendChild(snapshot);

  const previousDisplay = reactFlow.style.display;
  const previousMinHeight = flowContainer.style.minHeight;
  reactFlow.style.display = "none";
  flowContainer.style.minHeight = "0";
  flowContainer.appendChild(wrapper);

  return () => {
    wrapper.remove();
    reactFlow.style.display = previousDisplay;
    flowContainer.style.minHeight = previousMinHeight;
  };
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function loadImageAsDataUrl(src: string): Promise<string> {
  const absolute = src.startsWith("http")
    ? src
    : `${window.location.origin}${src.startsWith("/") ? src : `/${src}`}`;

  const response = await fetch(absolute, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`failed to fetch ${absolute}`);
  }

  return blobToDataUrl(await response.blob());
}

async function waitForImages(root: ParentNode): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

/**
 * Converte imagens (logo etc.) para data URL — evita corte/ícone quebrado no PDF.
 */
export async function inlineImagesAsDataUrls(root: HTMLElement): Promise<() => void> {
  const restores: Array<{ img: HTMLImageElement; src: string; width: string; height: string }> =
    [];

  for (const img of Array.from(root.querySelectorAll("img"))) {
    if (img.classList.contains("proposal-flow-snapshot")) continue;
    if (img.src.startsWith("data:")) continue;

    const originalSrc = img.src;
    const originalWidth = img.style.width;
    const originalHeight = img.style.height;

    try {
      const dataUrl = await loadImageAsDataUrl(originalSrc);
      restores.push({
        img,
        src: originalSrc,
        width: originalWidth,
        height: originalHeight,
      });
      img.src = dataUrl;
      img.removeAttribute("srcset");
      img.style.display = "block";
      img.style.maxWidth = "none";

      if (img.classList.contains("proposal-logo")) {
        const height = img.height || Number.parseInt(img.style.height, 10) || 40;
        img.style.height = `${height}px`;
        img.style.width = "auto";
      }
    } catch {
      // mantém src original
    }
  }

  await waitForImages(root);

  return () => {
    for (const { img, src, width, height } of restores) {
      img.src = src;
      img.style.width = width;
      img.style.height = height;
    }
  };
}

export async function captureElementAsPng(element: HTMLElement): Promise<string> {
  hardenFlowSvg(element);

  const { domToPng } = await import("modern-screenshot");

  return domToPng(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      return !node.classList.contains("pdf-exclude") && !node.classList.contains("no-print");
    },
  });
}
