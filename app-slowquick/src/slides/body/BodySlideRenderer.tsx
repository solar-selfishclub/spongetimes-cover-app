import { forwardRef } from 'react';
import { BodySlide } from '../../state/bodySlide';
import { BodyHeroSlide } from './BodyHeroSlide';
import { BodyQuoteSlide } from './BodyQuoteSlide';
import { BodyQuoteMultiSlide } from './BodyQuoteMultiSlide';
import { BodyFlowSlide } from './BodyFlowSlide';
import { BodySideProfileSlide } from './BodySideProfileSlide';
import { BodyGridHeroSlide } from './BodyGridHeroSlide';

type Props = {
  slide: BodySlide;
  pageNum: number;
  pageTotal: number;
};

// Single switch — picks the template renderer based on slide.template.
export const BodySlideRenderer = forwardRef<HTMLDivElement, Props>(function BodySlideRenderer(
  { slide, pageNum, pageTotal },
  ref
) {
  switch (slide.template) {
    case 'hero':
      return <BodyHeroSlide ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal} />;
    case 'quote':
      return <BodyQuoteSlide ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal} />;
    case 'quote-multi':
      return (
        <BodyQuoteMultiSlide ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal} />
      );
    case 'flow':
      return <BodyFlowSlide ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal} />;
    case 'side-profile':
      return (
        <BodySideProfileSlide ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal} />
      );
    case 'grid-hero':
      return (
        <BodyGridHeroSlide ref={ref} slide={slide} pageNum={pageNum} pageTotal={pageTotal} />
      );
  }
});
