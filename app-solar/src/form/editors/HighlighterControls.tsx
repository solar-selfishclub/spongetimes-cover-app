import { DEFAULT_DRAFT, SpotlightDraft } from '../../state/useSpotlightDraft';
import { RangeField } from '../fields';

type Props = {
  draft: SpotlightDraft;
  update: <K extends keyof SpotlightDraft>(key: K, value: SpotlightDraft[K]) => void;
};

// Highlighter color tweak group: yellow override + opacity/saturation/lightness.
// State is global per draft, so the same widget is rendered under each editor's
// highlight-word input — adjustments here flow to all <Highlight> instances.
export function HighlighterControls({ draft, update }: Props) {
  function resetHighlighter() {
    update('highlighterUseYellow', DEFAULT_DRAFT.highlighterUseYellow);
    update('highlighterOpacity', DEFAULT_DRAFT.highlighterOpacity);
    update('highlighterSaturation', DEFAULT_DRAFT.highlighterSaturation);
    update('highlighterLightness', DEFAULT_DRAFT.highlighterLightness);
  }

  return (
    <div
      style={{
        marginTop: 8,
        padding: '12px 14px',
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
          marginBottom: 10
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
          onClick={resetHighlighter}
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
          marginBottom: 12,
          fontSize: 14,
          cursor: 'pointer'
        }}
      >
        <input
          type="checkbox"
          checked={draft.highlighterUseYellow}
          onChange={(e) => update('highlighterUseYellow', e.target.checked)}
        />
        <span>기본 노란색 사용</span>
        <span style={{ fontSize: 12, color: 'var(--muted-mid)' }}>
          (발행자 시그니처 색 무시)
        </span>
      </label>

      <RangeField
        label="불투명도"
        value={draft.highlighterOpacity}
        onChange={(v) => update('highlighterOpacity', v)}
        min={0}
        max={100}
        step={1}
        unit="%"
      />
      <RangeField
        label="채도"
        value={draft.highlighterSaturation}
        onChange={(v) => update('highlighterSaturation', v)}
        min={0}
        max={200}
        step={1}
        unit="%"
      />
      <RangeField
        label="명도"
        value={draft.highlighterLightness}
        onChange={(v) => update('highlighterLightness', v)}
        min={0}
        max={200}
        step={1}
        unit="%"
      />
    </div>
  );
}
