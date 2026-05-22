import {
  ChangeEvent,
  CSSProperties,
  MouseEvent,
  useEffect,
  useRef,
  useState
} from 'react';

type Props = {
  src: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
};

type Pick = { x: number; y: number; r: number; g: number; b: number };
type RefSheet = { dataUrl: string; mime: string };
type Mode = 'pick' | 'erase' | 'restore';

const API_KEY_STORAGE = 'spongetimes.gemini_api_key';
const PROMPT_STORAGE = 'spongetimes.gemini_last_prompt';
const MODEL_STORAGE = 'spongetimes.gemini_model';
const DEFAULT_MODEL = 'gemini-2.5-flash-image';
const MODEL_SUGGESTIONS = [
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-image-preview',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash-preview-image-generation',
  'imagen-3.0-generate-002'
];

function toHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

function fileToData(file: File): Promise<RefSheet> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ dataUrl: reader.result as string, mime: file.type || 'image/png' });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function buildFullPrompt(userPrompt: string): string {
  return [
    userPrompt.trim(),
    '',
    '필수 제약 조건 (반드시 지켜주세요):',
    '- 캐릭터 시트를 참조하여 외형, 의상, 헤어, 색상, 비율 등 모든 특징을 그대로 유지한 채 포즈만 새로 만들어주세요.',
    '- 배경은 캐릭터에 사용된 색상과 절대 겹치지 않는 단일 색(flat color)으로 채워주세요. 그라데이션이나 패턴 없이 한 가지 색만 사용하세요.',
    '- 캐릭터 1명만, 정면 또는 약간 사선에서 전신/상반신이 잘 보이도록 그려주세요. 텍스트나 워터마크 없이.'
  ].join('\n');
}

function paintDisc(mask: Uint8Array, w: number, h: number, cx: number, cy: number, r: number) {
  const r2 = r * r;
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(w - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(h - 1, Math.ceil(cy + r));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        mask[y * w + x] = 255;
      }
    }
  }
}

