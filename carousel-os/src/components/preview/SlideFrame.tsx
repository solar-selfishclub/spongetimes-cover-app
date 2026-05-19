'use client';

import { ReactNode } from 'react';
import { CANVAS, PREVIEW_SCALE } from '@/tokens';

type SlideFrameProps = {
  label: string;
  active?: boolean;
  children: ReactNode;
};

export function SlideFrame({ label, active = false, children }: SlideFrameProps) {
  return (
    <div className="preview-frame-wrapper">
      <span className="preview-frame-label">{label}</span>
      <div
        className={`preview-frame${active ? ' active' : ''}`}
        style={{
          width: CANVAS.W * PREVIEW_SCALE,
          height: CANVAS.H * PREVIEW_SCALE,
        }}
      >
        <div
          style={{
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top left',
            width: CANVAS.W,
            height: CANVAS.H,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
