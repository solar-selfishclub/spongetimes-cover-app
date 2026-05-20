import { useEffect, useState } from 'react';
import {
  ContentType,
  DEFAULT_HIGHLIGHTER_STYLE,
  HighlighterStyle,
  PublisherName
} from '../tokens';

export type SpotlightDraft = {
  publisher: PublisherName;
  week: number;
  contentType: ContentType;
  // Per-slide highlighter color tweaks. Cover and CTA each own their own
  // copy so changes on one slide don't leak into the other.
  coverHighlighter: HighlighterStyle;
  ctaHighlighter: HighlighterStyle;
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
  ctaCharacterMessage: string; // `**word**` syntax → bold
  ctaCharacterMessageFontSize: number;   // px, speech bubble text
  ctaCharacterMessageLineHeight: number; // unitless
  ctaCharacterImage: string | null;
  ctaCharacterSize: number; // % of CTA row width (20–60)
  ctaCharacterRowOffsetY: number; // px, shifts character + bubble row vertically
  ctaFollowOffsetY: number;       // px, shifts the follow card group vertically
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
  coverHighlighter: { ...DEFAULT_HIGHLIGHTER_STYLE },
  ctaHighlighter: { ...DEFAULT_HIGHLIGHTER_STYLE },
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
  ctaQuestion: '여기에 자유 텍스트를 입력하세요',
  ctaQuestionHighlight: '자유 텍스트',
  ctaCharacterMessage: '여기에 발행자 **자유 멘트**를 입력하세요',
  ctaCharacterMessageFontSize: 30,
  ctaCharacterMessageLineHeight: 1.45,
  ctaCharacterImage: null,
  ctaCharacterSize: 32,
  ctaCharacterRowOffsetY: 0,
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
