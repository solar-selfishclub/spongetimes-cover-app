'use client';

type HighlightProps = {
  text: string;
  words?: string[];
};

export function Highlight({ text, words = [] }: HighlightProps) {
  const valid = words.filter((w) => w && w.trim().length > 0);

  if (valid.length === 0) {
    return (
      <>
        {text.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 ? <br /> : null}
          </span>
        ))}
      </>
    );
  }

  const escaped = valid.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g');

  return (
    <>
      {text.split('\n').map((line, lineIdx, allLines) => {
        const parts = line.split(pattern);
        return (
          <span key={lineIdx}>
            {parts.map((part, i) =>
              valid.includes(part) ? (
                <mark key={i} className="hl-mark">
                  {part}
                </mark>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
            {lineIdx < allLines.length - 1 ? <br /> : null}
          </span>
        );
      })}
    </>
  );
}
