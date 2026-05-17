'use client';

import { CarouselDraft } from '@/state/useCarouselDraft';
import { ImageField, RangeField, TextareaField, TextField } from '../Fields';

type Props = {
  draft: CarouselDraft;
  update: <K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) => void;
};

export function CoverEditor({ draft, update }: Props) {
  return (
    <div className="editor-body">
      <div className="editor-section">
        <div className="editor-section-title">텍스트</div>
        <TextField
          label="헤더 태그"
          value={draft.cover_headerTag}
          onChange={(v) => update('cover_headerTag', v)}
          placeholder="Week 1 · 캐러셀 삽질기"
          helper="공통 설정의 Week·주제를 기반으로 자동 입력됩니다"
        />
        <TextareaField
          label="메인 카피"
          value={draft.cover_mainCopy}
          onChange={(v) => update('cover_mainCopy', v)}
          placeholder="내 캐러셀은\n왜 밤티였을까.."
          helper="줄바꿈: 엔터 사용"
          rows={3}
        />
        <TextField
          label="하이라이트 단어 (콤마 구분)"
          value={draft.cover_highlightWords}
          onChange={(v) => update('cover_highlightWords', v)}
          placeholder="캐러셀, 밤티"
          helper="하늘색 배경 강조할 단어를 콤마로 구분"
        />
        <TextField
          label="서브 카피"
          value={draft.cover_subCopy}
          onChange={(v) => update('cover_subCopy', v)}
          placeholder="🔥 AI보다 먼저 챙겨야 할 한 가지"
        />
        <TextField
          label="보조 텍스트 1줄"
          value={draft.cover_auxLine1}
          onChange={(v) => update('cover_auxLine1', v)}
          placeholder="처음이라도"
        />
        <TextField
          label="보조 텍스트 2줄"
          value={draft.cover_auxLine2}
          onChange={(v) => update('cover_auxLine2', v)}
          placeholder="괜찮아요."
        />
      </div>

      <div className="editor-section">
        <div className="editor-section-title">캐릭터 이미지</div>
        <ImageField
          label="캐릭터 이미지"
          value={draft.cover_characterImage}
          onChange={(v) => update('cover_characterImage', v)}
        />
        <RangeField
          label="가로 위치 (X)"
          value={draft.cover_characterX}
          onChange={(v) => update('cover_characterX', v)}
          min={10}
          max={90}
          helper="왼쪽 0% ~ 오른쪽 100%"
        />
        <RangeField
          label="세로 위치 (Y)"
          value={draft.cover_characterY}
          onChange={(v) => update('cover_characterY', v)}
          min={20}
          max={90}
          helper="위 0% ~ 아래 100%"
        />
        <RangeField
          label="크기"
          value={draft.cover_characterSize}
          onChange={(v) => update('cover_characterSize', v)}
          min={15}
          max={80}
          helper="캔버스 너비 대비 %"
        />
      </div>
    </div>
  );
}
