# 03. CTA 슬라이드 OS

> 캐러셀 마지막 슬라이드. 댓글 유도 + 팔로우 유도가 목적.

---

## 🎯 CTA 명세

```json
{
  "slide_type": "cta",
  "canvas": { "width": 1080, "height": 1350, "ratio": "4:5" },
  "background_color": "#FFFBED",
  "padding": "8% 7%",
  "goals": [
    "팔로우 유도",
    "댓글/소통 유도 (질문 던지기)"
  ],
  "structure": {
    "1": "옐로우 라벨 (댓글 유도 신호)",
    "2": "질문 카드 (화이트, 따옴표 장식)",
    "3": "캐릭터 + 발행자 자유 멘트",
    "4": "다크네이비 팔로우 카드"
  }
}
```

## 📐 레이아웃 구조

```
┌─────────────────────────────────────┐
│ [💬 댓글로 이야기해요]                 │ ← 옐로우 라벨
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ "                                │ │ ← 화이트 질문 카드
│ │   이번 주 워크샵에서             │ │   (큰 따옴표 장식)
│ │   [가장 기억에 남는]              │ │
│ │   장면은 뭐였나요? 💭            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌────────┐  발행자 자유 멘트          │ ← 캐릭터 + 멘트
│ │ 캐릭터  │  (2~3줄)                  │
│ └────────┘                          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [📰] @spongeclub      [+팔로우] │ │ ← 다크 팔로우 카드
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🧩 컴포넌트 명세

### 1. 옐로우 라벨

```json
{
  "component": "cta_label",
  "type": "pill",
  "background": "#FFE67A",
  "text_color": "#1A1F36",
  "font_size": 11,
  "font_weight": 500,
  "padding": "4px 10px",
  "border_radius": 999,
  "content_examples": [
    "💬 댓글로 이야기해요",
    "🙌 함께 이야기해봐요",
    "✍️ 의견을 들려주세요"
  ],
  "margin_bottom": 14
}
```

### 2. 질문 카드 (화이트 + 따옴표)

```json
{
  "component": "question_card",
  "background": "#FFFFFF",
  "border_radius": 12,
  "padding": "16px 14px",
  "decoration": {
    "quote_mark": {
      "position": "top-left",
      "offset": "top: 4px, left: 10px",
      "font_size": 32,
      "color": "#1A1F36",
      "opacity": 0.25,
      "font_family": "serif"
    }
  },
  "question_text": {
    "font_size": 20,
    "font_weight": 700,
    "color": "#1A1F36",
    "line_height": 1.3,
    "letter_spacing": "-0.015em",
    "padding": "12px 8px 4px",
    "highlight_supported": true,
    "emoji_supported": true
  },
  "margin_bottom": 12
}
```

### 3. 캐릭터 + 발행자 자유 멘트

```json
{
  "component": "character_message_row",
  "layout": "flex align-center gap-10",
  "padding": "4px 4px 12px",
  "flex": 1,
  "children": [
    {
      "name": "character",
      "width_percent": 32,
      "aspect_ratio": "1:1",
      "border_radius": 12,
      "image_source": "발행자 캐릭터 (AI 생성)",
      "character_options_by_publisher": {
        "봄": "파란 모자/멜빵바지 스폰지",
        "솔라": "빨간 모자/멜빵바지 스폰지",
        "슬로우퀵": "주황 모자/멜빵바지 스폰지",
        "키노": "보라 모자/멜빵바지 스폰지"
      }
    },
    {
      "name": "free_message",
      "flex": 1,
      "input_type": "발행자 자유 입력",
      "font_size": 12,
      "color": "#1A1F36",
      "line_height": 1.5,
      "font_weight": 500,
      "max_lines": "2~3",
      "tone": "캐릭터/발행자의 개성 살리는 멘트",
      "examples": [
        "봄이 던지는 질문이에요 ✨\n댓글로 이야기 들려주세요",
        "이번 주 가장 재밌었던 순간을\n같이 나눠봐요 🌿",
        "슬로우퀵의 픽! 댓글 환영해요 🔥"
      ]
    }
  ]
}
```

### 4. 다크네이비 팔로우 카드

```json
{
  "component": "follow_card",
  "background": "#1A1F36",
  "border_radius": 16,
  "padding": "12px 14px",
  "layout": "flex align-center gap-10",
  "children": [
    {
      "name": "icon_box",
      "width": 32,
      "height": 32,
      "background": "#FFE67A",
      "border_radius": 8,
      "icon": "📰",
      "icon_size": 14
    },
    {
      "name": "account_name",
      "flex": 1,
      "content": "@spongeclub",
      "font_size": 13,
      "font_weight": 700,
      "color": "#FFE67A"
    },
    {
      "name": "follow_button",
      "background": "#FFE67A",
      "color": "#1A1F36",
      "font_size": 11,
      "font_weight": 700,
      "padding": "4px 12px",
      "border_radius": 999,
      "content": "+ 팔로우"
    }
  ],
  "removed_elements": [
    "스폰지타임즈 매주 발행 (서브 텍스트 제거)"
  ]
}
```

## 💬 질문 자동 생성 룰 (AI)

### 콘텐츠 유형별 질문 톤 가이드

```json
{
  "field_record": {
    "purpose": "공감/회상 유도",
    "tone": "참석자만 답할 수 있는 질문",
    "example_pool": [
      "이번 주 워크샵에서 가장 기억에 남은 장면은 뭐였나요? 💭",
      "줌 화면에서 가장 빛났던 순간을 알려주세요 ✨",
      "오늘 워크샵에서 건진 한 마디가 있다면? 🎤"
    ]
  },
  "slack_moment": {
    "purpose": "참여/공유 유도",
    "tone": "슬랙 멤버들이 답하기 좋은",
    "example_pool": [
      "이번 주 슬랙에서 가장 좋았던 순간은? 💛",
      "스폰지클럽 멤버라면 공감할 만한 일, 댓글로 남겨주세요 👀",
      "이번 주 슬랙에서 가장 자주 본 이모지는? 🎉"
    ]
  },
  "participant_spotlight": {
    "purpose": "응원/투표 유도",
    "tone": "MVP들에 대한 반응 끌어내기",
    "example_pool": [
      "오늘 소개된 6명 중 가장 인상 깊었던 분은? 댓글로 응원 보내주세요 👏",
      "여러분이라면 어떤 과제를 만들고 싶으신가요? 💡",
      "다음 주엔 누구의 작품을 볼 수 있을지 기대돼요 ✨"
    ]
  },
  "insight_skill": {
    "purpose": "시도/공감 유도",
    "tone": "실제 사용 경험 끌어내기",
    "example_pool": [
      "이 스킬, 여러분이라면 어디에 써보고 싶으세요? 💭",
      "비슷한 경험 있으셨다면 댓글로 알려주세요 🙌",
      "어떤 스킬이 가장 궁금하신가요? 다음 주에 다뤄볼게요 ✨"
    ]
  }
}
```

### AI 프롬프트 템플릿

```
[system]
당신은 스폰지타임즈의 인스타 캐러셀 CTA 질문을 생성합니다.
캐주얼하고 친근한 톤, 한 문장 이내, 끝에 적절한 이모지 1개 권장.
"~?" 형태의 질문 또는 "~해주세요"의 요청 형태.

