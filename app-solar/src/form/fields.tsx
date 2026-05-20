import { ChangeEvent, useRef, useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { PUBLISHER_NAMES, PublisherName } from '../tokens';

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Post-process the AI-cutout result to scrub residual magenta — both fully
// magenta pixels the model missed AND magenta-tinted edge fringe ("spill").
// Safe to always run: spongetimes characters use no magenta hues, so any
// magenta-ish pixel is by definition background that leaked through.
async function scrubMagentaResidue(blob: Blob): Promise<Blob> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return blob;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a === 0) continue;

      // Step 1: solid magenta residue (R high, B high, G low) → fully transparent.
      // Cheese mascot's red overalls (high R, low G, low B) are safe — they
      // don't satisfy the B>=180 condition.
      if (r >= 180 && b >= 180 && g <= 100) {
        data[i + 3] = 0;
        continue;
      }

      // Step 2: edge fringe / spill — pixel is "magenta-tinted" meaning both
      // red and blue clearly exceed green. Pull R and B down toward G so the
      // pink halo around character edges disappears without removing the
      // pixel entirely (preserves anti-aliasing).
      if (r > g + 50 && b > g + 50 && r >= 120 && b >= 120) {
        const cap = g + 20; // allow a tiny residual tint at most
        if (r > cap) data[i] = cap;
        if (b > cap) data[i + 2] = cap;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    return await new Promise<Blob>((resolve) =>
      canvas.toBlob((out) => resolve(out ?? blob), 'image/png')
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  helper,
  maxLength
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  helper?: string;
  maxLength?: number;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {helper && <div className="helper">{helper}</div>}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = ''
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="field">
      <label>
        {label} <span style={{ color: 'var(--muted-mid)', fontWeight: 500 }}>{value}{unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export function PublisherSelect({
  value,
  onChange
}: {
  value: PublisherName;
  onChange: (v: PublisherName) => void;
}) {
  return (
    <div className="field">
      <label>발행자</label>
      <select value={value} onChange={(e) => onChange(e.target.value as PublisherName)}>
        {PUBLISHER_NAMES.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: readonly T[] | T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  helper
}: {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  helper?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  // Keep the raw original (pre-cutout) so the checkbox can toggle both ways.
  // This is session-local — after a page refresh the persisted value (which may
  // already be the cut-out version) is all we have, so toggling off won't
  // restore the original unless the user re-uploads.
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const rawDataUrl = await blobToDataUrl(file);
    setOriginalImage(rawDataUrl);

    if (!autoRemoveBg) {
      onChange(rawDataUrl);
      return;
    }

    setStatus('processing');
    try {
      const cleaned = await removeBackground(file);
      const scrubbed = await scrubMagentaResidue(cleaned);
      const dataUrl = await blobToDataUrl(scrubbed);
      onChange(dataUrl);
      setStatus('idle');
    } catch (err) {
      console.error('background removal failed', err);
      onChange(rawDataUrl);
      setStatus('error');
    }
  }

  async function handleToggle(checked: boolean) {
    setAutoRemoveBg(checked);
    if (!value) return; // no image yet — just remember the preference

    if (checked) {
      // Off → On: apply cutout to the current image. Treat current value as
      // the original if we don't have one cached (e.g. after page refresh).
      const source = originalImage ?? value;
      if (!originalImage) setOriginalImage(value);

      setStatus('processing');
      try {
        const blob = await fetch(source).then((r) => r.blob());
        const cleaned = await removeBackground(blob);
        const scrubbed = await scrubMagentaResidue(cleaned);
        const cleanedUrl = await blobToDataUrl(scrubbed);
        onChange(cleanedUrl);
        setStatus('idle');
      } catch (err) {
        console.error('background removal failed', err);
        setStatus('error');
      }
    } else {
      // On → Off: revert to original if we still have it
      if (originalImage) onChange(originalImage);
      // else: no-op — original was lost (page refresh), user can re-upload
    }
  }

  const processing = status === 'processing';

  return (
    <div className="field">
      <label>{label}</label>
      <div
        className="image-drop"
        onClick={() => !processing && inputRef.current?.click()}
        style={processing ? { opacity: 0.6, cursor: 'wait' } : undefined}
      >
        {processing ? (
          <span>배경 제거 중… (첫 실행은 모델 다운로드로 10초 정도 걸려요)</span>
        ) : value ? (
          <img src={value} alt="" />
        ) : (
          <span>클릭해서 이미지 업로드 (PNG/JPG)</span>
        )}
      </div>
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
        <span>배경 자동 제거 (누끼)</span>
        <input
          type="checkbox"
          checked={autoRemoveBg}
          disabled={processing}
          onChange={(e) => handleToggle(e.target.checked)}
        />
      </label>
      {status === 'error' && (
        <div className="helper" style={{ color: '#c0392b' }}>
          배경 제거에 실패해 원본을 사용합니다.
        </div>
      )}
      {value && (
        <button
          type="button"
          className="btn btn-ghost btn-small"
          style={{ marginTop: 6 }}
          onClick={() => onChange(null)}
        >
          이미지 제거
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      {helper && <div className="helper">{helper}</div>}
    </div>
  );
}
