# Sain Motors brand system implementation plan

> **For agentic workers:** use superpowers:subagent-driven-development for the independent component groups, then review the integrated site.

**Goal:** Give the whole corporate website one red/white/black Sain Motors identity.

**Architecture:** Define shared CSS tokens and alias existing semantics. Migrate active components and add restrained structural red accents, preserving existing page layouts and behavior.

**Tech Stack:** Existing Next.js 16/React/TypeScript/CSS, Inter/system UI font, supplied SVG logos, headless Playwright.

**Spec:** `docs/superpowers/specs/2026-11-17-sain-brand-system-design.md`

## Global constraints

Official UI red #e20a17; white/black/neutral gray. Preserve supplied copy, logo files, photo choices, news withdrawals, routes, form semantics, map behavior and both locales. No dependencies, commits or deployment. Keep the existing dirty checkout.

## Review focus

CSS cascade across globals/route CSS; dark hero header vs white scrolled header; longer Mongolian controls on mobile; red/white contrast; no changes to partner logo/photo colors or service routing.

### Task 1: Shared foundation and source guideline

- [x] Read supplied brand guideline and audit active sources.
- [ ] Add `src/app/brand-tokens.css`, alias globals/site-system/orbis semantics.
- [ ] Normalize shared button, title-band, service and brand-portfolio presentation.
- [ ] Document palette, typography, component states and exceptions in `docs/brand-guidelines.md`.

### Task 2: Header, footer and home

Depends on token contract in spec. Own `src/components/site-header.css`, `site-footer.css`, `home-orbit-hero.css`, `home-orbit-sections.css`, `SiteHeader.tsx` only if needed.

- [ ] Preserve header behavior, add official dark logo treatment and strong current navigation.
- [ ] Apply common red actions/neutral palette to homepage sections and footer.
- [ ] Report exact edits and local validation; do not build concurrently.

### Task 3: Locations, contact and news

Depends on token contract. Own `src/app/locations.css`, `src/components/feedback.css`, `news-system.css` only; small component changes only if necessary and reported.

- [ ] Unify selected/filter/form/news states using official red and neutral tokens.
- [ ] Preserve all structure, copy, images, filters, maps and form behavior.
- [ ] Report validation; do not build concurrently.

### Task 4: Integration and verification

- [ ] Audit shared CSS and migrate About's recent design to official tokens.
- [ ] Run lint, build, unit/content checks and current relevant browser checks.
- [ ] Capture/review before-after main-page screenshots, MN/EN mobile/desktop.
- [ ] Fix material visual or interaction regressions, obtain independent final review.

Ruling: the user's explicit request to perform the full task and continuing delegation of design choices authorize execution without an additional approval round.
