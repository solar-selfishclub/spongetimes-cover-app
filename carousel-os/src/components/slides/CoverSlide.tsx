'use client';

import { forwardRef } from 'react';
import { COLORS } from '@/tokens';
import { Slide } from './Slide';
import { Highlight } from './parts/Highlight';
import { splitHighlightWords } from '@/state/useCarouselDraft';

type CoverSlideProps = {
  week: number;
  headerTag: string;
  mainCopy: string;
  highlightWords: string;
  subCopy: string;
  auxLine1: string;
  auxLine2: string;
  authorHandle: string;
  characterImage?: string | null;
  characterX?: number;
  characterY?: number;
  characterSize?: number;
};

export const CoverSlide = forwardRef<HTMLDivElement, CoverSlideProps>(
  function CoverSlide(
    {
      week,
      headerTag,
      mainCopy,
      highlightWords,
      subCopy,
      auxLine1,
      auxLine2,
      authorHandle,
      characterImage,
      characterX = 72,
      characterY = 65,
      characterSize = 55,
    },
    ref
  ) {
    const words = splitHighlightWords(highlightWords);

    return (
      <Slide ref={ref} background={COLORS.coverBg} padding="0">
        {/* 배경 장식 원 */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -180,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -120,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            pointerEvents: 'none',
          }}
        />

        {/* 헤더 태그 박스 */}
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: 80,
            right: 80,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: '#000',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 999,
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            {headerTag}
          </div>
        </div>

        {/* 메인 카피 */}
        <div
          style={{
            position: 'absolute',
            top: 180,
            left: 80,
            right: 80,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: COLORS.text,
            }}
          >
            <Highlight text={mainCopy} words={words} />
          </div>

          {/* 서브 카피 */}
          <div
            style={{
              marginTop: 36,
              fontSize: 38,
              fontWeight: 500,
              color: '#333',
              letterSpacing: '-0.01em',
            }}
          >
            {subCopy}
          </div>
        </div>

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

        {/* 하단 좌측: 보조 텍스트 */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 80,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 300, color: '#333', lineHeight: 1.4 }}>
            {auxLine1}
            {auxLine2 && (
              <>
                <br />
                {auxLine2}
              </>
            )}
          </div>
        </div>

        {/* 하단 우측: 브랜드 + 핸들 */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: '#000', letterSpacing: '-0.01em' }}>
            스폰지클럽
          </div>
          <div style={{ fontSize: 26, fontWeight: 300, color: '#555', marginTop: 4 }}>
            {authorHandle}
          </div>
        </div>
      </Slide>
    );
  }
);
