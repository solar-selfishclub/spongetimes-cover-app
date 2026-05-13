import { COLORS, RADII } from '../../../tokens';

type Props = {
  text: string;
};

// Yellow-emphasis short quote card — for decisive lines.
export function HlQuoteMini({ text }: Props) {
  return (
    <div
      style={{
        background: COLORS.surface.cardYellow,
        borderRadius: RADII.card,
        padding: '28px 32px',
        fontSize: 30,
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
