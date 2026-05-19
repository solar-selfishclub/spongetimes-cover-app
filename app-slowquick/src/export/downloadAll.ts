import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { slideToDataUrl } from './slideToPng';

export async function downloadAllAsZip(
  nodes: HTMLElement[],
  zipName = 'spongetimes-carousel.zip'
) {
  const zip = new JSZip();
  for (let i = 0; i < nodes.length; i++) {
    const dataUrl = await slideToDataUrl(nodes[i]);
    const base64 = dataUrl.split(',')[1];
    const filename = `slide-${String(i + 1).padStart(2, '0')}.png`;
    zip.file(filename, base64, { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}
