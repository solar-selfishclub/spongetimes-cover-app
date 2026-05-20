import { saveAs } from 'file-saver';
import { COLORS } from '../tokens';

const W = 1080;
const H = 1350;
const FONT_STACK = 'Pretendard, "Pretendard Variable", "Noto Sans KR", sans-serif';

// ──────────────────────────────────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────────────────────────────────

function pickMime(): { mimeType: string; ext: 'mp4' | 'webm' } {
  const mp4 = ['video/mp4;codecs=avc1', 'video/mp4'];
  const webm = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  for (const m of mp4) if (MediaRecorder.isTypeSupported(m)) return { mimeType: m, ext: 'mp4' };
  for (const m of webm) if (MediaRecorder.isTypeSupported(m)) return { mimeType: m, ext: 'webm' };
  throw new Error('이 브라우저는 MediaRecorder 비디오 인코딩을 지원하지 않습니다.');
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function setupRecorder(canvas: HTMLCanvasElement, mimeType: string) {
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 6_000_000
  });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const blobPromise = new Promise<Blob>((resolve, reject) => {
    const failTimer = setTimeout(
      () => reject(new Error('MediaRecorder did not emit "stop" within 70s')),
      70_000
    );
    recorder.onstop = () => {
      clearTimeout(failTimer);
      resolve(new Blob(chunks, { type: mimeType }));
    };
    recorder.onerror = (e) => {
      clearTimeout(failTimer);
      reject(new Error(`MediaRecorder error: ${(e as unknown as { error?: unknown }).error ?? 'unknown'}`));
    };
  });
  return { recorder, blobPromise };
}

/**
 * setTimeout-based loop (not requestAnimationFrame) so the export works
 * even if the document/iframe is throttled or backgrounded.
 */
function runFrameLoop(
  drawFrame: (elapsedMs: number) => void,
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
      drawFrame(elapsed);
      setTimeout(tick, 1000 / fps);
    }
    setTimeout(tick, 0);
  });
}

// ──────────────────────────────────────────────────────────────────────────
// CTA slide → MP4 (animated follow button pulse + chevron nudge)
// ──────────────────────────────────────────────────────────────────────────

export type CtaVideoExportProps = {
  // The CTA slide's DOM rendered to PNG, with the follow button AND prelude
  // chevrons hidden so we can re-draw the animated parts on top each frame.
  chromeImage: HTMLImageElement;
  // Pixel bbox of the follow button inside the 1080×1350 slide.
  buttonRect: { x: number; y: number; w: number; h: number };
  // Centers of the "더 많은 이야기가…" chevrons, plus their font size,
  // measured at rest. Each will be re-drawn rotated 90° with a vertical
  // nudge that loops at 1.2s like the CSS .cta-prelude-arrow.
  arrowRects?: { cx: number; cy: number; fontSize: number }[];
};

export async function downloadCtaAsVideo(
  filename: string,
  props: CtaVideoExportProps,
  opts: { durationMs?: number } = {}
): Promise<void> {
  const durationMs = opts.durationMs ?? 3600; // ~2 full pulse cycles at 1.8s each
  const { mimeType, ext } = pickMime();

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const { chromeImage, buttonRect } = props;

  // Pre-bake the button (pill + label) into an off-screen canvas ONCE.
  const SUPERSAMPLE = 2;
  const btnCanvas = document.createElement('canvas');
  btnCanvas.width = Math.ceil(buttonRect.w * SUPERSAMPLE);
  btnCanvas.height = Math.ceil(buttonRect.h * SUPERSAMPLE);
  const bctx = btnCanvas.getContext('2d');
  if (!bctx) throw new Error('Canvas 2D context unavailable');
  bctx.scale(SUPERSAMPLE, SUPERSAMPLE);
  bctx.fillStyle = COLORS.surface.cardYellow;
  roundRect(bctx, 0, 0, buttonRect.w, buttonRect.h, buttonRect.h / 2);
  bctx.fill();
  bctx.fillStyle = COLORS.text.primary;
  bctx.font = `700 26px ${FONT_STACK}`;
  bctx.textAlign = 'center';
  bctx.textBaseline = 'middle';
  bctx.fillText('+ 팔로우', buttonRect.w / 2, buttonRect.h / 2 + 2);

  function drawFrame(elapsed: number) {
    if (!ctx) return;
    ctx.fillStyle = COLORS.bg.cta;
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(chromeImage, 0, 0, W, H);

    // Follow-pulse: matches CSS keyframes (1.8s, ease-in-out via sin curve)
    const period = 1800;
    const phase = (elapsed % period) / period;
    const pulseT = Math.sin(phase * Math.PI);
    const scale = 1 + 0.06 * pulseT;
    const glowAlpha = pulseT;

    const cx = buttonRect.x + buttonRect.w / 2;
    const cy = buttonRect.y + buttonRect.h / 2;
    const scaledW = buttonRect.w * scale;
    const scaledH = buttonRect.h * scale;

    ctx.save();
    ctx.shadowColor = `rgba(255, 230, 122, ${0.55 * glowAlpha})`;
    ctx.shadowBlur = 28 * glowAlpha;
    ctx.drawImage(btnCanvas, cx - scaledW / 2, cy - scaledH / 2, scaledW, scaledH);
    ctx.restore();

    // Prelude chevrons — same 1.2s ease-in-out nudge as the CSS class
    if (props.arrowRects && props.arrowRects.length > 0) {
      const arrowPeriod = 1200;
      const arrowPhase = (elapsed % arrowPeriod) / arrowPeriod;
      const arrowT = Math.sin(arrowPhase * Math.PI);
      const arrowNudge = arrowT * 10;
      for (const a of props.arrowRects) {
        ctx.save();
        ctx.translate(a.cx, a.cy + arrowNudge);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = COLORS.text.primary;
        ctx.globalAlpha = 0.55;
        ctx.font = `700 ${a.fontSize}px ${FONT_STACK}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('››', 0, 0);
        ctx.restore();
      }
    }
  }

  drawFrame(0);

  const { recorder, blobPromise } = setupRecorder(canvas, mimeType);
  recorder.start();

  await runFrameLoop(
    (elapsed) => drawFrame(elapsed),
    (elapsed) => elapsed >= durationMs
  );

  await new Promise((r) => setTimeout(r, 150));
  recorder.stop();

  const blob = await blobPromise;
  saveAs(blob, filename.replace(/\.(mp4|webm)$/, '') + '.' + ext);
}
