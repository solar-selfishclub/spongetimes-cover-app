import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { slideToDataUrl } from './slideToPng';

export async function downloadAllAsZip(
  nodes: HTMLElement[],
  zipName: string,
  slideNames?: string[]
) {
  const zip = new JSZip();
  const defaultNames = nodes.map((_, i) => `slide-${String(i + 1).padStart(2, '0')}.png`);
  const names = slideNames ?? defaultNames;

  for (let i = 0; i < nodes.length; i++) {
    const dataUrl = await slideToDataUrl(nodes[i]);
    const base64 = dataUrl.split(',')[1];
    zip.file(names[i], base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}
