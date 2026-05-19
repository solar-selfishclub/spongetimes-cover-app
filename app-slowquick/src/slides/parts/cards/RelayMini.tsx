import { COLORS, RADII } from '../../../tokens';

type Props = {
  stepNum: number;     // 1, 2, 3, ...
  person: string;
  quote: string;
  padding?: number;
  fontScale?: number;
};

// Flow card — large step number + person + their line.
export function RelayMini({ stepNum, person, quote, padding = 26, fontScale = 1.0 }: Props) {
  const personSize = 22 * fontScale;
  const quoteSize = 24 * fontScale;
  const numSize = 38 * fontScale;
  const circleSize = 84 * fontScale;

  return (
    <div
      style={{
        background: COLORS.surface.cardWhite,
        borderRadius: RADII.card,
        padding: `${padding}px ${padding + 2}px`,
        display: 'flex',
        alignItems: 'center',
        gap: 22
      }}
    >
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: '50%',
          background: COLORS.bg.cover,
          color: COLORS.text.primary,
          fontSize: numSize,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          letterSpacing: '-0.02em'
        }}
      >
        {stepNum}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: personSize,
            fontWeight: 700,
            color: COLORS.text.primary,
            marginBottom: 4
          }}
        >
          {person}
        </div>
        <div
          style={{
            fontSize: quoteSize,
            fontWeight: 500,
            lineHeight: 1.4,
            color: COLORS.text.mutedHigh,
            whiteSpace: 'pre-wrap'
          }}
        >
          {quote}
        </div>
      </div>
    </div>
  );
}
