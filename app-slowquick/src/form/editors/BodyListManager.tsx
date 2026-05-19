import { useState } from 'react';
import {
  BodySlide,
  BodyTemplate,
  BODY_TEMPLATES,
  TEMPLATE_LABEL
} from '../../state/bodySlide';

type Props = {
  bodySlides: BodySlide[];
  onAdd: (template: BodyTemplate) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  // The full slide order index for the body at body-index `i` is `i + 1` (cover at 0).
  onJump: (bodyIndex: number) => void;
  currentBodyIndex: number | null;
};

export function BodyListManager({
  bodySlides,
  onAdd,
  onRemove,
  onMove,
  onJump,
  currentBodyIndex
}: Props) {
  const [picker, setPicker] = useState<BodyTemplate>('hero');

  return (
    <div className="form-section">
      <h2>본문 슬라이드 ({bodySlides.length})</h2>

      {bodySlides.length === 0 && (
        <div className="helper" style={{ marginBottom: 10 }}>
          본문 슬라이드가 아직 없음. 아래에서 템플릿 골라 추가하세요.
        </div>
      )}

      {bodySlides.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {bodySlides.map((b, i) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 10px',
                background: i === currentBodyIndex ? '#FFF8DA' : '#FFFEF4',
                border: '1px solid #E5E1D0',
                borderRadius: 8
              }}
            >
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => onJump(i)}
                style={{ flex: 1, justifyContent: 'flex-start', textAlign: 'left' }}
                title="이 본문 슬라이드로 이동"
              >
                <span style={{ fontWeight: 700, marginRight: 6 }}>#{i + 1}</span>
                <span style={{ color: 'var(--muted-mid)' }}>{TEMPLATE_LABEL[b.template]}</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                disabled={i === 0}
                onClick={() => onMove(i, -1)}
                title="위로"
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                disabled={i === bodySlides.length - 1}
                onClick={() => onMove(i, 1)}
                title="아래로"
              >
                ↓
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => {
                  if (confirm(`본문 ${i + 1} (${TEMPLATE_LABEL[b.template]}) 를 삭제할까요?`)) {
                    onRemove(i);
                  }
                }}
                title="삭제"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
        <select
          value={picker}
          onChange={(e) => setPicker(e.target.value as BodyTemplate)}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: '1px solid #DDD7C2',
            borderRadius: 8,
            fontSize: 13,
            background: '#FFFEF8'
          }}
        >
          {BODY_TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {TEMPLATE_LABEL[t]}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-small" onClick={() => onAdd(picker)}>
          + 본문 추가
        </button>
      </div>
    </div>
  );
}
