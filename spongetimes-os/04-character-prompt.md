# 04. 캐릭터 프롬프트 생성 룰

> 발행자 캐릭터를 외부 AI 도구(Midjourney, DALL-E 등)로 생성할 때 사용할 프롬프트 자동 생성 가이드.

---

## 🎭 캐릭터 개요

```json
{
  "character_universe": "Sponge Times Mascot Characters",
  "common_features": {
    "style": "Pixel art, retro game style",
    "body": "Sponge-shaped block (cheese-like with holes)",
    "body_color": "#FFC845 (yellow)",
    "outfit": ["Baseball cap", "Overalls (멜빵바지)", "White T-shirt"],
    "face": "Pixel smile (two dots eyes + curve mouth)",
    "size_reference": "32px height in pixel art (chibi/SD proportion)",
    "logo_detail": "Newspaper + sparkle icon on cap and overalls"
  },
  "publishers": {
    "봄": {
      "color_hex": "#4490E2",
      "color_name": "blue",
      "palette": {
        "main": "#4490E2",
        "light": "#77BDF7",
        "dark": "#2B2D3A"
      }
    },
    "솔라": {
      "color_hex": "#E63946",
      "color_name": "red",
      "palette": {
        "main": "#E63946",
        "light": "#FF5252",
        "dark": "#4F3838"
      }
    },
    "슬로우퀵": {
      "color_hex": "#FF6A00",
      "color_name": "orange",
      "palette": {
        "main": "#FF6A00",
        "light": "#FFA35C",
        "dark": "#E65C00"
      }
    },
    "키노": {
      "color_hex": "#8B5CF6",
      "color_name": "purple",
      "palette": {
        "main": "#8B5CF6",
        "light": "#CBA6FF",
        "dark": "#2B203A"
      }
    }
  }
}
```

## 🎨 베이스 프롬프트 템플릿

```
A pixel art chibi character: a yellow sponge-shaped mascot with small holes 
on the surface, wearing {color} baseball cap and {color} overalls over a white 
t-shirt. The cap and overalls have small newspaper logo with sparkle. 
Simple pixel smile face (two dot eyes, curve mouth). 32px tall, retro game style.
{pose_description}
{additional_context}
Plain transparent background. Centered composition.
```

## 📐 슬라이드별 캐릭터 사용 룰

### 표지 슬라이드
```json
{
  "slide": "cover",
  "default_pose": "정면(FRONT) 포즈",
  "size_in_slide": "42% width",
  "position": "bottom-right",
  "pose_options": "주제에 맞게 AI 생성 가능",
  "rules": [
    "주제에 맞는 표정/포즈 생성",
    "텍스트와 안 겹치게",
    "배경 투명 PNG로 저장"
  ]
}
```

### CTA 슬라이드
```json
{
  "slide": "cta",
  "default_pose": "정면 또는 인사 포즈",
  "size_in_slide": "32% width",
  "position": "left-side (질문 카드 아래)",
  "pose_suggestion": "친근하게 말 거는 듯한 포즈"
}
```

### 본문 슬라이드
```json
{
  "slide": "body",
  "default_usage": "사용 안 함 (콘텐츠에 집중)",
  "exception": "참가자 스포트라이트 시 멤버 아바타로 활용 가능"
}
```

## 🤖 AI 프롬프트 자동 생성 룰

### 입력 → 프롬프트 매핑

```json
{
  "inputs": {
    "publisher": "봄/솔라/슬로우퀵/키노 중 1",
    "content_type": "현장 기록/슬랙 모멘트/참가자 스포트라이트/인사이트",
    "main_title": "표지 메인 타이틀 (포즈 추론용)",
    "slide_type": "cover/cta",
    "custom_pose_request": "선택 사항 (발행자가 직접 지정 시)"
  },
  "output": "외부 AI 도구에 붙여넣을 영문 프롬프트"
}
```

### 콘텐츠 유형별 포즈 추천

```json
{
  "field_record": {
    "default_poses": [
      "looking through binoculars (관찰자)",
      "holding a camera (기록자)",
      "writing in a notebook (메모하는)",
      "waving hello (인사)"
    ],
    "mood": "관찰/기록/현장감"
  },
  "slack_moment": {
    "default_poses": [
      "typing on a laptop",
      "holding a phone with chat bubble",
      "thumbs up reaction",
      "looking at floating chat bubbles"
    ],
    "mood": "소통/리액션"
  },
  "participant_spotlight": {
    "default_poses": [
      "holding a trophy",
      "clapping hands",
      "spotlight pose (양손 들고 환영)",
      "pointing at something with excitement"
    ],
    "mood": "응원/축하"
  },
  "insight_skill": {
    "default_poses": [
      "thinking with light bulb above head",
      "showing a tool or gadget",
      "demonstrating with hands",
      "eureka moment expression"
    ],
    "mood": "발견/체험"
  },
  "cta": {
    "default_poses": [
      "waving with smile",
      "pointing at the viewer (질문 던지기)",
      "holding a question mark",
      "leaning forward to ask"
    ],
    "mood": "친근/소통 유도"
  }
}
```

