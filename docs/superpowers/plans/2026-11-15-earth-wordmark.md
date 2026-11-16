# Earth film and Sain Motors wordmark motion
Date: 2026-11-15

The user's supplied Earth clip replaces the dimensional red S background. Source: Downloads/4K Planet Earth Spinning in Space _ Free HD Videos - No Copyright_1080p.mp4 (1920x1080, 16.068209s, 3,964,630 bytes). Local copy: public/video/hero/sain-earth.mp4; a native decoded frame supplies the WebP poster.

Design: retain the existing Orbis-inspired composition, dark header, supplied description, company sections and clean Inter supporting typography. Earth is full bleed with dark edge shading. The central wordmark uses existing Zona Pro. Its initial S begins centered, is traced in champagne gold for about 1.3s, fills white and glides into its final left position. AIN MOTORS follows one letter at a time with a controlled lateral reveal; the complete name settles by about 3.5s. Supporting copy appears as part of that single sequence.
User follow-up: like the supplied Jetour screenshot, the header is fixed and transparent on top of the film; it becomes solid white with dark navigation when the film scrolls away. The film now fills the entire viewport beneath the header.

Palette: #030710 midnight, #f7f7f5 ivory white, #d8be87 champagne, #65b9e6 reflected blue, #a9b3c4 muted text.
Layout: existing full-screen hero; the title stays on one line at desktop and phone sizes. No giant S sculpture remains behind the title.

Approach: a self-hosted muted looping video with a real poster, plus SVG text and native CSS animations. This produces the requested individual letter trace/reveal without rasterized lettering or a new motion dependency. Controller pauses media and active animations on user choice, tab hiding or offscreen state, preserves completed intro state, and shows the full wordmark/poster for reduced motion and no-JS.

Execution under the user's explicit local-edit request:
- [x] Add a failing browser assertion for the real clip and ordered S-to-name sequence.
- [x] Implement CinematicHeroScene and CinematicWordmark; wire into HomeOrbitHero and replace old monogram styles.
- [x] Verify actual playback, intro order/completion, pause/resume, reduced motion and phone layout.
- [x] Build final out export, validate it and inspect desktop/mobile screenshots.

Verification: actual 1920x1080 film playback and native duration confirmed; 188 unit tests and 11 focused browser tests passed. Production output generated 47 pages and export validation checked 681 files. Screenshots of the S trace, letter flow, completed desktop title and completed mobile hero are saved in docs/review/earth-intro.

Review: a fresh reviewer identified the no-JS transparent-header contrast problem. A solid no-JS header and hidden inactive pause control were added and verified by a browser test. Header color assertions wait for the intentional 300ms transition.
