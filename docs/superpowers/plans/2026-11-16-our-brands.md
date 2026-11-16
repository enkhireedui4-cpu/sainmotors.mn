# Our Brands Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the user's final Bada-inspired Our brands section with large centered logos and brand names beneath them.

**Architecture:** Refine the existing server component and its scoped stylesheet. Keep registry-driven links and wordmark crop geometry; use responsive equal-width flex items with centered incomplete rows.

**Tech Stack:** Next.js 16.4.1, React 19, TypeScript, CSS, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-16-our-brands-design.md`

## Global Constraints
- English heading: "Our brands". Mongolian heading: "Манай брэндүүд".
- Borderless logo/name links; 1408px maximum desktop width; logo areas 200px desktop/tablet and 80px phones.
- Desktop row pitch approximately 297px, logo-to-label gap 32px; mobile column gap 20px, row gap 24px and logo-to-label gap 12px. Wordmarks up to 48px / 32px with preserved proportions and a 256px width limit.
- Four / three / two columns at >=1024 / 768–1023 / <768px.
- Preserve all 11 brands, proportions, cropped wordmarks and destinations.
- Current local checkout; no new dependencies, client JavaScript, commit, push or deployment.

## Review Focus
1. At 320px, two buttons remain inside the viewport with no overlap.
2. The three cropped wordmarks are centered by their visible bounds within the logo area and show no emblem remnants.
3. Very wide logos scale proportionally and remain fully visible.
4. Keyboard focus is visible and the destinations remain functional.
5. Both headings localize correctly; homepage news/invitation blocks remain absent.

## Task 1: Refine and verify the brand section

**Files:** Modify `src/components/HomeOrbitBrands.tsx`, `src/components/home-orbit-sections.css`, `docs/design/homepage.md`, and `docs/fonts.md`.

**Interfaces:** Consume the unchanged `HomeOrbitBrands({ brands: Brand[], locale: Locale })` contract and `brandHref(locale, slug)`. Produce the same 11 accessible anchors with localized short heading, larger centered logos and visible brand names.

- [x] Capture current component/CSS in `.tmp-assets/our-brands-review/` and inspect relevant skills, Next.js docs and current behavior.
- [x] Replace the heading with exact localized copy and a concise supporting line matching the reference hierarchy.
- [x] Apply the spec's sizes, responsive column calculation, centered rows, brand labels and focus states.
- [x] Run lint and an isolated static build. Expected: exit 0 and all 47 routes generated.
- [x] Serve the new export on the existing local preview URL; check the spec's viewport matrix, logo centers/proportions, keyboard navigation and all hrefs. Expected: no layout violations or broken destinations.
- [x] Run `node --test --test-concurrency=1 tests/e2e/site-design.test.mjs tests/e2e/experience.test.mjs`. Expected: 4 tests pass.
- [x] Save desktop/mobile screenshots, complete an independent final review, and update the design/typography documentation and execution ledger with actual results.

## Execution notes
This reversible visual refinement uses direct browser measurements, screenshot review and existing integration tests; no new tests that merely mirror CSS are added. The project already contains substantial uncommitted work, so no branch or staging operations are performed. The user requested complete implementation, so execution continues inline after documenting and self-reviewing the plan. A fresh reviewer checks the final scoped change.
