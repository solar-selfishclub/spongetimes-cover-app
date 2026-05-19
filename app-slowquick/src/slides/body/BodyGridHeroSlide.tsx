import { forwardRef } from 'react';
import { BodySlideHost } from './BodySlideHost';
import { BodyHeading } from '../parts/BodyHeading';
import { BodySlide } from '../../state/bodySlide';
import { splitHighlightInput } from '../../state/useSpotlightDraft';
import { GhCard } from '../parts/cards/GhCard';

type Props = { slide: BodySlide; pageNum: number; pageTotal: number };

// GRID HERO — big heading + 2×2 grid of cards (each: yellow stripe + dark pill tag + title + body).
export const BodyGridHeroSlide = forwardRef<HTMLDivElement, Props>(function BodyGridHeroSlide(
  { slide, pageNum, pageTotal },
  ref
) {
  const visible = slide.gridCards.filter((c) => c.enabled);
  // We render up to 4 cards in a 2x2; if fewer are enabled, the grid still uses 2 columns.
  return (
    <BodySlideHost ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, height: '100%' }}>
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
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridAutoRows: '1fr',
            gap: 18,
            flex: 1,
            minHeight: 0
          }}
        >
          {visible.map((card, i) => (
            <GhCard
              key={i}
              tag={card.tag}
              title={card.title}
              body={card.body}
              padding={slide.cardPadding}
              fontScale={slide.cardFontScale}
            />
          ))}
        </div>
      </div>
    </BodySlideHost>
  );
});
