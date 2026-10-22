# Corporate Production Implementation Plan

> **For agentic workers:** Use executing-plans inline with independent parallel domain tasks. Fresh final review after integration.

**Goal:** Implement the approved light corporate redesign and produce a verified publication candidate.
**Architecture:** Existing static Next App Router; server-rendered content and small client islands for filters/galleries. Shared tokens and content registry.
**Tech Stack:** Next16.4.1, React19, TS, local Zona/Inter, existing Motion/sharp, Vitest/Playwright.
**Spec:** ../specs/2026-10-22-corporate-production.md

## Constraints and review focus
-11 official brands confirmed by user; do not approve unrelated137 historical content blocks.
- No fabricated hours/maps/news; preserve source notes and user media changes.
- URL filters, empty results, Back, translated routes and no-JS baseline remain usable.
- Full light theme must cover legacy secondary pages, dialogs,404 and logo contrast.
- Release gate/indexing must distinguish review build from approved production.

### Task1 — shared design, home and brand journeys (root)
- [x] Add behavior tests for direct11-brand access, useful hero routes, new nav/news and absence of auto-motion; observe RED against existing export.
- [x] Implement light global system/header/footer/home, brand views, compact services/about/privacy and sourced news routes.
- [x] Adapt only superseded tests, build and inspect responsive screenshots.

### Task2 — locations (independent agent)
- [x] Test literal brand/city intersections, empty results and query restoration RED→GREEN.
- [x] Implement src/lib/locations.ts, LocationDirectory.tsx, locations.css, [lang]/locations/page.tsx using existing typed records.
- [x] Test filter controls and real phone/map destinations; hand back exact source facts gaps.

### Task3 — content and release workflow (independent agent)
- [x] Add comprehensive registry/export and preview-indexing tests RED→GREEN.
- [x] Complete CSV/provenance, incorporate only explicit11-brand confirmation, investigate supplied hours/pins/logo assets, preserve unverified states.
- [x] Harden release packaging/Apache deployment templates and document exact human/external prerequisites.

### Task4 — integrate, verify and deliver
- [x] Unit suite/typecheck/lint/static build/browser suite and visual QA pass; record limitations separately.
- [x] Fresh read-only final review and one justified fix pass.
- [x] Backup original tracked state, integrate completed changes into requested folder, package candidate/checksums and Mongolian deployment instructions. No external publish without prerequisites.

## Ledger
- User explicitly authorized implementation; no further plan/worktree consent gate. Worktree: Desktop/sainmotors-production-20261022, branch codex/corporate-production-20261022, base d7fa532. Original generated/media.json is dirty and copied intact into worktree; dependencies junction to existing installation, generated media copied.
- Baseline on same original sources today:41 unit +38 e2e pass, lint/typecheck pass. Vitest default bundle loader hits unrelated parent-directory sandbox read; --configLoader runner passes. Python absent; apply ui-ux-pro-max Quick Reference instead of installing tools for optional searches. Requested motion-design skill searched all skill roots, not installed; frontend-design motion guidance and existing Motion cover the outcome.
- Interfaces: root adds PageKey locations/news and nav labels; locations agent consumes those. Root owns global CSS; location agent owns locations.css with --bg/--text/--text-2/--line tokens. Content agent owns content/index/types/hero/company registry and operations, root consumes approved hero and existing content data; agents do not alter shared global/home UI.

- Final evidence:58 unit,18 full browser tests pass; subsequent12pxlabel adjustment rebuilt and3affected browser tests pass. Fresh reviewer fixes verified: BOM-free Apache, language filter/hash, Locations copy. Full npm build pipeline pass. Clean export609files; preview ZIP307a1f5638bfd3868d5fd1bf34f29f2747beed8f24636f034f26a4d03c12d83d.77source files integrated into original; preexisting manifest hash preserved. Backup208trackedfiles+oldout. Originalout directory rename returnedEPERM, so backed-up in-place file copy used; clean releasecandidate also stored at originaldist/preview-files. Local3300healthpasses; no external deployment or remoteCI execution.
