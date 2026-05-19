import { CSSProperties } from 'react';
import { COLORS } from '../../tokens';

type Props = {
  category: string;     // top-left text — e.g. "WEEK 1 · MISSION"
  pageNum: number;      // 1-based body slide index
  pageTotal: number;    // total body slides
  badgeText?: string;   // top-right pill text (optional)
  badgeVariant?: 'dark' | 'yellow';
  badgeEnabled?: boolean;
  star?: boolean;       // bottom-right star
};

// 4-corner anchor row used on every body slide (DESIGN-BODY.md §1-1).
// Top-left: "#NN · CATEGORY"  Top-right: pill label
// Bottom-left: "NN / total"   Bottom-right: ★
export function BodyAnchor({
  category,
  pageNum,
  pageTotal,
  badgeText,
  badgeVariant = 'dark',
  badgeEnabled = true,
  star = true
}: Props) {
  const numLabel = `#${String(pageNum).padStart(2, '0')}`;

  const cornerBase: CSSProperties = {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: '0.15em',
    color: COLORS.text.primary,
    opacity: 0.5,
    zIndex: 2
  };

  const badgeStyle: CSSProperties = badgeEnabled && badgeText
    ? {
        position: 'absolute',
        top: '5%',
        right: '7%',
        padding: '8px 22px',
        borderRadius: 999,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: '0.02em',
        lineHeight: 1,
        background: badgeVariant === 'dark' ? COLORS.surface.cardDark : COLORS.surface.cardYellow,
        color: badgeVariant === 'dark' ? COLORS.text.onDark : COLORS.text.primary,
        zIndex: 2
      }
    : { display: 'none' };

  return (
    <>
      <div style={{ ...cornerBase, top: '5%', left: '7%' }}>
        {numLabel} · {category}
      </div>
      <div style={badgeStyle}>{badgeText}</div>
      <div style={{ ...cornerBase, bottom: '5%', left: '7%' }}>
        {String(pageNum).padStart(2, '0')} / {String(pageTotal).padStart(2, '0')}
      </div>
      {star && (
        <div
          style={{
            ...cornerBase,
            bottom: '5%',
            right: '7%',
            fontSize: 34,
            opacity: 0.6
          }}
        >
          ★
        </div>
      )}
    </>
  );
}