function paintStroke(
  mask: Uint8Array,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: number
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(1, Math.ceil(dist / Math.max(1, r * 0.5)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    paintDisc(mask, w, h, x0 + dx * t, y0 + dy * t, r);
  }
}

export function ColorKeyoutModal({ src, onCancel, onApply }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const refSheetInputRef = useRef<HTMLInputElement>(null);
  const originalDataRef = useRef<ImageData | null>(null);
  const eraseMaskRef = useRef<Uint8Array | null>(null);
  const restoreMaskRef = useRef<Uint8Array | null>(null);
  const isPaintingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [effectiveSrc, setEffectiveSrc] = useState(src);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [threshold, setThreshold] = useState(40);
  const [feather, setFeather] = useState(15);
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<Mode>('pick');
  const [brushSize, setBrushSize] = useState(24);
  const [maskVersion, setMaskVersion] = useState(0);
  const [cursorPos, setCursorPos] = useState<{ cssX: number; cssY: number } | null>(null);
  const [displayScale, setDisplayScale] = useState(1);

  const [refSheet, setRefSheet] = useState<RefSheet | null>(null);
  const [prompt, setPrompt] = useState(() => localStorage.getItem(PROMPT_STORAGE) || '');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [saveKey, setSaveKey] = useState(() => !!localStorage.getItem(API_KEY_STORAGE));
  const [model, setModel] = useState(
    () => localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL
  );
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [lastGenInfo, setLastGenInfo] = useState<string | null>(null);

  useEffect(() => {
    setEffectiveSrc(src);
  }, [src]);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      originalDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const total = canvas.width * canvas.height;
      eraseMaskRef.current = new Uint8Array(total);
      restoreMaskRef.current = new Uint8Array(total);
      setMaskVersion(0);
      setPicks([]);
      setLoaded(true);
    };
    img.src = effectiveSrc;
  }, [effectiveSrc]);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const update = () => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width > 0) setDisplayScale(rect.width / canvas.width);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [loaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const original = originalDataRef.current;
    if (!canvas || !original) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = original.width;
    const h = original.height;
    const srcData = original.data;
    const out = new Uint8ClampedArray(srcData);

    if (picks.length > 0) {
      const total = w * h;
      const visited = new Uint8Array(total);
      const queue = new Int32Array(total);
      const t2 = threshold * threshold;
      const tf = threshold + feather;
      const tf2 = tf * tf;

      for (const pick of picks) {
        visited.fill(0);
        let qHead = 0;
        let qTail = 0;
        const startIdx = pick.x + pick.y * w;
        if (startIdx < 0 || startIdx >= total) continue;
        queue[qTail++] = startIdx;
        visited[startIdx] = 1;

        while (qHead < qTail) {
          const i = queue[qHead++];
          const p4 = i * 4;
          const dr = srcData[p4] - pick.r;
          const dg = srcData[p4 + 1] - pick.g;
          const db = srcData[p4 + 2] - pick.b;
          const d2 = dr * dr + dg * dg + db * db;
          if (d2 > tf2) continue;

          if (d2 <= t2) {
            out[p4 + 3] = 0;
          } else if (feather > 0) {
            const dist = Math.sqrt(d2);
            const a = (dist - threshold) / feather;
            const next = Math.round(srcData[p4 + 3] * a);
            if (next < out[p4 + 3]) out[p4 + 3] = next;
          }

          const x = i % w;
          const y = (i - x) / w;
          if (x > 0 && !visited[i - 1]) {
            visited[i - 1] = 1;
            queue[qTail++] = i - 1;
          }
          if (x < w - 1 && !visited[i + 1]) {
            visited[i + 1] = 1;
            queue[qTail++] = i + 1;
          }
          if (y > 0 && !visited[i - w]) {
            visited[i - w] = 1;
            queue[qTail++] = i - w;
          }
          if (y < h - 1 && !visited[i + w]) {
            visited[i + w] = 1;
            queue[qTail++] = i + w;
          }
        }
      }
    }

    const erase = eraseMaskRef.current;
    const restore = restoreMaskRef.current;
    if (erase && restore) {
      const total = w * h;
      for (let i = 0; i < total; i++) {
        const e = erase[i];
        const r = restore[i];
        if (e === 0 && r === 0) continue;
        const p4 = i * 4;
        let a = out[p4 + 3];
        if (e > 0) {
          a = Math.min(a, Math.round(a * (1 - e / 255)));
        }
        if (r > 0) {
          const restored = Math.round(srcData[p4 + 3] * (r / 255));
          a = Math.max(a, restored);
        }
        out[p4 + 3] = a;
      }
    }

    ctx.putImageData(new ImageData(out, w, h), 0, 0);
  }, [picks, threshold, feather, maskVersion]);

  function getCanvasPoint(e: MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    return {
      cssX,
      cssY,
      x: Math.floor((cssX / rect.width) * canvas.width),
      y: Math.floor((cssY / rect.height) * canvas.height)
    };
  }

  function handlePickClick(e: MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const original = originalDataRef.current;
    if (!canvas || !original) return;
    const { x, y } = getCanvasPoint(e);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
    const idx = (y * canvas.width + x) * 4;
    setPicks((prev) => [
      ...prev,
      {
        x,
        y,
        r: original.data[idx],
        g: original.data[idx + 1],
        b: original.data[idx + 2]
      }
    ]);
  }

  function applyBrushStroke(x0: number, y0: number, x1: number, y1: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mask = mode === 'erase' ? eraseMaskRef.current : restoreMaskRef.current;
    if (!mask) return;
    paintStroke(mask, canvas.width, canvas.height, x0, y0, x1, y1, brushSize);
    setMaskVersion((v) => v + 1);
  }

  function handleMouseDown(e: MouseEvent<HTMLCanvasElement>) {
    if (mode === 'pick') {
      handlePickClick(e);
      return;
    }
    const { x, y } = getCanvasPoint(e);
    isPaintingRef.current = true;
    lastPointRef.current = { x, y };
    applyBrushStroke(x, y, x, y);
  }

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    const { cssX, cssY, x, y } = getCanvasPoint(e);
    setCursorPos({ cssX, cssY });
    if (!isPaintingRef.current || mode === 'pick') return;
    const prev = lastPointRef.current ?? { x, y };
    applyBrushStroke(prev.x, prev.y, x, y);
    lastPointRef.current = { x, y };
  }

  function handleMouseUp() {
    isPaintingRef.current = false;
    lastPointRef.current = null;
  }

  function handleMouseLeave() {
    isPaintingRef.current = false;
    lastPointRef.current = null;
    setCursorPos(null);
  }

  function removePick(i: number) {
    setPicks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function resetBrushMasks() {
    eraseMaskRef.current?.fill(0);
    restoreMaskRef.current?.fill(0);
    setMaskVersion((v) => v + 1);
  }

  function handleApply() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onApply(canvas.toDataURL('image/png'));
  }

  async function handleRefSheetFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const data = await fileToData(file);
    setRefSheet(data);
  }

  async function handleGenerate() {
    if (!refSheet || !prompt.trim() || !apiKey.trim() || !model.trim() || generating) return;

    setGenError(null);
    setLastGenInfo(null);
    setGenerating(true);

    if (saveKey) localStorage.setItem(API_KEY_STORAGE, apiKey);
    else localStorage.removeItem(API_KEY_STORAGE);
    localStorage.setItem(PROMPT_STORAGE, prompt);
    localStorage.setItem(MODEL_STORAGE, model.trim());

    const usedModel = model.trim();

    try {
      const base64 = refSheet.dataUrl.split(',')[1];
      const fullPrompt = buildFullPrompt(prompt);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        usedModel
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;
      // eslint-disable-next-line no-console
      console.log('[Gemini call]', { model: usedModel, refSheetMime: refSheet.mime, refSheetSizeKB: Math.round(base64.length * 0.75 / 1024) });
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: fullPrompt },
                { inline_data: { mime_type: refSheet.mime, data: base64 } }
              ]
            }
          ],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
        })
      });

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 429) {
          throw new Error(
            `Gemini 무료 한도 초과 (429) · 모델: ${usedModel}\n` +
              '· 잠시 기다린 뒤 다시 시도하세요 (분/일 단위 한도).\n' +
              '· 캐릭터 시트가 크면 입력 토큰을 많이 먹어요 — 1024px 이하 PNG/JPG로 줄여서 올려보세요.\n' +
              '· 다른 모델로 바꿔서 테스트해보세요 (위의 추천 칩 클릭).\n' +
              '· Google AI Studio에서 결제(Billing)를 활성화하면 한도가 풀립니다.\n' +
              '자세히: https://ai.dev/rate-limit'
          );
        }
        if (res.status === 404) {
          throw new Error(
            `모델을 찾을 수 없음 (404) · 모델: ${usedModel}\n` +
              '· 모델 ID 오타 확인. 추천 칩에서 다른 모델을 시도해보세요.\n' +
              '· 사용 가능한 모델 목록: https://ai.google.dev/gemini-api/docs/models'
          );
        }
        throw new Error(`API ${res.status} · 모델 ${usedModel}: ${text.slice(0, 400)}`);
      }
      const json = await res.json();
      const parts = json?.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(
        (p: { inlineData?: { data?: string }; inline_data?: { data?: string } }) =>
          p.inlineData?.data || p.inline_data?.data
      );
      const inline = imgPart?.inlineData || imgPart?.inline_data;
      if (!inline?.data) {
        const blockReason = json?.promptFeedback?.blockReason;
        throw new Error(
          blockReason
            ? `이미지가 반환되지 않았습니다 (차단 사유: ${blockReason})`
            : '응답에 이미지가 없습니다.'
        );
      }
      const mime = inline.mimeType || inline.mime_type || 'image/png';
      const newDataUrl = `data:${mime};base64,${inline.data}`;
      setPicks([]);
      setEffectiveSrc(newDataUrl);
      setLastGenInfo(`✓ 성공 · 모델: ${usedModel}`);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : String(err));
    } finally {
      setGenerating(false);
    }
  }

  const canGenerate =
    !!refSheet && prompt.trim().length > 0 && apiKey.trim().length > 0 && model.trim().length > 0;
  const brushColor = mode === 'erase' ? '#e74c3c' : '#27ae60';

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: 16 }}>누끼 + AI 포즈 생성</h3>
          <button type="button" className="btn btn-ghost btn-small" onClick={onCancel}>
            닫기
          </button>
        </div>

        <div style={twoColStyle}>
          {/* 좌측: 누끼 작업 */}
          <div style={colStyle}>
            <div style={modeRowStyle}>
              <ModeButton active={mode === 'pick'} onClick={() => setMode('pick')}>
                색 클릭
              </ModeButton>
              <ModeButton active={mode === 'erase'} onClick={() => setMode('erase')}>
                지우개
              </ModeButton>
              <ModeButton active={mode === 'restore'} onClick={() => setMode('restore')}>
                복구
              </ModeButton>
            </div>

            <div style={{ fontSize: 12, color: '#666' }}>
              {mode === 'pick' &&
                '배경을 클릭하면 그 지점과 연결된 같은 색 영역만 투명해집니다. 여러 번 클릭 가능.'}
              {mode === 'erase' && '드래그한 영역을 추가로 투명하게 만듭니다 (덜 지워진 곳 보정).'}
              {mode === 'restore' &&
                '드래그한 영역을 원래대로 되돌립니다 (잘못 지워진 곳 복구).'}
            </div>

            <div style={previewBoxStyle}>
              <div ref={canvasWrapRef} style={{ position: 'relative', display: 'inline-block' }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '50vh',
                    cursor: !loaded
                      ? 'wait'
                      : mode === 'pick'
                        ? 'crosshair'
                        : 'none',
                    display: 'block',
                    userSelect: 'none'
                  }}
                />
                {mode !== 'pick' && cursorPos && loaded && (
                  <div
                    style={{
                      position: 'absolute',
                      pointerEvents: 'none',
                      left: cursorPos.cssX - brushSize * displayScale,
                      top: cursorPos.cssY - brushSize * displayScale,
                      width: brushSize * 2 * displayScale,
                      height: brushSize * 2 * displayScale,
                      borderRadius: '50%',
                      border: `1.5px solid ${brushColor}`,
                      background: `${brushColor}22`,
                      boxSizing: 'border-box'
                    }}
                  />
                )}
              </div>
            </div>

            {mode === 'pick' && (
              <>
                <div style={{ fontSize: 13 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 6
                    }}
                  >
                    <span>
                      찍은 색 <strong>{picks.length}</strong>개
                    </span>
                    {picks.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-small"
                        onClick={() => setPicks([])}
                      >
                        전체 초기화
                      </button>
                    )}
                  </div>
                  {picks.length === 0 ? (
                    <div style={{ color: '#888', fontSize: 12 }}>
                      이미지에서 배경을 클릭하세요
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {picks.map((p, i) => {
                        const hex = toHex(p.r, p.g, p.b);
                        return (
                          <span key={i} style={chipStyle}>
                            <span
                              style={{
                                width: 14,
                                height: 14,
                                background: hex,
                                border: '1px solid rgba(0,0,0,0.15)',
                                borderRadius: '50%',
                                display: 'inline-block'
                              }}
                            />
                            <code style={{ fontSize: 10 }}>{hex}</code>
                            <button
                              type="button"
                              onClick={() => removePick(i)}
                              title="이 색 취소"
                              style={chipCloseStyle}
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <label style={{ fontSize: 12, display: 'block' }}>
                  허용 오차 <strong>{threshold}</strong>
                  <input
                    type="range"
                    min={0}
                    max={150}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>

                <label style={{ fontSize: 12, display: 'block' }}>
                  가장자리 부드럽게 <strong>{feather}</strong>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={feather}
                    onChange={(e) => setFeather(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>
              </>
            )}

            {(mode === 'erase' || mode === 'restore') && (
              <>
                <label style={{ fontSize: 12, display: 'block' }}>
                  브러시 크기 <strong>{brushSize}px</strong>
                  <input
                    type="range"
                    min={2}
                    max={150}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={resetBrushMasks}
                  style={{ alignSelf: 'flex-start' }}
                >
                  지우개·복구 자국 초기화
                </button>
              </>
            )}
          </div>

          {/* 우측: AI 포즈 생성 */}
          <div style={colStyle}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              AI 포즈 생성 (Gemini 2.5 Flash Image)
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
              캐릭터 시트를 올리고 원하는 포즈를 묘사하면, 시트의 외형/의상을 유지한 채 새 포즈로
              그려줍니다. 결과는 좌측 캔버스에 자동으로 들어가서 곧바로 누끼/지우개 작업이
              가능합니다.
            </div>

            <div>
              <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                캐릭터 시트 (참조 이미지)
              </label>
              <div style={refDropStyle} onClick={() => refSheetInputRef.current?.click()}>
                {refSheet ? (
                  <img
                    src={refSheet.dataUrl}
                    alt="reference"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 140,
                      borderRadius: 4,
                      display: 'block'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: '#888' }}>
                    클릭해서 캐릭터 시트 업로드 (PNG/JPG)
                  </span>
                )}
              </div>
              {refSheet && (
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  style={{ marginTop: 4 }}
                  onClick={() => setRefSheet(null)}
                >
                  시트 제거
                </button>
              )}
              <input
                ref={refSheetInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleRefSheetFile}
              />
            </div>

            <label style={{ fontSize: 12, display: 'block' }}>
              포즈 / 상황 프롬프트
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={'예) 두 손으로 화이트보드를 가리키며 활짝 웃는 포즈, 정면, 상반신.'}
                style={{ width: '100%', marginTop: 4, fontSize: 12, padding: 6 }}
              />
            </label>

            <div style={apiBoxStyle}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                API 설정
              </div>

              <label style={{ fontSize: 12, display: 'block' }}>
                모델 ID
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="gemini-2.5-flash-image"
                  style={{ width: '100%', marginTop: 4, fontSize: 12, padding: 6 }}
                  autoComplete="off"
                />
              </label>
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  flexWrap: 'wrap',
                  marginTop: 6,
                  marginBottom: 8
                }}
              >
                <span style={{ fontSize: 11, color: '#888', alignSelf: 'center' }}>추천:</span>
                {MODEL_SUGGESTIONS.map((m) => {
                  const active = m === model.trim();
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      style={{
                        padding: '3px 7px',
                        fontSize: 10,
                        borderRadius: 999,
                        border: '1px solid',
                        borderColor: active ? '#222' : '#ddd',
                        background: active ? '#222' : '#fff',
                        color: active ? '#fff' : '#444',
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>

              <label style={{ fontSize: 12, display: 'block' }}>
                API 키
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  style={{ width: '100%', marginTop: 4, fontSize: 12, padding: 6 }}
                  autoComplete="off"
                />
              </label>
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: '#666',
                marginTop: -4
              }}
            >
              <input
                type="checkbox"
                checked={saveKey}
                onChange={(e) => setSaveKey(e.target.checked)}
              />
              이 브라우저에 API 키 저장 (localStorage · 평문)
            </label>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={!canGenerate || generating}
            >
              {generating ? '생성 중…' : '캐릭터 생성'}
            </button>

            {lastGenInfo && !genError && (
              <div style={{ fontSize: 11, color: '#27ae60' }}>{lastGenInfo}</div>
            )}
            {genError && (
              <div
                style={{
                  fontSize: 12,
                  color: '#c0392b',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5
                }}
              >
                {genError}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleApply}
            disabled={!loaded}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        border: '1px solid',
        borderColor: active ? '#222' : '#ddd',
        background: active ? '#222' : '#fff',
        color: active ? '#fff' : '#444',
        borderRadius: 6,
        fontSize: 12,
        cursor: 'pointer',
        fontWeight: active ? 600 : 400
      }}
    >
      {children}
    </button>
  );
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: 16
};

const modalStyle: CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 16,
  width: 'min(1100px, 96vw)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxHeight: '94vh',
  overflow: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline'
};

const twoColStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap'
};

const colStyle: CSSProperties = {
  flex: '1 1 360px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10
};

const modeRowStyle: CSSProperties = {
  display: 'flex',
  gap: 6
};

const previewBoxStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxHeight: '50vh'
};

const apiBoxStyle: CSSProperties = {
  border: '1px solid #eee',
  borderRadius: 8,
  padding: 10,
  background: '#fbfbfb'
};

const refDropStyle: CSSProperties = {
  border: '1px dashed #bbb',
  borderRadius: 8,
  padding: 12,
  minHeight: 80,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#fafafa',
  cursor: 'pointer'
};

const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 4px 3px 6px',
  border: '1px solid #ddd',
  borderRadius: 999,
  background: '#fafafa',
  fontSize: 11
};

const chipCloseStyle: CSSProperties = {
  width: 16,
  height: 16,
  border: 'none',
  background: '#eee',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: 11,
  lineHeight: 1,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#555'
};
