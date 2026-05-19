// Single source of truth — mirrors spongetimes-os/00-design-system.md
// and the relevant blocks from 01-cover.md / 02-body.md / 03-cta.md / 04-character-prompt.md.

export const CANVAS = {
  width: 1080,
  height: 1350,
  ratio: '4:5' as const
};

export const COLORS = {
  bg: {
    cover: '#FFE67A',
    body: '#FFFBED',
    cta: '#FFFBED'
  },
  surface: {
    cardWhite: '#FFFFFF',
    cardYellow: '#FFE67A',
    cardDark: '#1A1F36'
  },
  text: {
    primary: '#1A1F36',
    onDark: '#FFE67A',
    mutedLow: 'rgba(26, 31, 54, 0.35)',
    mutedMid: 'rgba(26, 31, 54, 0.55)',
    mutedHigh: 'rgba(26, 31, 54, 0.7)'
  },
  accent: {
    highlighter: 'rgba(255, 152, 0, 0.55)'
  }
};

export type PublisherName = '봄' | '솔라' | '슬로우퀵' | '키노';

export const PUBLISHERS: Record<
  PublisherName,
  { hex: string; colorName: 'blue' | 'red' | 'orange' | 'purple' }
> = {
  봄: { hex: '#4490E2', colorName: 'blue' },
  솔라: { hex: '#E63946', colorName: 'red' },
  슬로우퀵: { hex: '#FF6A00', colorName: 'orange' },
  키노: { hex: '#8B5CF6', colorName: 'purple' }
};

export const PUBLISHER_NAMES: PublisherName[] = ['봄', '솔라', '슬로우퀵', '키노'];

// Free-text — publishers each work on different content so we don't constrain
// to the 4 spec options. The values below are kept as suggestion examples for
// the input placeholder and as keys for the character-prompt pose pool.
export const CONTENT_TYPE_SUGGESTIONS = [
  '현장 기록',
  '슬랙 모멘트',
  '참가자 스포트라이트',
  '인사이트'
] as const;
export type ContentType = string;

export const RADII = {
  card: 12,
  smallCard: 8,
  pill: 999,
  followCard: 16
};

export const FONT_FAMILY = 'Pretendard, "Pretendard Variable", "Noto Sans KR", sans-serif';

// Mood descriptions matched to the 9-pose action sheet the user attaches.
// The AI is asked to PICK the pose from the sheet that best fits the mood —
// not invent a new one. So these strings describe the situation/feeling,
// not a literal pose name.
// Fallback used when the user-typed contentType doesn't match any known key.
export const POSES_FALLBACK = [
  'a pose that fits the slide topic — pick the most contextually appropriate one from the sheet',
  'an engaged, on-topic pose — choose the sheet pose that best supports the message',
  'a friendly, expressive pose that matches the mood of the content'
];

export const POSES_BY_CONTENT: Record<string, string[]> = {
  '현장 기록': [
    'observing and recording the scene — pick a pose like holding a phone, tablet, or notebook',
    'documenting the moment — a focused, working-with-device pose',
    'curiously taking notes — a calm, attentive pose'
  ],
  '슬랙 모멘트': [
    'reacting to a chat — pick a pose like sitting at a laptop, thumbs-up, or looking at the screen',
    'engaged in conversation — a friendly, communicating pose',
    'noticing something funny — a small reaction or thumbs-up pose'
  ],
  '참가자 스포트라이트': [
    'celebrating participants — pick a pose like both arms raised in cheer, two thumbs up, or applauding',
    'introducing the spotlight — a welcoming, arms-out pose',
    'congratulating with excitement — a celebratory pose'
  ],
  '인사이트': [
    'sharing a discovery — pick a pose like holding a tablet, pointing at something, or showing a screen',
    'an "aha!" moment — a thoughtful, excited pose',
    'demonstrating a tool — pose interacting with a laptop or tablet'
  ]
};

// Font picker for the CTA publisher free message. Stored as the user-facing label;
// applied as `${label}, Pretendard, sans-serif` in the slide.
export const CTA_MESSAGE_FONTS = [
  'Pretendard',
  'Gowun Dodum',
  'Gaegu',
  'Jua',
  'Hi Melody',
  'Nanum Pen Script',
  'Nanum Brush Script',
  'Black Han Sans'
] as const;
export type CtaMessageFont = (typeof CTA_MESSAGE_FONTS)[number];

export const CTA_POSES = [
  'inviting the viewer to respond — pick a pose like arms out welcome, with a small speech bubble nearby',
  'asking a question — a curious pose, optionally with a question mark above the head',
  'friendly, leaning-forward pose to encourage comments',
  'thumbs-up with a smile, encouraging engagement'
];

// Question pool — 03-cta.md > participant_spotlight
export const SPOTLIGHT_QUESTION_POOL = [
  '오늘 소개된 6명 중 가장 인상 깊었던 분은? 댓글로 응원 보내주세요 👏',
  '여러분이라면 어떤 과제를 만들고 싶으신가요? 💡',
  '다음 주엔 누구의 작품을 볼 수 있을지 기대돼요 ✨'
];

export const CTA_LABEL_POOL = [
  '💬 댓글로 이야기해요',
  '🙌 함께 이야기해봐요',
  '✍️ 의견을 들려주세요'
];
