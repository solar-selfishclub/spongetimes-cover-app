'use client';

type NumberedListProps = {
  items: string[];
};

export function NumberedList({ items }: NumberedListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#87CEEB',
              lineHeight: 1,
              minWidth: 56,
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span
            style={{
              fontSize: 44,
              fontWeight: 500,
              lineHeight: 1.35,
              color: '#000',
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}
