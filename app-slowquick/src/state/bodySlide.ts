// Body slide data model for the spongetimes mini app.
// DESIGN-BODY.md v0.1 — 6 templates, all sharing common anchor/heading/option fields.
// One BodySlide object holds fields for every template; the active `template` decides
// which fields are read. This keeps template switching lossless.

export type BodyTemplate =
  | 'hero'
  | 'quote'
  | 'quote-multi'
  | 'flow'
  | 'side-profile'
  | 'grid-hero';

export const BODY_TEMPLATES: readonly BodyTemplate[] = [
  'hero',
  'quote',
  'quote-multi',
  'flow',
  'side-profile',
  'grid-hero'
] as const;

export const TEMPLATE_LABEL: Record<BodyTemplate, string> = {
  hero: 'HERO',
  quote: 'QUOTE',
  'quote-multi': 'QUOTE MULTI',
  flow: 'FLOW',
  'side-profile': 'SIDE PROFILE',
  'grid-hero': 'GRID HERO'
};

export type DecoShape = 'circle' | 'half-circle' | 'dot' | 'curve';

export type DecoPosition =
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export type DecoSize = 'small' | 'medium' | 'large';

export type QuoteMultiCard = { enabled: boolean; text: string; by: string };
export type FlowStep = { enabled: boolean; person: string; quote: string };
export type SideItem = { enabled: boolean; label: string; title: string; body: string };
export type GridCard = { enabled: boolean; tag: string; title: string; body: string };

export type BodySlide = {
  id: string;
  template: BodyTemplate;

  // 4-corner anchor
  anchorCategory: string;
  anchorBadge: string;
  anchorBadgeVariant: 'dark' | 'yellow';
  anchorBadgeEnabled: boolean;
  anchorStar: boolean;

  // Heading
  heading: string;
  headingSize: number;
  headingAlign: 'left' | 'center';
  headingHighlight: string;

  // Subcaption (option)
  subcaptionEnabled: boolean;
  subcaption: string;
  subcaptionSize: number;
  subcaptionHighlight: string; // comma-separated up to 2

  // Card box sizing (applies to all white cards on this slide)
  cardPadding: number;     // px
  cardFontScale: number;   // multiplier (0.7~1.5)

  // Pill label (option)
  pillEnabled: boolean;
  pillText: string;
  pillVariant: 'dark' | 'yellow';

  // Yellow circle deco (option)
  decoEnabled: boolean;
  decoPosition: DecoPosition;
  decoSize: DecoSize;
  decoShape: DecoShape;

  // Image slot (option)
  imageEnabled: boolean;
  image: string | null;
  imageX: number;
  imageY: number;
  imageSize: number;

  // HERO
  heroBody: string;

  // QUOTE
  quoteText: string;
  quoteMeta: string;
  quoteEmphasisEnabled: boolean;
  quoteEmphasis: string;

  // QUOTE MULTI
  quoteMultiCards: QuoteMultiCard[];

  // FLOW
  flowSteps: FlowStep[];

  // SIDE PROFILE
  sideItems: SideItem[];

  // GRID HERO
  gridCards: GridCard[];
};

function newId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function makeDefaultBodySlide(template: BodyTemplate = 'hero'): BodySlide {
  return {
    id: newId(),
    template,

    anchorCategory: 'WEEK 1',
    anchorBadge: '미션',
    anchorBadgeVariant: 'dark',
    anchorBadgeEnabled: true,
    anchorStar: true,

    heading: '본문 헤딩을\n입력하세요',
    headingSize: 88,
    headingAlign: 'left',
    headingHighlight: '',

    subcaptionEnabled: false,
    subcaption: '한 줄 부캡션',
    subcaptionSize: 24,
    subcaptionHighlight: '',

    cardPadding: 24,
    cardFontScale: 1.0,

    pillEnabled: false,
    pillText: '오늘의 키워드',
    pillVariant: 'dark',

    decoEnabled: true,
    decoPosition: 'right',
    decoSize: 'large',
    decoShape: 'circle',

    imageEnabled: false,
    image: null,
    imageX: 75,
    imageY: 70,
    imageSize: 38,

    heroBody:
      '여기에 짧은 본문을 적어요.\n2~3줄을 넘기지 않는 게 좋아요.',

    quoteText:
      '"AI 도구를 어떻게 쓰는지보다,\n무엇을 위해 쓰는지가 더 중요했습니다."',
    quoteMeta: '— 멤버 어록',
    quoteEmphasisEnabled: false,
    quoteEmphasis: '핵심 한 줄을 형광펜처럼.',

    quoteMultiCards: [
      { enabled: true, text: '"한 줄 어록 1"', by: '— 멤버 A' },
      { enabled: true, text: '"한 줄 어록 2"', by: '— 멤버 B' },
      { enabled: true, text: '"한 줄 어록 3"', by: '— 멤버 C' },
      { enabled: false, text: '"한 줄 어록 4"', by: '— 멤버 D' },
      { enabled: false, text: '"한 줄 어록 5"', by: '— 멤버 E' }
    ],

    flowSteps: [
      { enabled: true, person: '솔라', quote: '시작은 이렇게.' },
      { enabled: true, person: '흐민', quote: '이어서 이렇게.' },
      { enabled: true, person: '코니', quote: '마무리는 이렇게.' },
      { enabled: false, person: '', quote: '' }
    ],

    sideItems: [
      { enabled: true, label: '미션 1', title: '클로드 코드로\n인터뷰 스킬 늘리기', body: '' },
      { enabled: true, label: '미션 2', title: 'OS 벤치마킹\n→ 만들어보기', body: '' },
      { enabled: true, label: '미션 3', title: 'AI 없이\nSNS 글 쓰기', body: '' },
      { enabled: false, label: '', title: '', body: '' },
      { enabled: false, label: '', title: '', body: '' }
    ],

    gridCards: [
      { enabled: true, tag: '#01', title: '카드 1', body: '간단한 설명.' },
      { enabled: true, tag: '#02', title: '카드 2', body: '간단한 설명.' },
      { enabled: true, tag: '#03', title: '카드 3', body: '간단한 설명.' },
      { enabled: true, tag: '#04', title: '카드 4', body: '간단한 설명.' }
    ]
  };
}

// Merge a possibly-partial BodySlide from localStorage with current defaults so
// new fields added in later versions don't crash older drafts.
export function hydrateBodySlide(raw: Partial<BodySlide>): BodySlide {
  const base = makeDefaultBodySlide((raw.template as BodyTemplate) ?? 'hero');
  return { ...base, ...raw, id: raw.id ?? base.id };
}
