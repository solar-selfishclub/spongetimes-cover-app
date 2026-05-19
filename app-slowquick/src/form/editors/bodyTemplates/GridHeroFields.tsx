import { BodySlide, GridCard } from '../../../state/bodySlide';

type Props = {
  slide: BodySlide;
  patch: (p: Partial<BodySlide>) => void;
};

export function GridHeroFields({ slide, patch }: Props) {
  function updateCard(i: number, partial: Partial<GridCard>) {
    const next = slide.gridCards.map((c, idx) => (idx === i ? { ...c, ...partial } : c));
    patch({ gridCards: next });
  }

  return (
    <div>
      <div className="helper" style={{ marginBottom: 8 }}>
        2×2 그리드 카드. 최대 4개. 각 카드에 태그 + 제목 + 본문.
      </div>
      {slide.gridCards.map((card, i) => (
        <div className="mvp-form-card" key={i}>
          <div className="mvp-form-card-header">
            <span>카드 {i + 1}</span>
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
            <label>태그 (다크 알약)</label>
            <input
              type="text"
              value={card.tag}
              onChange={(e) => updateCard(i, { tag: e.target.value })}
              placeholder="#01"
            />
          </div>
          <div className="field">
            <label>제목</label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => updateCard(i, { title: e.target.value })}
            />
          </div>
          <div className="field">
            <label>본문</label>
            <textarea
              rows={2}
              value={card.body}
              onChange={(e) => updateCard(i, { body: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
