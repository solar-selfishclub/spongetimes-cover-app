# 스폰지타임즈 생성기 (mini)

표지(Cover) + 본문(Body) + CTA 슬라이드를 한 앱에서 만들고 PNG/ZIP으로 내보내는 미니 앱입니다.

- **표지/CTA** — 4명 공통 OS (`spongetimes-os/`) 기반
- **본문** — `cta/슬로우퀵` 브랜치에서 추가된 슬로우퀵 본인 채널용 OS (`DESIGN-BODY.md` v0.1). 본문 OS는 본인 한정 운용이며 솔라 합의 시 메인 머지 예정.

## 디자인 OS (단일 진실 공급원)

`spongetimes-os/` 폴더의 문서들이 모든 디자인 규칙의 출처입니다.

- `00-design-system.md` — 컬러/타이포/스페이싱 토큰
- `01-cover.md` — 표지 슬라이드 명세
- `03-cta.md` — CTA 슬라이드 명세 + 질문 풀
- `04-character-prompt.md` — 캐릭터 이미지 생성 프롬프트 빌더 의사코드
- `README.md` — 전체 카탈로그 개요

## 실행

```bash
cd app
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 동작

1. 좌측 슬라이드 프리뷰 (1080×1350을 0.55배로 축소 표시)
2. 우측 폼에서 텍스트/이미지/캐릭터 위치 등 편집
3. `PNG 다운로드` — 현재 슬라이드 1장만 다운로드
4. `전체 PNG (N장 ZIP)` — 표지 + 본문(N) + CTA를 ZIP으로 일괄 다운로드
5. 입력 내용은 `localStorage`에 자동 저장 (새로고침해도 유지)

## 본문 슬라이드 사용법 (슬로우퀵 OS)

우측 사이드바의 **`본문 슬라이드`** 섹션에서 템플릿을 골라 `+ 본문 추가` 버튼으로 N장을 만들 수 있습니다. 슬라이드 순서는 자동으로 `표지 → 본문 1 → … → 본문 N → CTA` 가 됩니다.

### 본문 템플릿 6종 (`DESIGN-BODY.md` §2)

| 템플릿 | 용도 | 핵심 자산 |
|---|---|---|
| `HERO` | 미션 진입 / 섹션 헤더 | 큰 헤딩 + 짧은 본문 + (옵션) 노란 원 + (옵션) 이미지 |
| `QUOTE` | 멤버 어록 강조 | 큰 인용 + 출처 + (옵션) 옐로우 강조 박스 |
| `QUOTE MULTI` | 어록 묶음 (3~5명) | 작은 인용 카드 세로 N개 (각 on/off) |
| `FLOW` | 노하우 전파, 단계 | 1→2→3 카드 (인물 + 한 마디, 최대 4) |
| `SIDE PROFILE` | 미션 리스트 / 분류 | 좌측 박스 리스트 + 우측 이미지 슬롯 |
| `GRID HERO` | 인물·상황 4종 비교 | 2×2 카드 (옐로우 띠 + 다크 알약 태그) |

### 옵션 (모든 템플릿 공통, on/off + 조절)

- **부캡션** — 헤딩 아래 한 줄
- **알약 라벨** — 헤딩 위 (다크 / 옐로우)
- **큰 노란 원 배경 데코** — 위치(6) × 크기(소/중/대) × 모양(원·반원·도트·곡선)
- **이미지 슬롯** — 캐릭터·사진·UI 캡처 자유, 위치/크기 조절
- **흰 콘텐츠 카드** — 템플릿별로 각 카드 on/off + 텍스트 편집

### 슬로우퀵 9포즈 캐릭터 시스템

발행자를 **`슬로우퀵`** 으로 선택하고 본문 슬라이드의 이미지 슬롯을 켜면, `슬로우퀵 9포즈 직접 선택` 드롭다운이 나옵니다. `#01 대표 / 손 흔들기 ~ #09 화이트보드` 중 하나를 고르면 캐릭터 프롬프트가 해당 포즈로 자동 채워집니다. 생성된 프롬프트를 나노바나나2 등에 붙여서 캐릭터 PNG를 만든 뒤 이미지 슬롯에 업로드하세요.

### 4코너 anchor (자동 생성)

- 좌상단 `#NN · CATEGORY` — 카테고리는 본문 편집기에서 입력
- 우상단 알약 라벨 — on/off + 텍스트 + 색
- 좌하단 `NN / total` — 자동 (본문 슬라이드 번호 / 본문 총 장수)
- 우하단 ★ — on/off

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 푸시
2. Vercel 대시보드 → **New Project** → 해당 저장소 선택
3. **Root Directory**를 `app`으로 지정 (`app/vercel.json`이 빌드 설정을 잡아줌)
4. **Deploy** — 이후 푸시할 때마다 자동 빌드

빌드/프리뷰 로컬 확인:

```bash
cd app
npm run build      # tsc -b && vite build → app/dist/
npm run preview    # dist/ 결과물을 로컬에서 미리보기
```

## 스택

- Vite + React 18 + TypeScript
- Pretendard (npm 패키지로 설치 — CDN 미사용)
- html-to-image (DOM → PNG)
- JSZip + file-saver (ZIP 묶음 다운로드)

## 폴더 구조

```
app/
  src/
    main.tsx, App.tsx
    tokens.ts                     # 디자인 시스템 JSON → JS 객체 (+ SLOWQUICK_9_POSES)
    slideOrder.ts                 # 표지 + 본문 N + CTA 순서 동적 빌드
    state/
      useSpotlightDraft.ts        # 폼 상태 + localStorage + bodySlides CRUD
      bodySlide.ts                # BodySlide 타입 + 6템플릿 기본값
    slides/
      Slide.tsx                   # 1080×1350 캔버스 래퍼
      CoverSlide.tsx
      CtaSlide.tsx
      body/
        BodySlideHost.tsx         # 본문 공통 래퍼 (배경 + anchor + deco + image slot)
        BodySlideRenderer.tsx     # template → 컴포넌트 디스패치
        BodyHeroSlide.tsx
        BodyQuoteSlide.tsx
        BodyQuoteMultiSlide.tsx
        BodyFlowSlide.tsx
        BodySideProfileSlide.tsx
        BodyGridHeroSlide.tsx
      parts/
        BodyAnchor.tsx            # 4-corner anchor
        BodyHeading.tsx           # 헤딩 + 부캡션 + 알약
        YellowCircleDeco.tsx      # 노란 원 배경 데코 (4 shape × 6 position × 3 size)
        Highlight.tsx, PillLabel.tsx, FollowCard.tsx
        cards/                    # 본문 작은 카드들
          MiniQuoteCard.tsx, HlQuoteMini.tsx, EncourageMini.tsx
          RelayMini.tsx, GhCard.tsx, SideItem.tsx
    form/
      fields.tsx                  # TextField, NumberField, RangeField, CheckboxField, ...
      editors/
        CommonFields.tsx, CoverEditor.tsx, CtaEditor.tsx
        BodyEditor.tsx            # 본문 1장 편집기 (템플릿 디스패치)
        BodyListManager.tsx       # 본문 추가/삭제/순서변경
        bodyTemplates/            # 템플릿별 폼 fragment 6종
    character/                    # 캐릭터 프롬프트 빌더 + 복사 UI (cover/cta/body)
    export/                       # PNG 추출 + ZIP 묶음
    styles/                       # tokens.css + global.css
spongetimes-os/                   # 솔라 표지/CTA 디자인 OS 문서 (참조)
DESIGN-BODY.md                    # 본문 OS (외부 파일 — 슬로우퀵 채널 한정)
```
