import { SpotlightDraft } from '../../state/useSpotlightDraft';
import { TextField, ImageField, RangeField, SelectField } from '../fields';
import { CTA_LABEL_POOL, CTA_MESSAGE_FONTS, SPOTLIGHT_QUESTION_POOL } from '../../tokens';
import { HighlighterControls } from './HighlighterControls';

const CUSTOM_SENTINEL = '__custom__';

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
      // Switching to custom — keep whatever is already there if it's already custom,
      // otherwise start blank so the user knows the input is theirs to fill.
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
  return (
    <div className="form-section">
      <h2>CTA 편집</h2>
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
      <TextField
        label="질문 형광펜 단어"
        value={draft.ctaQuestionHighlight}
        onChange={(v) => update('ctaQuestionHighlight', v)}
      />
      <HighlighterControls draft={draft} update={update} />
      <TextField
        label="발행자 자유 멘트 (캐릭터 옆)"
        value={draft.ctaCharacterMessage}
        onChange={(v) => update('ctaCharacterMessage', v)}
        multiline
        rows={3}
        helper="2~3줄. 캐릭터/발행자 개성 살리기"
      />
      <SelectField
        label="멘트 폰트"
        value={draft.ctaMessageFontFamily}
        options={CTA_MESSAGE_FONTS}
        onChange={(v) => update('ctaMessageFontFamily', v)}
      />
      <div className="field-row">
        <RangeField
          label="멘트 글자 크기"
          value={draft.ctaMessageFontSize}
          min={20}
          max={96}
          unit="px"
          onChange={(v) => update('ctaMessageFontSize', v)}
        />
        <RangeField
          label="멘트 굵기"
          value={draft.ctaMessageFontWeight}
          min={100}
          max={900}
          step={100}
          onChange={(v) => update('ctaMessageFontWeight', v)}
        />
      </div>
      <div className="field-row">
        <RangeField
          label="멘트 자간"
          value={draft.ctaMessageLetterSpacing}
          min={-0.1}
          max={0.2}
          step={0.005}
          unit="em"
          onChange={(v) => update('ctaMessageLetterSpacing', v)}
        />
        <RangeField
          label="멘트 줄간격"
          value={draft.ctaMessageLineHeight}
          min={1}
          max={2.5}
          step={0.05}
          onChange={(v) => update('ctaMessageLineHeight', v)}
        />
      </div>
      <ImageField
        label="CTA 캐릭터 이미지"
        value={draft.ctaCharacterImage}
        onChange={(v) => update('ctaCharacterImage', v)}
      />
      <RangeField
        label="캐릭터 크기"
        value={draft.ctaCharacterSize}
        min={15}
        max={70}
        unit="%"
        onChange={(v) => update('ctaCharacterSize', v)}
      />

      <div className="field-row">
        <RangeField
          label="캐릭터 X 이동"
          value={draft.ctaCharacterOffsetX}
          min={-900}
          max={900}
          step={5}
          unit="px"
          onChange={(v) => update('ctaCharacterOffsetX', v)}
        />
        <RangeField
          label="캐릭터 Y 이동"
          value={draft.ctaCharacterOffsetY}
          min={-300}
          max={300}
          step={5}
          unit="px"
          onChange={(v) => update('ctaCharacterOffsetY', v)}
        />
      </div>
      <div className="field-row">
        <RangeField
          label="멘트 X 이동"
          value={draft.ctaMessageOffsetX}
          min={-900}
          max={900}
          step={5}
          unit="px"
          onChange={(v) => update('ctaMessageOffsetX', v)}
        />
        <RangeField
          label="멘트 Y 이동"
          value={draft.ctaMessageOffsetY}
          min={-300}
          max={300}
          step={5}
          unit="px"
          onChange={(v) => update('ctaMessageOffsetY', v)}
        />
      </div>
      <RangeField
        label="팔로우 카드 Y 이동"
        value={draft.ctaFollowOffsetY}
        min={-100}
        max={300}
        step={5}
        unit="px"
        onChange={(v) => update('ctaFollowOffsetY', v)}
      />

      <div
        style={{
          marginTop: 16,
          marginBottom: 12,
          padding: '12px 14px',
          background: '#FFFEF4',
          border: '1px solid #E5E1D0',
          borderRadius: 8
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}
        >
          <input
            type="checkbox"
            checked={draft.ctaSecondaryFollowEnabled}
            onChange={(e) => update('ctaSecondaryFollowEnabled', e.target.checked)}
            style={{ width: 16, height: 16, margin: 0, flexShrink: 0 }}
          />
          <span>개인 팔로우 카드 추가</span>
        </label>
        <div
          className="helper"
          style={{ marginTop: 6, marginLeft: 26 }}
        >
          @spongeclub.ai 아래에 발행자 개인 계정 카드를 하나 더 표시
        </div>
      </div>
      {draft.ctaSecondaryFollowEnabled && (
        <>
          <TextField
            label="개인 계정 표시명"
            value={draft.ctaSecondaryFollowName}
            onChange={(v) => update('ctaSecondaryFollowName', v)}
            placeholder="예: KENO (스폰지타임즈)"
            helper="카드 윗줄에 굵게 표시됨"
          />
          <TextField
            label="개인 계정 @핸들"
            value={draft.ctaSecondaryFollowHandle}
            onChange={(v) => update('ctaSecondaryFollowHandle', v)}
            placeholder="@amuse__ai"
            helper="@를 포함해서 입력. 비워두면 카드가 숨겨짐"
          />
          <ImageField
            label="개인 계정 프로필 이미지"
            value={draft.ctaSecondaryFollowImage}
            onChange={(v) => update('ctaSecondaryFollowImage', v)}
            helper="정사각형 권장. 비워두면 👤 아이콘이 들어감"
          />
        </>
      )}

    </div>
  );
}
