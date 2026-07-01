import { saveAs } from 'file-saver';
import { slideToDataUrl } from './slideToPng';

const W = 1080;
const H = 1350;
const MAX_DURATION_MS = 30_000; // safety cap for very long uploads

function pickMime(): { mimeType: string; ext: 'mp4' | 'webm' } {
  const mp4 = ['video/mp4;codecs=avc1', 'video/mp4'];
  const webm = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  for (const m of mp4) if (MediaRecorder.isTypeSupported(m)) return { mimeType: m, ext: 'mp4' };
  for (const m of webm) if (MediaRecorder.isTypeSupported(m)) return { mimeType: m, ext: 'webm' };
  throw new Error('이 브라우저는 MediaRecorder 비디오 인코딩을 지원하지 않습니다.');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('배경 스냅샷 이미지를 불러오지 못했습니다.'));
    img.src = src;
  });
}

function loadRecVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    v.src = url;
    v.muted = false; // keep the audio track so it can be recorded
    v.playsInline = true;
    v.preload = 'auto';
    v.onloadedmetadata = () => resolve(v);
    v.onerror = () => reject(new Error('영상을 불러오지 못했습니다.'));
  });
}

/**
 * setTimeout-based frame loop (not requestAnimationFrame) so the export keeps
 * running even if the tab is throttled/backgrounded.
 */
function runFrameLoop(
  drawFrame: () => void,
  shouldStop: (elapsedMs: number) => boolean,
  fps = 30
): Promise<void> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    let stopped = false;
    function tick() {
      if (stopped) return;
      const elapsed = performance.now() - startTime;
      if (shouldStop(elapsed)) {
        stopped = true;
        resolve();
        return;
      }
      drawFrame();
      setTimeout(tick, 1000 / fps);
    }
    setTimeout(tick, 0);
  });
}

export type CoverVideoExportOpts = {
  videoUrl: string;
  xPct: number; // 0–100, video center X
  yPct: number; // 0–100, video center Y
  sizePct: number; // percent of 1080 width
  filename: string;
};

/**
 * Render the cover slide to an MP4 (or WebM fallback): the static parts
 * (background, title, character image) are baked once via html-to-image, then
 * the uploaded video is composited on top frame-by-frame at its slot rect. The
 * upload's audio track, if any, is muxed into the recording.
 */
export async function downloadCoverAsVideo(
  node: HTMLElement,
  opts: CoverVideoExportOpts
): Promise<void> {
  const { mimeType, ext } = pickMime();

  const recVideo = await loadRecVideo(opts.videoUrl);

  // Bake the static chrome with the live <video> temporarily hidden so the
  // snapshot only holds background + text + character image.
  const domVideo = node.querySelector('video.cover-video') as HTMLElement | null;
  const prevVisibility = domVideo?.style.visibility ?? '';
  if (domVideo) domVideo.style.visibility = 'hidden';
  let chromeUrl: string;
  try {
    chromeUrl = await slideToDataUrl(node);
  } finally {
    if (domVideo) domVideo.style.visibility = prevVisibility;
  }
  const chromeImage = await loadImage(chromeUrl);

  // Video slot rect (center-anchored), preserving the upload's aspect ratio to
  // match the slide's objectFit:'contain' / height:auto rendering.
  const aspect = recVideo.videoWidth / recVideo.videoHeight || 1;
  const dispW = (opts.sizePct / 100) * W;
  const dispH = dispW / aspect;
  const cx = (opts.xPct / 100) * W;
  const cy = (opts.yPct / 100) * H;
  const drawX = cx - dispW / 2;
  const drawY = cy - dispH / 2;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  function drawFrame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(chromeImage, 0, 0, W, H);
    // readyState >= 2 (HAVE_CURRENT_DATA) means a frame is available to draw.
    if (recVideo.readyState >= 2) {
      ctx.drawImage(recVideo, drawX, drawY, dispW, dispH);
    }
  }

  // Play the upload once (no loop) so the export length matches its duration.
  recVideo.loop = false;
  recVideo.currentTime = 0;
  await recVideo.play();

  // Combine canvas video with the upload's audio (if it has any).
  const canvasStream = canvas.captureStream(30);
  const tracks = [...canvasStream.getVideoTracks()];
  const recStream = (recVideo as HTMLVideoElement & {
    captureStream?: () => MediaStream;
    mozCaptureStream?: () => MediaStream;
  });
  const srcStream = recStream.captureStream?.() ?? recStream.mozCaptureStream?.();
  if (srcStream) tracks.push(...srcStream.getAudioTracks());
  const stream = new MediaStream(tracks);

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const blobPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = (e) =>
      reject(new Error(`MediaRecorder error: ${(e as unknown as { error?: unknown }).error ?? 'unknown'}`));
  });

  const durationMs =
    Number.isFinite(recVideo.duration) && recVideo.duration > 0
      ? Math.min(recVideo.duration * 1000, MAX_DURATION_MS)
      : MAX_DURATION_MS;

  drawFrame();
  recorder.start(250); // emit chunks periodically (more robust than stop-only)

  let ended = false;
  recVideo.onended = () => {
    ended = true;
  };

  await runFrameLoop(drawFrame, (elapsed) => ended || elapsed >= durationMs);

  // Flush the final frame before stopping.
  await new Promise((r) => setTimeout(r, 150));
  recorder.stop();
  recVideo.pause();

  const blob = await blobPromise;
  saveAs(blob, opts.filename.replace(/\.(mp4|webm)$/i, '') + '.' + ext);
}
