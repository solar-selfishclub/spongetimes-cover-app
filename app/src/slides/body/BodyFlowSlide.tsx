import { forwardRef } from 'react';
import { BodySlideHost } from './BodySlideHost';
import { BodyHeading } from '../parts/BodyHeading';
import { BodySlide } from '../../state/bodySlide';
import { splitHighlightInput } from '../../state/useSpotlightDraft';
import { RelayMini } from '../parts/cards/RelayMini';

type Props = { slide: BodySlide; pageNum: number; pageTotal: number };

// FLOW — heading + 1→2→3 step cards.
export const BodyFlowSlide = forwardRef<HTMLDivElement, Props>(function BodyFlowSlide(
  { slide, pageNum, pageTotal },
  ref
) {
  const visible = slide.flowSteps
    .map((s, i) => ({ ...s, originalIndex: i }))
    .filter((s) => s.enabled);

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
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            flex: 1
          }}
        >
          {visible.map((step, displayIdx) => (
            <RelayMini
              key={step.originalIndex}
              stepNum={displayIdx + 1}
              person={step.person}
              quote={step.quote}
            />
          ))}
        </div>
      </div>
    </BodySlideHost>
  );
});
