# 01. 표지 슬라이드 OS

> 캐러셀 첫 슬라이드. 인스타 피드에서 즉시 "스폰지타임즈"임을 인지시키는 시그니처 슬라이드.
> **이 문서는 단독 사용 가능합니다.** 표지만 별도로 제작하고 싶을 때는 이 파일과 `00-design-system.md`만 보면 됩니다.

---

## 🎯 표지 명세

```json
{
  "slide_type": "cover",
  "canvas": { "width": 1080, "height": 1350, "ratio": "4:5" },
  "background_color": "#FFE67A",
  "padding": "6% 7% 5%",
  "structure": {
    "header": { "position": "top", "opacity": 0.35 },
    "label": { "position": "top-left", "below_header": true },
    "main_title": { "position": "center-vertical", "align": "left" },
    "character": { "position": "bottom-right", "size_percent": 42 },
    "footer": { "position": "bottom", "opacity": 0.35 }
  }
}
```

## 📐 레이아웃 구조

```
┌─────────────────────────────────────┐
│ SPONGE TIMES        VOL.0X / 20XX   │ ← 헤더 (옅게)
│                                     │
│ [Week N · 콘텐츠 유형]                │ ← 라벨 (다크 알약)
│                                     │
│ 메인 타이틀 (좌측 정렬, Bold 700)      │
│ 강조어는 [오렌지 형광펜]               │  ← 본문 영역
│ 직접 써봤습니다                       │
│                                     │
│                      ┌──────────┐   │
│                      │  캐릭터    │   │  ← 캐릭터 (우하단, 42%)
│                      │ 정면 포즈  │   │
│                      └──────────┘   │
│                                     │
│ @spongeclub             by 발행자명   │ ← 푸터 (옅게)
└─────────────────────────────────────┘
```

## 🧩 컴포넌트 명세

### 1. 헤더 (Header)

```json
{
  "component": "cover_header",
  "layout": "flex justify-between align-center",
  "margin_bottom": 24,
  "left_text": {
    "content": "SPONGE TIMES",
    "font_size": 10,
    "font_weight": 500,
    "letter_spacing": "0.15em",
    "color": "#1A1F36",
    "opacity": 0.35
  },
  "right_text": {
    "content": "VOL.{volume_number} / {year}",
    "font_size": 10,
    "font_weight": 500,
    "letter_spacing": "0.05em",
    "color": "#1A1F36",
    "opacity": 0.35
  }
}
```

### 2. 라벨 (Pill Label)

```json
{
  "component": "cover_label",
  "format": "Week {N} · {contentType}",
  "examples": [
    "Week 3 · 현장 기록",
    "Week 5 · 슬랙 모멘트",
    "Week 1 · 참가자 스포트라이트",
    "Week 7 · 인사이트"
  ],
  "style": {
    "background": "#1A1F36",
    "text_color": "#FFE67A",
    "font_size": 12,
    "font_weight": 500,
    "padding": "5px 12px",
    "border_radius": 999,
    "letter_spacing": "0.02em",
    "display": "inline-block"
  },
  "margin_bottom": 20
}
```

### 3. 메인 타이틀

```json
{
  "component": "cover_main_title",
  "alignment": "left",
  "font_family": "Pretendard",
  "font_weight": 700,
  "font_size": 40,
  "line_height": 1.15,
  "letter_spacing": "-0.025em",
  "color": "#1A1F36",
  "line_break_rule": "발행자가 직접 줄바꿈 지정 (2~3줄 권장)",
  "highlight_rule": {
    "method": "오렌지 형광펜",
    "color": "rgba(255, 152, 0, 0.55)",
    "implementation": "텍스트 뒤에 absolute 위치한 색 막대 (height: ~14px, bottom: 5px)",
    "count": "1~2개 단어/구절만 강조"
  }
}
```

### 4. 캐릭터 영역

```json
{
  "component": "cover_character",
  "position": "absolute",
  "default_placement": {
    "right": "5%",
    "bottom": "12%",
    "width_percent": 42,
    "aspect_ratio": "1:1"
  },
  "adjustable": true,
  "adjustment_options": {
    "width_range": "25-50%",
    "position_presets": ["bottom-right", "bottom-left", "bottom-center"]
  },
  "image_source": "AI 생성 (외부 도구) → 사용자 업로드",
  "prompt_generation": "04-character-prompt.md 참조"
}
```

### 5. 푸터 (Footer)

```json
{
  "component": "cover_footer",
  "layout": "flex justify-between align-center",
  "left_text": {
    "content": "@spongeclub",
    "font_size": 10,
    "font_weight": 500,
    "opacity": 0.35
  },
  "right_text": {
    "content": "by {publisher_name}",
    "font_size": 10,
    "font_weight": 500,
    "opacity": 0.35
  },
  "note": "옅은 텍스트만, 라인 없음"
}
```

## 📥 사용자 입력 필드

자동 생성 시스템에서 발행자가 입력할 변수:

```json
{
  "inputs": {
    "week": {
      "type": "number",
      "range": [1, 7],
      "required": true
    },
    "content_type": {
      "type": "select",
      "options": ["현장 기록", "슬랙 모멘트", "참가자 스포트라이트", "인사이트"],
      "required": true
    },
    "volume": {
      "type": "auto",
      "format": "VOL.{XX} / {YYYY}",
      "computed_from": "week + year"
    },
    "main_title": {
      "type": "textarea",
      "max_length": 50,
      "line_break_supported": true,
      "required": true
    },
    "highlight_word": {
      "type": "string",
      "description": "메인 타이틀 안에서 형광펜 강조할 단어/구절",
      "required": false,
      "max_count": 2
    },
    "publisher": {
      "type": "select",
      "options": ["봄", "솔라", "슬로우퀵", "키노"],
      "required": true
    },
    "character_image": {
      "type": "file_upload",
      "format": ["png", "jpg"],
      "required": true
    },
    "character_position": {
      "type": "select",
      "options": ["bottom-right", "bottom-left", "bottom-center"],
      "default": "bottom-right"
    },
    "character_size": {
      "type": "number",
      "range": [25, 50],
      "default": 42,
      "unit": "percent"
    }
  }
}
```

## ✅ 검수 체크리스트

표지 생성 후 확인 사항:

- [ ] 옐로우 배경 (#FFE67A) 적용됨
- [ ] 헤더 텍스트가 너무 진하지 않음 (opacity 35%)
- [ ] 라벨이 좌상단에 다크네이비 알약 형태
- [ ] 메인 타이틀이 좌측 정렬, Bold 700
- [ ] 강조 단어에 오렌지 형광펜 (1~2곳만)
- [ ] 캐릭터가 타이틀과 안 겹침
- [ ] 푸터가 옅게, 라인 없음
- [ ] 전체 컬러 균형 (다크네이비 비중이 너무 많지 않음)

## 🎨 시각적 예시

```
배경: #FFE67A 크림옐로우
헤더: "SPONGE TIMES" + "VOL.03 / 2026" (opacity 35%)
라벨: "Week 3 · 인사이트" (다크네이비 알약 + 옐로우 텍스트)
타이틀: 
  "노션 캘린더
   [자동화 스킬]   ← 오렌지 형광펜
   직접 써봤습니다"
캐릭터: 우하단 42% (키노)
푸터: "@spongeclub" / "by 키노" (opacity 35%)
```
