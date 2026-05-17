'use client';

import { CarouselDraft } from '@/state/useCarouselDraft';
import { NumberField, TextField } from './Fields';

type CommonFieldsProps = {
  draft: CarouselDraft;
  update: <K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) => void;
};

export function CommonFields({ draft, update }: CommonFieldsProps) {
  return (
    <div className="common-fields-section">
      <div className="common-fields-title">공통 설정</div>
      <NumberField
        label="Week 번호"
        value={draft.week}
        onChange={(v) => update('week', v)}
        min={1}
        max={99}
      />
      <TextField
        label="주제"
        value={draft.topic}
        onChange={(v) => update('topic', v)}
        placeholder="캐러셀 삽질기"
        helper="모든 슬라이드의 헤더 태그에 사용됩니다"
      />
      <TextField
        label="작성자 핸들"
        value={draft.authorHandle}
        onChange={(v) => update('authorHandle', v)}
        placeholder="@spongeclub"
      />
    </div>
  );
}
