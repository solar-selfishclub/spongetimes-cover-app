import { COLORS, RADII } from '../../../tokens';

type Props = {
  text: string;
  by: string;
  padding?: number;
  fontScale?: number;
};

// Small white quote card with a large decorative quotation mark — DESIGN-BODY.md §3-4.
export function MiniQuoteCard({ text, by, padding = 28, fontScale = 1.0 }: Props) {
  const textSize = 28 * fontScale;
  const bySize = 18 * fontScale;
  const quoteMarkSize = 86 * fontScale;

  return (
    <div
      style={{
        position: 'relative',
        background: COLORS.surface.cardWhite,
        borderRadius: RADII.card,
        padding: `${padding + 6}px ${padding + 8}px ${padding}px`,
        boxShadow: '0 2px 6px rgba(26, 31, 54, 0.04)'
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 4,
          left: 18,
          fontSize: quoteMarkSize,
          fontFamily: 'Georgia, serif',
          lineHeight: 1,
          color: COLORS.text.primary,
          opacity: 0.18
        }}
      >
        “
      </div>
      <div
        style={{
          fontSize: textSize,
          fontWeight: 500,
          lineHeight: 1.45,
          color: COLORS.text.primary,
          marginBottom: 12,
          whiteSpace: 'pre-wrap'
        }}
      >
        {text}
      </div>
      <div
        style={{
          fontSize: bySize,
          fontWeight: 500,
          color: COLORS.text.mutedHigh,
          letterSpacing: '0.01em'
        }}
      >
        {by}
      </div>
    </div>
  );
}
