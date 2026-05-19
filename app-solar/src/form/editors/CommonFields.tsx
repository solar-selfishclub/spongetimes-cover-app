import { SpotlightDraft } from '../../state/useSpotlightDraft';
import { PublisherSelect } from '../fields';

type Props = {
  draft: SpotlightDraft;
  update: <K extends keyof SpotlightDraft>(key: K, value: SpotlightDraft[K]) => void;
};

export function CommonFields({ draft, update }: Props) {
  return (
    <div className="form-section">
      <h2>공통</h2>
      <PublisherSelect value={draft.publisher} onChange={(v) => update('publisher', v)} />
    </div>
  );
}
