# Orbis Brands Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for inline execution. Steps use checkbox syntax.

**Goal:** Match the user's Orbis reference with a dark patterned brand section and white logo pills.
**Architecture:** Refine `HomeOrbitBrands` and its existing scoped CSS; serve a local copy of the reference background.
**Tech Stack:** Next.js 16.4.1, React 19, TypeScript, CSS, Playwright.
**Spec:** `docs/superpowers/specs/2026-11-16-orbis-brands-design.md`

## Global constraints
11 registry-driven destinations; localized count heading; white wordmarks; 65px desktop / 56px phone pills; 4/3/2 responsive columns; existing font stack; no added client JavaScript/dependencies.

## Review focus
Small phones must fit two pills; second-row staggering must remain inside the section; all cropped logos must stay centered; CHERY must render white; both language headings and existing links must work.

## Task 1: Implement and verify the reference section
**Files:** `src/components/HomeOrbitBrands.tsx`, `src/components/home-orbit-sections.css`, `public/art/orbis-brands-bg.webp`, `docs/design/homepage.md`.
**Interface:** Preserve `HomeOrbitBrands({ brands: Brand[], locale: Locale })` and `brandHref(locale, slug)`.
- [x] Inspect supplied screenshots, current source, installed Next.js CSS guide and retained REA reference; obtain the exact background and current reference CSS metrics.
- [ ] Implement localized copy, white logo pills, reference spacing, dark artwork and responsive wrapping.
- [ ] Run lint/type checks and an isolated export; inspect screenshots at 1920, 1440, 1024, 768, 390 and 320px in both languages.
- [ ] Check links, all decoded logo images, keyboard focus, hover and overflow; run existing relevant browser tests and final review.
- [ ] Record verification and update the homepage design description.

## Execution notes
Pre-flight: no shared interfaces. The user explicitly supplied the visual design and requested implementation. This reversible styling change uses browser measurements and existing tests; no tests mirroring CSS are added. Preserve the dirty active checkout; no commit, push or deployment.
