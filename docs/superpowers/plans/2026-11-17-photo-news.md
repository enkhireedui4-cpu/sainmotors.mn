# Photo news implementation plan

Goal: reproduce the observed Orbis news journey with Sain Motors' supplied bilingual stories and real photos.

Spec: `docs/design/orbis-news/DESIGN.md`. Stack: existing Next.js static export, typed content and responsive Picture assets. Work in the existing dirty checkout and preserve earlier changes.

- [x] Import selected festival and BYD photos through the existing image pipeline; attach provenance and bilingual alt text.
- [x] Add a shared article model with honest date precision and consolidate Word topics into distinct articles.
- [x] Adapt existing news cards, category filtering, detail routes and sitemap to the combined article catalogue. Preserve published event URLs and films; withdraw MTD7 and MTD8 as subsequently requested.
- [x] Implement the observed black introduction, left-aligned title/date/cover, white illustrated story and related-news section using the existing typeface.
- [x] Verify every published article in both languages, categories, dates, images, navigation, mobile/desktop overflow and the festival film. Run relevant unit checks, lint, typecheck and production export; inspect screenshots. Final result: 11 published stories; 194 unit tests, category/footer browser test and 44 article viewport checks pass. Withdrawn MTD7/MTD8 paths return 404 in both languages.

Review focus: missing dates must stay missing; duplicated topics must not become duplicate articles; BYD and festival photos must stay with the correct event; retained event URLs must work and explicitly withdrawn URLs must not remain in the export; the article must remain readable without JavaScript.
