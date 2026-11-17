# About principles implementation plan

> **For agentic workers:** implement this focused change inline, preserving the existing working tree.

**Goal:** Replace the old four-panel purpose section with four staggered typographic cards.

**Architecture:** A server component reads the existing bilingual about copy. Scoped CSS handles the composition without JavaScript or image requests. Keep the earlier motto/brand introduction sections intact.

**Tech Stack:** Next.js 16, React, TypeScript, existing Inter font and CSS.

**Spec:** `docs/superpowers/specs/2026-11-17-about-principles-design.md`

## Constraints and review focus

- Preserve management copy and both locales; remove only the old purpose visuals/layout.
- No new dependencies, stock imagery, or motion.
- Cards grow with translated or longer text; reading order remains mission, vision, values, development.
- Narrow screens must not overflow or overlap. Keep real links keyboard accessible.

## Tasks

- [x] Add `AboutPrinciples.tsx`, its scoped CSS and bilingual section heading.
- [x] Replace the legacy purpose markup and remove its unused CSS.
- [x] Update existing About browser checks for the new layout and removed duplicate film.
- [x] Run lint, build, content tests and About browser checks; inspect desktop/mobile screenshots and refine.

Validation: targeted ESLint clean; static export and TypeScript passed; 34 content tests passed; all four About browser tests passed, including both locales at 320/390/768/1024/1440/1920px, no-JS content, longer copy, introductory video playback/pause and fallback behavior. Desktop/mobile screenshot evidence is in `.tmp-assets/about-principles-*.png`.

Ruling: the user's instruction to choose and implement the design provides authorization to proceed without a separate design approval round. Retain the existing dirty checkout; do not commit or deploy.
