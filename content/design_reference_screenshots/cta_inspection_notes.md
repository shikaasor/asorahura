# CTA inspection notes

URL: https://cta-gules.vercel.app/

## Captured screenshots
- Browser hero snapshot: /home/ubuntu/screenshots/cta-gules_vercel_app_2026-08-11_19-44-56_6790.webp
- Local hero capture: /home/ubuntu/screenshots/cta_capture/section_00_y0.png
- Local Mandate capture: /home/ubuntu/screenshots/cta_capture/section_01_y1100.png
- Local capability capture: /home/ubuntu/screenshots/cta_capture/section_02_y2500.png
- Local VFusion capture: /home/ubuntu/screenshots/cta_capture/section_03_y4300.png
- Local projects capture: /home/ubuntu/screenshots/cta_capture/section_04_y6500.png
- Local later/heritage capture: /home/ubuntu/screenshots/cta_capture/section_05_y9000.png

## Verified visual structure
- The hero is a full-height monochrome, grain-textured photographic panel: a military aircraft carrier/deck image is darkened almost to black, with the white CTA wordmark top-left, sparse uppercase navigation across the top, large condensed sans headline in the lower-left, and a thin horizontal rule plus technical metadata along the bottom.
- The Mandate section switches to a rigorous editorial grid. A narrow left rail carries the section number/title, while the wider right column holds a short paragraph and a four-row data table divided by fine gray rules. Vertical guide lines create a drafting-board / engineering-document feel; a dark photographic panel begins below.
- The page uses generous vertical pacing but dense internal information: large visual sections are followed by compact metadata tables, labels, and standard/certification callouts.

## Computed design tokens
- Fonts: HND (weights 300, 400, 500, 700) for display/body sans; Elios for label/mono typography.
- Colors: --bg #010101; --fg #f1f0ea; --t2 #b0b0a9; --t3 #6c6e6b; --t4 #565654; --line rgba(241,240,234,.13); --line-2 rgba(241,240,234,.26).
- Layout: --mx clamp(24px,6vw,160px); --fmx clamp(14px,2.2vw,46px); nav padding approximately 22px 76.8px at the captured desktop width.
- Motion: primary easing cubic-bezier(.7,0,.2,1). Fixed navigation transitions background, backdrop-filter, border color, and padding over roughly .4–.45s.
- Hero height is 1100px; page body height observed around 14,416px; main begins below the hero at 1100px.

## Personality
- Mission-driven, exacting, cinematic.
- Design language: aerospace/defense documentation translated into a modern editorial interface with monochrome photography, technical labels, measured grid lines, and minimal accent color.

## Additional visual findings from section captures

The capability modules repeat a robust three-zone composition over full-bleed monochrome photography: a narrow numbered/discipline rail at left, a central headline/paragraph/outlined CTA block, and a right-side mono metadata table. Vertical rules anchor the three zones, while the background image is subdued enough that content remains dominant. Headings are large, tightly set, and mostly uppercase; labels and data rows use a small monospaced face with generous tracking.

The VFusion transition introduces a new chapter title on a clean black field after the photographic capability modules. It uses a small all-caps platform descriptor above an oversized white wordmark, preserving the same technical-documentary pacing while giving the product a distinct flagship moment.
