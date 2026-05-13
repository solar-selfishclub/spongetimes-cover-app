import { BodySlide, SideItem } from '../../../state/bodySlide';

type Props = {
  slide: BodySlide;
  patch: (p: Partial<BodySlide>) => void;
};

export function SideProfileFields({ slide, patch }: Props) {
  function updateItem(i: number, partial: Partial<SideItem>) {
    const next = slide.sideItems.map((s, idx) => (idx === i ? { ...s, ...partial } : s));
    patch({ sideItems: next });
  }

  return (
    <div>
      <div className="helper" style={{ marginBottom: 8 }}>
        사이드 박스 리스트 최대 5개. 우측 영역에는 이미지 슬롯을 켜서 배치 가능.
      </div>
      {slide.sideItems.map((item, i) => (
        <div className="mvp-form-card" key={i}>
          <div className="mvp-form-card-header">
            <span>항목 {i + 1}</span>
            <label className="co-winner-toggle">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => updateItem(i, { enabled: e.target.checked })}
              />
              표시
            </label>
          </div>
          <div className="field">
            <label>제목</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
            />
          </div>
          <div className="field">
            <label>본문</label>
            <textarea
              rows={2}
              value={item.body}
              onChange={(e) => updateItem(i, { body: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
