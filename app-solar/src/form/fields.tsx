import { ChangeEvent, useRef, useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { PUBLISHER_NAMES, PublisherName } from '../tokens';

// Full-precision ISNet — slower + larger download (~88MB) but best edge
// detection. Trying this to see if it helps white-on-white cases like the
// cheese character's white sleeve being clipped with the background.
const RM_BG_CONFIG = { model: 'isnet' as const };

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
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
      const cleaned = await removeBackground(file, RM_BG_CONFIG);
      const dataUrl = await blobToDataUrl(cleaned);
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
        const cleaned = await removeBackground(blob, RM_BG_CONFIG);
        const cleanedUrl = await blobToDataUrl(cleaned);
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
          <span>배경 제거 중… (첫 실행은 모델 다운로드로 15~20초 걸려요)</span>
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
