import { DEFAULT_HIGHLIGHTER_STYLE, HighlighterStyle } from '../../tokens';
import { RangeField } from '../fields';

type Props = {
  value: HighlighterStyle;
  onChange: (next: HighlighterStyle) => void;
};

// Highlighter color tweak group: yellow override + opacity/saturation/lightness.
// Stateless — operates on whatever HighlighterStyle slot the parent passes in
// (cover or cta). Same widget is rendered under each editor's highlight-word
// input, but the values are independent per slide.
export function HighlighterControls({ value, onChange }: Props) {
  const patch = (next: Partial<HighlighterStyle>) => onChange({ ...value, ...next });

  function reset() {
    onChange({ ...DEFAULT_HIGHLIGHTER_STYLE });
  }

  return (
    <div
      className="highlighter-controls"
      style={{
        marginTop: 16,
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0, 0, 0, 0.06)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--muted-mid)',
            letterSpacing: '-0.01em'
          }}
        >
          형광펜 색 조절
        </div>
        <button
          type="button"
          onClick={reset}
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            color: 'var(--muted-mid)',
            cursor: 'pointer'
          }}
        >
          기본값으로 되돌리기
        </button>
      </div>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
          fontSize: 14,
          cursor: 'pointer'
        }}
      >
        <input
          type="checkbox"
          checked={value.useYellow}
          onChange={(e) => patch({ useYellow: e.target.checked })}
        />
        <span>기본 노란색 사용</span>
        <span style={{ fontSize: 12, color: 'var(--muted-mid)' }}>
          (발행자 시그니처 색 무시)
        </span>
      </label>

      <RangeField
        label="불투명도"
        value={value.opacity}
        onChange={(v) => patch({ opacity: v })}
        min={0}
        max={100}
        step={1}
        unit="%"
      />
      <RangeField
        label="채도"
        value={value.saturation}
        onChange={(v) => patch({ saturation: v })}
        min={0}
        max={200}
        step={1}
        unit="%"
      />
      <RangeField
        label="명도"
        value={value.lightness}
        onChange={(v) => patch({ lightness: v })}
        min={0}
        max={200}
        step={1}
        unit="%"
      />
    </div>
  );
}
