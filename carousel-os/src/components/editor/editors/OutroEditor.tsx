'use client';

import { CarouselDraft } from '@/state/useCarouselDraft';
import { ImageField, RangeField, TextField } from '../Fields';

type Props = {
  draft: CarouselDraft;
  update: <K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) => void;
};

export function OutroEditor({ draft, update }: Props) {
  return (
    <div className="editor-body">
      <div className="editor-section">
        <div className="editor-section-title">텍스트</div>
        <TextField
          label="다음 편 예고"
          value={draft.outro_nextPreview}
          onChange={(v) => update('outro_nextPreview', v)}
          placeholder="다음 편: AI로 캐러셀 10배 빠르게 만드는 법"
        />
        <TextField
          label="CTA 문구"
          value={draft.outro_ctaText}
          onChange={(v) => update('outro_ctaText', v)}
          placeholder="도움이 됐다면 팔로우 + 저장 부탁드려요!"
        />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">캐릭터 이미지</div>
        <ImageField
          label="캐릭터 이미지"
          value={draft.outro_characterImage}
          onChange={(v) => update('outro_characterImage', v)}
        />
        {draft.outro_characterImage && (
          <>
            <RangeField
              label="가로 위치 (X)"
              value={draft.outro_characterX}
              onChange={(v) => update('outro_characterX', v)}
              min={10}
              max={90}
              helper="왼쪽 10% ~ 오른쪽 90%"
            />
            <RangeField
              label="세로 위치 (Y)"
              value={draft.outro_characterY}
              onChange={(v) => update('outro_characterY', v)}
              min={20}
              max={95}
              helper="위 20% ~ 아래 95%"
            />
            <RangeField
              label="크기"
              value={draft.outro_characterSize}
              onChange={(v) => update('outro_characterSize', v)}
              min={10}
              max={70}
              helper="캔버스 너비 대비 %"
            />
          </>
        )}
      </div>
    </div>
  );
}
