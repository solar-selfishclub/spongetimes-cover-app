import { forwardRef } from 'react';
import { BodySlideHost } from './BodySlideHost';
import { BodyHeading } from '../parts/BodyHeading';
import { BodySlide } from '../../state/bodySlide';
import { splitHighlightInput } from '../../state/useSpotlightDraft';
import { MiniQuoteCard } from '../parts/cards/MiniQuoteCard';

type Props = { slide: BodySlide; pageNum: number; pageTotal: number };

// QUOTE MULTI — small heading + N mini-quote cards stacked vertically.
export const BodyQuoteMultiSlide = forwardRef<HTMLDivElement, Props>(
  function BodyQuoteMultiSlide({ slide, pageNum, pageTotal }, ref) {
    const visible = slide.quoteMultiCards.filter((c) => c.enabled);

    return (
      <BodySlideHost ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
          <BodyHeading
            pillEnabled={slide.pillEnabled}
            pillText={slide.pillText}
            pillVariant={slide.pillVariant}
            heading={slide.heading}
            headingSize={Math.min(slide.headingSize, 64)}
            headingAlign={slide.headingAlign}
            highlightWords={splitHighlightInput(slide.headingHighlight)}
            subcaptionEnabled={slide.subcaptionEnabled}
            subcaption={slide.subcaption}
            subcaptionSize={slide.subcaptionSize}
            subcaptionHighlightWords={splitHighlightInput(slide.subcaptionHighlight)}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              flex: 1
            }}
          >
            {visible.map((card, i) => (
              <MiniQuoteCard
                key={i}
                text={card.text}
                by={card.by}
                padding={slide.cardPadding}
                fontScale={slide.cardFontScale}
              />
            ))}
          </div>
        </div>
      </BodySlideHost>
    );
  }
);
