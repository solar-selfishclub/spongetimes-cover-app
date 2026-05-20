import { ReactNode } from 'react';
import { DEFAULT_DRAFT, SpotlightDraft } from '../../state/useSpotlightDraft';
import { TextField, ImageField, RangeField } from '../fields';
import { CTA_LABEL_POOL, SPOTLIGHT_QUESTION_POOL } from '../../tokens';
import { CharacterPromptCopy } from '../../character/CharacterPromptCopy';
import { HighlighterControls } from './HighlighterControls';

const CUSTOM_SENTINEL = '__custom__';

// Top-level section header inside the editor sidebar, matching CoverEditor's
// pattern (clear bold title, optional reset button on the right, thin top
// border between sections).
function Section({
  title,
  onReset,
  first,
  dense,
  children
}: {
  title: string;
  onReset?: () => void;
  first?: boolean;
  dense?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: first ? 0 : 20,
        paddingTop: first ? 0 : 16,
        borderTop: first ? 'none' : '1px solid rgba(0, 0, 0, 0.10)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </h3>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            style={{
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              color: 'var(--muted-mid)',
              cursor: 'pointer'
            }}
          >
            기본값으로 되돌리기
          </button>
        )}
      </div>
      <div className={dense ? 'section-dense' : undefined}>{children}</div>
    </div>
  );
}

function SubGroup({ label, onReset }: { label: string; onReset?: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 12
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em'
        }}
      >
        {label}
      </h3>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            color: 'var(--muted-mid)',
            cursor: 'pointer'
          }}
        >
          기본값으로 되돌리기
        </button>
      )}
    </div>
  );
}

function LabelPicker({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isPool = (CTA_LABEL_POOL as readonly string[]).includes(value);
  const selectValue = isPool ? value : CUSTOM_SENTINEL;

  function handleSelect(v: string) {
    if (v === CUSTOM_SENTINEL) {
      if (isPool) onChange('');
    } else {
      onChange(v);
    }
  }

  return (
    <div className="field">
      <label>옐로우 라벨</label>
      <select value={selectValue} onChange={(e) => handleSelect(e.target.value)}>
        {CTA_LABEL_POOL.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value={CUSTOM_SENTINEL}>✏️ 직접 입력…</option>
      </select>
      <input
        type="text"
        value={value}
        disabled={isPool}
        placeholder={isPool ? '추천 라벨 사용 중 — 직접 입력하려면 위에서 선택' : '직접 입력하세요'}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginTop: 8, opacity: isPool ? 0.5 : 1 }}
      />
    </div>
  );
}

type Props = {
  draft: SpotlightDraft;
  update: <K extends keyof SpotlightDraft>(key: K, value: SpotlightDraft[K]) => void;
};

