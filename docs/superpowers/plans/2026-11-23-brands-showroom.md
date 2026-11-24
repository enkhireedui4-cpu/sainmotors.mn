# Brands Showroom Implementation Plan

> Use `superpowers:executing-plans` to implement and verify each task in this checkout.

**Goal**  
Restore the bilingual Brands menu item and make the Brands directory a photo-led showroom.

**Architecture**  
Reuse the shared header route list, bilingual registry, responsive image component, catalogue filters and existing brand destinations. Link the remaining brands to their filtered dealer network results.

**Tech stack**  
Next.js App Router, React, TypeScript, CSS, Vitest and Playwright.

**Approved design**  
A compact black title beside a real showroom photo, eleven white photo cards in a three-column desktop grid and one-column phone layout, a compact search and filter row, and a homepage link under the brand logos.

## Tasks

- [x] Update navigation coverage first. Insert `brands` between `about` and `locations` in the shared header list. Verify both localized menus and the active page indicator.
- [x] Check the expected card destinations against the rendered directory. Update the directory and home link using existing photos, logos and bilingual content. Verify external websites, the RELY page and the filtered dealer links.
- [x] Refine the banner, cards and filter layout using the shared Sain Motors palette. Review the design at desktop, tablet and phone widths. Check horizontal overflow, keyboard access, filtering, asset decoding, and both locales.
- [x] Run the unit suite, type check and targeted lint. Leave the updated site running on localhost for review.

Use the requested Desktop checkout and preserve unrelated work. The preview is local.
