'use client';

import { forwardRef } from 'react';
import { COLORS } from '@/tokens';
import { Slide } from './Slide';

type OutroSlideProps = {
  week: number;
  nextPreview: string;
  ctaText: string;
  authorHandle: string;
  characterImage?: string | null;
  characterX?: number;
  characterY?: number;
  characterSize?: number;
};

export const OutroSlide = forwardRef<HTMLDivElement, OutroSlideProps>(
  function OutroSlide({ week, nextPreview, ctaText, authorHandle, characterImage, characterX = 72, characterY = 75, characterSize = 35 }, ref) {
    return (
      <Slide ref={ref} background={COLORS.coverBg} padding="0">
        {/* 배경 장식 원 */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: -160,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            pointerEvents: 'none',
          }}
        />

        {/* 상단: WEEK 표시 */}
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: 80,
            right: 80,
            display: 'flex',
            justifyContent: 'space-between',
            opacity: 0.4,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.06em',
          }}
        >
          <span>SPONGE TIMES</span>
          <span>WEEK {String(week).padStart(2, '0')}</span>
        </div>

        {/* 중앙 콘텐츠 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 80,
            right: 80,
            transform: 'translateY(-55%)',
          }}
        >
          {/* 다음 편 예고 박스 */}
          <div
            style={{
              background: 'rgba(0,0,0,0.08)',
              borderRadius: 20,
              padding: '36px 40px',
              marginBottom: 60,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: '#555',
                marginBottom: 16,
                letterSpacing: '0.02em',
              }}
            >
              NEXT EPISODE ▶
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.3,
                color: '#000',
                letterSpacing: '-0.02em',
              }}
            >
              {nextPreview}
            </div>
          </div>

          {/* CTA 문구 */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.35,
              color: '#000',
              letterSpacing: '-0.02em',
              textAlign: 'center',
            }}
          >
            {ctaText}
          </div>
        </div>

        {/* 캐릭터 */}
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
            bottom: 72,
            left: 80,
            right: 80,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 300, color: '#333' }}>
            {authorHandle}
          </span>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#000' }}>
            스폰지클럽
          </span>
        </div>
      </Slide>
    );
  }
);
