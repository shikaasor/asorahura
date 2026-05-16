# Phase 04: Navigation & Content Polish — Research

**Researched:** 2026-05-16
**Domain:** Next.js navigation, React state management, CSS Modules, content migration
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Navigation design**
- Sticky/fixed header — always visible as the user scrolls
- Mobile: hamburger icon that reveals a dropdown below the nav bar (no slide-in drawer)
- "Get Your AI Audit" CTA in nav: filled white button (white background, dark text) — high contrast against the dark nav
- Text links: Services | Work | Assessment | Blog
- Active state: yes — current page link gets a subtle underline or brighter white text to indicate location

**CTA pairs per page**
- Definition: Buttons + prominent text links (underlined, bold, or standalone — not inline prose links). Nav links and footer links are exempt.
- Homepage: Primary → "Take the Assessment" | Secondary → "Work With Me"
- Services page: Primary → "Work With Me" | Secondary → "Take the Assessment"
- Blog listing (/blog): Email Capture Widget only — no additional CTA button. Discovery page, not a conversion page.
- Blog articles: BlogCTABlock (existing) + EmailCaptureWidget (existing) — already enforced, no change needed
- All other pages: Claude's discretion — enforce the 2-CTA rule, route to natural next step

**Testimonials**
- Real content: Asor will supply actual quotes, names, titles, and headshot images before execution
- Count and placement: 4 total — 1 on Homepage hero, 2 on Services page, 1 on Assessment Results page
- Visual treatment: dark card — circular headshot, quote text in white, name + title in muted grey (#a3a3a3), dark box background (#111111) with subtle border (#1f1f1f)
- Implementation: plan with realistic placeholder data. Asor swaps in real testimonials (quotes + headshots) before running /gsd:execute-phase 04
- Existing testimonials on Engage page should be removed/moved — do not leave duplicates

**Urgency signals**
- Message format: "Currently booking for [Month] — [N] slots remaining" — factual and calm, no manufactured pressure
- Month: auto-computed from current date (JavaScript `new Date().toLocaleString('en-US', { month: 'long' })`)
- Slot count: config variable — lives in a single config file (e.g., `src/config/site.ts` or `src/config/booking.ts`)
- Placement: Services page only
- Visual: inline text near pricing tiers, not a banner or alert box

### Claude's Discretion
- Exact active state implementation (underline thickness, color value, transition)
- Mobile hamburger dropdown styling and animation (open/close transition)
- CTA pair audit for pages not explicitly specified above (Work page, Engage page, Checkout)
- Config file name and structure for slot count
- Typography and spacing within testimonial cards
- Exact position of testimonial on assessment results page (below score, before CTA?)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Primary nav: Services \| Work \| Assessment \| Blog | Navigation.tsx must replace current links (Work, Articles, Flowmorph) with Services, Work, Assessment, Blog |
| NAV-02 | Nav CTA button "Get Your AI Audit" links to /assessment | Replace current "Work with Me" CTA in nav; style as white filled button matching BlogCTABlock/EmailCaptureWidget button |
| NAV-03 | Secondary CTA "Work With Me" in hero, Services page, Work page, About section | Audit current CTAs; HeroSection has "Book a Discovery Call" → replace; work page has "/engage" → redirect to correct page |
| NAV-04 | No Flowmorph branding anywhere on site | Nav link to /flowmorph must be removed; flowmorph page itself is out of scope but nav reference must go |
| NAV-05 | No more than 2 CTAs visible at once on any page | Per-page audit documented below; several pages need surgery |
| NAV-06 | Every page has a primary CTA routing to next step | Verified per page below |
| CONTENT-04 | Remove EU Horizon grant references from all case studies | Two occurrences in src/lib/articles.ts (lines 22, 66) |
| CONTENT-05 | Move testimonials from Engage page to Homepage and Services page | Engage page uses `<Testimonials />` component; Homepage uses `<SocialProof />` which already has testimonials; Services page uses `<Testimonials />` |
| CONTENT-06 | Republish all content with new positioning (executive language, not technical) | Work page case study copy needs review; articles.ts content needs review |
| CONV-03 | Pricing shown transparently (no "contact us" for pricing) | Services page already shows all prices — compliant |
| CONV-04 | Urgency signals real and maintained honestly | New `BookingUrgency` inline component needed on Services page; config file needed |
| CONV-05 | No exit links to social media in conversion flow (only footer) | Social links exist only in Footer.tsx and LinkedInFeed.tsx/YouTubeFeed.tsx — these need checking against conversion pages |
</phase_requirements>

---

## Summary

This phase is primarily codebase surgery and content rewriting — no new external dependencies are needed. All research was conducted against the existing codebase directly (HIGH confidence).

The navigation requires a significant rebuild: the current nav is light-background (rgba(255,255,255,0.9)) with dark text, but the locked decision specifies a dark nav with a white filled CTA. The existing links (Work, Articles, Flowmorph + "Work with Me") all need to change. The nav is a `"use client"` component using `usePathname()` from Next.js navigation — the pattern is already correct, just the content and styling needs updating.

Testimonials currently live in two separate components: `<Testimonials />` (white card design, used on Engage + Services) and `<SocialProof />` (dark card design, used on Homepage). The locked decision mandates a new dark card design (dark bg #111111, border #1f1f1f, circular headshot) that neither existing component matches. A new `TestimonialCard` component should be built to spec and used in all four placement locations. The old `<Testimonials />` component (white light-theme cards) becomes obsolete.

Content changes are surgical: two string replacements in `src/lib/articles.ts` for EU Horizon references, removal of the Flowmorph nav link, and executive-language rewrite of case study prose in `src/app/work/page.tsx` and `src/lib/articles.ts`.

**Primary recommendation:** Build a new `TestimonialCard` component and a new `BookingUrgency` component, refactor `Navigation.tsx` in-place, create `src/config/booking.ts`, then do targeted per-page CTA surgery.

---

## Existing Codebase State (Verified)

### Navigation.tsx — Current State

```
File: src/components/Navigation.tsx
Pattern: "use client" — uses usePathname() from next/navigation
Position: Fixed via navWrapper CSS, z-index 100
Current links: Work | Articles | Flowmorph | "Work with Me" (CTA)
Background: rgba(255, 255, 255, 0.9) — WHITE nav
Active state: CSS class `.active` already exists — changes color to var(--foreground) (dark)
Mobile: No hamburger — links just wrap or overflow
paddinTop on layout: 88px hardcoded in RootLayout div
```

**What must change:**
- Background: white → dark (e.g., `rgba(10, 10, 10, 0.95)` or `#0a0a0a` with blur)
- Links: Work | Articles | Flowmorph → Services | Work | Assessment | Blog
- CTA: "Work with Me" → "Get Your AI Audit" (href /assessment), white filled button style
- Active state: white underline or brighter white text (currently dark — must invert for dark nav)
- Add hamburger menu for mobile

### Per-Page CTA Audit (Verified)

**Homepage (`src/app/page.tsx` + `src/components/home/HeroSection.tsx`)**
- Current: "Take the Free AI Readiness Assessment" (primary) + "Book a Discovery Call" (secondary → /checkout)
- Required: Primary → "Take the Assessment" (/assessment) | Secondary → "Work With Me" (/engage)
- Change: Replace "Book a Discovery Call" with "Work With Me"; link to /engage not /checkout
- SocialProof component (dark testimonial cards) already on homepage — keep

**Services page (`src/app/services/page.tsx`)**
- Current: Assessment callout section has "Take the Assessment →" as a link — that's a third CTA alongside tier CTAs
- The tier cards each have their own CTA buttons (all pointing to /assessment or /checkout)
- The `<Testimonials />` at bottom uses white card design — must replace with new dark card design
- Need `BookingUrgency` inline text near pricing tiers
- CTA audit: Primary → "Work With Me" (button in hero area or above tiers) | Secondary → "Take the Assessment"
- The assessment callout block at the bottom is a third CTA — must be removed or merged

**Blog listing (`src/app/blog/BlogListingClient.tsx`)**
- Current: `<EmailCaptureWidget />` at top of listing — compliant (this is the only CTA)
- No additional buttons present — already correct
- Status: COMPLIANT, no change needed

**Blog articles**
- Already have BlogCTABlock + EmailCaptureWidget per locked decision — no change needed
- Status: COMPLIANT

**Work page (`src/app/work/page.tsx`)**
- Current: Each case study card has "See if we're a fit →" (link to /engage) + bottom section has "Tell Me About Your Problem →" (button to /engage)
- "See if we're a fit →" on each card = multiple CTAs, but they're all the same action — the per-card link likely counts as repeated CTA
- Recommended: Keep the bottom CTA button as primary, remove per-card link or make it inline prose, OR keep per-card as secondary and remove bottom section
- Primary CTA → "Work With Me" (/engage) | Secondary → "Take the Assessment" (/assessment) OR Assessment link from nav

**Engage page (`src/app/engage/page.tsx`)**
- Current: `<Testimonials />` component present — MUST be removed (CONTENT-05)
- The form itself is the CTA — no button duplication
- After removal, verify no other CTAs remain
- The "Submit My Project Brief" form submit button is the only CTA — compliant

**Assessment page (`src/app/assessment/page.tsx`)**
- No extra CTAs visible — the AssessmentShell is the content
- Status: Likely compliant

**Assessment Results (inside `AssessmentShell` — step "results" renders `ResultsScreen`)**
- Current: "Tell Me About Your Problem →" (primary, to /engage) + "Skip to checkout" (secondary, to /checkout)
- These are 2 CTAs — within the 2-CTA rule
- Must add 1 testimonial below score block, before CTA
- The "Skip to checkout" link is a secondary exit — evaluate whether it exits conversion flow

**Checkout page (`src/app/checkout/page.tsx`)**
- Conversion page — no social media links present
- The page itself IS the CTA — form submission
- Status: Likely compliant, no change needed

### Components That Become Obsolete

- `src/components/Testimonials.tsx` — white card design, will be replaced by new dark card component
- The Flowmorph nav link in `Navigation.tsx` — removed

### Flowmorph References to Remove (NAV-04)

| File | Line | Content |
|------|------|---------|
| `src/components/Navigation.tsx` | 12 | `if (pathname === "/flowmorph") return null;` — hide nav on flowmorph page |
| `src/components/Navigation.tsx` | 46-47 | `<Link href="/flowmorph">Flowmorph</Link>` — nav link |

Note: `src/app/flowmorph/page.tsx` itself is NOT in scope for this phase — the requirement is only that the nav link be removed and no Flowmorph branding appears in the navigation.

### EU Horizon References to Remove (CONTENT-04)

| File | Line | Content |
|------|------|---------|
| `src/lib/articles.ts` | 22 | `metrics: "39+ Facilities \| EU HORIZON €2.25M \| Zero Cloud Dependency"` |
| `src/lib/articles.ts` | 66 | Full paragraph about EU HORIZON grant positioning |

**Fix for line 22:** Replace metrics string — remove the EU HORIZON segment: `"39+ Facilities \| Zero Cloud Dependency"`

**Fix for line 66:** Remove the full body paragraph: `"This project is currently being positioned for an EU HORIZON grant of up to €2.25 million under the EDCTP3 Global Health partnership. The call is specifically for AI-driven health innovation in sub-Saharan Africa."` — delete this array element from the body array.

### Social Media Links in Conversion Flow (CONV-05)

Social links exist in:
- `src/components/home/Footer.tsx` — LinkedIn only, inside footer column — COMPLIANT (footer is exempt)
- `src/components/LinkedInFeed.tsx` — links to LinkedIn posts + "View all on LinkedIn" button
- `src/components/YouTubeFeed.tsx` — "Subscribe on YouTube →" link

Check where LinkedInFeed and YouTubeFeed are rendered:
- Neither is imported in any conversion page (checkout, engage, assessment, results) — need to verify homepage usage
- Homepage (`src/app/page.tsx`) does NOT import LinkedInFeed or YouTubeFeed in the current page.tsx
- Status: Likely compliant, but planner should verify these components are not rendered in conversion flow paths

---

## Standard Stack

### Core (already in project — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15+ | App router, Server/Client components | Already in project |
| React | 19+ | UI components | Already in project |
| framer-motion | ^11 | Mobile menu open/close animation | Already used in Navigation.tsx |
| CSS Modules | built-in | Component-scoped styles | Already the project pattern |
| `usePathname` | next/navigation | Active link detection | Already in Navigation.tsx |

### No New Dependencies

This phase requires zero new npm packages. All capability needed:
- Hamburger menu state: React `useState` (already available)
- Dark nav styling: CSS Modules (already available)
- Active link detection: `usePathname` (already imported in Navigation.tsx)
- Urgency signal date: `new Date().toLocaleString()` (vanilla JS)
- Testimonial headshots: Next.js `<Image>` (already in project)

---

## Architecture Patterns

### Recommended Project Structure Changes

```
src/
├── config/
│   └── booking.ts           # NEW — BOOKING_SLOTS constant
├── components/
│   ├── Navigation.tsx        # MODIFY — dark nav, new links, hamburger
│   ├── Navigation.module.css # MODIFY — dark theme, mobile styles
│   ├── shared/
│   │   └── TestimonialCard.tsx     # NEW — dark card with headshot
│   │   └── TestimonialCard.module.css # NEW
│   ├── home/
│   │   └── HeroSection.tsx   # MODIFY — CTA swap
│   └── services/             # NEW dir (or inline in services page)
│       └── BookingUrgency.tsx # NEW — inline urgency text
├── app/
│   ├── services/page.tsx     # MODIFY — CTAs, testimonials, urgency
│   ├── engage/page.tsx       # MODIFY — remove <Testimonials />
│   ├── work/page.tsx         # MODIFY — CTA audit, executive language
│   └── assessment/ (results in AssessmentShell) # MODIFY — add testimonial
└── lib/
    └── articles.ts           # MODIFY — remove EU Horizon refs
```

### Pattern 1: Dark Navigation with Hamburger

The Navigation is a `"use client"` component — hamburger state belongs here via `useState`.

```typescript
// Source: existing Navigation.tsx pattern + standard React
const [menuOpen, setMenuOpen] = useState(false);
```

Mobile dropdown: render links in a div that appears below the nav bar (position absolute, top: 100%, full width) when `menuOpen === true`. Not a slide-in drawer.

The nav background must change from white to dark. The existing `.navWrapper` uses `backdrop-filter: blur(10px)` — keep this for the frosted dark effect.

```css
/* Navigation.module.css — navWrapper change */
.navWrapper {
  background: rgba(10, 10, 10, 0.92);  /* was rgba(255,255,255,0.9) */
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #1f1f1f;    /* was var(--border) which is light */
}

.links a {
  color: #9ca3af;   /* muted white — was var(--muted) which is dark */
}

.links a:hover,
.links a.active {
  color: #ffffff;   /* bright white — was var(--foreground) which is dark */
}

/* Active state — underline for dark nav */
.active {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1.5px;
}

/* Nav CTA — white filled button (matches BlogCTABlock button style) */
.cta {
  background: #ffffff;
  color: #0a0a0a !important;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
}
```

Button shape/size matches BlogCTABlock and EmailCaptureWidget: `borderRadius: '8px'`, `padding: '0.875rem 2rem'`, `fontWeight: 600`, `fontSize: '0.9375rem'`. Planner should verify padding aligns — the nav may want slightly smaller (0.75rem 1.5rem) to fit the nav bar height.

### Pattern 2: Booking Config File

```typescript
// Source: locked decision — simple exported constant
// src/config/booking.ts
export const BOOKING_SLOTS = 2;
```

Usage in BookingUrgency component:
```typescript
import { BOOKING_SLOTS } from '@/config/booking';

export function BookingUrgency() {
  const month = new Date().toLocaleString('en-US', { month: 'long' });
  return (
    <p className={styles.urgency}>
      Currently booking for {month} — {BOOKING_SLOTS} slots remaining
    </p>
  );
}
```

This is a Server Component (no `"use client"` needed — `new Date()` works at render time in Next.js App Router server components).

### Pattern 3: New TestimonialCard Component

The locked decision specifies a dark card design. Neither `<Testimonials />` (white cards) nor `<SocialProof />` (dark cards, but no headshots and different layout) matches the spec.

Build a new `TestimonialCard` that accepts:
```typescript
interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  headshot: string; // image path, e.g. "/images/testimonials/jd.jpg"
}
```

Visual spec from CONTEXT.md:
- Background: `#111111`
- Border: `1px solid #1f1f1f`
- Border radius: `12px` (matches BlogCTABlock)
- Headshot: circular (border-radius: 50%), positioned at top or left of card
- Quote: white text
- Name + title: `#a3a3a3`

Placeholder data for execution (Asor replaces before running):
```typescript
// Placeholder — Asor replaces before /gsd:execute-phase 04
const TESTIMONIALS = [
  {
    quote: "Placeholder quote — Asor to supply.",
    name: "Client Name",
    title: "Title, Company",
    headshot: "/images/testimonials/placeholder.jpg",
  },
  // ... 3 more
];
```

Placement:
- Homepage: 1 testimonial — placed in HeroSection after TrustSignals OR as standalone row after HeroSection but before PainSection
- Services page: 2 testimonials — replace existing `<Testimonials />` section (white cards), use new dark cards
- Assessment Results (ResultsScreen): 1 testimonial — below score block, before CTA

### Pattern 4: CTA Discipline — Assessment callout removal from Services

The Services page currently has an "assessment callout" block at the bottom:
```tsx
<div className={styles.assessmentCallout}>
  <p>Not sure which tier fits? ...</p>
  <Link href="/assessment" className={styles.calloutLink}>Take the Assessment →</Link>
</div>
```

This is a third CTA on the Services page. Remove this block. The 2 CTAs should be:
1. Primary: "Work With Me" — prominent button above or beside the tiers
2. Secondary: "Take the Assessment" — one of the tier card CTAs (the first 3 tiers already link to /assessment)

The Services page tier cards already have CTA buttons. The planner should treat the tier card buttons as inline conversion actions (same as form submit buttons) rather than "page-level CTAs" — otherwise every tier card would count as a CTA. Recommendation: keep tier card buttons as functional, add one "Work With Me" hero-level button, remove the assessment callout block.

### Anti-Patterns to Avoid

- **Don't use a slide-in drawer for mobile menu** — locked decision: dropdown below nav bar only
- **Don't put urgency signal in a banner or alert box** — inline text only, near pricing tiers
- **Don't add a headshot placeholder that uses an external URL** — use a local `/images/` path for easy Asor swap
- **Don't keep the Flowmorph `if (pathname === "/flowmorph") return null;` guard** — this only existed to hide the nav on the Flowmorph page; removing the nav link makes this irrelevant, but the guard itself is harmless if left. Cleaner to remove it.
- **Don't make BookingUrgency a client component** — no interactivity needed; `new Date()` works in server components

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile hamburger animation | Custom CSS keyframe from scratch | framer-motion `AnimatePresence` + `motion.div` | Already in project, handles mount/unmount cleanly |
| Active link detection | Manual pathname comparison logic | `usePathname()` — already in Navigation.tsx | Built-in, already pattern in codebase |
| Month string formatting | Manual month array | `new Date().toLocaleString('en-US', { month: 'long' })` | One liner, locale-aware |
| Next.js Image optimization | `<img>` tags for headshots | `<Image>` from next/image | Already pattern in project, handles sizing/lazy load |

---

## Common Pitfalls

### Pitfall 1: Nav Background Contrast with Page Content

**What goes wrong:** The nav changes from light to dark, but the `paddingTop: "88px"` on the layout div was calibrated for the light nav. Dark nav may have different height.
**Why it happens:** Height depends on padding in `.nav` CSS (currently `1.5rem 2rem` = 48px content + 2x24px padding = ~88px). If nav padding changes, the layout offset breaks.
**How to avoid:** Keep nav padding identical when restyling. If padding changes, update the `paddingTop` value in `src/app/layout.tsx`.
**Warning signs:** Page content visible behind nav, or gap between nav and content.

### Pitfall 2: Dark Nav with Light Page Background Creates Scroll Flash

**What goes wrong:** The homepage has a light background (`#ffffff` with grid pattern). As user scrolls, content slides under the dark nav — potential jarring contrast.
**Why it happens:** The nav uses `backdrop-filter: blur` which blurs whatever's behind it. On a light page, this looks fine. The dark background is applied via the nav's own `background` CSS property — it covers the page content behind it.
**How to avoid:** The `background: rgba(10, 10, 10, 0.92)` is opaque enough to cover page content — this is intentional and correct. No fix needed, but verify visually during execution.

### Pitfall 3: usePathname Causes Full Nav Re-render on Route Change

**What goes wrong:** `usePathname` triggers re-render when route changes. If the mobile menu is open and user navigates, the menu stays open.
**Why it happens:** State doesn't reset between navigations unless explicitly handled.
**How to avoid:** Add `useEffect` that closes the menu when `pathname` changes:
```typescript
useEffect(() => { setMenuOpen(false); }, [pathname]);
```

### Pitfall 4: Testimonial Headshots Break on Missing Image

**What goes wrong:** Placeholder images `"/images/testimonials/placeholder.jpg"` don't exist, causing Next.js Image errors.
**Why it happens:** `<Image>` in Next.js throws on 404 for local images.
**How to avoid:** Either create a simple placeholder image in `/public/images/testimonials/`, or use `width`/`height` with a grey background div as placeholder. Planner should include a task to create the placeholder image file.

### Pitfall 5: Testimonials Component Still Imported After Replacement

**What goes wrong:** Old `<Testimonials />` component remains imported but unused in Services page and Engage page after new dark cards are added.
**Why it happens:** Easy to add new component and forget to remove old import.
**How to avoid:** For each page that currently imports `Testimonials`, explicitly remove the import when adding TestimonialCard. The old `Testimonials.tsx` file itself can remain — but if all usages are removed, it becomes dead code (mention to user, don't delete unless asked).

### Pitfall 6: `"use client"` Contamination on BookingUrgency

**What goes wrong:** If BookingUrgency is placed inside a `"use client"` parent, `new Date()` executes client-side only — this is fine for the urgency signal, but if placed in a server component that then gets forced to client boundary, performance degrades.
**Why it happens:** Next.js App Router: any component that imports a `"use client"` component becomes client-rendered.
**How to avoid:** Keep BookingUrgency as a Server Component. The Services page is currently a Server Component (confirmed by Phase 02 research: Work/Services pages are Server Components). Don't add `"use client"` to BookingUrgency.

### Pitfall 7: CTA Count on Work Page — Per-Card Links

**What goes wrong:** The Work page has "See if we're a fit →" on each case study card (4 cards = 4 links) plus a bottom section button. Treating each card link as a separate CTA would violate the 2-CTA rule.
**Why it happens:** The CTA definition is ambiguous for repeated inline card links.
**How to avoid:** Per the locked decision, "prominent text links (underlined, bold, or standalone)" count. The per-card links are standalone text links on each card — they likely count. Recommended resolution: remove per-card links, keep bottom CTA button (primary: "Work With Me") and add assessment secondary CTA. Planner should make this explicit.

---

## Code Examples

### Hamburger Mobile Menu Pattern

```typescript
// Navigation.tsx — state + effect
const [menuOpen, setMenuOpen] = useState(false);

useEffect(() => {
  setMenuOpen(false);
}, [pathname]);

// Hamburger button (mobile only — hide on desktop via CSS)
<button
  className={styles.hamburger}
  onClick={() => setMenuOpen(prev => !prev)}
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  aria-expanded={menuOpen}
>
  <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
  <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
  <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
</button>

// Mobile dropdown
{menuOpen && (
  <div className={styles.mobileMenu}>
    <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
    <Link href="/work" onClick={() => setMenuOpen(false)}>Work</Link>
    <Link href="/assessment" onClick={() => setMenuOpen(false)}>Assessment</Link>
    <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
    <Link href="/assessment" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
      Get Your AI Audit
    </Link>
  </div>
)}
```

```css
/* CSS — hamburger bars */
.hamburger {
  display: none; /* hidden on desktop */
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 4px;
  background: none;
  border: none;
}

.bar {
  width: 22px;
  height: 2px;
  background: #ffffff;
  border-radius: 2px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

@media (max-width: 768px) {
  .hamburger { display: flex; }
  .links { display: none; } /* hide desktop links on mobile */
}

.mobileMenu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #0a0a0a;
  border-top: 1px solid #1f1f1f;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  gap: 1rem;
}
```

### BookingUrgency Component

```typescript
// src/components/services/BookingUrgency.tsx (Server Component)
import { BOOKING_SLOTS } from '@/config/booking';
import styles from './BookingUrgency.module.css';

export function BookingUrgency() {
  const month = new Date().toLocaleString('en-US', { month: 'long' });
  if (BOOKING_SLOTS <= 0) return null; // don't show if no slots
  return (
    <p className={styles.urgency}>
      Currently booking for {month} — {BOOKING_SLOTS} slot{BOOKING_SLOTS !== 1 ? 's' : ''} remaining
    </p>
  );
}
```

```typescript
// src/config/booking.ts
export const BOOKING_SLOTS = 2;
```

### TestimonialCard Component

```typescript
// src/components/shared/TestimonialCard.tsx
import Image from 'next/image';
import styles from './TestimonialCard.module.css';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  headshot: string;
}

export function TestimonialCard({ quote, name, title, headshot }: TestimonialCardProps) {
  return (
    <div className={styles.card}>
      <Image
        src={headshot}
        alt={name}
        width={48}
        height={48}
        className={styles.headshot}
      />
      <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>
      <div className={styles.attribution}>
        <span className={styles.name}>{name}</span>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
}
```

```css
/* src/components/shared/TestimonialCard.module.css */
.card {
  background: #111111;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.headshot {
  border-radius: 50%;
  object-fit: cover;
}

.quote {
  color: #ffffff;
  font-size: 0.9375rem;
  line-height: 1.6;
  font-style: italic;
}

.attribution {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name {
  color: #a3a3a3;
  font-size: 0.875rem;
  font-weight: 600;
}

.title {
  color: #a3a3a3;
  font-size: 0.8125rem;
}
```

### EU Horizon String Removals

```typescript
// src/lib/articles.ts — line 22 change
// BEFORE:
metrics: "39+ Facilities | EU HORIZON €2.25M | Zero Cloud Dependency",
// AFTER:
metrics: "39+ Facilities | Zero Cloud Dependency",

// src/lib/articles.ts — line 66 change
// BEFORE (full paragraph to remove from body array):
"This project is currently being positioned for an EU HORIZON grant of up to €2.25 million under the EDCTP3 Global Health partnership. The call is specifically for AI-driven health innovation in sub-Saharan Africa.",
// AFTER: delete this array element entirely
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `/flowmorph` nav link + Flowmorph brand | Remove nav link, brand stays on its own page | Phase 04 | Nav is now personal brand only |
| Light white nav | Dark nav | Phase 04 | Consistent dark-theme brand |
| Testimonials component (white cards) | TestimonialCard (dark cards with headshots) | Phase 04 | Trust signals match dark-theme brand |
| "Articles" nav link | "Blog" nav link | Phase 04 | Consistent with /blog route |

---

## Open Questions

1. **Services page CTA structure — which is "primary" on the page**
   - What we know: Tier cards have individual CTA buttons; locked decision says Primary → "Work With Me"
   - What's unclear: Is a "Work With Me" button added to the hero section, or does one of the tier cards become "primary"? Or is a standalone CTA section added above the tier grid?
   - Recommendation: Add a "Work With Me" CTA button prominently in the hero section of the Services page (before the tier grid), keep tier card buttons as tier-specific actions, remove the assessment callout block. This gives: hero primary CTA (Work With Me) + assessment secondary CTA (from one tier card or a small secondary link). Planner should decide exact placement.

2. **Assessment Results testimonial placement within ResultsScreen**
   - What we know: Placed "below score, before CTA" per Claude's discretion
   - What's unclear: ResultsScreen.tsx is rendered inside AssessmentShell which is a client component — TestimonialCard can still be a server component imported into it (Next.js will handle), but the testimonial data will be static (hardcoded in the component or imported from a constant)
   - Recommendation: Add a `RESULTS_TESTIMONIAL` constant directly in `ResultsScreen.tsx` (single testimonial, not an array) for clarity. Place it between the `.opportunities` section and the `.divider`.

3. **SocialProof component on Homepage vs. new TestimonialCard**
   - What we know: SocialProof (dark cards, no headshots) is currently on the homepage; locked decision says 1 testimonial on homepage
   - What's unclear: Does the new dark card testimonial REPLACE SocialProof, or SUPPLEMENT it? Having both would be 3+ testimonial blocks
   - Recommendation: Replace SocialProof with 1 new TestimonialCard placed in or near the hero. The SocialProof section (3 quotes, dark cards) would become redundant once the new 1-testimonial card is placed. Alternatively, keep SocialProof and remove it from home/page.tsx, adding 1 TestimonialCard inline in HeroSection. Planner should decide which approach.

4. **Placeholder headshot image**
   - What we know: TestimonialCard uses `<Image>` which requires valid paths
   - What's unclear: Does `/public/images/testimonials/` exist? (not checked)
   - Recommendation: Planner includes a task to create placeholder image files at the expected paths, or uses a CSS-only grey circle as placeholder until Asor provides real headshots.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — all findings are from reading actual source files
  - `src/components/Navigation.tsx` — current nav implementation
  - `src/components/Navigation.module.css` — current nav styles
  - `src/components/Testimonials.tsx` and `.module.css` — existing testimonial component
  - `src/components/home/SocialProof.tsx` — homepage testimonial component
  - `src/components/blog/BlogCTABlock.tsx` — button style reference
  - `src/components/blog/EmailCaptureWidget.tsx` — button style reference
  - `src/app/page.tsx` — homepage page structure
  - `src/app/services/page.tsx` — services page full content
  - `src/app/engage/page.tsx` — engage page (Testimonials placement)
  - `src/app/work/page.tsx` — work page CTA audit
  - `src/app/assessment/page.tsx` and `/deep/page.tsx` — assessment pages
  - `src/components/assessment/ResultsScreen.tsx` — results page CTA audit
  - `src/app/layout.tsx` — Navigation placement, paddingTop
  - `src/app/globals.css` — design tokens
  - `src/lib/articles.ts` — EU Horizon reference locations
  - `src/components/home/Footer.tsx` — social links audit

### Secondary (MEDIUM confidence)
- Phase 02 prior decisions: Work/Services pages are Server Components — informs BookingUrgency component type

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries, all from existing codebase
- Architecture: HIGH — all patterns derived from actual codebase inspection
- Per-page CTA audit: HIGH — read each page file directly
- Content locations (EU Horizon, Flowmorph): HIGH — grep verified exact line numbers
- Pitfalls: HIGH — derived from codebase patterns and Next.js App Router behavior

**Research date:** 2026-05-16
**Valid until:** 2026-06-16 (stable codebase — no fast-moving dependencies)
