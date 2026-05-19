import { ChangeEvent, useRef } from 'react';
import { PUBLISHER_NAMES, PublisherName } from '../tokens';

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

export function CheckboxField({
  label,
  value,
  onChange,
  helper
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  helper?: string;
}) {
  return (
    <div className="field" style={{ marginBottom: 8 }}>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          marginBottom: 0
        }}
      >
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 16, height: 16, margin: 0 }}
        />
        <span>{label}</span>
      </label>
      {helper && <div className="helper" style={{ marginLeft: 24, marginTop: 4 }}>{helper}</div>}
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

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div
        className="image-drop"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="" />
        ) : (
          <span>클릭해서 이미지 업로드 (PNG/JPG)</span>
        )}
      </div>
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
