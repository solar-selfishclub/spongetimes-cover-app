import { forwardRef } from 'react';
import { BodySlideHost } from './BodySlideHost';
import { BodyHeading } from '../parts/BodyHeading';
import { BodySlide } from '../../state/bodySlide';
import { splitHighlightInput } from '../../state/useSpotlightDraft';
import { SideItem } from '../parts/cards/SideItem';

type Props = { slide: BodySlide; pageNum: number; pageTotal: number };

// SIDE PROFILE — left column with heading + box-list, right column reserved for image slot.
export const BodySideProfileSlide = forwardRef<HTMLDivElement, Props>(
  function BodySideProfileSlide({ slide, pageNum, pageTotal }, ref) {
    const visible = slide.sideItems.filter((s) => s.enabled);

    return (
      <BodySlideHost ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: slide.imageEnabled ? '60% 40%' : '100%',
            gap: 24,
            height: '100%'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <BodyHeading
              pillEnabled={slide.pillEnabled}
              pillText={slide.pillText}
              pillVariant={slide.pillVariant}
              heading={slide.heading}
              headingSize={Math.min(slide.headingSize, 72)}
              headingAlign={slide.headingAlign}
              highlightWords={splitHighlightInput(slide.headingHighlight)}
              subcaptionEnabled={slide.subcaptionEnabled}
              subcaption={slide.subcaption}
              maxWidth={slide.imageEnabled ? '100%' : '78%'}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              {visible.map((item, i) => (
                <SideItem key={i} title={item.title} body={item.body} />
              ))}
            </div>
          </div>
          {/* Right column intentionally empty — image slot floats over it via BodySlideHost */}
        </div>
      </BodySlideHost>
    );
  }
);
