# News and Footer Implementation Plan

**Goal:** Reproduce the supplied Orbis news band and footer using Sain content.
**Spec:** `docs/superpowers/specs/2026-11-17-news-footer-design.md`
**Architecture:** Existing PageBand + stateful news filters with server-rendered cards; shared server-rendered footer with its own stylesheet.

- [x] Inspect current source and reuse retained reference measurements and REA evidence.
- [x] Verify the new browser check fails on missing filters, then implement category behavior and news band sizing.
- [x] Replace footer composition and verify localized routes, scrolling and responsive layout.
- [x] Run focused browser coverage, lint/typecheck and isolated production build; inspect desktop/mobile screenshots.

Preserve pre-existing uncommitted inner-page work. No commit or deployment requested. Use empty states for categories with no source articles; use existing About/Brands/Contact routes for the three footer links.

Verification found that the existing `.brand-detail .brand-title` rule overrides the new PageBand background on BYD. A scoped PageBand override now preserves the intended black arrival band and readable action links. This resolves the failing existing inner-page browser check without changing other brand-title presentations.

Design review: no blocking findings. 14 locale/viewport cases cover 320/390/768/900/1024/1440/1920px. Desktop and mobile screenshots inspected under `.tmp-assets/news-footer-review/`. Lint and the first isolated 47-page production export passed; final production coverage follows the CSS correction.

Final result: lint passed; the corrected production export compiled, passed TypeScript and generated all 47 pages. Six production browser tests passed on port 3304 (news/footer, news stories, services, corporate journeys and shared page-band coverage). Local development preview remains on port 3200. The working branch and prior staged/uncommitted page changes were preserved.
