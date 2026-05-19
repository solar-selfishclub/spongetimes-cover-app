import { forwardRef } from 'react';
import { Slide } from './Slide';
import { PillLabel } from './parts/PillLabel';
import { Highlight } from './parts/Highlight';
import { FollowCard } from './parts/FollowCard';
import { COLORS } from '../tokens';

export type CtaSlideProps = {
  labelText: string;
  questionText: string;
  questionHighlightWords?: string[];
  characterMessage: string;
  characterImage?: string | null;
  characterSize?: number; // percent of row width
  messageFontFamily?: string;
  messageFontSize?: number;
  messageFontWeight?: number;
  messageLetterSpacing?: number; // em
  messageLineHeight?: number;
  characterOffsetX?: number;
  characterOffsetY?: number;
  messageOffsetX?: number;
  messageOffsetY?: number;
  followOffsetY?: number;
  secondaryFollow?: { name: string; handle: string; imageUrl: string | null } | null;
};

export const CtaSlide = forwardRef<HTMLDivElement, CtaSlideProps>(function CtaSlide(
  {
    labelText,
    questionText,
    questionHighlightWords = [],
    characterMessage,
    characterImage,
    characterSize = 32,
    messageFontFamily = 'Pretendard',
    messageFontSize = 48,
    messageFontWeight = 800,
    messageLetterSpacing = -0.03,
    messageLineHeight = 1.3,
    characterOffsetX = 0,
    characterOffsetY = 0,
    messageOffsetX = 0,
    messageOffsetY = 0,
    followOffsetY = 0,
    secondaryFollow
  },
  ref
) {
  return (
    <Slide ref={ref} background={COLORS.bg.cta}>
      <div style={{ marginBottom: 24 }}>
        <PillLabel variant="yellow">{labelText}</PillLabel>
      </div>

      {/* Question card */}
      <div
        style={{
          background: COLORS.surface.cardWhite,
          borderRadius: 28,
          padding: '48px 44px 44px',
          position: 'relative',
          marginBottom: 32
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 14,
            left: 24,
            fontSize: 140,
            color: COLORS.text.primary,
            opacity: 0.22,
            fontFamily: 'Georgia, serif',
            lineHeight: 1
          }}
        >
          "
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.015em',
            color: COLORS.text.primary,
            paddingTop: 36
          }}
        >
          <Highlight text={questionText} words={questionHighlightWords} />
        </div>
      </div>

      {/* Character + free message row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 32,
          padding: '8px 4px 12px'
        }}
      >
        <div
          style={{
            width: `${characterSize}%`,
            aspectRatio: '1 / 1',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#FFFDF1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transform: `translate(${characterOffsetX}px, ${characterOffsetY}px)`
          }}
        >
          {characterImage ? (
            <img
              src={characterImage}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <span style={{ fontSize: 18, color: COLORS.text.mutedLow }}>캐릭터</span>
          )}
        </div>
        <div
          style={{
            flex: '0 1 auto',
            alignSelf: 'center',
            fontFamily: `"${messageFontFamily}", "Pretendard", sans-serif`,
            fontSize: messageFontSize,
            lineHeight: messageLineHeight,
            letterSpacing: `${messageLetterSpacing}em`,
            fontWeight: messageFontWeight,
            color: COLORS.text.primary,
            whiteSpace: 'pre-wrap',
            transform: `translate(${messageOffsetX}px, ${messageOffsetY}px)`
          }}
        >
          {characterMessage}
        </div>
      </div>

      <div style={{ transform: `translateY(${followOffsetY}px)` }}>
        <FollowCard
          name="스폰지클럽"
          handle="@spongeclub.ai"
          imageUrl="/spongeclub-icon.png"
        />
        {secondaryFollow && (
          <div style={{ marginTop: 16 }}>
            <FollowCard
              name={secondaryFollow.name}
              handle={secondaryFollow.handle}
              imageUrl={secondaryFollow.imageUrl}
              fallbackEmoji="👤"
            />
          </div>
        )}
      </div>
    </Slide>
  );
});
