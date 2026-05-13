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
        사이드 박스 리스트 최대 5개. 라벨(주황) + 제목(굵게) + 본문(보조 회색). 우측 영역에 이미지 슬롯 옵션.
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
            <label>주황 라벨 (예: 미션 1)</label>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(i, { label: e.target.value })}
              placeholder="비워두면 라벨 없음"
            />
          </div>
          <div className="field">
            <label>제목 (큰 글자)</label>
            <textarea
              rows={2}
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
              placeholder="줄바꿈은 엔터"
            />
          </div>
          <div className="field">
            <label>본문 (작은 보조 텍스트, 옵션)</label>
            <textarea
              rows={2}
              value={item.body}
              onChange={(e) => updateItem(i, { body: e.target.value })}
              placeholder="비워두면 표시 안 됨"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
