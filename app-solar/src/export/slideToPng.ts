import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

const TARGET_W = 1080;
const TARGET_H = 1350;

// Force the captured DOM to render at 1080×1350 regardless of preview scale.
const overrideStyle: Partial<CSSStyleDeclaration> = {
  transform: 'none',
  transformOrigin: 'top left',
  width: `${TARGET_W}px`,
  height: `${TARGET_H}px`
};

export async function slideToDataUrl(node: HTMLElement): Promise<string> {
  return toPng(node, {
    pixelRatio: 1,
    width: TARGET_W,
    height: TARGET_H,
    cacheBust: true,
    style: overrideStyle as Record<string, string>,
    skipFonts: true // Skip embedding ~5MB of Pretendard weights into every snapshot. Fonts are loaded in the page and SVG→canvas falls back to system Korean stack if needed.
  });
}

export async function downloadSlide(node: HTMLElement, filename: string) {
  const dataUrl = await slideToDataUrl(node);
  const blob = await (await fetch(dataUrl)).blob();
  saveAs(blob, filename);
}