export function CtaEditor({ draft, update }: Props) {
  function resetMessageStyle() {
    update('ctaCharacterMessageFontSize', DEFAULT_DRAFT.ctaCharacterMessageFontSize);
    update('ctaCharacterMessageLineHeight', DEFAULT_DRAFT.ctaCharacterMessageLineHeight);
  }
  function resetLayout() {
    update('ctaCharacterRowOffsetY', DEFAULT_DRAFT.ctaCharacterRowOffsetY);
    update('ctaFollowOffsetY', DEFAULT_DRAFT.ctaFollowOffsetY);
  }
  function resetCharacterPlacement() {
    update('ctaCharacterSize', DEFAULT_DRAFT.ctaCharacterSize);
  }

  return (
    <div className="form-section">
      <h2>CTA 편집</h2>

      <Section title="라벨 & 질문" first>
        <LabelPicker
          value={draft.ctaLabel}
          onChange={(v) => update('ctaLabel', v)}
        />
        <div className="field">
          <label>질문 추천 풀</label>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) update('ctaQuestion', e.target.value);
            }}
          >
            <option value="">— 추천 질문 선택 (자동 채움) —</option>
            {SPOTLIGHT_QUESTION_POOL.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
        <TextField
          label="질문 텍스트"
          value={draft.ctaQuestion}
          onChange={(v) => update('ctaQuestion', v)}
          multiline
          rows={3}
        />
      </Section>

      <Section title="형광펜">
        <TextField
          label="질문 형광펜 단어"
          value={draft.ctaQuestionHighlight}
          onChange={(v) => update('ctaQuestionHighlight', v)}
          helper="질문 텍스트에서 강조할 단어/구절 (쉼표 구분, 최대 2개)"
        />
        <HighlighterControls
          value={draft.ctaHighlighter}
          onChange={(next) => update('ctaHighlighter', next)}
        />
      </Section>

      <Section title="발행자 멘트" onReset={resetMessageStyle} dense>
        <TextField
          label="자유 멘트 (캐릭터 옆 말풍선)"
          value={draft.ctaCharacterMessage}
          onChange={(v) => update('ctaCharacterMessage', v)}
          multiline
          rows={3}
          helper={'4줄 이하 권장. 강조할 부분은 `**단어**`로 감싸면 굵게 표시됩니다\n(예: 스폰지타임즈 **`솔라`**입니다).'}
        />
        <RangeField
          label="멘트 글자 크기"
          value={draft.ctaCharacterMessageFontSize}
          min={18}
          max={40}
          step={1}
          unit="px"
          onChange={(v) => update('ctaCharacterMessageFontSize', v)}
        />
        <RangeField
          label="멘트 줄간격"
          value={draft.ctaCharacterMessageLineHeight}
          min={1}
          max={2.2}
          step={0.05}
          unit="x"
          onChange={(v) => update('ctaCharacterMessageLineHeight', v)}
        />
      </Section>

      <Section title="캐릭터">
        <ImageField
          label="CTA 캐릭터 이미지"
          value={draft.ctaCharacterImage}
          onChange={(v) => update('ctaCharacterImage', v)}
          helper="투명 배경 PNG 권장"
        />
        <SubGroup label="캐릭터 크기" onReset={resetCharacterPlacement} />
        <div className="section-dense">
          <RangeField
            label="캐릭터 크기"
            value={draft.ctaCharacterSize}
            min={20}
            max={60}
            step={1}
            unit="%"
            onChange={(v) => update('ctaCharacterSize', v)}
          />
        </div>
        <CharacterPromptCopy
          publisher={draft.publisher}
          contentType={draft.contentType}
          slideType="cta"
          title="CTA 캐릭터 프롬프트"
        />
      </Section>

      <Section title="레이아웃" onReset={resetLayout} dense>
        <RangeField
          label="캐릭터+말풍선 세로 위치 (Y)"
          value={draft.ctaCharacterRowOffsetY}
          min={-300}
          max={300}
          step={2}
          unit="px"
          onChange={(v) => update('ctaCharacterRowOffsetY', v)}
        />
        <RangeField
          label="팔로우 카드 세로 위치 (Y)"
          value={draft.ctaFollowOffsetY}
          min={-300}
          max={300}
          step={2}
          unit="px"
          onChange={(v) => update('ctaFollowOffsetY', v)}
        />
      </Section>

      <Section title="팔로우 카드">
        <div className="helper" style={{ marginBottom: 12 }}>
          스폰지클럽 카드는 기본 로고가 적용돼요. 변경은 코드 수정 필요.
        </div>
        <SubGroup label="보조 팔로우 카드 (개인 계정)" />
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginTop: 6,
            padding: '8px 12px',
            borderRadius: 8,
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            fontSize: 13,
            color: '#555',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <span>보조 팔로우 카드 표시</span>
          <input
            type="checkbox"
            checked={draft.ctaSecondaryFollowEnabled}
            onChange={(e) => update('ctaSecondaryFollowEnabled', e.target.checked)}
          />
        </label>
        {draft.ctaSecondaryFollowEnabled && (
          <>
            <TextField
              label="이름"
              value={draft.ctaSecondaryFollowName}
              onChange={(v) => update('ctaSecondaryFollowName', v)}
              placeholder="예: 솔라"
            />
            <TextField
              label="핸들"
              value={draft.ctaSecondaryFollowHandle}
              onChange={(v) => update('ctaSecondaryFollowHandle', v)}
              placeholder="예: @solar.handle"
            />
            <ImageField
              label="프로필 이미지"
              value={draft.ctaSecondaryFollowImage}
              onChange={(v) => update('ctaSecondaryFollowImage', v)}
              disableCutout
            />
          </>
        )}
      </Section>
    </div>
  );
}
