import { COLORS, PUBLISHERS, RADII } from '../../../tokens';

type Props = {
  label?: string;
  title: string;
  body: string;
  padding?: number;    // px, default 24
  fontScale?: number;  // multiplier, default 1.0
};

// Side-by-side list item used in SIDE PROFILE template (v6 si-num + si-text pattern).
// Small white box, vertical layout. Orange label on top (slowquick signature accent).
export function SideItem({ label, title, body, padding = 24, fontScale = 1.0 }: Props) {
  const labelSize = 18 * fontScale;
  const titleSize = 26 * fontScale;
  const bodySize = 19 * fontScale;

  return (
    <div
      style={{
        background: COLORS.surface.cardWhite,
        borderRadius: RADII.card,
        padding: `${padding}px ${padding * 1.1}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
      }}
    >
      {label && (
        <div
          style={{
            fontSize: labelSize,
            fontWeight: 700,
            color: PUBLISHERS['슬로우퀵'].hex,
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </div>
      )}
      {title && (
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: COLORS.text.primary,
            letterSpacing: '-0.01em',
            lineHeight: 1.35,
            whiteSpace: 'pre-wrap'
          }}
        >
          {title}
        </div>
      )}
      {body && (
        <div
          style={{
            fontSize: bodySize,
            fontWeight: 400,
            lineHeight: 1.45,
            color: COLORS.text.mutedHigh,
            whiteSpace: 'pre-wrap',
            marginTop: 4
          }}
        >
          {body}
        </div>
      )}
    </div>
  );
}
