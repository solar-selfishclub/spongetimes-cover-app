import { useMemo, useState } from 'react';
import { generateCharacterPrompt } from './promptBuilder';
import { ContentType, PublisherName, SLOWQUICK_9_POSES } from '../tokens';

type Props = {
  publisher: PublisherName;
  contentType: ContentType;
  slideType: 'cover' | 'cta' | 'body';
  title: string;
};

export function CharacterPromptCopy({ publisher, contentType, slideType, title }: Props) {
  // Two separate states:
  // - `inputDraft` = what the user is currently typing (not yet applied)
  // - `appliedPose` = what's actually baked into the prompt right now
  // The prompt only updates when the user clicks 확인, or 포즈 다시 뽑기 (which clears it).
  const [inputDraft, setInputDraft] = useState('');
  const [appliedPose, setAppliedPose] = useState('');
  const [seed, setSeed] = useState(0); // re-roll trigger when appliedPose === ''
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () => generateCharacterPrompt({
      publisher,
      contentType,
      slideType,
      customPose: appliedPose
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [publisher, contentType, slideType, appliedPose, seed]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  function applyCustom() {
    setAppliedPose(inputDraft.trim());
  }

  function rerollRandom() {
    setAppliedPose('');
    setInputDraft('');
    setSeed((s) => s + 1);
  }

  function pick9Pose(num: string) {
    if (!num) return;
    const found = SLOWQUICK_9_POSES.find((p) => p.num === num);
    if (!found) return;
    setInputDraft(`pose #${found.num} (${found.label}) — ${found.desc}`);
    setAppliedPose(`pose #${found.num} (${found.label}) — ${found.desc}`);
  }

  const isCustomActive = appliedPose.length > 0;
  const isSlowquickBody =
    slideType === 'body' && publisher === '슬로우퀵';

  return (
    <div className="field">
      <label>{title}</label>
      <div className="helper" style={{ marginBottom: 8 }}>
        📎 AI 도구에서 이 프롬프트와 함께 <b>{publisher}의 9포즈 액션 시트</b>를 같이 첨부해 주세요. AI가 시트에서 상황에 맞는 포즈를 골라 다시 렌더링합니다.
      </div>

      {/* Slowquick body slides: 9-pose direct picker */}
      {isSlowquickBody && (
        <div className="field" style={{ marginBottom: 10 }}>
          <label style={{ marginBottom: 4 }}>슬로우퀵 9포즈 직접 선택</label>
          <select
            value=""
            onChange={(e) => pick9Pose(e.target.value)}
          >
            <option value="">— 9포즈 중 선택 (자동 적용) —</option>
            {SLOWQUICK_9_POSES.map((p) => (
              <option key={p.num} value={p.num}>
                #{p.num} · {p.label}
              </option>
            ))}
          </select>
          <div className="helper" style={{ marginTop: 4 }}>
            본문 OS: 슬로우퀵 9컷 시스템 (DESIGN-BODY.md §4)
          </div>
        </div>
      )}

      {/* Custom pose — above the prompt */}
      <div className="custom-pose-row">
        <input
          type="text"
          value={inputDraft}
          placeholder="원하는 포즈를 입력 (예: 트로피 들고 활짝 웃기)"
          onChange={(e) => setInputDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyCustom();
            }
          }}
        />
        <button
          type="button"
          className="btn btn-small"
          onClick={applyCustom}
          disabled={!inputDraft.trim()}
        >
          확인
        </button>
      </div>
      {isCustomActive && (
        <div className="helper" style={{ marginTop: 4 }}>
          ✅ 커스텀 포즈 적용됨: <b>{appliedPose}</b>
        </div>
      )}

      {/* Prompt block */}
      <div className="prompt-block" style={{ marginTop: 10 }}>{prompt}</div>
      <div className="prompt-actions">
        <button type="button" className="btn btn-small" onClick={copy}>
          {copied ? '복사됨 ✓' : '프롬프트 복사'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={rerollRandom}
        >
          {isCustomActive ? '랜덤 포즈로 되돌리기' : '포즈 다시 뽑기'}
        </button>
      </div>
    </div>
  );
}
