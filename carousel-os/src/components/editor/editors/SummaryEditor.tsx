'use client';

import { CarouselDraft } from '@/state/useCarouselDraft';
import { ANIMATION_OPTIONS, AnimationType } from '@/tokens';
import { ImageField, RangeField, SelectField, TextField } from '../Fields';

type Props = {
  draft: CarouselDraft;
  update: <K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) => void;
};

export function SummaryEditor({ draft, update }: Props) {
  return (
    <div className="editor-body">
      <div className="editor-section">
        <div className="editor-section-title">3가지 포인트</div>
        <TextField
          label="포인트 1"
          value={draft.summary_point1}
          onChange={(v) => update('summary_point1', v)}
          placeholder="캐러셀은 스토리가 핵심이다"
        />
        <TextField
          label="포인트 2"
          value={draft.summary_point2}
          onChange={(v) => update('summary_point2', v)}
          placeholder="툴보다 구조를 먼저 잡아라"
        />
        <TextField
          label="포인트 3"
          value={draft.summary_point3}
          onChange={(v) => update('summary_point3', v)}
          placeholder="반복이 퀄리티를 만든다"
        />
      </div>
      <div className="editor-section">
        <div className="editor-section-title">마무리</div>
        <TextField
          label="마무리 한 줄"
          value={draft.summary_closingLine}
          onChange={(v) => update('summary_closingLine', v)}
          placeholder="오늘도 한 걸음 앞으로 :)"
        />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">상단 이미지 (WEEK 우측)</div>
        <ImageField
          label="상단 이미지"
          value={draft.summary_topImage}
          onChange={(v) => update('summary_topImage', v)}
        />
        {draft.summary_topImage && (
          <>
            <RangeField
              label="가로 위치 (X)"
              value={draft.summary_topImageX}
              onChange={(v) => update('summary_topImageX', v)}
              min={10}
              max={95}
              helper="왼쪽 10% ~ 오른쪽 95%"
            />
            <RangeField
              label="세로 위치 (Y)"
              value={draft.summary_topImageY}
              onChange={(v) => update('summary_topImageY', v)}
              min={1}
              max={95}
              helper="위 1% ~ 아래 95%"
            />
            <RangeField
              label="크기"
              value={draft.summary_topImageSize}
              onChange={(v) => update('summary_topImageSize', v)}
              min={5}
              max={60}
              helper="캔버스 너비 대비 %"
            />
            <SelectField
              label="애니메이션"
              value={draft.summary_topImageAnimation}
              onChange={(v) => update('summary_topImageAnimation', v as AnimationType)}
              options={ANIMATION_OPTIONS}
            />
            <RangeField
              label="속도 (초)"
              value={draft.summary_topImageDuration}
              onChange={(v) => update('summary_topImageDuration', v)}
              min={1}
              max={6}
              step={0.5}
              helper="애니메이션 1사이클 시간"
            />
          </>
        )}
      </div>

      <div className="editor-section">
        <div className="editor-section-title">캐릭터 이미지</div>
        <ImageField
          label="캐릭터 이미지"
          value={draft.summary_characterImage}
          onChange={(v) => update('summary_characterImage', v)}
        />
        {draft.summary_characterImage && (
          <>
            <RangeField
              label="가로 위치 (X)"
              value={draft.summary_characterX}
              onChange={(v) => update('summary_characterX', v)}
              min={10}
              max={90}
              helper="왼쪽 10% ~ 오른쪽 90%"
            />
            <RangeField
              label="세로 위치 (Y)"
              value={draft.summary_characterY}
              onChange={(v) => update('summary_characterY', v)}
              min={20}
              max={95}
              helper="위 20% ~ 아래 95%"
            />
            <RangeField
              label="크기"
              value={draft.summary_characterSize}
              onChange={(v) => update('summary_characterSize', v)}
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
