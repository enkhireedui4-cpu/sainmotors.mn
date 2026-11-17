# About background film

Source: user-provided `Downloads/HONGQI showroom grand opening in Mongolia_1080p.mp4` (93.48 seconds, 1920×1080). No audio retained. Do not publish the original recording here.

Edit: 1.70–6.45s facade and entrance; 7.05–8.80s grille; 50.25–53.25s unveiled front; 55.15–56.55s rear lamp; 59.15–61.35s cabin; 78.40–80.65s front detail. Short dips between shots; no speeches, stage performance or closing title. The source's encoded letterbox bars are cropped (y=196, height=686); preserve aspect ratio with separate center crops for landscape 1280×720 and portrait 540×960. Matching posters use the exterior at 3s.

Rebuild: `node scripts/build-about-film.mjs "C:/path/to/source.mp4"`. Uses installed Chrome and browser-native H.264 encoding; no external encoder or runtime dependency. MP4s and WebP posters are static, same-origin public assets. Reduced-motion, save-data, no-JS and load failure use the poster.