[user]
콘텐츠 유형: {content_type}
콘텐츠 내용 요약: {content_summary}
발행자: {publisher_name}

위 콘텐츠를 본 독자가 댓글을 달고 싶어할 만한 질문 3개를 추천해주세요.
각 질문은 위 유형별 톤 가이드를 따라야 합니다.

[output format]
JSON array of 3 question strings.
```

## 📥 사용자 입력 필드

```json
{
  "inputs": {
    "selected_question": {
      "type": "select_or_edit",
      "source": "AI 추천 1~3개 중 선택 또는 살짝 수정",
      "required": true
    },
    "label_text": {
      "type": "select_or_input",
      "default": "💬 댓글로 이야기해요",
      "options_pool": ["💬 댓글로 이야기해요", "🙌 함께 이야기해봐요", "✍️ 의견을 들려주세요"]
    },
    "character_message": {
      "type": "textarea",
      "max_lines": 3,
      "description": "발행자 자유 멘트 (캐릭터 우측)",
      "required": true
    }
  }
}
```

## ✅ CTA 검수 체크리스트

- [ ] 배경 #FFFBED 적용 (옐로우 X)
- [ ] 옐로우 라벨이 좌상단
- [ ] 질문 카드에 큰 따옴표 장식
- [ ] 질문 텍스트에 형광펜 강조 (1곳)
- [ ] 캐릭터 + 자유 멘트가 같은 높이로 정렬
- [ ] 다크네이비 팔로우 카드 (3요소: 아이콘/계정명/버튼)
- [ ] "스폰지타임즈 매주 발행" 텍스트 없음
- [ ] 전체적으로 휑하지 않고 채워짐
