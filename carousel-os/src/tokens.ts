export const COLORS = {
  coverBg: '#FEE67A',
  bodyBg: '#FDFCEA',
  text: '#000000',
  highlight: '#87CEEB',
  textSub: '#555555',
  border: '#E0DDD0',
} as const;

export const CANVAS = { W: 1080, H: 1350 } as const;

export const PREVIEW_SCALE = 0.37;

export const SLIDE_LABELS = [
  '표지',
  '문제',
  '삽질',
  '인사이트',
  '정리',
  '마무리',
] as const;

export const ANIMATION_OPTIONS = [
  { value: 'none',     label: '없음' },
  { value: 'float',    label: 'Float (위아래 부유)' },
  { value: 'bounce',   label: 'Bounce (통통 튀기)' },
  { value: 'shake',    label: 'Shake (좌우 흔들기)' },
  { value: 'pulse',    label: 'Pulse (맥동)' },
  { value: 'slide-lr', label: 'Slide (좌우 이동)' },
] as const;

export type AnimationType = typeof ANIMATION_OPTIONS[number]['value'];
