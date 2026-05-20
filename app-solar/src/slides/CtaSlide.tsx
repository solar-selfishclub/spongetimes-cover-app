import { forwardRef, ReactNode } from 'react';
import { Slide } from './Slide';
import { PillLabel } from './parts/PillLabel';
import { Highlight } from './parts/Highlight';
import { FollowCard } from './parts/FollowCard';
import { SpeechBubble } from './parts/SpeechBubble';
import { COLORS } from '../tokens';

// Parse `**word**` markers into <strong> nodes. Plain text outside the markers
// is left untouched so whitespace (newlines, spaces) keeps `white-space: pre-wrap`
// behavior inside the speech bubble.
function parseBoldText(text: string): ReactNode {
  const parts = text.split(/\*\*([^*]+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ fontWeight: 700 }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export type CtaSlideProps = {
  labelText: string;
  questionText: string;
  questionHighlightWords?: string[];
  characterMessage: string;
  characterImage?: string | null;
  characterSize?: number; // % of row width (20–60), default 32
  characterMessageFontSize?: number; // px, default 30
  characterMessageLineHeight?: number; // default 1.45
  characterRowOffsetY?: number; // px, shifts character+bubble row vertically
  followOffsetY?: number;       // px, shifts the follow card vertically
  // Optional secondary follow card (e.g. personal account)
  secondaryFollow?: {
    name: string;
    handle: string;
    imageUrl: string | null;
  } | null;
};

export const CtaSlide = forwardRef<HTMLDivElement, CtaSlideProps>(function CtaSlide(
  {
    labelText,
    questionText,
    questionHighlightWords = [],
    characterMessage,
    characterImage,
    characterSize = 32,
    characterMessageFontSize = 30,
    characterMessageLineHeight = 1.45,
    characterRowOffsetY = 0,
    followOffsetY = 0,
    secondaryFollow = null
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
          padding: '68px 44px 64px',
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
          &ldquo;
        </div>
        <div
          style={{
            fontSize: 54,
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
          padding: '8px 4px 12px',
          transform: `translateY(${characterRowOffsetY}px)`
        }}
      >
        <div
          style={{
            width: `${characterSize}%`,
            aspectRatio: '1 / 1',
            borderRadius: characterImage ? 0 : 16,
            overflow: 'hidden',
            background: characterImage ? 'transparent' : '#FFFDF1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {characterImage ? (
            <img
              src={characterImage}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontSize: 18, color: COLORS.text.mutedLow }}>캐릭터</span>
          )}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 12
          }}
        >
          <PillLabel
            variant="yellow"
            style={{
              fontSize: 28,
              padding: '10px 22px',
              fontWeight: 700,
              background: COLORS.surface.cardWhite,
              color: COLORS.text.primary
            }}
          >
            발행자 한마디 🗯️
          </PillLabel>
          <div style={{ alignSelf: 'stretch', transform: 'translateX(-28px)' }}>
            <SpeechBubble
              fontSize={characterMessageFontSize}
              fontWeight={500}
              lineHeight={characterMessageLineHeight}
              padding="32px 32px"
            >
              {parseBoldText(characterMessage)}
            </SpeechBubble>
          </div>
        </div>
      </div>

      <div style={{ transform: `translateY(${followOffsetY}px)` }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 32,
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.text.primary,
            letterSpacing: '-0.01em'
          }}
        >
          <span className="cta-prelude-arrow" style={{ opacity: 0.55 }}>
            <span style={{ display: 'inline-block', transform: 'rotate(90deg)', fontWeight: 700 }}>
              ››
            </span>
          </span>
          더 많은 이야기가 궁금하다면?
          <span className="cta-prelude-arrow" style={{ opacity: 0.55 }}>
            <span style={{ display: 'inline-block', transform: 'rotate(90deg)', fontWeight: 700 }}>
              ››
            </span>
          </span>
        </div>
        <FollowCard
          handle="@spongeclub.ai"
          imageUrl="/spongeclub-icon.png"
          round
          fallbackEmoji="📰"
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
