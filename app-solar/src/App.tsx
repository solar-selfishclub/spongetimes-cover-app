import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useSpotlightDraft, splitHighlightInput } from './state/useSpotlightDraft';
import { highlighterColors, PUBLISHER_NAMES, PublisherName } from './tokens';
import { CoverEditor } from './form/editors/CoverEditor';
import { CtaEditor } from './form/editors/CtaEditor';
import { CoverSlide } from './slides/CoverSlide';
import { CtaSlide } from './slides/CtaSlide';
import { downloadSlide, slideToDataUrl } from './export/slideToPng';
import { downloadAllAsZip } from './export/downloadAll';
import { downloadCtaAsVideo } from './export/slideToVideo';
import { buildSlideOrder } from './slideOrder';

const ACTIVE_SCALE = 0.55; // 1080 * 0.55 = 594, 1350 * 0.55 = 742.5

export default function App() {
  const { draft, update, reset } = useSpotlightDraft();
  const [exporting, setExporting] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const order = useMemo(() => buildSlideOrder(), []);
  const total = order.length;

  // Clamp index when slide list shrinks/grows
  useEffect(() => {
    if (currentIdx >= total) setCurrentIdx(total - 1);
  }, [currentIdx, total]);

  // One ref per slide. All slides remain mounted off-screen so PNG/ZIP export
  // can capture any of them; only the current one is shown.
  const slideRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
  if (slideRefs.current.length !== total) {
    slideRefs.current = Array.from(
      { length: total },
      (_, i) => slideRefs.current[i] ?? { current: null }
    );
  }

  const coverHighlight = useMemo(
    () => splitHighlightInput(draft.mainTitleHighlight),
    [draft.mainTitleHighlight]
  );
  const ctaHighlight = useMemo(
    () => splitHighlightInput(draft.ctaQuestionHighlight),
    [draft.ctaQuestionHighlight]
  );

  // Per-slide highlighter CSS vars. Cover and CTA each carry their own
  // HighlighterStyle so we compute --highlighter / --highlighter-subtle once
  // per slide kind and attach them to that slide's wrapper div. This way
  // changing the cover's highlight doesn't bleed into the CTA preview.
  function highlighterStyleForKind(kind: 'cover' | 'cta'): CSSProperties {
    const style = kind === 'cover' ? draft.coverHighlighter : draft.ctaHighlighter;
    const hl = highlighterColors(draft.publisher, style);
    return {
      ['--highlighter' as never]: hl.main,
      ['--highlighter-subtle' as never]: hl.subtle
    };
  }

  function suffixForIdx(idx: number): string {
    return order[idx].kind;
  }

  async function captureOne(idx: number) {
    const node = slideRefs.current[idx]?.current;
    if (!node) return;
    const filename = `slide-${String(idx + 1).padStart(2, '0')}-${suffixForIdx(idx)}.png`;
    setExporting(true);
    try {
      await downloadSlide(node, filename);
    } finally {
      setExporting(false);
    }
  }

  async function captureAll() {
    const nodes = slideRefs.current
      .map((r) => r.current)
      .filter((n): n is HTMLDivElement => !!n);
    if (nodes.length === 0) return;
    setExporting(true);
    try {
      await downloadAllAsZip(nodes, `spongetimes-W${draft.week}-${draft.publisher}.zip`);
    } finally {
      setExporting(false);
    }
  }

  // CTA → MP4: snapshot the slide with the animated parts (follow button +
  // chevrons) hidden, then drive those parts in a canvas overlay so the export
  // can record real animation. The on-screen preview is restored before
  // recording starts so the editor keeps animating during export.
  async function captureCurrentAsVideo() {
    const idx = currentIdx;
    const entry = order[idx];
    if (entry.kind !== 'cta') return;
    const node = slideRefs.current[idx]?.current;
    if (!node) return;
    const btn = node.querySelector('.follow-card__button') as HTMLElement | null;
    if (!btn) {
      alert('팔로우 버튼을 찾지 못했어요.');
      return;
    }
    const arrows = Array.from(
      node.querySelectorAll<HTMLElement>('.cta-prelude-arrow')
    ).slice(0, 2);

    // Freeze every animating element so bbox reads reflect the rest state.
    const prevBtnVisibility = btn.style.visibility;
    const prevBtnAnimation = btn.style.animation;
    btn.style.animation = 'none';
    const prevArrowState = arrows.map((a) => ({
      visibility: a.style.visibility,
      animation: a.style.animation
    }));
    arrows.forEach((a) => {
      a.style.animation = 'none';
    });
    void btn.offsetWidth; // force layout flush

    const slideRect = node.getBoundingClientRect();
    const btnBox = btn.getBoundingClientRect();
    // Convert from display-pixel coords to 1080×1350 slide-local coords
    const scaleX = 1080 / slideRect.width;
    const scaleY = 1350 / slideRect.height;
    const buttonRect = {
      x: (btnBox.left - slideRect.left) * scaleX,
      y: (btnBox.top - slideRect.top) * scaleY,
      w: btnBox.width * scaleX,
      h: btnBox.height * scaleY
    };
    const arrowRects = arrows.map((a) => {
      const r = a.getBoundingClientRect();
      const inner = a.firstElementChild as HTMLElement | null;
      const fontPx = parseFloat(getComputedStyle(inner ?? a).fontSize) || 28;
      return {
        cx: (r.left - slideRect.left + r.width / 2) * scaleX,
        cy: (r.top - slideRect.top + r.height / 2) * scaleY,
        fontSize: fontPx * scaleX
      };
    });

    btn.style.visibility = 'hidden';
    arrows.forEach((a) => {
      a.style.visibility = 'hidden';
    });
    setExporting(true);
    const restore = () => {
      btn.style.visibility = prevBtnVisibility;
      btn.style.animation = prevBtnAnimation;
      arrows.forEach((a, i) => {
        a.style.visibility = prevArrowState[i].visibility;
        a.style.animation = prevArrowState[i].animation;
      });
    };
    try {
      const dataUrl = await slideToDataUrl(node);
      const chromeImage = await new Promise<HTMLImageElement>((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = dataUrl;
      });
      restore();
      const filename = `slide-${String(idx + 1).padStart(2, '0')}-cta`;
      await downloadCtaAsVideo(filename, { chromeImage, buttonRect, arrowRects });
    } catch (e) {
      restore();
      alert((e as Error).message ?? '비디오 생성에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  }

  function renderSlide(idx: number) {
    const entry = order[idx];
    switch (entry.kind) {
      case 'cover':
        return (
          <CoverSlide
            week={draft.week}
            contentType={draft.contentType}
            mainTitle={draft.mainTitle}
            mainTitleSize={draft.mainTitleSize}
            mainTitleAlign={draft.mainTitleAlign}
            mainTitleTopOffset={draft.mainTitleTopOffset}
            highlightWords={coverHighlight}
            publisher={draft.publisher}
            characterImage={draft.coverCharacterImage}
            characterX={draft.coverCharacterX}
            characterY={draft.coverCharacterY}
            characterSize={draft.coverCharacterSize}
          />
        );
      case 'cta':
        return (
          <CtaSlide
            labelText={draft.ctaLabel}
            questionText={draft.ctaQuestion}
            questionHighlightWords={ctaHighlight}
            characterMessage={draft.ctaCharacterMessage}
            characterImage={draft.ctaCharacterImage}
            characterSize={draft.ctaCharacterSize}
            characterMessageFontSize={draft.ctaCharacterMessageFontSize}
            characterMessageLineHeight={draft.ctaCharacterMessageLineHeight}
            characterRowOffsetY={draft.ctaCharacterRowOffsetY}
            followOffsetY={draft.ctaFollowOffsetY}
            secondaryFollow={
              draft.ctaSecondaryFollowEnabled && draft.ctaSecondaryFollowHandle.trim()
                ? {
                    name: draft.ctaSecondaryFollowName,
                    handle: draft.ctaSecondaryFollowHandle,
                    imageUrl: draft.ctaSecondaryFollowImage
                  }
                : null
            }
          />
        );
    }
  }

  function renderRightPanelEditor() {
    const entry = order[currentIdx];
    if (!entry) return null;
    switch (entry.kind) {
      case 'cover':
        return <CoverEditor draft={draft} update={update} />;
      case 'cta':
        return <CtaEditor draft={draft} update={update} />;
    }
  }

  const goPrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIdx((i) => Math.min(total - 1, i + 1));

  return (
    <div className="app-shell-v2">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="topbar-title">
          스폰지타임즈 표지 + CTA 생성기 <span className="topbar-sub">· mini</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--muted-mid)',
              letterSpacing: '-0.01em'
            }}
          >
            발행자
          </label>
          <select
            value={draft.publisher}
            onChange={(e) => update('publisher', e.target.value as PublisherName)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid rgba(0,0,0,0.15)',
              background: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {PUBLISHER_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn"
            onClick={captureAll}
            disabled={exporting}
          >
            {exporting ? '내보내는 중…' : `전체 PNG (${total}장 ZIP)`}
          </button>
        </div>
      </header>

      <div className="main-grid">
        {/* LEFT: active slide */}
        <section className="stage">
          <div className="stage-nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={goPrev}
              disabled={currentIdx === 0}
            >
              ← 이전
            </button>
            <div className="stage-counter">
              {currentIdx + 1} / {total}
              <span className="stage-label"> · {order[currentIdx]?.label}</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={goNext}
              disabled={currentIdx === total - 1}
            >
              다음 →
            </button>
          </div>

          <div className="stage-viewport">
            <div
              className="stage-slide-wrap"
              style={{
                width: 1080 * ACTIVE_SCALE,
                height: 1350 * ACTIVE_SCALE
              }}
            >
              <div
                style={{
                  transform: `scale(${ACTIVE_SCALE})`,
                  transformOrigin: 'top left',
                  width: 1080,
                  height: 1350,
                  ...highlighterStyleForKind(order[currentIdx].kind)
                }}
              >
                {renderSlide(currentIdx)}
              </div>
            </div>
          </div>

          <div className="stage-actions">
            <button
              type="button"
              className="btn"
              onClick={() => captureOne(currentIdx)}
              disabled={exporting}
            >
              PNG 다운로드
            </button>
            {order[currentIdx]?.kind === 'cta' && (
              <button
                type="button"
                className="btn"
                onClick={captureCurrentAsVideo}
                disabled={exporting}
                style={{ marginLeft: 8 }}
              >
                {exporting ? '내보내는 중…' : 'MP4 다운로드'}
              </button>
            )}
          </div>

          {/* Page dots */}
          <div className="stage-dots">
            {order.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`슬라이드 ${i + 1}`}
                className={`stage-dot ${i === currentIdx ? 'stage-dot--active' : ''}`}
                onClick={() => setCurrentIdx(i)}
              />
            ))}
          </div>
        </section>

        {/* RIGHT: editor for current slide */}
        <aside className="editor">
          {renderRightPanelEditor()}

          <div style={{ marginTop: 24, borderTop: '1px solid #E5E1D0', paddingTop: 18 }}>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => {
                if (confirm('모든 입력을 초기화하시겠어요?')) reset();
              }}
            >
              폼 초기화
            </button>
          </div>
        </aside>
      </div>

      {/* Off-screen mounted slides for PNG/ZIP capture */}
      <div className="offscreen-render-area" aria-hidden>
        {order.map((entry, i) => (
          <div
            key={`${entry.kind}-${i}`}
            ref={slideRefs.current[i]}
            style={{
              position: 'absolute',
              width: 1080,
              height: 1350,
              // The current slide is also rendered visibly in the stage,
              // but we keep this hidden duplicate so refs[currentIdx] always
              // points to a capturable 1080×1350 node.
              top: 0,
              left: 0,
              ...highlighterStyleForKind(entry.kind)
            }}
          >
            {renderSlide(i)}
          </div>
        ))}
      </div>
    </div>
  );
}
