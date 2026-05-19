import { CSSProperties, forwardRef, ReactNode } from 'react';

type SlideProps = {
  background: string;
  padding?: string;
  children: ReactNode;
  style?: CSSProperties;
};

// Always-1080x1350 canvas. Outer wrapper uses CSS scale for preview.
export const Slide = forwardRef<HTMLDivElement, SlideProps>(function Slide(
  { background, padding = '8% 7%', children, style },
  ref
) {
  return (
    <div
      ref={ref}
      className="slide-canvas"
      style={{
        background,
        padding,
        ...style
      }}
    >
      {children}
    </div>
  );
});
