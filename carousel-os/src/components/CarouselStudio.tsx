'use client';

import { createRef, RefObject, useRef, useState } from 'react';
import { useCarouselDraft } from '@/state/useCarouselDraft';
import { SLIDE_LABELS } from '@/tokens';
import { downloadSlide } from '@/lib/slideToPng';
import { downloadAllAsZip } from '@/lib/downloadAll';

import { CommonFields } from './editor/CommonFields';
import { SlideTabBar } from './editor/SlideTabBar';
import { CoverEditor } from './editor/editors/CoverEditor';
import { BodySlideEditor } from './editor/editors/BodySlideEditor';
import { InsightEditor } from './editor/editors/InsightEditor';
import { SummaryEditor } from './editor/editors/SummaryEditor';
import { OutroEditor } from './editor/editors/OutroEditor';

import { SlideFrame } from './preview/SlideFrame';
import { CoverSlide } from './slides/CoverSlide';
import { BodySlide } from './slides/BodySlide';
import { OutroSlide } from './slides/OutroSlide';
import { NumberedList } from './slides/parts/NumberedList';

const NUM_SLIDES = 6;

export function CarouselStudio() {
  const { draft, update, reset } = useCarouselDraft();
  const [activeTab, setActiveTab] = useState(0);
  const [exporting, setExporting] = useState(false);

  // 오프스크린 풀사이즈 refs (PNG 캡처용)
  const slideRefs = useRef<RefObject<HTMLDivElement | null>[]>(
    Array.from({ length: NUM_SLIDES }, () => createRef<HTMLDivElement>())
  );

  function getSlideNames() {
    return Array.from({ length: NUM_SLIDES }, (_, i) =>
      `W${String(draft.week).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}-${SLIDE_LABELS[i]}.png`
    );
  }

  async function handleDownloadCurrent() {
    const node = slideRefs.current[activeTab]?.current ?? null;
    if (!node) return;
    setExporting(true);
    try {
      const name = getSlideNames()[activeTab];
      await downloadSlide(node, name);
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadAll() {
    const nodes = slideRefs.current.map((r) => r.current).filter((n): n is HTMLDivElement => n !== null);
    if (nodes.length === 0) return;
    setExporting(true);
    try {
      await downloadAllAsZip(
        nodes,
        `스폰지타임즈-W${String(draft.week).padStart(2, '0')}.zip`,
        getSlideNames()
      );
    } finally {
      setExporting(false);
    }
  }

  function handleTabChange(tab: number) {
    setActiveTab(tab);
    // 헤더 태그 자동 업데이트
    update('cover_headerTag', `Week ${draft.week} · ${draft.topic}`);
  }

  // 슬라이드 렌더 함수 (미리보기 + 오프스크린 공용)
  function renderSlide(index: number) {
    switch (index) {
      case 0:
        return (
          <CoverSlide
            week={draft.week}
            headerTag={draft.cover_headerTag}
            mainCopy={draft.cover_mainCopy}
            highlightWords={draft.cover_highlightWords}
            subCopy={draft.cover_subCopy}
            auxLine1={draft.cover_auxLine1}
            auxLine2={draft.cover_auxLine2}
            authorHandle={draft.authorHandle}
            characterImage={draft.cover_characterImage}
            characterX={draft.cover_characterX}
            characterY={draft.cover_characterY}
            characterSize={draft.cover_characterSize}
          />
        );
      case 1:
        return (
          <BodySlide
            week={draft.week}
            authorHandle={draft.authorHandle}
            label={`Week ${draft.week} · 문제`}
            mainCopy={draft.problem_mainCopy}
            highlightWords={draft.problem_highlightWords}
            bodyText={draft.problem_bodyText}
            characterImage={draft.problem_characterImage}
            characterX={draft.problem_characterX}
            characterY={draft.problem_characterY}
            characterSize={draft.problem_characterSize}
            topImage={draft.problem_topImage}
            topImageX={draft.problem_topImageX}
            topImageY={draft.problem_topImageY}
            topImageSize={draft.problem_topImageSize}
            topImageAnimation={draft.problem_topImageAnimation}
            topImageDuration={draft.problem_topImageDuration}
          />
        );
      case 2:
        return (
          <BodySlide
            week={draft.week}
            authorHandle={draft.authorHandle}
            label="내가 한 삽질"
            mainCopy={draft.struggle_mainCopy}
            highlightWords={draft.struggle_highlightWords}
            bodyText={draft.struggle_bodyText}
            characterImage={draft.struggle_characterImage}
            characterX={draft.struggle_characterX}
            characterY={draft.struggle_characterY}
            characterSize={draft.struggle_characterSize}
            topImage={draft.struggle_topImage}
            topImageX={draft.struggle_topImageX}
            topImageY={draft.struggle_topImageY}
            topImageSize={draft.struggle_topImageSize}
            topImageAnimation={draft.struggle_topImageAnimation}
            topImageDuration={draft.struggle_topImageDuration}
          />
        );
      case 3:
        return (
          <BodySlide
            week={draft.week}
            authorHandle={draft.authorHandle}
            label="그래서 알게 된 건"
            mainCopy={draft.insight_mainCopy}
            highlightWords={draft.insight_highlightWords}
            bodyText={draft.insight_bodyText}
            characterImage={draft.insight_characterImage}
            characterX={draft.insight_characterX}
            characterY={draft.insight_characterY}
            characterSize={draft.insight_characterSize}
            topImage={draft.insight_topImage}
            topImageX={draft.insight_topImageX}
            topImageY={draft.insight_topImageY}
            topImageSize={draft.insight_topImageSize}
            topImageAnimation={draft.insight_topImageAnimation}
            topImageDuration={draft.insight_topImageDuration}
          >
            {draft.insight_emphasisSentence && (
              <div
                style={{
                  background: '#87CEEB',
                  borderRadius: 16,
                  padding: '28px 36px',
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: '#000',
                  letterSpacing: '-0.02em',
                  marginTop: 16,
                }}
              >
                &ldquo;{draft.insight_emphasisSentence}&rdquo;
              </div>
            )}
          </BodySlide>
        );
      case 4:
        return (
          <BodySlide
            week={draft.week}
            authorHandle={draft.authorHandle}
            label="오늘의 정리"
            mainCopy=""
            highlightWords=""
            bodyText=""
            characterImage={draft.summary_characterImage}
            characterX={draft.summary_characterX}
            characterY={draft.summary_characterY}
            characterSize={draft.summary_characterSize}
            topImage={draft.summary_topImage}
            topImageX={draft.summary_topImageX}
            topImageY={draft.summary_topImageY}
            topImageSize={draft.summary_topImageSize}
            topImageAnimation={draft.summary_topImageAnimation}
            topImageDuration={draft.summary_topImageDuration}
          >
            <NumberedList
              items={[
                draft.summary_point1,
                draft.summary_point2,
                draft.summary_point3,
              ].filter(Boolean)}
            />
            {draft.summary_closingLine && (
              <div
                style={{
                  marginTop: 56,
                  fontSize: 40,
                  fontWeight: 500,
                  color: '#555',
                  letterSpacing: '-0.01em',
                }}
              >
                {draft.summary_closingLine}
              </div>
            )}
          </BodySlide>
        );
      case 5:
        return (
          <OutroSlide
            week={draft.week}
            nextPreview={draft.outro_nextPreview}
            ctaText={draft.outro_ctaText}
            authorHandle={draft.authorHandle}
            characterImage={draft.outro_characterImage}
            characterX={draft.outro_characterX}
            characterY={draft.outro_characterY}
            characterSize={draft.outro_characterSize}
          />
        );
      default:
        return null;
    }
  }

  function renderEditor() {
    switch (activeTab) {
      case 0: return <CoverEditor draft={draft} update={update} />;
      case 1: return <BodySlideEditor slideKey="problem" draft={draft} update={update} />;
      case 2: return <BodySlideEditor slideKey="struggle" draft={draft} update={update} />;
      case 3: return <InsightEditor draft={draft} update={update} />;
      case 4: return <SummaryEditor draft={draft} update={update} />;
      case 5: return <OutroEditor draft={draft} update={update} />;
      default: return null;
    }
  }

  return (
    <div className="studio-layout">
      {/* 오프스크린 풀사이즈 슬라이드 (PNG 캡처용) */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -99999,
          top: 0,
          width: 1080,
          height: 1350,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: NUM_SLIDES }, (_, i) => (
          <div
            key={i}
            ref={slideRefs.current[i]}
            style={{ width: 1080, height: 1350 }}
          >
            {renderSlide(i)}
          </div>
        ))}
      </div>

      {/* ── 좌측: 에디터 패널 ── */}
      <div className="studio-editor">
        {/* 탑바 */}
        <div className="studio-topbar">
          <h1>스폰지클럽 캐러셀 OS</h1>
          <div className="topbar-actions">
            <button
              className="btn-secondary"
              onClick={handleDownloadCurrent}
              disabled={exporting}
            >
              {exporting ? '처리 중...' : '현재 슬라이드'}
            </button>
            <button
              className="btn-primary"
              onClick={handleDownloadAll}
              disabled={exporting}
            >
              {exporting ? '처리 중...' : '전체 ZIP'}
            </button>
          </div>
        </div>

        {/* 공통 필드 */}
        <CommonFields draft={draft} update={update} />

        {/* 탭바 */}
        <SlideTabBar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* 슬라이드별 에디터 */}
        {renderEditor()}
      </div>

      {/* ── 우측: 미리보기 패널 ── */}
      <div className="studio-preview">
        <div className="preview-list">
          {Array.from({ length: NUM_SLIDES }, (_, i) => (
            <SlideFrame
              key={i}
              label={`${i + 1}. ${SLIDE_LABELS[i]}`}
              active={activeTab === i}
            >
              {renderSlide(i)}
            </SlideFrame>
          ))}
        </div>
      </div>
    </div>
  );
}
