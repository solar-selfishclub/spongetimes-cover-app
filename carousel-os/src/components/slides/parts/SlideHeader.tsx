'use client';

type SlideHeaderProps = {
  week: number;
  color?: string;
};

export function SlideHeader({ week, color = '#000' }: SlideHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.4,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: '0.06em',
        color,
        marginBottom: 40,
      }}
    >
      <span>SPONGE TIMES</span>
      <span>WEEK {String(week).padStart(2, '0')}</span>
    </div>
  );
}
