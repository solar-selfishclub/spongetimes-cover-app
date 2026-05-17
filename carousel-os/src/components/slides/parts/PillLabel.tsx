'use client';

type PillLabelProps = {
  text: string;
  variant?: 'dark' | 'yellow' | 'sky';
};

const VARIANTS = {
  dark: { background: '#111', color: '#fff' },
  yellow: { background: '#FEE67A', color: '#000' },
  sky: { background: '#87CEEB', color: '#000' },
};

export function PillLabel({ text, variant = 'dark' }: PillLabelProps) {
  const style = VARIANTS[variant];
  return (
    <div
      style={{
        display: 'inline-block',
        ...style,
        padding: '10px 24px',
        borderRadius: 999,
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        marginBottom: 48,
      }}
    >
      {text}
    </div>
  );
}
