import { COLORS, RADII } from '../../../tokens';

type Props = {
  stepNum: number;     // 1, 2, 3, ...
  person: string;
  quote: string;
};

// Flow card — large step number + person + their line.
export function RelayMini({ stepNum, person, quote }: Props) {
  return (
    <div
      style={{
        background: COLORS.surface.cardWhite,
        borderRadius: RADII.card,
        padding: '26px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 22
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: '50%',
          background: COLORS.bg.cover,
          color: COLORS.text.primary,
          fontSize: 38,
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
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.text.primary,
            marginBottom: 4
          }}
        >
          {person}
        </div>
        <div
          style={{
            fontSize: 24,
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
