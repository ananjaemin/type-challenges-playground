[[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | 简体中文]

# TypeScript Challenge Playground
在浏览器里刷 TypeScript 类型体操题。

## 简介
TypeScript Challenge Playground 是一个在浏览器中解 https://github.com/type-challenges/type-challenges 的 TypeScript 类型挑战的网站。共收录 190 道题，分为 warm, easy, medium, hard, extreme 5 个难度，并提供带实时类型检查的 Monaco 编辑器。

## 主要特性
- 来自 type-challenges 仓库的 190 道类型挑战
- 启用 TypeScript strict 模式的 Monaco Editor
- 实时类型诊断 (通过/未通过)
- 难度筛选 (warm/easy/medium/hard/extreme) + 搜索
- 为所有挑战页面进行 SSG (Static Site Generation) 静态生成
- 基于 shadcn/ui 的深色模式 UI

## 技术栈
- Next.js 16 (App Router, SSG)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Monaco Editor (@monaco-editor/react)
- Biome (lint + format)
- Husky + lint-staged (pre-commit hooks)
- pnpm (package manager)

## 快速开始
前置条件: Node.js 18+, pnpm

克隆仓库后，执行:

```bash
pnpm install
pnpm fetch-challenges   # fetches 190 challenges from GitHub
pnpm dev                # starts dev server at localhost:3000
```

## 可用脚本
- pnpm dev: 启动开发服务器
- pnpm build: 生产构建
- pnpm start: 启动生产服务器
- pnpm fetch-challenges: 从 GitHub 拉取挑战数据
- pnpm lint: 运行 Biome linter
- pnpm format: 使用 Biome 格式化
- pnpm check: 运行所有 Biome 检查
- pnpm check:fix: 自动修复所有 Biome 问题

## 项目结构
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

## 工作原理
挑战数据在构建时从 type-challenges 的 GitHub 仓库拉取，并解析 info.yml, template.ts, test-cases.ts，然后以静态页面的形式提供。Monaco 编辑器在 Web Worker 中运行 TypeScript 的语言服务，从而提供实时类型检查。当类型错误数量归零时，该挑战会被标记为通过。

## 致谢
- https://github.com/type-challenges/type-challenges

## 许可证
MIT
