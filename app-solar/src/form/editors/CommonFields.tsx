import { SpotlightDraft } from '../../state/useSpotlightDraft';
import { PublisherSelect, RangeField } from '../fields';

type Props = {
  draft: SpotlightDraft;
  update: <K extends keyof SpotlightDraft>(key: K, value: SpotlightDraft[K]) => void;
};

export function CommonFields({ draft, update }: Props) {
  return (
    <div className="form-section">
      <h2>공통</h2>
      <PublisherSelect value={draft.publisher} onChange={(v) => update('publisher', v)} />

      <div style={{ marginTop: 16 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--muted-mid)',
            marginBottom: 8,
            letterSpacing: '-0.01em'
          }}
        >
          형광펜 색 조절
        </div>
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
    </div>
  );
}
