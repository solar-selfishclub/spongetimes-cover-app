'use client';

import { CSSProperties, forwardRef, ReactNode } from 'react';

type SlideProps = {
  background: string;
  padding?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export const Slide = forwardRef<HTMLDivElement, SlideProps>(function Slide(
  { background, padding = '7% 8%', children, style },
  ref
) {
  return (
    <div
      ref={ref}
      className="slide-canvas"
      style={{ background, padding, ...style }}
    >
      {children}
    </div>
  );
});
