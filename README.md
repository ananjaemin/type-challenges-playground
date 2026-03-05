English | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

# TypeScript Challenge Playground
Solve type-level TypeScript challenges in the browser.

## Description
TypeScript Challenge Playground is a site for solving type-level TypeScript challenges from https://github.com/type-challenges/type-challenges directly in the browser. It includes 190 challenges across 5 difficulty levels (warm, easy, medium, hard, extreme) and a Monaco editor with real-time type checking.

## Key Features
- 190 type challenges from type-challenges repo
- Monaco Editor with TypeScript strict mode
- Real-time type diagnostics (pass/fail)
- Difficulty filtering (warm/easy/medium/hard/extreme) + search
- SSG (Static Site Generation) for all challenge pages
- Dark mode UI with shadcn/ui

## Tech Stack
- Next.js 16 (App Router, SSG)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Monaco Editor (@monaco-editor/react)
- Biome (lint + format)
- Husky + lint-staged (pre-commit hooks)
- pnpm (package manager)

## Getting Started
Prerequisites: Node.js 18+, pnpm

Clone this repo, then run:

```bash
pnpm install
pnpm fetch-challenges   # fetches 190 challenges from GitHub
pnpm dev                # starts dev server at localhost:3000
```

## Available Scripts
- pnpm dev: Start development server
- pnpm build: Production build
- pnpm start: Start production server
- pnpm fetch-challenges: Fetch challenge data from GitHub
- pnpm lint: Run Biome linter
- pnpm format: Format code with Biome
- pnpm check: Run all Biome checks
- pnpm check:fix: Auto-fix all Biome issues

## Project Structure
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

## How It Works
Challenge data is fetched at build time from the type-challenges GitHub repo, parsed (info.yml + template.ts + test-cases.ts), and served as static pages. The Monaco editor runs TypeScript's language service in a Web Worker to provide real-time type checking. When all type errors resolve to zero, the challenge is marked as passing.

## Credits
- https://github.com/type-challenges/type-challenges

## License
MIT
