import { COLORS, RADII } from '../../../tokens';

type Props = {
  tag: string;
  title: string;
  body: string;
  padding?: number;
  fontScale?: number;
};

// Grid card — yellow top stripe + dark pill tag + title + body.
// Used inside the 2×2 grid on GRID HERO template.
export function GhCard({ tag, title, body, padding = 20, fontScale = 1.0 }: Props) {
  const tagSize = 16 * fontScale;
  const titleSize = 26 * fontScale;
  const bodySize = 19 * fontScale;

  return (
    <div
      style={{
        background: COLORS.surface.cardWhite,
        borderRadius: RADII.card,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Yellow top stripe */}
      <div
        style={{
          background: COLORS.bg.cover,
          height: 14,
          flexShrink: 0
        }}
      />
      <div
        style={{
          padding: `${padding}px ${padding + 2}px ${padding + 2}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            background: COLORS.surface.cardDark,
            color: COLORS.text.onDark,
            padding: '4px 14px',
            borderRadius: 999,
            fontSize: tagSize,
            fontWeight: 500,
            letterSpacing: '0.04em'
          }}
        >
          {tag}
        </div>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: COLORS.text.primary,
            letterSpacing: '-0.01em',
            lineHeight: 1.25
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: bodySize,
            fontWeight: 400,
            lineHeight: 1.45,
            color: COLORS.text.mutedHigh,
            whiteSpace: 'pre-wrap'
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}
