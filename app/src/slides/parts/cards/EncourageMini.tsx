import { COLORS, RADII } from '../../../tokens';

type Props = {
  text: string;
};

// Encouragement / conclusion box with a left orange border.
export function EncourageMini({ text }: Props) {
  return (
    <div
      style={{
        background: COLORS.surface.cardWhite,
        borderLeft: `6px solid ${COLORS.accent.highlighter}`,
        borderRadius: RADII.smallCard,
        padding: '24px 30px',
        fontSize: 26,
        fontWeight: 500,
        lineHeight: 1.45,
        color: COLORS.text.primary,
        whiteSpace: 'pre-wrap'
      }}
    >
      {text}
    </div>
  );
}
