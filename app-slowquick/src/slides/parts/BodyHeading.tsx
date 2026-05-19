import { COLORS } from '../../tokens';
import { Highlight } from './Highlight';
import { PillLabel } from './PillLabel';

type Props = {
  pillEnabled: boolean;
  pillText: string;
  pillVariant: 'dark' | 'yellow';
  heading: string;
  headingSize: number;
  headingAlign: 'left' | 'center';
  highlightWords: string[];
  subcaptionEnabled: boolean;
  subcaption: string;
  subcaptionSize?: number;
  subcaptionHighlightWords?: string[];
  maxWidth?: string;
};

// Shared heading column for body templates — optional pill, big heading, optional subcaption.
export function BodyHeading({
  pillEnabled,
  pillText,
  pillVariant,
  heading,
  headingSize,
  headingAlign,
  highlightWords,
  subcaptionEnabled,
  subcaption,
  subcaptionSize = 24,
  subcaptionHighlightWords = [],
  maxWidth = '80%'
}: Props) {
  return (
    <div style={{ textAlign: headingAlign }}>
      {pillEnabled && pillText && (
        <div style={{ marginBottom: 22 }}>
          <PillLabel variant={pillVariant}>{pillText}</PillLabel>
        </div>
      )}
      <div
        style={{
          fontSize: headingSize,
          fontWeight: 700,
          lineHeight: 1.18,
          letterSpacing: '-0.02em',
          color: COLORS.text.primary,
          maxWidth: headingAlign === 'center' ? '100%' : maxWidth,
          marginLeft: headingAlign === 'center' ? 'auto' : 0,
          marginRight: headingAlign === 'center' ? 'auto' : 0
        }}
      >
        <Highlight text={heading} words={highlightWords} />
      </div>
      {subcaptionEnabled && subcaption && (
        <div
          style={{
            fontSize: subcaptionSize,
            fontWeight: 500,
            color: COLORS.text.mutedHigh,
            marginTop: 22,
            lineHeight: 1.45,
            whiteSpace: 'pre-wrap',
            maxWidth: headingAlign === 'center' ? '100%' : maxWidth,
            marginLeft: headingAlign === 'center' ? 'auto' : 0,
            marginRight: headingAlign === 'center' ? 'auto' : 0
          }}
        >
          <Highlight text={subcaption} words={subcaptionHighlightWords} />
        </div>
      )}
    </div>
  );
}
