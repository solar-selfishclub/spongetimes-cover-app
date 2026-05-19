import { CSSProperties } from 'react';
import { COLORS } from '../../tokens';
import { DecoPosition, DecoShape, DecoSize } from '../../state/bodySlide';

type Props = {
  position: DecoPosition;
  size: DecoSize;
  shape: DecoShape;
};

const SIZE_PX: Record<DecoSize, number> = {
  small: 360,
  medium: 560,
  large: 820
};

const POSITION_STYLE: Record<DecoPosition, CSSProperties> = {
  right: { top: '50%', right: -260, transform: 'translateY(-50%)' },
  'top-left': { top: -180, left: -180 },
  'top-right': { top: -180, right: -180 },
  'bottom-left': { bottom: -220, left: -220 },
  'bottom-right': { bottom: -220, right: -220 },
  center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
};

// Soft yellow background decoration — DESIGN-BODY.md §1-3 (Kakao-style background spot).
// 4 shapes: circle, half-circle, dot cluster, curve sweep.
export function YellowCircleDeco({ position, size, shape }: Props) {
  const px = SIZE_PX[size];
  const base: CSSProperties = {
    position: 'absolute',
    width: px,
    height: px,
    background: COLORS.bg.cover,
    zIndex: 0,
    pointerEvents: 'none',
    ...POSITION_STYLE[position]
  };

  if (shape === 'circle') {
    return <div aria-hidden style={{ ...base, borderRadius: '50%' }} />;
  }

  if (shape === 'half-circle') {
    // The half-circle effect is achieved by letting half slip off-canvas.
    // We render a full circle but bias it further off the edge based on position.
    const bias = Math.round(px / 2);
    const biasedStyle: CSSProperties = { ...base, borderRadius: '50%' };
    if (position === 'right') biasedStyle.right = -bias;
    if (position === 'top-left') biasedStyle.top = -bias;
    if (position === 'top-right') biasedStyle.top = -bias;
    if (position === 'bottom-left') biasedStyle.bottom = -bias;
    if (position === 'bottom-right') biasedStyle.bottom = -bias;
    return <div aria-hidden style={biasedStyle} />;
  }

  if (shape === 'dot') {
    // Cluster of 3 smaller dots — playful filler.
    const d = Math.round(px / 4);
    const wrap: CSSProperties = {
      ...base,
      background: 'transparent',
      width: px,
      height: px
    };
    const dotBase: CSSProperties = {
      position: 'absolute',
      borderRadius: '50%',
      background: COLORS.bg.cover
    };
    return (
      <div aria-hidden style={wrap}>
        <div style={{ ...dotBase, width: d * 1.4, height: d * 1.4, top: 0, left: 0 }} />
        <div style={{ ...dotBase, width: d, height: d, top: d * 1.6, left: d * 1.8 }} />
        <div
          style={{
            ...dotBase,
            width: d * 0.6,
            height: d * 0.6,
            top: d * 0.4,
            left: d * 3.0
          }}
        />
      </div>
    );
  }

  // curve — half-pill that sweeps from one edge
  const curveStyle: CSSProperties = {
    ...base,
    borderRadius: '50%',
    width: px * 1.6,
    height: px * 0.5
  };
  return <div aria-hidden style={curveStyle} />;
}
