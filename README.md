# 스폰지타임즈 표지 + CTA 생성기 (mini)

스폰지타임즈 캐러셀 생성기에서 **표지(Cover)**와 **CTA** 슬라이드 2장만 빼서 만든 미니 앱입니다. 다른 발행자 분들이 표지/CTA만 빠르게 뽑을 수 있게 단순화한 버전이에요.

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
4. `전체 PNG (2장 ZIP)` — 표지 + CTA를 ZIP으로 일괄 다운로드
5. 입력 내용은 `localStorage`에 자동 저장 (새로고침해도 유지)

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
    tokens.ts                     # 디자인 시스템 JSON → JS 객체
    slideOrder.ts                 # cover + cta 두 종류만 순서 빌드
    state/useSpotlightDraft.ts    # 폼 상태 + localStorage 동기화
    slides/
      Slide.tsx                   # 1080×1350 캔버스 래퍼
      CoverSlide.tsx
      CtaSlide.tsx
      parts/                      # Highlight, PillLabel, FollowCard
    form/
      fields.tsx                  # TextField, NumberField, RangeField, ...
      editors/                    # CommonFields, CoverEditor, CtaEditor
    character/                    # 캐릭터 프롬프트 빌더 + 복사 UI
    export/                       # PNG 추출 + ZIP 묶음
    styles/                       # tokens.css + global.css
spongetimes-os/                   # 디자인 OS 문서 (참조)
```
