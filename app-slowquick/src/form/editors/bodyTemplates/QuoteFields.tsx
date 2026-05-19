import { BodySlide } from '../../../state/bodySlide';
import { TextField, CheckboxField } from '../../fields';

type Props = {
  slide: BodySlide;
  patch: (p: Partial<BodySlide>) => void;
};

export function QuoteFields({ slide, patch }: Props) {
  return (
    <>
      <TextField
        label="인용 텍스트"
        value={slide.quoteText}
        onChange={(v) => patch({ quoteText: v })}
        multiline
        rows={4}
        helper="3~5줄 권장. 따옴표는 자동 장식됨"
      />
      <TextField
        label="출처 (메타)"
        value={slide.quoteMeta}
        onChange={(v) => patch({ quoteMeta: v })}
        placeholder="— 멤버 / 출처"
      />
      <CheckboxField
        label="하단 강조 박스"
        value={slide.quoteEmphasisEnabled}
        onChange={(v) => patch({ quoteEmphasisEnabled: v })}
      />
      {slide.quoteEmphasisEnabled && (
        <TextField
          label="강조 박스 텍스트"
          value={slide.quoteEmphasis}
          onChange={(v) => patch({ quoteEmphasis: v })}
          multiline
          rows={2}
          helper="결정적 한 줄 — 옐로우 강조 박스로 표시됨"
        />
      )}
    </>
  );
}
