export type SlideKind = { kind: 'cover' } | { kind: 'cta' };

export type SlideEntry = SlideKind & { label: string };

// Single source of truth: index → slide kind + display label.
// Cover-only mini app: just the cover slide and the CTA slide.
export function buildSlideOrder(): SlideEntry[] {
  return [
    { kind: 'cover', label: '표지' },
    { kind: 'cta', label: 'CTA' }
  ];
}
