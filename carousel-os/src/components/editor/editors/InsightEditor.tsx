'use client';

import { CarouselDraft } from '@/state/useCarouselDraft';
import { TextField } from '../Fields';
import { BodySlideEditor } from './BodySlideEditor';

type Props = {
  draft: CarouselDraft;
  update: <K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) => void;
};

export function InsightEditor({ draft, update }: Props) {
  return (
    <BodySlideEditor
      slideKey="insight"
      draft={draft}
      update={update}
      extraFields={
        <TextField
          label="강조 문장"
          value={draft.insight_emphasisSentence}
          onChange={(v) => update('insight_emphasisSentence', v)}
          placeholder="디자인보다 스토리가 먼저다"
          helper="하이라이트 박스로 강조 표시됩니다"
        />
      }
    />
  );
}
