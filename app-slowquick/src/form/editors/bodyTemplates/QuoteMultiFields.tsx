import { BodySlide, QuoteMultiCard } from '../../../state/bodySlide';

type Props = {
  slide: BodySlide;
  patch: (p: Partial<BodySlide>) => void;
};

export function QuoteMultiFields({ slide, patch }: Props) {
  function updateCard(i: number, partial: Partial<QuoteMultiCard>) {
    const next = slide.quoteMultiCards.map((c, idx) => (idx === i ? { ...c, ...partial } : c));
    patch({ quoteMultiCards: next });
  }

  return (
    <div>
      <div className="helper" style={{ marginBottom: 8 }}>
        인용 카드는 최대 5장. 각 카드를 체크박스로 켜고 끌 수 있음.
      </div>
      {slide.quoteMultiCards.map((card, i) => (
        <div className="mvp-form-card" key={i}>
          <div className="mvp-form-card-header">
            <span>인용 카드 {i + 1}</span>
            <label className="co-winner-toggle">
              <input
                type="checkbox"
                checked={card.enabled}
                onChange={(e) => updateCard(i, { enabled: e.target.checked })}
              />
              표시
            </label>
          </div>
          <div className="field">
            <label>인용 텍스트</label>
            <textarea
              rows={2}
              value={card.text}
              onChange={(e) => updateCard(i, { text: e.target.value })}
            />
          </div>
          <div className="field">
            <label>화자</label>
            <input
              type="text"
              value={card.by}
              onChange={(e) => updateCard(i, { by: e.target.value })}
              placeholder="— 멤버 이름"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
