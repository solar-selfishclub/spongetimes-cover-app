import { BodySlide, TEMPLATE_LABEL } from './state/bodySlide';

export type SlideEntry =
  | { kind: 'cover'; label: string }
  | { kind: 'body'; label: string; bodyIndex: number }
  | { kind: 'cta'; label: string };

// Single source of truth: index → slide kind + display label.
// Order: cover, (body × N), cta.
export function buildSlideOrder(bodySlides: BodySlide[]): SlideEntry[] {
  return [
    { kind: 'cover', label: '표지' },
    ...bodySlides.map((b, i) => ({
      kind: 'body' as const,
      label: `본문 ${i + 1} · ${TEMPLATE_LABEL[b.template]}`,
      bodyIndex: i
    })),
    { kind: 'cta', label: 'CTA' }
  ];
}
