# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

No test runner is configured.

## Architecture

Next.js 16 App Router project with React 19, TypeScript (strict), Tailwind CSS 4, and Shadcn UI.

**Key directories:**
- `app/` — App Router pages and layouts; server components by default
- `components/ui/` — Shadcn UI components (CVA + Radix UI primitives)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

**Styling:**
- Tailwind CSS 4 — configured entirely via CSS variables in `app/globals.css`, no `tailwind.config.js`
- PostCSS plugin: `@tailwindcss/postcss` (not the old webpack loader)
- Theming uses oklch color space with `.dark` class toggling
- Path alias `@/*` maps to the repo root

**Components:**
- Shadcn style variant: `radix-maia`, base color: `olive`
- Components use CVA for variants and Radix UI's `asChild`/`Slot` for polymorphism
- RSC is enabled — keep components server-side unless they need client interactivity
