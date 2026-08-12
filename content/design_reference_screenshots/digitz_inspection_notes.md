# Digitz inspection notes

URL: https://digitz.fr/

## Captured screenshots
- Hero viewport: /home/ubuntu/screenshots/digitz_fr_2026-08-11_19-34-40_2447.webp
- Sector/method transition: /home/ubuntu/screenshots/digitz_fr_2026-08-11_19-37-25_2630.webp
- Method circle/references transition: /home/ubuntu/screenshots/digitz_fr_2026-08-11_19-37-31_1637.webp

## Visible structure
- Sticky dark header; logo at left, numbered nav items (01 Approche, 02 IA, 03+ Expertises, 04 Réalisations, 05+ Secteurs, 06 Ressources), outlined contact CTA at right.
- Hero: deep navy background, blurred smoky/particle-like abstract visual with large editorial serif headline "Agence digitale" and cyan particle-rendered word "augmentée"; short sans-serif body copy and two outlined CTAs.
- Section rhythm: numbered section labels, large serif headings with italic/cyan emphasis, compact metadata counters on the right, followed by full-bleed media or large process graphics.
- Sector section: immersive photographic panel with dark overlay; large serif title and small italic subline positioned over the image.
- Method section: generous dark canvas with a large thin cyan orbital circle, seven step labels arranged around it, centered three-line serif statement.

## Computed design tokens
- Display: Fraunces Variable; body: Geist Variable; mono/labels: JetBrains Mono.
- Colors: --c-cyan #5bc2d8; --c-cyan-bright #3fe4e4; --c-ember #e6886e; --c-ink #0a101c; --c-line #243049; --c-marine #141b2b; --c-marine-deep #0d1828; --c-mute #8e97a8; --c-off #f5f3ee; --c-off-soft #e8e5dd; --c-panel #1b2436.
- Layout tokens: max width 1280px; desktop padding 56px; mobile padding 24px.
- Motion tokens: .1s fast, .2s default, .4s medium, .8s slow; signature easings cubic-bezier(.16,1,.3,1), cubic-bezier(.2,.8,.2,1), cubic-bezier(.6,0,.4,1), cubic-bezier(.7,0,.3,1).
- Header is sticky with background/border transitions; page uses canvases for hero/graphics and likely scroll/hover-driven visual states.

## Personality
- Restrained, editorial, technical.
- Design language: dark, precise, confident, with a measured art-direction layer rather than decorative excess.

## Content cues
- Key headings: "Quatre verticales, un socle.", "La méthode tourne. Toujours.", "Sortis des ateliers.", "Une couche, cinq offres.", "Sept expertises, un fil.", "Lab, cas, méthode.", "Un projet ? Parlons-en."
- Strong use of numbered indexing and operational language to signal rigor and process.

## Screenshot note
- The page was captured at desktop viewport approximately 877x768; the site’s cookie banner was hidden locally for cleaner visual evidence without changing saved preferences.

## Additional visual findings from clean captures

The clean hero capture confirms a desktop layout with a 56px-ish left/right content margin, a six-item numbered navigation anchored at the top, and a large editorial headline block occupying the left half of an atmospheric dark canvas. The word "augmentée" is rendered as a cyan particle/point cloud beneath the Fraunces headline, with a short sans-serif paragraph and two outlined actions beneath it. The section boundary is marked by a thin rule and a small vertical index on the far right.

The clean method capture confirms a large circular orbit diagram centered in a sparse navy field. Seven serif stage labels sit around the perimeter, each connected by a fine cyan line and small node; the centered copy is set in a large serif with the final "IA" accented in cyan. The sticky header remains visible and keeps the composition anchored as the user scrolls.
