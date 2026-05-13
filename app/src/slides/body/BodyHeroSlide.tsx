import { forwardRef } from 'react';
import { BodySlideHost } from './BodySlideHost';
import { BodyHeading } from '../parts/BodyHeading';
import { BodySlide } from '../../state/bodySlide';
import { splitHighlightInput } from '../../state/useSpotlightDraft';
import { COLORS } from '../../tokens';

type Props = { slide: BodySlide; pageNum: number; pageTotal: number };

// HERO — big heading + short body + optional yellow deco + optional image slot.
export const BodyHeroSlide = forwardRef<HTMLDivElement, Props>(function BodyHeroSlide(
  { slide, pageNum, pageTotal },
  ref
) {
  return (
    <BodySlideHost ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, height: '100%' }}>
        <BodyHeading
          pillEnabled={slide.pillEnabled}
          pillText={slide.pillText}
          pillVariant={slide.pillVariant}
          heading={slide.heading}
          headingSize={slide.headingSize}
          headingAlign={slide.headingAlign}
          highlightWords={splitHighlightInput(slide.headingHighlight)}
          subcaptionEnabled={slide.subcaptionEnabled}
          subcaption={slide.subcaption}
          maxWidth={slide.imageEnabled ? '62%' : '80%'}
        />
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            lineHeight: 1.55,
            color: COLORS.text.mutedHigh,
            maxWidth: slide.imageEnabled ? '62%' : '78%',
            whiteSpace: 'pre-wrap'
          }}
        >
          {slide.heroBody}
        </div>
      </div>
    </BodySlideHost>
  );
});
