'use client';

import { useEffect, useState } from 'react';
import { AnimationType } from '@/tokens';

export type CarouselDraft = {
  // 공통
  week: number;
  topic: string;
  authorHandle: string;

  // 슬라이드 1: 표지
  cover_headerTag: string;
  cover_mainCopy: string;
  cover_highlightWords: string;
  cover_subCopy: string;
  cover_characterImage: string | null;
  cover_characterX: number;
  cover_characterY: number;
  cover_characterSize: number;
  cover_auxLine1: string;
  cover_auxLine2: string;

  // 슬라이드 2: 문제
  problem_mainCopy: string;
  problem_highlightWords: string;
  problem_bodyText: string;
  problem_characterImage: string | null;
  problem_characterX: number;
  problem_characterY: number;
  problem_characterSize: number;
  problem_topImage: string | null;
  problem_topImageX: number;
  problem_topImageY: number;
  problem_topImageSize: number;
  problem_topImageAnimation: AnimationType;
  problem_topImageDuration: number;

  // 슬라이드 3: 삽질
  struggle_mainCopy: string;
  struggle_highlightWords: string;
  struggle_bodyText: string;
  struggle_characterImage: string | null;
  struggle_characterX: number;
  struggle_characterY: number;
  struggle_characterSize: number;
  struggle_topImage: string | null;
  struggle_topImageX: number;
  struggle_topImageY: number;
  struggle_topImageSize: number;
  struggle_topImageAnimation: AnimationType;
  struggle_topImageDuration: number;

  // 슬라이드 4: 깨달음
  insight_mainCopy: string;
  insight_highlightWords: string;
  insight_bodyText: string;
  insight_emphasisSentence: string;
  insight_characterImage: string | null;
  insight_characterX: number;
  insight_characterY: number;
  insight_characterSize: number;
  insight_topImage: string | null;
  insight_topImageX: number;
  insight_topImageY: number;
  insight_topImageSize: number;
  insight_topImageAnimation: AnimationType;
  insight_topImageDuration: number;

  // 슬라이드 5: 정리
  summary_point1: string;
  summary_point2: string;
  summary_point3: string;
  summary_closingLine: string;
  summary_characterImage: string | null;
  summary_characterX: number;
  summary_characterY: number;
  summary_characterSize: number;
  summary_topImage: string | null;
  summary_topImageX: number;
  summary_topImageY: number;
  summary_topImageSize: number;
  summary_topImageAnimation: AnimationType;
  summary_topImageDuration: number;

  // 슬라이드 6: 엔딩
  outro_nextPreview: string;
  outro_ctaText: string;
  outro_characterImage: string | null;
  outro_characterX: number;
  outro_characterY: number;
  outro_characterSize: number;
};

export const DEFAULT_DRAFT: CarouselDraft = {
  week: 1,
  topic: '캐러셀 삽질기',
  authorHandle: '@spongeclub',

  cover_headerTag: 'Week 1 · 캐러셀 삽질기',
  cover_mainCopy: '내 캐러셀은\n왜 밤티였을까..',
  cover_highlightWords: '캐러셀',
  cover_subCopy: '🔥 AI보다 먼저 챙겨야 할 한 가지',
  cover_characterImage: null,
  cover_characterX: 72,
  cover_characterY: 65,
  cover_characterSize: 55,
  cover_auxLine1: '처음이라도',
  cover_auxLine2: '괜찮아요.',

  problem_mainCopy: '나도 처음엔\n다 잘 될 줄 알았다',
  problem_highlightWords: '처음',
  problem_bodyText: '캐러셀을 만들기 시작했을 때\n뭔가 대단한 걸 만들 것 같았다\n근데 결과물은 처참했다',
  problem_characterImage: null,
  problem_characterX: 75,
  problem_characterY: 75,
  problem_characterSize: 38,
  problem_topImage: null,
  problem_topImageX: 82,
  problem_topImageY: 12,
  problem_topImageSize: 28,
  problem_topImageAnimation: 'none',
  problem_topImageDuration: 3,

  struggle_mainCopy: '이것저것 다 해봤지만\n다 망했다',
  struggle_highlightWords: '다 망했다',
  struggle_bodyText: 'Canva 써보고, 노션 써보고\n피그마도 써봤지만\n퀄리티는 제자리걸음이었다',
  struggle_characterImage: null,
  struggle_characterX: 75,
  struggle_characterY: 75,
  struggle_characterSize: 38,
  struggle_topImage: null,
  struggle_topImageX: 82,
  struggle_topImageY: 12,
  struggle_topImageSize: 28,
  struggle_topImageAnimation: 'none',
  struggle_topImageDuration: 3,

  insight_mainCopy: '결국 중요한 건\n구조였다',
  insight_highlightWords: '구조',
  insight_bodyText: '툴이 문제가 아니라\n콘텐츠의 흐름이 문제였다\n이걸 알게 되니 모든 게 달라졌다',
  insight_emphasisSentence: '디자인보다 스토리가 먼저다',
  insight_characterImage: null,
  insight_characterX: 75,
  insight_characterY: 75,
  insight_characterSize: 38,
  insight_topImage: null,
  insight_topImageX: 82,
  insight_topImageY: 12,
  insight_topImageSize: 28,
  insight_topImageAnimation: 'none',
  insight_topImageDuration: 3,

  summary_point1: '캐러셀은 스토리가 핵심이다',
  summary_point2: '툴보다 구조를 먼저 잡아라',
  summary_point3: '반복이 퀄리티를 만든다',
  summary_closingLine: '오늘도 한 걸음 앞으로 :)',
  summary_characterImage: null,
  summary_characterX: 75,
  summary_characterY: 75,
  summary_characterSize: 38,
  summary_topImage: null,
  summary_topImageX: 82,
  summary_topImageY: 12,
  summary_topImageSize: 28,
  summary_topImageAnimation: 'none',
  summary_topImageDuration: 3,

  outro_nextPreview: '다음 편: AI로 캐러셀 10배 빠르게 만드는 법',
  outro_ctaText: '도움이 됐다면 팔로우 + 저장 부탁드려요!',
  outro_characterImage: null,
  outro_characterX: 72,
  outro_characterY: 75,
  outro_characterSize: 35,
};

const STORAGE_KEY = 'carousel-os:draft:v1';

function load(): CarouselDraft {
  if (typeof window === 'undefined') return DEFAULT_DRAFT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw) as Partial<CarouselDraft>;
    return { ...DEFAULT_DRAFT, ...parsed };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export function useCarouselDraft() {
  const [draft, setDraft] = useState<CarouselDraft>(() => load());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // localStorage 용량 초과 등 — 무시
    }
  }, [draft]);

  function update<K extends keyof CarouselDraft>(key: K, value: CarouselDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function reset() {
    setDraft(DEFAULT_DRAFT);
  }

  return { draft, update, reset };
}

export function splitHighlightWords(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
