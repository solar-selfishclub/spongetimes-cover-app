import { COLORS, RADII } from '../../../tokens';

type Props = {
  text: string;
  padding?: number;
  fontScale?: number;
};

// Yellow-emphasis short quote card — for decisive lines.
export function HlQuoteMini({ text, padding = 28, fontScale = 1.0 }: Props) {
  return (
    <div
      style={{
        background: COLORS.surface.cardYellow,
        borderRadius: RADII.card,
        padding: `${padding}px ${padding + 4}px`,
        fontSize: 30 * fontScale,
        fontWeight: 700,
        lineHeight: 1.4,
        color: COLORS.text.primary,
        letterSpacing: '-0.01em',
        whiteSpace: 'pre-wrap'
      }}
    >
      {text}
    </div>
  );
}
