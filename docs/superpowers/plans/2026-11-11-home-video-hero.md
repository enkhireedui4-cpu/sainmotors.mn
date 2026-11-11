# Homepage video hero

Goal: Replace only the homepage's split text/photo introduction with the supplied, edge-to-edge responsive video. Keep the header and all sections below the brand heading unchanged.

User requirements:
- No visible copy, image carousel controls or counters inside the hero. The requested single down-arrow link sits in its bottom-right corner and scrolls away with the hero. It first reveals the red company claim and moving logo row, pauses there for 1.2s, then continues to `#home-brand-showcase` (the car studio headed “Таны сонголт. Таны брэнд”).
- Desktop and phone use their corresponding `sain-motors-hero-*.mp4` files.
- Skip the first second on first playback and every repeat; never reveal the excluded opening frame.
- Remove exactly [19.00s, 21.00s) from both website video files, retaining the originals. Play the edited clip, then hold the selected nighttime lineup frame at 38.00s for three visible seconds before repeating. Click/tap/Enter/Space during the hold immediately restarts at one second. Suspend playback and the remaining hold delay after any ordinary scrolling that hides the video, including behind the sticky header, or in a hidden tab.
- Rename the heading above the moving logos to `11 брэндийн албан ёсны дистрибьютор`; localize the same meaning in English and use the existing SAIN red token.
- Retain all eleven logo links, the brand showcase, company/service/news sections, header and footer.

Implementation:
1. Replace obsolete photo-hero browser tests with video behavior tests and observe failures on the old preview.
2. Add a focused `HomeVideoHero` client component and scoped CSS. Use one video with responsive source selection, a responsive poster captured after one second, muted inline playback, reveal only after the initial seek, and explicit repeat from one second after the selected frame hold.
3. Fit the hero to `100svh - var(--header-h)` with `object-fit: cover`, preserving the existing header. Keep a screen-reader-only H1. The down arrow uses a 650ms eased scroll to the brand row, 1200ms dwell, then a 650ms scroll to the car studio. Wheel, touch and scroll keys cancel both the motion and pending dwell. Arrival clears the sticky header and moves keyboard focus to the studio heading. Reduced motion goes directly to the studio without animation. Video visibility excludes the sticky header and updates when its height changes.
4. Respect reduced motion, pause out of view/hidden tabs, and allow click/tap and keyboard pause/resume without visible controls, as requested.
5. Integrate the component in `src/app/[lang]/page.tsx`; update the two localized brand headings in `src/content/corporate.ts` and scope the existing red token to that heading in `brand-marquee.css`.
6. Run unit tests, lint, typecheck and a static production build. Verify both languages, playback, repeat, viewport/source changes, posters and unchanged lower sections; save desktop/mobile screenshots.

Media: originals are in `C:/Users/user/Documents/Codex/2026-11-11/new-chat-2/` and remain untouched. The website copies are frame-accurately re-encoded after removing source frames 475–524 ([19s,21s)): 1024 frames at 25fps, 40.96s, silent H.264 and faststart MP4. Original dimensions remain 1152×648 desktop and 396×704 mobile. Posters remain at source 1.05s, before the edit. Independent decode and paired-image checks confirm new 19.00s = original 21.00s and new 38.00s = original 40.00s.

Verification uses a separate static output directory if existing previews hold build artifacts. Publish the reviewed commit to `origin/main` at the user's explicit request. Release/indexing settings remain unchanged.

Verification completed:
- Normal production build exports all 47 pages. Lint and TypeScript checks pass.
- 94 unit tests and 25 focused browser tests pass against the final static preview on port 3300, using the edited 40.96s videos and 38.00s held frame.
- Chrome verifies both languages, 360–1440px hero layouts, the 767/768px source boundary, initial playback, the three-second hold and repeated playback from one second, immediate restart from the held frame, pause/resume, reduced motion, smooth arrow navigation and the existing lower sections. Desktop/mobile screenshots are in `docs/review/home-video-hero/`.
- The local preview server now sends MP4 byte ranges and content lengths so browser seeking works. A host that cannot seek keeps the poster after two attempts instead of repeatedly seeking at zero.
- Safari and physical devices were not tested. Original source files are unchanged; website copies contain the requested two-second cut.
