# Contact Feedback Implementation Plan

**Goal:** Match the supplied Orbis form composition with Sain content and working email preparation.
**Spec:** `docs/superpowers/specs/2026-11-17-contact-feedback-design.md`

- [x] Inspect retained reference measurements and current phone/email routing; confirm no generic feedback submission backend exists.
- [x] Add meaningful form browser coverage and observe failure before implementation.
- [x] Build responsive intro/form, native audience radio choices, showroom selection, field and consent validation, and an explicitly user-sent email draft.
- [x] Preserve existing brand enquiry query/hash/history journeys and general contact actions.
- [x] Replace obsolete contact photo/disclosure visual assertions with current form/contact coverage.
- [x] Complete lint, production export, final browser verification and independent scoped review.

The email draft stays in component state and is cleared when fields change. There is no fake server success or CAPTCHA. The action is disabled before hydration, with direct email fallback for no-JavaScript visitors. Existing unrelated dirty work is preserved; no commit or deployment requested.

Final verification: lint passed; Next production export compiled with TypeScript and generated 47 pages. All six focused production browser tests passed on port 3305, including MN/EN form checks at 320/390/768/1024/1920, consent and field validation, chosen showroom in the draft, stale-draft clearing, no-JavaScript fallback and existing brand/query/history journeys. Desktop/mobile screenshots inspected in `.tmp-assets/contact-feedback-review/`. Independent review reported no blocking findings; conditional error-description references were cleaned up. Local preview: http://localhost:3200/en/contact/.
