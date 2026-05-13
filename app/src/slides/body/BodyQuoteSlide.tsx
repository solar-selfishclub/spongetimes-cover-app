import { forwardRef } from 'react';
import { BodySlideHost } from './BodySlideHost';
import { BodySlide } from '../../state/bodySlide';
import { COLORS, RADII } from '../../tokens';
import { PillLabel } from '../parts/PillLabel';
import { HlQuoteMini } from '../parts/cards/HlQuoteMini';

type Props = { slide: BodySlide; pageNum: number; pageTotal: number };

// QUOTE — big quotation text + meta source + optional emphasis box at bottom.
// The "heading" field is used as the quote source / context blurb above the quote.
export const BodyQuoteSlide = forwardRef<HTMLDivElement, Props>(function BodyQuoteSlide(
  { slide, pageNum, pageTotal },
  ref
) {
  return (
    <BodySlideHost ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: 30
        }}
      >
        {slide.pillEnabled && slide.pillText && (
          <div>
            <PillLabel variant={slide.pillVariant}>{slide.pillText}</PillLabel>
          </div>
        )}

        <div style={{ position: 'relative', paddingLeft: 56 }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -40,
              left: -12,
              fontSize: 180,
              fontFamily: 'Georgia, serif',
              lineHeight: 1,
              color: COLORS.text.primary,
              opacity: 0.18
            }}
          >
            “
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color: COLORS.text.primary,
              whiteSpace: 'pre-wrap'
            }}
          >
            {slide.quoteText}
          </div>
          {slide.quoteMeta && (
            <div
              style={{
                marginTop: 30,
                fontSize: 24,
                fontWeight: 500,
                color: COLORS.text.mutedHigh,
                letterSpacing: '0.01em'
              }}
            >
              {slide.quoteMeta}
            </div>
          )}
        </div>

        {slide.subcaptionEnabled && slide.subcaption && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              lineHeight: 1.45,
              color: COLORS.text.mutedHigh,
              whiteSpace: 'pre-wrap'
            }}
          >
            {slide.subcaption}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {slide.quoteEmphasisEnabled && slide.quoteEmphasis && (
          <div style={{ marginTop: 'auto', borderRadius: RADII.card }}>
            <HlQuoteMini text={slide.quoteEmphasis} />
          </div>
        )}
      </div>
    </BodySlideHost>
  );
});
