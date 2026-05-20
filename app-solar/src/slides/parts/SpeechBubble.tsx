import { ReactNode } from 'react';
import { COLORS } from '../../tokens';

type Props = {
  children: ReactNode;
  fontSize?: number;
  lineHeight?: number;
  fontWeight?: number;
  padding?: string;
  // Whether to draw the left-pointing tail (for character on the left).
  // 'none' renders the bubble without a tail.
  tail?: 'left' | 'none';
};

export function SpeechBubble({
  children,
  fontSize = 30,
  lineHeight = 1.45,
  fontWeight = 700,
  padding = '28px 32px',
  tail = 'left'
}: Props) {
  return (
    <div
      style={{
        filter:
          'drop-shadow(0 10px 18px rgba(26, 31, 54, 0.14)) drop-shadow(0 2px 4px rgba(26, 31, 54, 0.06))'
      }}
    >
      <div
        style={{
          position: 'relative',
          background: COLORS.surface.cardWhite,
          borderRadius: 28,
          padding,
          fontSize,
          fontWeight,
          lineHeight,
          letterSpacing: '-0.015em',
          color: COLORS.text.primary,
          whiteSpace: 'pre-wrap'
        }}
      >
        {tail === 'left' && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '20px solid transparent',
              borderBottom: '20px solid transparent',
              borderRight: `20px solid ${COLORS.surface.cardWhite}`
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}
