import { ReactNode } from 'react';
import { CONTENT_TYPE_SUGGESTIONS } from '../../tokens';
import { DEFAULT_DRAFT, SpotlightDraft } from '../../state/useSpotlightDraft';
import { TextField, ImageField, NumberField, RangeField, SelectField } from '../fields';
import { CharacterPromptCopy } from '../../character/CharacterPromptCopy';
import { HighlighterControls } from './HighlighterControls';

// Visual top-level section inside the editor sidebar. Each section gets a
// clear bold title, a thin top border (except the first), and optional reset
// button on the right.
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

// Nested sub-group inside a section. Used when a section has multiple
// concerns but only one of them needs its own reset (e.g. 캐릭터 section
// has image + placement + prompt — only placement gets a reset).
function SubGroup({ label, onReset }: { label: string; onReset: () => void }) {
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
    </div>
  );
}

type Props = {
  draft: SpotlightDraft;
  update: <K extends keyof SpotlightDraft>(key: K, value: SpotlightDraft[K]) => void;
};

export function CoverEditor({ draft, update }: Props) {
  function resetTitleStyle() {
    update('mainTitleSize', DEFAULT_DRAFT.mainTitleSize);
    update('mainTitleAlign', DEFAULT_DRAFT.mainTitleAlign);
    update('mainTitleTopOffset', DEFAULT_DRAFT.mainTitleTopOffset);
  }
  function resetCharacterPlacement() {
    update('coverCharacterSize', DEFAULT_DRAFT.coverCharacterSize);
    update('coverCharacterX', DEFAULT_DRAFT.coverCharacterX);
    update('coverCharacterY', DEFAULT_DRAFT.coverCharacterY);
  }

  return (
    <div className="form-section">
      <h2>표지 편집</h2>

      <Section title="콘텐츠" first>
        <NumberField
          label="주차 (1-7)"
          value={draft.week}
          min={1}
          max={7}
          onChange={(v) => update('week', v)}
        />
        <TextField
          label="콘텐츠 유형"
          value={draft.contentType}
          onChange={(v) => update('contentType', v)}
          placeholder={`예: ${CONTENT_TYPE_SUGGESTIONS.join(' / ')}`}
          helper="자유 입력. 표지 라벨에 'Week N · 입력값' 형태로 들어감"
        />
        <TextField
          label="메인 타이틀"
          value={draft.mainTitle}
          onChange={(v) => update('mainTitle', v)}
          multiline
          rows={3}
          helper="줄바꿈은 엔터로. 2~3줄 권장."
        />
      </Section>

      <Section title="타이틀 스타일" onReset={resetTitleStyle} dense>
        <RangeField
          label="타이틀 크기"
          value={draft.mainTitleSize}
          min={48}
          max={180}
          unit="px"
          onChange={(v) => update('mainTitleSize', v)}
        />
        <div className="field-row">
          <SelectField
            label="타이틀 정렬"
            value={draft.mainTitleAlign}
            options={['left', 'center', 'right']}
            onChange={(v) => update('mainTitleAlign', v)}
          />
          <RangeField
            label="위에서 띄우기"
            value={draft.mainTitleTopOffset}
            min={0}
            max={500}
            step={10}
            unit="px"
            onChange={(v) => update('mainTitleTopOffset', v)}
          />
        </div>
      </Section>

      <Section title="형광펜">
        <TextField
          label="형광펜 강조 단어 (쉼표 구분, 최대 2개)"
          value={draft.mainTitleHighlight}
          onChange={(v) => update('mainTitleHighlight', v)}
          helper="메인 타이틀 안에서 정확히 일치하는 단어/구절만 강조됨"
        />
        <HighlighterControls
          value={draft.coverHighlighter}
          onChange={(next) => update('coverHighlighter', next)}
        />
      </Section>

      <Section title="캐릭터">
        <ImageField
          label="표지 캐릭터 이미지"
          value={draft.coverCharacterImage}
          onChange={(v) => update('coverCharacterImage', v)}
          helper="투명 배경 PNG 권장"
        />
        <SubGroup label="캐릭터 배치" onReset={resetCharacterPlacement} />
        <div className="section-dense">
          <RangeField
            label="캐릭터 크기"
            value={draft.coverCharacterSize}
            min={10}
            max={80}
            unit="%"
            onChange={(v) => update('coverCharacterSize', v)}
          />
          <div className="field-row">
            <RangeField
              label="캐릭터 가로 위치 (X)"
              value={draft.coverCharacterX}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => update('coverCharacterX', v)}
            />
            <RangeField
              label="캐릭터 세로 위치 (Y)"
              value={draft.coverCharacterY}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => update('coverCharacterY', v)}
            />
          </div>
        </div>
        <CharacterPromptCopy
          publisher={draft.publisher}
          contentType={draft.contentType}
          slideType="cover"
          title="표지 캐릭터 프롬프트"
        />
      </Section>
    </div>
  );
}
