'use client';

import { ChangeEvent, useRef } from 'react';

/* ── TextField ─────────────────────────────────── */
type TextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  placeholder?: string;
};

export function TextField({ label, value, onChange, helper, placeholder }: TextFieldProps) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {helper && <span className="field-helper">{helper}</span>}
    </div>
  );
}

/* ── TextareaField ──────────────────────────────── */
type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  placeholder?: string;
  rows?: number;
};

export function TextareaField({
  label,
  value,
  onChange,
  helper,
  placeholder,
  rows = 3,
}: TextareaFieldProps) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <textarea
        className="field-textarea"
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      />
      {helper && <span className="field-helper">{helper}</span>}
    </div>
  );
}

/* ── NumberField ────────────────────────────────── */
type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helper?: string;
};

export function NumberField({ label, value, onChange, min, max, step = 1, helper }: NumberFieldProps) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        style={{ maxWidth: 120 }}
      />
      {helper && <span className="field-helper">{helper}</span>}
    </div>
  );
}

/* ── RangeField ─────────────────────────────────── */
type RangeFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helper?: string;
};

export function RangeField({ label, value, onChange, min = 0, max = 100, step = 1, helper }: RangeFieldProps) {
  return (
    <div className="field-group">
      <label className="field-label">
        {label} <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>
      </label>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#FEE67A' }}
      />
      {helper && <span className="field-helper">{helper}</span>}
    </div>
  );
}

/* ── SelectField ────────────────────────────────── */
type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  helper?: string;
};

export function SelectField({ label, value, onChange, options, helper }: SelectFieldProps) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <select
        className="field-input"
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        style={{ cursor: 'pointer' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {helper && <span className="field-helper">{helper}</span>}
    </div>
  );
}

/* ── ImageField ─────────────────────────────────── */
type ImageFieldProps = {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
};

export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div
        className="image-upload-area"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="image-preview-thumb" />
            <button
              className="image-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              이미지 제거
            </button>
          </>
        ) : (
          <span>클릭해서 이미지 업로드</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </div>
    </div>
  );
}
