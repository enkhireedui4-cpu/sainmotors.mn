# Sain Motors homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the opening homepage sections with the requested Orbis-inspired Sain Motors experience.
**Architecture:** Server-render localized copy and links in HomeOrbitHero and HomeOrbitSections. Isolate native SVG motion in SainMonogram and passive scroll effects in OrbitScrollScene. Scope CSS to orbit-home and its matching header.
**Tech Stack:** Existing Next 16, React 19, TypeScript and CSS. No added packages.
**Spec:** ../specs/2026-11-15-orbis-home-design.md

## Global Constraints
- Exact supplied EN description and 11 brands; MN localization.
- Remove homepage video, marquee and vehicle studio.
- Use existing brand identity, routes and social URLs.
- Reduced motion and no horizontal overflow at 360px.
- Work directly in the user-requested Desktop folder; do not publish.

## Review Focus
- Browser without animation support retains a visible static S.
- Reduced motion disables art animation.
- Phone landscape uses natural scrolling.
- Dark header remains legible and the mobile dialog retains its original colors.
- Localized menu and language links continue to work.

### Task 1: Reference composition and native S
Files: create src/components/HomeOrbitHero.tsx, SainMonogram.tsx, HomeOrbitSections.tsx, OrbitScrollScene.tsx and both home-orbit CSS files; modify src/app/[lang]/page.tsx and src/content/company.ts. The shared header component needs no source changes.
- [x] Add a meaningful browser test for supplied copy, removed media, responsive viewport and scroll target; observe it fail against the current home.
- [x] Implement server-rendered hero, custom dimensional S and bounded animation controller.
- [x] Replace the old homepage opening sections and connect down control to home-company.
- [x] Verify desktop, mobile, reduced motion, offscreen pausing and navigation in the browser.
- [x] Run lint, TypeScript and relevant unit suite; build static output.

### Task 2: Review and documentation
- [x] Compare screenshots against the reference composition.
- [x] Review changed files and resolve material issues.
- [x] Update homepage design documentation and capture verification evidence.

## Execution ledger
Ruling: Use the existing checkout in place because the user explicitly named this Desktop folder for modification. The initial tree is clean. Preserve other pages and avoid commits or deployment unless asked.
Ruling: Continue implementation under the user's detailed action request; skill approval prompts do not add a new approval requirement to this reversible authorized work.
Ruling: User follow-ups replaced the old company/service blocks, requested clean iPhone-like typography and confirmed two 4S showrooms. These changes are included in the spec and implementation.
Review: A fresh reviewer found dark-header locale/focus contrast and an ineffective MP4 test assertion; all were corrected. A second review confirmed service destinations and effect cleanup, then identified the mobile-dialog focus token, also corrected.
Verification: 188 unit tests and 10 focused browser tests passed. The static build generated 47 pages; export validation checked 679 files. Desktop and phone screenshots for MN/EN are saved in docs/review/home-orbit.
Build note: SAIN_EXPORT_DIR is the final static destination in this project. The final export is refreshed in out; a stale preliminary out preview was identified and replaced before final verification.
