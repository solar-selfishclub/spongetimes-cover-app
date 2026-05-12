# 00. 디자인 시스템

> 모든 슬라이드에서 공통으로 사용하는 디자인 토큰. 다른 모든 문서의 기반이 됩니다.

---

## 🎨 디자인 토큰

```json
{
  "canvas": {
    "ratio": "4:5",
    "width": 1080,
    "height": 1350,
    "border_radius": 0
  },
  "colors": {
    "background": {
      "cover": "#FFE67A",
      "body": "#FFFBED",
      "cta": "#FFFBED"
    },
    "surface": {
      "card_white": "#FFFFFF",
      "card_yellow": "#FFE67A",
      "card_dark": "#1A1F36"
    },
    "text": {
      "primary": "#1A1F36",
      "on_dark": "#FFE67A",
      "muted_low": "rgba(26, 31, 54, 0.35)",
      "muted_mid": "rgba(26, 31, 54, 0.55)",
      "muted_high": "rgba(26, 31, 54, 0.7)"
    },
    "accent": {
      "highlighter_orange": "rgba(255, 152, 0, 0.55)"
    },
    "publisher_colors": {
      "봄": "#4490E2",
      "솔라": "#E63946",
      "슬로우퀵": "#FF6A00",
      "키노": "#8B5CF6"
    }
  },
  "typography": {
    "font_family": "Pretendard, Noto Sans KR, sans-serif",
    "scale": {
      "header_footer": { "size": 10, "weight": 500, "letter_spacing": "0.15em" },
      "label_small": { "size": 10, "weight": 500 },
      "label_pill": { "size": 12, "weight": 500 },
      "body_caption": { "size": 11, "weight": 400 },
      "body": { "size": 13, "weight": 400 },
      "body_emphasized": { "size": 14, "weight": 500 },
      "subheading": { "size": 18, "weight": 700 },
      "cta_question": { "size": 22, "weight": 700, "letter_spacing": "-0.015em" },
      "title_main": { "size": 40, "weight": 700, "letter_spacing": "-0.025em", "line_height": 1.15 }
    },
    "weight_rules": "Bold 700만 사용 (제목용). 본문은 Regular 400 / Medium 500"
  },
  "border_radius": {
    "card": 12,
    "small_card": 8,
    "pill": 999
  },
  "spacing": {
    "canvas_padding": "6~8%",
    "card_padding": "16px 14px",
    "label_padding": "4px 10px"
  }
}
```

## 🎨 컬러 사용 규칙

### 배경 컬러
| 슬라이드 | 컬러 | 의도 |
|---|---|---|
| 표지 | `#FFE67A` 크림옐로우 | 강한 시그니처, 인스타 피드에서 즉시 인지 |
| 본문 | `#FFFBED` 옅은 크림 | 콘텐츠 가독성 + 옐로우 톤 유지 |
| CTA | `#FFFBED` 옅은 크림 | 본문 흐름에서 자연스럽게 마무리 |

### 다크네이비 카드 사용 원칙
`#1A1F36` 다크네이비 카드는 **특별한 임팩트가 필요한 순간에만** 사용:
- CTA의 팔로우 카드 (필수)
- 본문 BEFORE/AFTER 비교의 AFTER 강조 (옵션)
- 인용구의 특별 강조 (드물게)

**남용 금지**: 매 슬라이드마다 사용하면 칙칙해짐.

### 형광펜 강조 (오렌지)
- 표지 메인 타이틀의 핵심 단어
- 본문 텍스트의 강조 단어
- CTA 질문의 강조 단어
- **통일 컬러로 적용** (발행자별 컬러 X)

### 발행자 시그니처 컬러
4명 각자의 컬러는 캐릭터 디자인에만 적용. 슬라이드 디자인 자체에는 반영하지 않음 (옐로우 통일).

## 📝 타이포그래피 위계

```
[표지]
- Main Title: 40px / Bold 700 / line-height 1.15
- Pill Label: 12px / Medium 500
- Header/Footer: 10px / Medium 500 / opacity 0.35-0.45

[본문]
- Subheading (카드 제목): 18px / Bold 700
- Body Emphasized (강조 문장): 14px / Medium 500
- Body: 13px / Regular 400
- Caption: 11px / Regular 400
- Pill Label: 12px / Medium 500

[CTA]
- Question: 22px / Bold 700
- Follow Card Name: 14px / Bold 700
- Caption: 11px / Medium 500
```

## 🔠 정렬 원칙

| 요소 | 정렬 | 비고 |
|---|---|---|
| 표지 메인 타이틀 | 좌측 정렬 | 가독성 + 캐릭터 우측 배치와 균형 |
| 본문 텍스트 | 좌측 정렬 | 한국어 가독성 |
| CTA 질문 | 좌측 정렬 | 본문 패턴과 일관 |
| 라벨 (알약) | 자체 inline | 좌상단 배치 |

## 🎭 톤 & 무드

```json
{
  "aesthetic_direction": "독립 크리에이터/뉴스레터 (개성있고 휴먼 터치)",
  "do": [
    "캐주얼하지만 절제된 톤",
    "이모지 포인트 (남용 X)",
    "발행자 캐릭터의 휴먼 터치",
    "옐로우 시그니처로 정체성 유지"
  ],
  "dont": [
    "억지스럽게 세련된 척 (넓은 여백만 강조)",
    "강의 자료 같은 정보 과잉",
    "외부인 사진 무단 사용",
    "다크네이비 카드 남용"
  ]
}
```

## 🌐 폰트 로딩 (웹앱 구현 시)

```html
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet">
```

또는 npm: `pretendard` 패키지 사용
