# Sain Motors research-led experience implementation plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation. Track each task here.

**Goal:** Make the bilingual corporate website a polished, useful entry into Sain Motors' eleven brands, ownership services and real locations.

**Architecture:** Keep Next.js static export, typed reviewed content, local responsive assets and server-rendered pages. Add small progressive client components for brand filtering and enquiry routing. Reuse the existing release gate.

**Tech stack:** Next.js 16.4.1, React 19.3.1, TypeScript, CSS, Vitest, Playwright and REA.

**Spec:** User's 2026-10-28 request and docs/research/2026-10-28-reference-review.md. The user explicitly delegates design and implementation decisions and will review content afterwards; execute without an intermediate approval round.

## Global constraints

- Preserve MN/EN parity, eleven approved distributor brands, local imagery, Zona Pro/Inter and Sain red.
- No fabricated prices, inventory, hours, service locations, finance terms or specialist contacts.
- Keep new editorial content draft in the shared content registry. Do not bypass publication approval or deploy.
- No dependency installation, autoplay, background video, fake form delivery, CRM or configurator.
- Work in the user's checkout on feat/research-led-experience; main started clean, all 59 baseline unit tests passed.

## Review focus

- Unknown enquiry URL values fall back safely; valid selection survives refresh, Back and language switching.
- Service enquiries show a confirmed service destination only for the corresponding brand; SOUEAST's support coverage must match its supplied statement.
- Brand filtering works by keyboard and exposes a meaningful empty state; no JavaScript still exposes all brand links.
- 360px mobile, 200% zoom, reduced motion and keyboard focus remain usable without overflow.
- Preview stays noindex; structured data contains no invented commercial facts and serializes safely.

## Tasks

- [x] 1. Record REA evidence and design rationale; apply user-supplied BYD/JETOUR pins and reconcile SOUEAST support. Add and run meaningful content regression tests first.
- [x] 2. Build pure enquiry routing helpers with tests, then bilingual enquiry chooser, direct brand actions and service-to-brand/location links. Preserve URL state.
- [x] 3. Build a photographic, responsive brand catalogue with accessible category/search controls and a complete static fallback. Add descriptive brand links on the homepage.
- [x] 4. Refine homepage, page introductions, contact and service hierarchy with a panoramic company photograph, clear journeys and consistent typography/spacing. Retain brand pages' own supplied photography.
- [x] 5. Add accurate Organization/WebSite/Breadcrumb JSON-LD, verify release/indexing behavior, run lint/types/unit/build/export/E2E, capture mobile/desktop screenshots and lab performance baseline, and perform independent review.

## Execution ledger

- Baseline: clean main; Vitest 6 files / 59 tests passed.
- Ruling: implement inline in the selected Desktop checkout on a feature branch, keeping the user's existing dependencies and preview workflow.
- Ruling: preserve source approval states because the user will audit content after implementation; production readiness is a technical quality target, not permission to mark unreviewed facts approved.
- Ruling: Python CLI unavailable; use ui-ux-pro-max's accessibility, responsive and interaction guidance directly without installing Python.
- Task 1–4 complete: REA captures of the six reference pages plus four follow-up pages; own existing photo derivatives reused; bilingual contact redesign includes native request disclosures.
- Independent review found stale query state on same-route Next navigation. Reproduced RED, fixed through QueryNavigationSync under an isolated Suspense boundary, and verified GREEN on static export. Hydration timing and duplicate E2E selector were corrected without adding arbitrary sleeps.
- Independent follow-up found brand enquiries started above the relevant team. Reproduced missing-anchor unit failure, added the existing enquiry-heading anchor to generated links, and verified actual phone visibility after CTA navigation at 360px and 1440px.
- Final verification: 68/68 unit tests, 32/32 browser tests; lint, TypeScript/build, export and preview HTTP health checks passed. Release preflight correctly blocks 170 unapproved content records; no production upload performed.
- Environment note: Windows runner twice temporarily returned CreateProcessWithLogonW 1909. Work resumed after access recovered; all required final checks were rerun successfully.
- Integration: retain the feature branch and the user's active Desktop checkout for review; no push or merge requested.
