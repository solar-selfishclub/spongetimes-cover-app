import { useEffect, useMemo, useRef, useState } from 'react';
import { useSpotlightDraft, splitHighlightInput } from './state/useSpotlightDraft';
import { CommonFields } from './form/editors/CommonFields';
import { CoverEditor } from './form/editors/CoverEditor';
import { CtaEditor } from './form/editors/CtaEditor';
import { CoverSlide } from './slides/CoverSlide';
import { CtaSlide } from './slides/CtaSlide';
import { downloadSlide } from './export/slideToPng';
import { downloadAllAsZip } from './export/downloadAll';
import { downloadCoverAsVideo } from './export/coverToVideo';
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

  async function captureCoverVideo(idx: number) {
    const node = slideRefs.current[idx]?.current;
    if (!node || !draft.coverVideoUrl) return;
    setExporting(true);
    try {
      await downloadCoverAsVideo(node, {
        videoUrl: draft.coverVideoUrl,
        xPct: draft.coverVideoX,
        yPct: draft.coverVideoY,
        sizePct: draft.coverVideoSize,
        filename: `spongetimes-W${draft.week}-${draft.publisher}-cover.mp4`
      });
    } catch (err) {
      alert(`MP4 내보내기에 실패했어요: ${err instanceof Error ? err.message : String(err)}`);
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
            videoUrl={draft.coverVideoUrl}
            videoX={draft.coverVideoX}
            videoY={draft.coverVideoY}
            videoSize={draft.coverVideoSize}
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
            messageFontFamily={draft.ctaMessageFontFamily}
            messageFontSize={draft.ctaMessageFontSize}
            messageFontWeight={draft.ctaMessageFontWeight}
            messageLetterSpacing={draft.ctaMessageLetterSpacing}
            messageLineHeight={draft.ctaMessageLineHeight}
            characterOffsetX={draft.ctaCharacterOffsetX}
            characterOffsetY={draft.ctaCharacterOffsetY}
            messageOffsetX={draft.ctaMessageOffsetX}
            messageOffsetY={draft.ctaMessageOffsetY}
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
        <button
          type="button"
          className="btn"
          onClick={captureAll}
          disabled={exporting}
        >
          {exporting ? '내보내는 중…' : `전체 PNG (${total}장 ZIP)`}
        </button>
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
                  height: 1350
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
            {order[currentIdx]?.kind === 'cover' && (
              <button
                type="button"
                className="btn"
                onClick={() => captureCoverVideo(currentIdx)}
                disabled={exporting || !draft.coverVideoUrl}
                title={draft.coverVideoUrl ? '' : '먼저 표지 영상을 업로드하세요'}
              >
                {exporting ? '내보내는 중…' : '표지 MP4'}
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
          <CommonFields draft={draft} update={update} />
          <hr className="editor-divider" />
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
              left: 0
            }}
          >
            {renderSlide(i)}
          </div>
        ))}
      </div>
    </div>
  );
}
