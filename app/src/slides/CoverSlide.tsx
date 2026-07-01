import { forwardRef } from 'react';
import { Slide } from './Slide';
import { PillLabel } from './parts/PillLabel';
import { Highlight } from './parts/Highlight';
import { COLORS, ContentType, PublisherName } from '../tokens';

export type CoverSlideProps = {
  week: number;
  contentType: ContentType;
  mainTitle: string;          // user-supplied with \n
  mainTitleSize: number;      // px
  mainTitleAlign: 'left' | 'center' | 'right';
  mainTitleTopOffset: number; // extra px pushed down from default
  highlightWords: string[];   // 0~2 words
  publisher: PublisherName;
  characterImage?: string | null;     // data URL
  characterX?: number;        // 0-100 percent from left (center anchor)
  characterY?: number;        // 0-100 percent from top (center anchor)
  characterSize?: number;     // percent width, default 42
  videoUrl?: string | null;   // object URL for the cover video slot
  videoX?: number;            // 0-100 percent from left (center anchor)
  videoY?: number;            // 0-100 percent from top (center anchor)
  videoSize?: number;         // percent width
};

export const CoverSlide = forwardRef<HTMLDivElement, CoverSlideProps>(function CoverSlide(
  {
    week,
    contentType,
    mainTitle,
    mainTitleSize,
    mainTitleAlign,
    mainTitleTopOffset,
    highlightWords,
    publisher,
    characterImage,
    characterX = 72,
    characterY = 67,
    characterSize = 64,
    videoUrl,
    videoX = 32,
    videoY = 52,
    videoSize = 50
  },
  ref
) {

  return (
    <Slide ref={ref} background={COLORS.bg.cover} padding="6% 7% 5%">
      {/* Decorative accents — soft white circles peeking from corners */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 440,
          height: 440,
          top: -180,
          right: -180,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.28)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 560,
          height: 560,
          bottom: -240,
          left: -240,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.28)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '0.15em',
          color: COLORS.text.primary,
          opacity: 0.35,
          marginBottom: 36
        }}
      >
        <span>SPONGE TIMES</span>
        <span style={{ letterSpacing: '0.15em' }}>WEEK {week}</span>
      </div>

      {/* Pill + title group — moves together via topOffset */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: mainTitleTopOffset }}>
        <div style={{ marginBottom: 30, textAlign: mainTitleAlign }}>
          <PillLabel variant="dark">
            Week {week} · {contentType}
          </PillLabel>
        </div>

        <div
          style={{
            fontSize: mainTitleSize,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: COLORS.text.primary,
            maxWidth: mainTitleAlign === 'left' ? '78%' : '100%',
            textAlign: mainTitleAlign
          }}
        >
          <Highlight text={mainTitle} words={highlightWords} />
        </div>
      </div>

      {/* Video slot — positioned by X/Y percent (center-anchored), muted autoplay loop */}
      {videoUrl && (
        <video
          className="cover-video"
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            zIndex: 1,
            left: `${videoX}%`,
            top: `${videoY}%`,
            transform: 'translate(-50%, -50%)',
            width: `${videoSize}%`,
            height: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Character — positioned by X/Y percent (center-anchored) */}
      {characterImage && (
        <img
          src={characterImage}
          alt=""
          style={{
            position: 'absolute',
            zIndex: 1,
            left: `${characterX}%`,
            top: `${characterY}%`,
            transform: 'translate(-50%, -50%)',
            width: `${characterSize}%`,
            height: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: '7%',
          right: '7%',
          bottom: '5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 22,
          fontWeight: 500,
          color: COLORS.text.primary,
          opacity: 0.35
        }}
      >
        <span>@spongeclub.ai</span>
        <span>by {publisher}</span>
      </div>
    </Slide>
  );
});
