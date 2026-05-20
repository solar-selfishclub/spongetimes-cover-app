import { useEffect, useState } from 'react';
import { ContentType, CtaMessageFont, PublisherName } from '../tokens';

export type SpotlightDraft = {
  publisher: PublisherName;
  week: number;
  contentType: ContentType;
  // Highlighter color tweaks (applied on top of publisher's signature hex)
  highlighterOpacity: number;    // 0–100, percent (alpha)
  highlighterSaturation: number; // 0–200, percent (100 = base hue saturation)
  highlighterLightness: number;  // 0–200, percent (100 = base hue lightness)
  // Cover
  mainTitle: string;
  mainTitleSize: number; // px
  mainTitleAlign: 'left' | 'center' | 'right';
  mainTitleTopOffset: number; // extra px pushed down from default position
  mainTitleHighlight: string; // comma-separated up to 2
  coverCharacterImage: string | null;
  coverCharacterX: number; // 0–100, percent from left (anchors character center)
  coverCharacterY: number; // 0–100, percent from top (anchors character center)
  coverCharacterSize: number; // percent of canvas width (10–80)
  // CTA
  ctaLabel: string;
  ctaQuestion: string;
  ctaQuestionHighlight: string;
  ctaCharacterMessage: string;
  ctaMessageFontFamily: CtaMessageFont;
  ctaMessageFontSize: number; // px
  ctaMessageFontWeight: number; // 100–900
  ctaMessageLetterSpacing: number; // em (e.g. -0.03)
  ctaMessageLineHeight: number; // unitless (e.g. 1.3)
  ctaCharacterImage: string | null;
  ctaCharacterSize: number; // percent of CTA row width (15–70)
  // Layout offsets (px) — let user nudge each element within the CTA slide
  ctaCharacterOffsetX: number;
  ctaCharacterOffsetY: number;
  ctaMessageOffsetX: number;
  ctaMessageOffsetY: number;
  ctaFollowOffsetY: number;
  // Optional secondary follow card (개인 계정)
  ctaSecondaryFollowEnabled: boolean;
  ctaSecondaryFollowName: string;
  ctaSecondaryFollowHandle: string;
  ctaSecondaryFollowImage: string | null;
};

export const DEFAULT_DRAFT: SpotlightDraft = {
  publisher: '키노',
  week: 1,
  contentType: '콘텐츠 유형을 입력하세요',
  highlighterOpacity: 55,
  highlighterSaturation: 100,
  highlighterLightness: 100,
  mainTitle: '콘텐츠 제목을\n입력하세요',
  mainTitleSize: 130,
  mainTitleAlign: 'left',
  mainTitleTopOffset: 110,
  mainTitleHighlight: '제목',
  coverCharacterImage: null,
  coverCharacterX: 72,
  coverCharacterY: 67,
  coverCharacterSize: 64,
  ctaLabel: '💬 댓글로 이야기해요',
  ctaQuestion: '오늘 소개된 6명 중\n가장 인상 깊었던 분은?\n댓글로 응원 보내주세요 👏',
  ctaQuestionHighlight: '가장 인상 깊었던 분',
  ctaCharacterMessage: '다음 회차에서\n또 만나요. 👋',
  ctaMessageFontFamily: 'Pretendard',
  ctaMessageFontSize: 48,
  ctaMessageFontWeight: 800,
  ctaMessageLetterSpacing: -0.03,
  ctaMessageLineHeight: 1.3,
  ctaCharacterImage: null,
  ctaCharacterSize: 32,
  ctaCharacterOffsetX: 0,
  ctaCharacterOffsetY: 0,
  ctaMessageOffsetX: 0,
  ctaMessageOffsetY: 0,
  ctaFollowOffsetY: 40,
  ctaSecondaryFollowEnabled: false,
  ctaSecondaryFollowName: '',
  ctaSecondaryFollowHandle: '',
  ctaSecondaryFollowImage: null
};

const STORAGE_KEY = 'spongetimes:cover-cta:v1';

function load(): SpotlightDraft {
  if (typeof window === 'undefined') return DEFAULT_DRAFT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw) as Partial<SpotlightDraft>;
    return { ...DEFAULT_DRAFT, ...parsed };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export function useSpotlightDraft() {
  const [draft, setDraft] = useState<SpotlightDraft>(() => load());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // localStorage might be full or unavailable — silently skip
    }
  }, [draft]);

  function update<K extends keyof SpotlightDraft>(key: K, value: SpotlightDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function reset() {
    setDraft(DEFAULT_DRAFT);
  }

  return { draft, setDraft, update, reset };
}

export function splitHighlightInput(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);
}
