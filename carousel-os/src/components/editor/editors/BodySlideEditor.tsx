'use client';

import { CarouselDraft } from '@/state/useCarouselDraft';
import { ANIMATION_OPTIONS, AnimationType } from '@/tokens';
import { ImageField, RangeField, SelectField, TextareaField, TextField } from '../Fields';

type SlideKey = 'problem' | 'struggle' | 'insight' | 'summary';

type Props = {
  slideKey: SlideKey;
  draft: CarouselDraft;
  update: <K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) => void;
  extraFields?: React.ReactNode;
};

type DraftKey = keyof CarouselDraft;

export function BodySlideEditor({ slideKey, draft, update, extraFields }: Props) {
  const k = <S extends string>(suffix: S) => `${slideKey}_${suffix}` as DraftKey;

  return (
    <div className="editor-body">
      <div className="editor-section">
        <div className="editor-section-title">텍스트</div>
        <TextareaField
          label="메인 카피"
          value={draft[k('mainCopy')] as string}
          onChange={(v) => update(k('mainCopy'), v)}
          helper="줄바꿈: 엔터 사용"
          rows={3}
        />
        <TextField
          label="하이라이트 단어 (콤마 구분)"
          value={draft[k('highlightWords')] as string}
          onChange={(v) => update(k('highlightWords'), v)}
          helper="하늘색 강조할 단어"
        />
        <TextareaField
          label="본문"
          value={draft[k('bodyText')] as string}
          onChange={(v) => update(k('bodyText'), v)}
          helper="2~3줄 권장, 줄바꿈: 엔터"
          rows={4}
        />
        {extraFields}
      </div>

      <div className="editor-section">
        <div className="editor-section-title">상단 이미지 (WEEK 우측)</div>
        <ImageField
          label="상단 이미지"
          value={draft[k('topImage')] as string | null}
          onChange={(v) => update(k('topImage'), v)}
        />
        {(draft[k('topImage')] as string | null) && (
          <>
            <RangeField
              label="가로 위치 (X)"
              value={draft[k('topImageX')] as number}
              onChange={(v) => update(k('topImageX'), v)}
              min={10}
              max={95}
              helper="왼쪽 10% ~ 오른쪽 95%"
            />
            <RangeField
              label="세로 위치 (Y)"
              value={draft[k('topImageY')] as number}
              onChange={(v) => update(k('topImageY'), v)}
              min={1}
              max={95}
              helper="위 1% ~ 아래 95%"
            />
            <RangeField
              label="크기"
              value={draft[k('topImageSize')] as number}
              onChange={(v) => update(k('topImageSize'), v)}
              min={5}
              max={60}
              helper="캔버스 너비 대비 %"
            />
            <SelectField
              label="애니메이션"
              value={draft[k('topImageAnimation')] as string}
              onChange={(v) => update(k('topImageAnimation'), v as AnimationType)}
              options={ANIMATION_OPTIONS}
            />
            <RangeField
              label="속도 (초)"
              value={draft[k('topImageDuration')] as number}
              onChange={(v) => update(k('topImageDuration'), v)}
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
          value={draft[k('characterImage')] as string | null}
          onChange={(v) => update(k('characterImage'), v)}
        />
        {(draft[k('characterImage')] as string | null) && (
          <>
            <RangeField
              label="가로 위치 (X)"
              value={draft[k('characterX')] as number}
              onChange={(v) => update(k('characterX'), v)}
              min={10}
              max={90}
              helper="왼쪽 10% ~ 오른쪽 90%"
            />
            <RangeField
              label="세로 위치 (Y)"
              value={draft[k('characterY')] as number}
              onChange={(v) => update(k('characterY'), v)}
              min={20}
              max={95}
              helper="위 20% ~ 아래 95%"
            />
            <RangeField
              label="크기"
              value={draft[k('characterSize')] as number}
              onChange={(v) => update(k('characterSize'), v)}
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
