import { BodySlide, FlowStep } from '../../../state/bodySlide';

type Props = {
  slide: BodySlide;
  patch: (p: Partial<BodySlide>) => void;
};

export function FlowFields({ slide, patch }: Props) {
  function updateStep(i: number, partial: Partial<FlowStep>) {
    const next = slide.flowSteps.map((s, idx) => (idx === i ? { ...s, ...partial } : s));
    patch({ flowSteps: next });
  }

  return (
    <div>
      <div className="helper" style={{ marginBottom: 8 }}>
        흐름 단계 카드 최대 4개. 각 단계의 인물 + 한 마디.
      </div>
      {slide.flowSteps.map((step, i) => (
        <div className="mvp-form-card" key={i}>
          <div className="mvp-form-card-header">
            <span>단계 {i + 1}</span>
            <label className="co-winner-toggle">
              <input
                type="checkbox"
                checked={step.enabled}
                onChange={(e) => updateStep(i, { enabled: e.target.checked })}
              />
              표시
            </label>
          </div>
          <div className="field">
            <label>인물</label>
            <input
              type="text"
              value={step.person}
              onChange={(e) => updateStep(i, { person: e.target.value })}
              placeholder="이름"
            />
          </div>
          <div className="field">
            <label>한 마디</label>
            <textarea
              rows={2}
              value={step.quote}
              onChange={(e) => updateStep(i, { quote: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
