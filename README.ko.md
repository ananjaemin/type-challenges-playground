[[English](README.md) | 한국어 | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)]

# TypeScript Challenge Playground
브라우저에서 타입 레벨 TypeScript 챌린지를 푸는 놀이터.

## 설명
TypeScript Challenge Playground는 https://github.com/type-challenges/type-challenges 의 타입 레벨 TypeScript 챌린지를 브라우저에서 바로 풀 수 있는 사이트입니다. warm, easy, medium, hard, extreme 5단계 난이도에 걸친 190개의 문제를 제공하며, Monaco 에디터에서 실시간 타입 체킹을 지원합니다.

## 주요 기능
- type-challenges 저장소의 190개 타입 챌린지
- TypeScript strict 모드가 적용된 Monaco Editor
- 실시간 타입 진단 (통과/실패)
- 난이도 필터링 (warm/easy/medium/hard/extreme) + 검색
- 전체 챌린지 페이지 빌드 타임 정적 생성 (SSG)
- shadcn/ui 기반 다크 모드 UI

## 기술 스택
- Next.js 16 (App Router, SSG)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Monaco Editor (@monaco-editor/react)
- Biome (lint + format)
- Husky + lint-staged (pre-commit hooks)
- pnpm (package manager)

## 시작하기
사전 준비물: Node.js 18+, pnpm

이 저장소를 클론한 뒤 실행하세요:

```bash
pnpm install
pnpm fetch-challenges   # fetches 190 challenges from GitHub
pnpm dev                # starts dev server at localhost:3000
```

## 사용 가능한 스크립트
- pnpm dev: 개발 서버 실행
- pnpm build: 프로덕션 빌드
- pnpm start: 프로덕션 서버 실행
- pnpm fetch-challenges: GitHub에서 챌린지 데이터 가져오기
- pnpm lint: Biome 린트 실행
- pnpm format: Biome로 코드 포맷
- pnpm check: Biome 전체 체크 실행
- pnpm check:fix: Biome 이슈 자동 수정

## 프로젝트 구조
```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Challenge list (home)
│   └── challenges/[slug] # Challenge workspace
├── components/
│   ├── challenge/        # Challenge list, card, badge
│   ├── editor/           # Monaco editor + type checking
│   └── ui/               # shadcn/ui components
├── data/                 # Generated challenge JSON data
├── lib/                  # Data loaders, utilities
└── types/                # TypeScript type definitions
```

## 동작 방식
챌린지 데이터는 빌드 시점에 type-challenges GitHub 저장소에서 가져와서 info.yml, template.ts, test-cases.ts를 파싱한 뒤, 각 챌린지를 정적 페이지로 제공합니다. Monaco 에디터는 Web Worker에서 TypeScript 언어 서비스를 실행해 실시간 타입 체킹을 제공하고, 타입 에러가 0이 되면 해당 챌린지를 통과로 표시합니다.

## 크레딧
- https://github.com/type-challenges/type-challenges

## 라이선스
MIT
