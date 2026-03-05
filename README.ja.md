[[English](README.md) | [한국어](README.ko.md) | 日本語 | [简体中文](README.zh-CN.md)]

# TypeScript Challenge Playground
ブラウザで型レベル TypeScript チャレンジを解くプレイグラウンド。

## 概要
TypeScript Challenge Playground は、https://github.com/type-challenges/type-challenges の型レベル TypeScript チャレンジをブラウザ上で解くためのサイトです。warm, easy, medium, hard, extreme の 5 段階難易度で 190 問を収録し、Monaco エディターでリアルタイムの型チェックを行えます。

## 主な機能
- type-challenges リポジトリ由来の 190 問
- TypeScript strict モード対応の Monaco Editor
- リアルタイム型診断 (合格/不合格)
- 難易度フィルタ (warm/easy/medium/hard/extreme) + 検索
- 全チャレンジページを SSG (Static Site Generation) で生成
- shadcn/ui によるダークモード UI

## 技術スタック
- Next.js 16 (App Router, SSG)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Monaco Editor (@monaco-editor/react)
- Biome (lint + format)
- Husky + lint-staged (pre-commit hooks)
- pnpm (package manager)

## はじめ方
前提: Node.js 18+, pnpm

このリポジトリをクローンしたら、次を実行します:

```bash
pnpm install
pnpm fetch-challenges   # fetches 190 challenges from GitHub
pnpm dev                # starts dev server at localhost:3000
```

## 利用可能なスクリプト
- pnpm dev: 開発サーバーを起動
- pnpm build: 本番ビルド
- pnpm start: 本番サーバーを起動
- pnpm fetch-challenges: GitHub からチャレンジデータを取得
- pnpm lint: Biome のリントを実行
- pnpm format: Biome でフォーマット
- pnpm check: Biome の全チェックを実行
- pnpm check:fix: Biome の問題を自動修正

## プロジェクト構成
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

## 仕組み
チャレンジデータはビルド時に type-challenges の GitHub リポジトリから取得し、info.yml, template.ts, test-cases.ts をパースして、各チャレンジを静的ページとして配信します。Monaco エディターは Web Worker 上で TypeScript の Language Service を動かし、リアルタイムの型チェックを提供します。型エラーが 0 になった時点で、そのチャレンジは合格として扱われます。

## クレジット
- https://github.com/type-challenges/type-challenges

## ライセンス
MIT
