import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

const TARGET_W = 1080;
const TARGET_H = 1350;

const overrideStyle: Partial<CSSStyleDeclaration> = {
  transform: 'none',
  transformOrigin: 'top left',
  width: `${TARGET_W}px`,
  height: `${TARGET_H}px`,
};

export async function slideToDataUrl(node: HTMLElement): Promise<string> {
  const noAnim = document.createElement('style');
  noAnim.textContent = '* { animation: none !important; transition: none !important; }';
  document.head.appendChild(noAnim);
  try {
    return await toPng(node, {
      pixelRatio: 1,
      width: TARGET_W,
      height: TARGET_H,
      cacheBust: true,
      style: overrideStyle as Record<string, string>,
      skipFonts: false,
    });
  } finally {
    document.head.removeChild(noAnim);
  }
}

export async function downloadSlide(node: HTMLElement, filename: string) {
  const dataUrl = await slideToDataUrl(node);
  const blob = await (await fetch(dataUrl)).blob();
  saveAs(blob, filename);
}
