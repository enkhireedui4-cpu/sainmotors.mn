# Sain Motors: one brand across the website

## Brief and authority

The user explicitly asks to execute a site-wide brand consistency task through Superpowers: unify the main menus, pages and sections around red, white and black. Earlier instructions delegate design choices and preserve management copy, curated photographs and both languages. Implement in the existing dirty checkout without deployment or commits.

Source of truth: supplied `sainmotorsWebPhotos/WEB Photos/9. Brand guidline/Brand guidline.docx`: **Color red – E20A17; Font – Zona; logo variants black/red, white/red, white.** The user's more recent system/Inter interface-font preference takes precedence; Zona remains for wordmark/S decoration. Supplied logo artwork is preserved as provided (its SVG red is E11F26).

## Chosen direction

White content areas, black major arrivals/brand sections/footer, official red for primary actions, selected filters, current navigation and short structural accents. Neutral grays have equal RGB channels. Red is purposeful rather than a wash over every surface. Existing photography, sub-brand artwork and maps retain their authentic colors.

Keep the current page compositions and recent news/about redesign. A blanket red background would damage readability; a cosmetic accent-only patch would leave the inconsistent controls and color values. Choose shared tokens plus focused changes to the actual active components.

### Shared contract

`src/app/brand-tokens.css`, imported by globals:

- `--sm-red: #e20a17`, `--sm-red-hover: #ba0813`, `--sm-red-soft: #fff1f2`.
- `--sm-black: #000`, `--sm-ink: #101113`, `--sm-white: #fff`.
- `--sm-surface: #f6f6f6`, `--sm-muted: #626262`, `--sm-line: #dedede`.
- `--sm-on-dark-muted: #c6c6c6`, `--sm-on-dark-line: #ffffff45`.
- `--sm-radius-card: 12px`, `--sm-radius-control: 999px`, `--sm-control-height: 48px`.
- `--sm-gutter: clamp(24px,7.86vw,150px)` and `--sm-section-space: clamp(56px,6vw,112px)`.
- `--sm-title-size: clamp(32px,3.65vw,70px)`; existing Inter/system font stack and photo-specific sizing remain.

Legacy semantic variables (`--red`, `--text`, `--surface`, `--ob-*`, etc.) alias the new tokens. Prefer tokens in touched component CSS. No global forced color filter on photographs or partner logos.

### Components and behavior

- Header: unchanged dimensions and navigation order; red current-page indicator and hover, reliable light/dark official logo treatment. Keep transparent hero header and white scrolled state. Mobile menu uses same active state, focus and red contact action.
- Shared inner-page arrival: black/white, consistent title scale and a short red rule. News article retains its left-aligned typography and receives the same red signature.
- Buttons/chips: primary buttons official red/white with hover; outlined secondary actions use monochrome plus red interaction. Selected filters red/white across news, brands and locations; comfortable tap targets and keyboard focus.
- Homepage: existing hero and selected photo order stay. Strengthen red accents in company/service calls to action, brand links and section details. Normalize tinted black and competing reds.
- About: keep the integrated photo-free motto and four cards. Migrate red and neutrals to tokens, preserving the staggered design and five values.
- Services/brand portfolio: neutral card geometry and red action/signature; maintain actual service routing and brand destinations.
- Locations: retain both maps, filter URL state and mobile map behavior. Use red for selected brand/city/location controls and map action focus; normalize UI neutrals.
- News: retain 11 reports, categories, source date precision and curated photo assignments. Keep the withdrawn reports absent. Red category/card accents and filters; no duplicate News badge in article metadata.
- Contact: official-red submit, selected identity, checkbox and focus; preserve consent, validation and email-draft behavior. Never send a message during verification.
- Footer: black with official logo, a restrained red top signature and consistent red interactions. Preserve all content and links.

## Validation and review

Before/after screenshots on main pages. Both locales at 390/1440, extra 320/768 checks on menus/forms. Verify filters and mobile menu, current route/lang state, no horizontal overflow, image decoding, visible focus and no page errors. Run build/TypeScript, lint, relevant content tests and existing current About/news/footer/dealer/contact checks. Update obsolete visual assertions only when the intentional brand change requires it; do not weaken behavior checks. Keep zero-JS content readable and reduced-motion behavior intact.
