import { COLORS, RADII } from '../../../tokens';

type Props = {
  title: string;
  body: string;
};

// Side-by-side list item used in SIDE PROFILE template.
// Small white box, vertical layout.
export function SideItem({ title, body }: Props) {
  return (
    <div
      style={{
        background: COLORS.surface.cardWhite,
        borderRadius: RADII.smallCard,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.text.primary,
          letterSpacing: '-0.01em'
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: 400,
          lineHeight: 1.45,
          color: COLORS.text.mutedHigh,
          whiteSpace: 'pre-wrap'
        }}
      >
        {body}
      </div>
    </div>
  );
}