## 📝 프롬프트 생성 예시

### 예시 1: 봄 / 현장 기록 / 표지

**입력:**
- publisher: 봄
- content_type: 현장 기록
- main_title: "이번 주 워크샵에서 일어난 일"
- slide_type: cover

**자동 생성 프롬프트:**
```
A pixel art chibi character: a yellow sponge-shaped mascot with small holes 
on the surface, wearing blue baseball cap and blue overalls over a white t-shirt. 
The cap and overalls have small newspaper logo with sparkle. Simple pixel smile 
face (two dot eyes, curve mouth). 32px tall, retro game style.

Holding a camera, looking around with curious expression, as if documenting 
a workshop scene.

Plain transparent background. Centered composition.
```

### 예시 2: 키노 / 인사이트 / 표지

**입력:**
- publisher: 키노
- content_type: 인사이트
- main_title: "노션 캘린더 자동화 스킬 직접 써봤습니다"

**자동 생성 프롬프트:**
```
A pixel art chibi character: a yellow sponge-shaped mascot with small holes 
on the surface, wearing purple baseball cap and purple overalls over a white 
t-shirt. The cap and overalls have small newspaper logo with sparkle. Simple 
pixel smile face. 32px tall, retro game style.

Thinking pose with a light bulb floating above head, showing an "aha!" moment, 
slightly excited expression.

Plain transparent background. Centered composition.
```

### 예시 3: 솔라 / CTA / 질문 던지기

**입력:**
- publisher: 솔라
- slide_type: cta

**자동 생성 프롬프트:**
```
A pixel art chibi character: a yellow sponge-shaped mascot with small holes 
on the surface, wearing red baseball cap and red overalls over a white t-shirt. 
The cap and overalls have small newspaper logo with sparkle. Simple pixel smile 
face. 32px tall, retro game style.

Friendly waving pose, looking at the viewer, slight head tilt, inviting 
expression as if asking a question.

Plain transparent background. Centered composition.
```

## ⚙️ 프롬프트 생성 함수 명세 (의사 코드)

```javascript
function generateCharacterPrompt({
  publisher,
  contentType,
  slideType,
  mainTitle = '',
  customPose = ''
}) {
  // 1. 발행자 컬러 정보 로드
  const publisherData = PUBLISHERS[publisher];
  const colorName = publisherData.color_name; // "blue", "red", "orange", "purple"
  
  // 2. 베이스 프롬프트 생성
  const basePrompt = `A pixel art chibi character: a yellow sponge-shaped 
mascot with small holes on the surface, wearing ${colorName} baseball cap and 
${colorName} overalls over a white t-shirt. The cap and overalls have small 
newspaper logo with sparkle. Simple pixel smile face (two dot eyes, curve 
mouth). 32px tall, retro game style.`;
  
  // 3. 포즈 결정
  let pose;
  if (customPose) {
    pose = customPose;
  } else if (slideType === 'cta') {
    pose = pickRandom(POSE_OPTIONS.cta.default_poses);
  } else {
    pose = pickRandom(POSE_OPTIONS[contentType].default_poses);
    // 메인 타이틀에서 추가 컨텍스트 추출 가능
  }
  
  // 4. 최종 프롬프트 조립
  return `${basePrompt}\n\n${pose}\n\nPlain transparent background. Centered composition.`;
}
```

## 🔄 사용자 워크플로우

```
[웹앱에서]
1. 발행자가 슬라이드 정보 입력
   ↓
2. 시스템이 프롬프트 자동 생성
   ↓
3. "프롬프트 복사" 버튼 → 클립보드에 복사
   ↓
[외부 AI 도구로 이동]
4. Midjourney / DALL-E / Stable Diffusion 등에 붙여넣기
   ↓
5. 캐릭터 이미지 생성
   ↓
[웹앱으로 돌아와서]
6. "캐릭터 이미지 업로드"
   ↓
7. 시스템이 슬라이드에 자동 배치
```

## ✅ 캐릭터 이미지 가이드라인

발행자가 생성한 캐릭터 이미지를 업로드할 때 확인:

- [ ] 배경 투명 PNG
- [ ] 캐릭터 색상이 발행자 시그니처 컬러와 일치
- [ ] 픽셀 아트 스타일 유지
- [ ] 너무 디테일하지 않음 (32px 픽셀 미감)
- [ ] 표정이 친근함 (어둡거나 무서운 표정 X)
- [ ] 슬라이드 콘텐츠와 어울리는 포즈
