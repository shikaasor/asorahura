# Design Reference Brief

## Scope and capture notes

This brief records a desktop inspection of [Digitz](https://digitz.fr/), [Dragonfly](https://www.dragonfly.xyz/), and [CTA · Mission-critical systems engineering](https://cta-gules.vercel.app/). The accompanying screenshots were captured at a consistent **1280 × 800 desktop viewport** at the hero and at representative scroll positions. Each image is a viewport-height capture chosen to show a meaningful composition rather than a browser-annotated page overview.

The notes distinguish between values read from live CSS or computed styles and values inferred visually. Where a site uses a canvas, video, or generated visual, the observed state is described as an art-direction system rather than as a static image asset.

## Screenshot inventory

| Reference | Screenshot | What it shows |
|---|---|---|
| Digitz | `digitz_hero.png` | Hero, sticky numbered navigation, particle-rendered headline, atmospheric background |
| Digitz | `digitz_sector.png` | Sector / method transition with large photographic panel and serif section framing |
| Digitz | `digitz_method.png` | Circular seven-step process graphic with orbital labels and cyan node accents |
| Dragonfly | `dragonfly_hero.png` | Oversized orange wordmark, black particle field, fixed gallery-like header |
| Dragonfly | `dragonfly_global.png` | Oversized “GLOBAL / SINCE / DAY 1” scroll-linked text state over a point-cloud field |
| Dragonfly | `dragonfly_writing.png` | Writing section, featured editorial cards, filters, and article index |
| Dragonfly | `dragonfly_team.png` | Four-column portrait grid, role hierarchy, fine rules, and low-light photography |
| CTA | `cta_hero.png` | Full-height monochrome aircraft image, oversized mission statement, technical footer metadata |
| CTA | `cta_mandate.png` | Mandate section with left rail, paragraph, four-row specification table, and drafting-grid rules |
| CTA | `cta_capability.png` | Repeating capability module over full-bleed photography with left rail, body, and data table |
| CTA | `cta_vfusion.png` | VFusion flagship chapter transition with a large product wordmark and technical label |

## Cross-site comparison at a glance

| Dimension | Digitz | Dragonfly | CTA |
|---|---|---|---|
| Primary stage | Deep navy editorial canvas | Pure black gallery-like canvas | Black technical-documentary canvas |
| Dominant type contrast | Fraunces serif + Geist sans + JetBrains Mono | FK Roman serif + NON Natural Grotesk + NON Natural Mono | HND sans + Elios mono |
| Main accent | Cyan / turquoise, with restrained ember orange | Saturated red-orange against white and black | Almost no chromatic accent; contrast comes from gray values and white |
| Image language | Abstract particles, smoke, darkened case-study photography | Point-cloud forms, portrait grids, editorial article imagery | Monochrome video and documentary photography from defense, data, and healthcare |
| Structural device | Numbered sections, counters, orbit/process diagrams | Fixed frame, oversized type states, sparse rules, low-density compositions | Engineering grid, left rail, vertical rules, repeated metadata tables |
| Overall feel | Restrained, editorial, technical | Experimental, cerebral, high-contrast | Mission-driven, exacting, cinematic |

# 1. Digitz

**Reference:** [digitz.fr](https://digitz.fr/)

### Layout and grid structure

Digitz uses a wide editorial grid capped by a live token of **1280px maximum width**, with desktop side padding of **56px** and a mobile padding token of **24px**. The header is a persistent horizontal frame: the wordmark sits at the far left, six numbered navigation units occupy the center-left, and a bordered “Prendre contact” action anchors the right.

The page is composed as a long sequence of numbered editorial modules. Each section begins with a small mono index such as `02 Secteurs`, `03 Posture`, or `04 Références`, followed by a large display heading. Headings are often paired with compact counters or metadata at the right edge. Large content fields then alternate between full-bleed photography, interactive lists, large diagrams, and multi-column service grids. The design behaves less like a conventional marketing page and more like a carefully indexed studio archive.

The section rhythm is deliberate: a large heading and small metadata establish the chapter, a generous visual or diagram gives the chapter its center of gravity, and a compact CTA or next-state control closes it. Repeated use of numbered indexes creates continuity across very different content types.

### Typography

| Role | Observed type treatment |
|---|---|
| Display / headline | **Fraunces Variable**, generally light to regular weight; high-contrast editorial serif with italic emphasis on selected words |
| Body and interface copy | **Geist Variable**, a neutral contemporary sans-serif used for paragraphs, buttons, and explanatory text |
| Section labels and metadata | **JetBrains Mono**, uppercase or small-caps-like mono labels with visible tracking |
| Hero scale | Visually approximately 90–115px at the captured desktop width, with a very large first-line serif statement |
| Body scale | Approximately 16–18px with relaxed line-height and short measure |
| Metadata scale | Approximately 10–12px, mono, tracked, and often cyan or muted gray |

The headline/body contrast is a central part of the identity. Fraunces makes the agency feel editorial and authored; Geist keeps the explanatory copy practical; JetBrains Mono frames the page as a system with measurable stages, indexes, and deliverables. Italics are used sparingly to mark the conceptual or strategic phrase in a headline, often with a cyan color shift.

### Color palette

The following tokens were read from the live CSS:

| Token | Hex | Use |
|---|---|---|
| `--c-ink` | `#0a101c` | Deep ink / darkest navy |
| `--c-marine-deep` | `#0d1828` | Primary deep background |
| `--c-marine` | `#141b2b` | Secondary navy field |
| `--c-panel` | `#1b2436` | Elevated panels and surfaces |
| `--c-line` | `#243049` | Rules, borders, grid separators |
| `--c-off` | `#f5f3ee` | Main warm-white text |
| `--c-off-soft` | `#e8e5dd` | Softer white / secondary text |
| `--c-mute` | `#8e97a8` | Muted metadata and labels |
| `--c-cyan` | `#5bc2d8` | Primary brand accent and selected words |
| `--c-cyan-bright` | `#3fe4e4` | Brighter interactive/particle accent |
| `--c-ember` | `#e6886e` | Warm counter-accent, used sparingly |

Color is not used as a decorative rainbow. It establishes a very controlled hierarchy: warm white for the main reading layer, navy-black for the stage, cyan for intelligence/AI/active states, and ember only as a small temperature shift. The hero’s cyan point-cloud word is the most expressive use of color.

### Motion and animation

The hero contains canvas-driven abstract motion: a dark smoky field and a particle-rendered wordform that reads as a live generative layer rather than a static illustration. A small cursor/ring motif appears within the canvas. The site also uses a sector carousel with previous/next controls and changing sector imagery/text, indicating a stateful interaction model rather than a single frozen hero.

The live CSS exposes a compact motion vocabulary: fast `.1s`, default `.2s`, medium `.4s`, overlay `.3s`, and slow `.8s`, with signature cubic-bezier curves including `cubic-bezier(.16, 1, .3, 1)` and `cubic-bezier(.2, .8, .2, 1)`. The feel is controlled and weighty rather than bouncy. Expect hover states to be short and precise, while scroll reveals and diagram transitions take longer and land with a soft editorial ease.

### Spacing and whitespace

Spacing is generous around chapter headings and immersive visuals, but the internal content is dense. The page often leaves a large navy field around a single diagram or large word, then compresses supporting facts into small mono labels and counters. Horizontal rules and short right-edge index rails prevent the whitespace from feeling empty; they make the negative space feel measured and engineered.

### Imagery and graphics style

The visual language combines three modes. First, abstract particle/canvas visuals in the hero and method diagram. Second, full-bleed editorial photography, typically darkened under a navy overlay, such as tourism, spa, or industrial/corporate imagery. Third, system graphics: orbital diagrams, index lists, tabs, counters, and service matrices. The treatment is atmospheric but never glossy; images are subordinated to the framework and text.

### Navigation pattern

The header is sticky and remains visible during scroll. It uses six numbered links—`01 Approche`, `02 IA`, `03+ Expertises`, `04 Réalisations`, `05+ Secteurs`, and `06 Ressources`—plus a bordered contact CTA. The structure is closer to a studio index than a conventional menu. The live CSS includes a `megaPanelIn` animation, so the numbered navigation should be treated as capable of opening a secondary panel or overlay on hover/click. The contact action is visually isolated as the primary conversion point.

### Personality

> **Restrained, editorial, technical.**

Digitz feels like a digital studio that wants to be read as a disciplined engineering partner without giving up art direction. The most transferable idea is the combination of a serious system vocabulary—indexes, rules, counters, method stages—with a warm editorial serif and one expressive generative accent.

# 2. Dragonfly

**Reference:** [dragonfly.xyz](https://www.dragonfly.xyz/)

### Layout and grid structure

Dragonfly is built as a black, full-viewport gallery experience. The hero is approximately **1100px high**, followed by a sparse About block, an oversized text state, a long Writing section, a portrait-led Team section, a very long Portfolio index, Careers, and a pre-footer. The observed live section sequence is:

| Section | Approximate top | Approximate height |
|---|---:|---:|
| Hero | 0px | 1100px |
| About | 1280px | 266px |
| Oversized text state | 1726px | 844px |
| Writing | 2750px | 1717px |
| Team | 4647px | 1878px |
| Portfolio | 6705px | 4047px |
| Careers | 10932px | 1247px |
| Pre-footer | 12359px | 1154px |

A fixed header anchors the entire experience. The top-left and top-right corners carry isolated serif marks, while the center contains a dark rectangular menu control. Small plus signs and corner letters create a persistent poster/frame system. The page is not built around a conventional dense grid above the fold; instead, it alternates between oversized type, long black breathing spaces, and sharply structured content grids when information arrives.

### Typography

| Role | Observed type treatment |
|---|---|
| Display / oversized statements | **FK Roman Standard**, weight 300, uppercase, approximately 90% line-height, strongly negative tracking |
| Sans headings and interface | **NON Natural Grotesk**, regular weight, uppercase for section headings and filters |
| Body copy | FK Roman Standard light, generally 16px on compact copy and 24px on larger editorial paragraphs, with 140% line-height |
| Labels / filters / small metadata | **NON Natural Mono**, about 10px, uppercase, lightly tracked |
| Desktop display range | CSS exposes a fluid display scale from roughly 130px to 280px depending on viewport width |

The typography is more fashion-editorial than corporate. FK Roman carries the ceremonial, almost monumental moments—`GLOBAL / SINCE / DAY 1`—while NON Natural Grotesk handles labels and content navigation. The page deliberately changes perceived depth by allowing giant serif words to blur, fade, or sit behind the particle field.

### Color palette

| Color | Value / confidence | Use |
|---|---|---|
| Black | `#000000` | Body and primary stage; exact from computed styles |
| Near-white | `rgb(242, 242, 242)` / approximately `#f2f2f2` | Main text and serif display; exact from computed styles |
| Red-orange accent | Visually approximately `#ff4a16` | Hero wordmark, active filter, pagination marks; exact literal was not surfaced in the inspectable CSS, so treat this as a working approximation |
| Dark gray | Near-black translucent values | Header, dividers, and card fields |

The palette is intentionally binary. Orange is not a general accent color spread across the page; it appears as a puncture against black and white. The lack of a secondary palette makes motion, blur, and scale carry more of the visual differentiation.

### Motion and animation

The hero uses a high-contrast point-cloud/particle field that reads as a dragonfly or world-like abstract form. The oversized `DRAGONFLY` wordmark sits in front of it. As the user moves down the page, the next state introduces huge words such as `GLOBAL`, `SINCE`, and `DAY 1`; the captured frame shows the lower lines softened and blurred, which strongly suggests a depth/scroll-linked focus treatment rather than a normal static heading.

The visual feel is slow, theatrical, and spatial. It favors opacity changes, blur, position, and scale over springy motion. Article controls use compact orange pagination marks; filters use hard rectangular tabs. Portrait cards and list items appear to reveal or recede with restrained transitions, maintaining the gallery-like seriousness.

### Spacing and whitespace

Dragonfly is the most generous of the three references. Large sections can hold a single word, a particle field, or a small amount of copy across most of a viewport. That emptiness is part of the brand: the black canvas behaves like a gallery wall. When density increases, as in Writing or Team, the page switches to fine rules and compact text clusters so the contrast with the sparse hero remains legible.

### Imagery and graphics style

The signature graphic is the white point-cloud field: a technical, almost astronomical or cartographic visualization made from dots, symbols, and low-opacity traces. Writing adds dark editorial feature imagery, while Team uses portraits treated almost like contact sheets—large, low-light hero crops at the top and smaller thumbnails in the dense grid below. The visual language avoids glossy gradients or commercial stock-photo brightness.

### Navigation pattern

The header is fixed and visually minimal. It frames the page with isolated serif corner marks and a central menu control rather than a conventional visible link list. The extracted page contains navigation destinations for Home, About, Writing, Team, Portfolio, Careers, Contact, Terms, and Disclosures, but the default frame keeps the primary interface compact. The menu should be understood as a focused overlay/drawer pattern, not a persistent multi-column nav bar.

### Personality

> **Experimental, cerebral, high-contrast.**

Dragonfly feels like a venture firm presenting itself as an art-directed research institution. The strongest transferable ideas are the disciplined black stage, enormous serif statements, point-cloud data graphics, and the willingness to let content emerge through scale and focus rather than through conventional cards everywhere.

# 3. CTA · Mission-critical systems engineering

**Reference:** [cta-gules.vercel.app](https://cta-gules.vercel.app/)

### Layout and grid structure

CTA uses a highly legible engineering grid. The hero is a full-height **1100px** frame, after which the page proceeds through a Mandate statement, four capability articles, a VFusion platform chapter, a pipeline explanation, selected projects, heritage, contact, and careers. The body extends to roughly **14,416px** at the captured desktop width.

The central layout token is `--mx: clamp(24px, 6vw, 160px)`, which gives the page broad, controlled outer margins. Internal modules behave like a three-zone grid: a narrow left rail for section number and discipline, a center body for the main heading, paragraph, and CTA, and a right data column for specifications. Fine vertical and horizontal rules create a frame around the content, so the page feels like an aerospace systems document translated into a contemporary website.

### Typography

| Role | Observed type treatment |
|---|---|
| Display and body | **HND**, a clean geometric/industrial sans used across hero headlines, capability headings, and paragraphs |
| Technical labels | **Elios**, used for small uppercase labels, standards, section metadata, and data rows |
| Hero headline | Computed at approximately 107.5px at the captured width, 500 weight, about 99px line-height, with approximately -3.2px tracking |
| Capability headings | Large uppercase sans, tightly set across two or three lines |
| Data values | Small mono-like technical text with visible tracking and low-contrast labels |

The hierarchy is based on width, weight, and contrast rather than a serif/sans pairing. HND makes the mission statements blunt and authoritative; Elios turns standards, dates, and metrics into instrument-panel data.

### Color palette

| Token | Value | Use |
|---|---|---|
| `--bg` | `#010101` | Primary page background |
| `--fg` | `#f1f0ea` | Main warm-white text |
| `--t2` | `#b0b0a9` | Secondary text and supporting copy |
| `--t3` | `#6c6e6b` | Muted labels |
| `--t4` | `#565654` | Very low-contrast metadata |
| `--line` | `rgba(241,240,234,.13)` | Fine grid rules |
| `--line-2` | `rgba(241,240,234,.26)` | Stronger frame edges |

CTA is effectively monochrome. Instead of introducing a colored accent, it creates hierarchy through off-white, several gray levels, image contrast, and line opacity. This is appropriate for an institutional/defense tone: the absence of chromatic decoration is itself a confidence signal.

### Motion and animation

CTA is the most explicit about scroll choreography. The saved page exposes **GSAP**, **ScrollTrigger**, and **Lenis** assets. Hero text is split into lines and animated upward into place; supporting labels and data blocks begin with a downward offset and opacity of zero before revealing. Capability background images move with a small parallax offset, and navigation transitions adjust background, backdrop-filter, border color, and padding over approximately .4–.45 seconds.

Hover interactions use a duplicated text-roll pattern: the label rolls to a second copy, while arrows and framed buttons remain precise. The primary easing token is `cubic-bezier(.7, 0, .2, 1)`, which produces a fast, controlled, slightly cinematic settle. The motion language is not playful; it resembles a guided instrument panel or a mission-control sequence.

### Spacing and whitespace

CTA uses generous vertical modules, but the internal grid is information-dense. The hero gives the mission statement nearly an entire frame. The Mandate block then compresses into a left rail, a paragraph, and four short specification rows. Each capability repeats this pattern over a large image, creating a dependable rhythm that supports scanning and comparison.

The whitespace is therefore **structured rather than atmospheric**. Rules, corner marks, and vertical rails occupy the empty field. The page breathes through large image modules and tall section frames, not through unbounded blank canvas.

### Imagery and graphics style

The hero uses a darkened, grain-textured video/poster of a military aircraft on a carrier deck. Later modules use monochrome or near-monochrome photography of an ICU monitor, enterprise data center, electronic-warfare manufacturing, a security operations center, and a Growler aircraft launch. The imagery is documentary and mission-specific; it never reads as lifestyle photography.

The graphic language adds faint scanlines/grain, technical labels, square/corner marks, and precise rules. The visual assets are not ornamental: each one reinforces the domain being described and carries the emotional weight that the very minimal color system intentionally avoids.

### Navigation pattern

The navigation is fixed at the top and contains the CTA logo at left, About / Capabilities / Projects in the center, and Contact plus a `Company +` control at right. The `Company` control is a likely mega-menu trigger. The live transition definitions indicate that the nav changes background, backdrop filter, border, and padding as the page state changes, so the header should be implemented as a responsive stateful frame rather than a static overlay.

### Personality

> **Mission-driven, exacting, cinematic.**

CTA feels like a defense contractor or advanced systems laboratory that has adopted modern editorial web design without softening its institutional seriousness. The strongest transferable ideas are the left-rail/grid/table composition, monochrome documentary imagery, and scroll reveals that feel like a system booting or a dossier being disclosed.

# Handoff synthesis for another AI

If the goal is to create a new design that learns from all three references without copying any one of them, combine the following principles. Start with a dark, nearly black stage and a fixed, minimal header. Use a clear editorial display face for the few highest-value statements, a neutral sans for explanation, and a mono face for indexes, standards, and data. Give every major section a visible index or chapter marker so the scroll feels like navigation through a system rather than an endless landing page.

Use full-bleed, heavily graded imagery only when it carries domain meaning. Pair each image with a structured overlay: a left rail, a short explanatory block, and a compact metadata table or specification list. Reserve the brightest accent for one intelligent generative or diagrammatic layer—particle field, orbital path, technical network, or other data-like visual—rather than distributing bright color throughout the interface.

Motion should be slow enough to feel intentional and fast enough to preserve orientation. Favor line-by-line reveal, opacity/blur focus, subtle image parallax, text-roll hover states, and fixed-header transitions. Avoid elastic springs, noisy micro-interactions, and gratuitous 3D. The resulting personality should land between **editorial intelligence**, **technical authority**, and **cinematic restraint**.

## Reference links

[1]: https://digitz.fr/
[2]: https://www.dragonfly.xyz/
[3]: https://cta-gules.vercel.app/
