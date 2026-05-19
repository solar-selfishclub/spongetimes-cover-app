import { CSSProperties, ReactNode } from 'react';

type PillLabelProps = {
  variant?: 'dark' | 'yellow';
  children: ReactNode;
  style?: CSSProperties;
};

export function PillLabel({ variant = 'yellow', children, style }: PillLabelProps) {
  return (
    <span className={`pill pill--${variant}`} style={style}>
      {children}
    </span>
  );
}
