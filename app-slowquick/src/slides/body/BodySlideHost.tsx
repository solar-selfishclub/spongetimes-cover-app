import { forwardRef, ReactNode } from 'react';
import { Slide } from '../Slide';
import { BodyAnchor } from '../parts/BodyAnchor';
import { YellowCircleDeco } from '../parts/YellowCircleDeco';
import { COLORS } from '../../tokens';
import { BodySlide } from '../../state/bodySlide';

type Props = {
  slide: BodySlide;
  pageNum: number;       // 1-based body index
  pageTotal: number;     // total body slides
  children: ReactNode;   // template body content
};

// Common wrapper for every body slide.
// Provides: cream background, optional yellow circle deco (z=0),
// 4-corner anchor (z=2), optional floating image slot (z=1),
// and reserves z=1 for the children (template body).
export const BodySlideHost = forwardRef<HTMLDivElement, Props>(function BodySlideHost(
  { slide, pageNum, pageTotal, children },
  ref
) {
  return (
    <Slide ref={ref} background={COLORS.bg.body} padding="11% 7% 9%">
      {slide.decoEnabled && (
        <YellowCircleDeco
          position={slide.decoPosition}
          size={slide.decoSize}
          shape={slide.decoShape}
        />
      )}

      <BodyAnchor
        category={slide.anchorCategory}
        pageNum={pageNum}
        pageTotal={pageTotal}
        badgeText={slide.anchorBadge}
        badgeVariant={slide.anchorBadgeVariant}
        badgeEnabled={slide.anchorBadgeEnabled}
        star={slide.anchorStar}
      />

      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>

      {slide.imageEnabled && slide.image && (
        <img
          src={slide.image}
          alt=""
          style={{
            position: 'absolute',
            zIndex: 1,
            left: `${slide.imageX}%`,
            top: `${slide.imageY}%`,
            transform: 'translate(-50%, -50%)',
            width: `${slide.imageSize}%`,
            height: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
        />
      )}
    </Slide>
  );
});
