'use client';

import { forwardRef, ReactNode } from 'react';
import { AnimationType, COLORS } from '@/tokens';
import { Slide } from './Slide';
import { Highlight } from './parts/Highlight';
import { SlideHeader } from './parts/SlideHeader';
import { PillLabel } from './parts/PillLabel';
import { splitHighlightWords } from '@/state/useCarouselDraft';

type BodySlideProps = {
  week: number;
  label: string;
  mainCopy: string;
  highlightWords: string;
  bodyText: string;
  authorHandle: string;
  characterImage?: string | null;
  characterX?: number;
  characterY?: number;
  characterSize?: number;
  topImage?: string | null;
  topImageX?: number;
  topImageY?: number;
  topImageSize?: number;
  topImageAnimation?: AnimationType;
  topImageDuration?: number;
  children?: ReactNode;
};

export const BodySlide = forwardRef<HTMLDivElement, BodySlideProps>(
  function BodySlide(
    {
      week,
      label,
      mainCopy,
      highlightWords,
      bodyText,
      authorHandle,
      characterImage,
      characterX = 75,
      characterY = 75,
      characterSize = 38,
      topImage,
      topImageX = 82,
      topImageY = 12,
      topImageSize = 28,
      topImageAnimation = 'none',
      topImageDuration = 3,
      children,
    },
    ref
  ) {
    const words = splitHighlightWords(highlightWords);

    return (
      <Slide ref={ref} background={COLORS.bodyBg} padding="72px 86px">
        {/* 헤더 */}
        <SlideHeader week={week} />

        {/* 라벨 */}
        <PillLabel text={label} variant="dark" />

        {/* 메인 카피 */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.03em',
            color: COLORS.text,
            marginBottom: 48,
          }}
        >
          <Highlight text={mainCopy} words={words} />
        </div>

        {/* 본문 텍스트 */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 300,
            lineHeight: 1.65,
            color: '#333',
            letterSpacing: '-0.01em',
            marginBottom: 48,
          }}
        >
          {bodyText.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </div>

        {/* 슬라이드별 추가 콘텐츠 슬롯 (Insight 강조문, Summary 목록 등) */}
        {children}

        {/* 상단 이미지 (WEEK 01 우측 영역) */}
        {topImage && (
          <img
            src={topImage}
            alt="top-image"
            style={{
              position: 'absolute',
              left: `${topImageX}%`,
              top: `${topImageY}%`,
              width: `${topImageSize}%`,
              transform: 'translate(-50%, -50%)',
              objectFit: 'contain',
              pointerEvents: 'none',
              animation: topImageAnimation !== 'none'
                ? `${topImageAnimation} ${topImageDuration}s ease-in-out infinite`
                : undefined,
            }}
          />
        )}

        {/* 캐릭터 이미지 */}
        {characterImage && (
          <img
            src={characterImage}
            alt="character"
            style={{
              position: 'absolute',
              left: `${characterX}%`,
              top: `${characterY}%`,
              width: `${characterSize}%`,
              transform: 'translate(-50%, -50%)',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* 하단 핸들 */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 86,
            right: 86,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 300, color: '#888' }}>
            {authorHandle}
          </span>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#888' }}>
            스폰지클럽
          </span>
        </div>
      </Slide>
    );
  }
);
