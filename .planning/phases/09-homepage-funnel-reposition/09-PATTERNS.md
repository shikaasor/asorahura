# Phase 9: Homepage & Funnel Reposition - Pattern Map

**Mapped:** 2026-08-11
**Files analyzed:** 8 new/modified files
**Analogs found:** 8 / 8 (exact matches — all files exist in codebase)

## File Classification

| File | Role | Data Flow | Closest Analog | Match Quality |
|------|------|-----------|----------------|---------------|
| `src/components/home/HeroSection.tsx` | component | render-time | `src/components/home/HeroSection.tsx` (existing) | exact |
| `src/components/home/PainSection.tsx` | component | render-time | `src/components/home/PainSection.tsx` (existing) | exact |
| `src/components/home/ServicesPreview.tsx` | component | render-time | `src/components/home/ServicesPreview.tsx` (existing) | exact |
| `src/components/home/SocialProof.tsx` | component | render-time | `src/components/home/SocialProof.tsx` (existing) | exact |
| `src/components/home/Footer.tsx` | component | render-time | `src/components/home/Footer.tsx` (existing) | exact |
| `src/components/Navigation.tsx` | component | render-time (client) | `src/components/Navigation.tsx` (existing) | exact |
| `src/app/layout.tsx` | config | server-side metadata | `src/app/layout.tsx` (existing) | exact |
| `src/app/engage/page.tsx` | page | request-response (form) | `src/app/engage/page.tsx` (existing) | exact |

## Pattern Assignments

### `src/components/home/HeroSection.tsx` (component, render-time)

**Analog:** `src/components/home/HeroSection.tsx` (lines 1-52)

**Imports pattern** (lines 1-7):
```typescript
import Link from "next/link";
import Image from "next/image";
import TrustSignals from "@/components/shared/TrustSignals";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import styles from "./HeroSection.module.css";
import testimonials from "@/content/testimonials.json";
```

**Structure pattern** (lines 11-51):
- Default export functional component
- Section wrapper with className from styles
- Container + grid layout (2-column: copy + image)
- Left column: eyebrow (`<p>`), headline (`<h1>`), subheading (`<p>`), actions div, trust signals, testimonial card
- Right column: Next.js Image with priority flag
- Single primary CTA link inside actions div

**Key mutations for Phase 9:**
- Change eyebrow text from "AI Systems Consultant" → positioning statement ("Automations that work like your best hire")
- Change h1 text to income-framed headline ("Small automations that make measurable money.")
- Change subheading to creator-focused value prop (not time-management pain)
- Change CTA href from "/assessment" → "/automate" and label from "Start Your Free AI Opportunity Discovery" → "See Automations"
- Remove secondary button (line 29-31: "Work With Me" link to /engage)
- Keep TrustSignals and TestimonialCard unchanged

**CSS token usage** (see HeroSection.module.css):
- Section: `padding: 8rem 0 7rem; background: var(--surface-1);`
- Grid: `gap: 5rem;` and responsive breakpoints
- Copy: flex column layout
- primaryBtn: should use `--accent` token for background (existing pattern)

---

### `src/components/home/PainSection.tsx` (component, render-time)

**Analog:** `src/components/home/PainSection.tsx` (lines 1-48)

**Imports pattern** (lines 1-2):
```typescript
import { Scale, Landmark, Building2, HardHat } from "lucide-react";
import styles from "./PainSection.module.css";
```

**Structure pattern** (lines 4-48):
- Data array of objects: `{ icon, title, body }`
- Section with heading + subheading
- Grid of mapped cards (each: icon div, card title h3, card body p)
- No links in current version (pain cards only)

**Key mutations for Phase 9:**
- Replace all card data: remove Law/Finance/RealEstate/Construction (regulated verticals)
- Add creator/coach pain cards (4 new cards from 09-RESEARCH.md Code Examples):
  1. "Growing followers, not income" (no icon needed, or use lucide TrendingUp)
  2. "Your time is your bottleneck" (lucide Clock or AlertCircle)
  3. "The systems exist, but they don't talk" (lucide Zap or Link2)
  4. "One automation = time + money back" (lucide DollarSign or BarChart3)
- Add escape-hatch link after grid: `<p className={styles.cta}><Link href="/enterprise">Working in a regulated industry? →</Link></p>` (using --ink-2 underline, not accent)

**Icon selection (lucide-react 0.290+):**
- Trending/growth: TrendingUp or BarChart3
- Time/urgency: Clock or AlertCircle
- Connection/integration: Link2 or Zap
- Money: DollarSign or PiggyBank

**CSS token usage:**
- Section: `background: var(--surface-1);`
- Cards: grid layout, card styling
- Title: `--fontWeight-bold`, `--fontSize-5` or `--fontSize-6`

---

### `src/components/home/ServicesPreview.tsx` (component, render-time)

**Analog:** `src/components/home/ServicesPreview.tsx` (lines 1-65)

**Imports pattern** (lines 1-2):
```typescript
import Link from "next/link";
import styles from "./ServicesPreview.module.css";
```

**Structure pattern** (lines 4-65):
- Data array: `services` with `{ title, description, price, href }`
- Section with heading + subheading
- Grid of mapped cards (cardTop div with title/description, cardBottom with price + link)
- Optional sector strip (in current version)

**Key mutations for Phase 9:**
- Replace services array with ladder data (2 rungs from 09-RESEARCH.md Code Examples):
  1. Instagram Lead Automation: entry "Free (DIY) or $500 (Done For You)", cta "Get Started", href "/automate/instagram", tier: 1
  2. The Next Four: entry "Coming soon", cta "Join Waitlist", href "/automate", tier: 2
- Update heading to "The Automation Ladder"
- Update subheading to "Start with one. Earn with it. Scale to five."
- Add tier badge per card (e.g., `<div className={styles.tier}>Rung {tier}</div>`)
- Rung 1 card should have featured styling (accent border or badge) — use `styles.featured` class
- Rung 2 card should have empty/coming-soon styling — use `styles.coming` class
- Remove sector strip entirely (not part of creator positioning)

**CSS token usage:**
- Accent reserved for Rung 1 featured card only (border or badge background: `--accent`)
- Coming-soon cards: neutral styling, no accent
- Price text: `--fontSize-4` or similar
- "Join Waitlist" link: `--ink-2` underline, not accent fill

---

### `src/components/home/SocialProof.tsx` (component, render-time)

**Analog:** `src/components/home/SocialProof.tsx` (lines 1-43)

**Imports pattern** (lines 1-1):
```typescript
import styles from "./SocialProof.module.css";
import testimonials from "@/content/testimonials.json";
```

**Structure pattern** (lines 3-43):
- Hardcoded testimonials array (current: anonymized T.N., R.O., P.J.)
- Section with heading + subheading
- Grid of mapped blockquote cards
- Each card: quote + footer with attribution (name + role, no headshot currently)

**Key mutations for Phase 9:**
- REMOVE hardcoded testimonials array entirely
- Import testimonials from JSON: `import testimonials from "@/content/testimonials.json";`
- Create proofItems array pulling from JSON: 
  ```typescript
  const proofItems = [
    testimonials.services[0],  // Pawel Janas (Lloyd's List)
    testimonials.services[1],  // Aamna Mansoor (image restoration)
    testimonials.hero,         // Maria Rios (archival digitization)
  ];
  ```
- Map over proofItems instead of hardcoded array
- Change card structure to include headshot image if available:
  ```typescript
  <blockquote key={t.name} className={styles.card}>
    <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
    <footer className={styles.attribution}>
      {t.headshot && (
        <img src={t.headshot} alt={t.name} className={styles.headshot} />
      )}
      <div>
        <strong>{t.name}</strong>
        <span className={styles.role}>{t.title}</span>
      </div>
    </footer>
  </blockquote>
  ```
- Add escape-hatch link after grid: `<p className={styles.enterpriseNote}><Link href="/enterprise">Looking for enterprise case studies? →</Link></p>` (using --ink-2 underline)
- Ensure no anonymized names (T.N., R.O., P.J.) remain in component code

**Testimonial selection note:**
- Current testimonials in testimonials.json are enterprise-focused (archival, hiring, maritime, deep learning), not creator/coach
- Phase 9 MVP uses existing testimonials with note in footer that creator/coach testimonials are coming
- Real creator testimonials to be collected post-Product #1 launch (flagged in 09-RESEARCH.md Pitfall 2)

**CSS token usage:**
- Quote text: `--fontSize-2` or similar
- Attribution: name bold, title regular with role styling
- Headshot img: small square (e.g., 48x48px)

---

### `src/components/home/Footer.tsx` (component, render-time)

**Analog:** `src/components/home/Footer.tsx` (lines 1-61)

**Imports pattern** (lines 1-3):
```typescript
import Link from "next/link";
import { Linkedin } from "lucide-react";
import styles from "./Footer.module.css";
```

**Structure pattern** (lines 5-61):
- Footer element with container
- Grid with: brand (logo + tagline), nav columns (links), legal + social
- Brand column: logo text, tagline paragraph
- Multiple nav columns: labels + link lists
- Bottom section: copyright text

**Key mutations for Phase 9:**
- Update tagline (brand column, line 13-15):
  - FROM: "Scale your business without scaling your payroll."
  - TO: "Automations that work like your best hire — reliable, consistent, and yours to keep." (positioning statement)
  - This must match hero eyebrow text exactly (or as substring) for automated verification
- Reorganize nav columns per 09-UI-SPEC.md § Component-Level Notes:
  1. "Creator Path" column: Home (/), Automations (/automate), Learn (/blog), Discovery (/assessment)
  2. "Enterprise" column: Enterprise Solutions (/enterprise), Intake Form (/engage), Case Studies (/work)
  3. "Legal" column: Privacy, Terms, Refund (unchanged)
- Remove or deprecate the current "Navigation" column structure
- Keep LinkedIn social link (or add to legal column)

**CSS token usage:**
- Tagline: `--ink-2` color, body font size
- Nav links: `--ink-2` color, body font size, no underline by default
- Brand logo: bold heading style

---

### `src/components/Navigation.tsx` (component, client-side render-time)

**Analog:** `src/components/Navigation.tsx` (lines 1-84)

**Client boundary marker** (line 1):
```typescript
"use client";
```

**Imports pattern** (lines 1-7):
```typescript
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
```

**Structure pattern** (lines 9-84):
- useState for menuOpen state
- usePathname() for active link detection
- Conditional render: return null if pathname starts with "/internal" or "/automate"
- navWrapper with nav element
- Logo link to home
- Links div with multiple Link components (active class if pathname matches)
- CTA link with styles.cta class
- Hamburger button toggle
- Conditional mobile menu with Link components

**Key mutations for Phase 9:**
- Add new nav link: `/services` with label "Pricing" (per 09-UI-SPEC.md § Copywriting Contract)
  - Place before or after "/blog", around line 48
  - Apply same active state logic: `className={pathname === "/services" ? styles.active : ""}`
- Update primary CTA (line 54-56):
  - FROM: href="/assessment", label "Start AI Opportunity Discovery"
  - TO: href="/automate", label "See Automations"
  - Keep styles.cta class
- Add same CTA update to mobile menu (line 79)
- Keep all other nav links and hamburger logic unchanged

**Pattern note:** This component already uses client-side routing with Next.js Link and pathname detection. No new patterns introduced, only CTA + Pricing link updates.

**CSS token usage:**
- `.cta` class should use accent token for button styling (existing pattern)
- Active link state: typically underline or color change

---

### `src/app/layout.tsx` (config/metadata, server-side)

**Analog:** `src/app/layout.tsx` (lines 1-71)

**Imports pattern** (lines 1-8):
```typescript
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ParticleWave from "@/components/ParticleWave";
import Footer from "@/components/home/Footer";
import RouteChrome from "@/components/RouteChrome";
import NavOffset from "@/components/NavOffset";
```

**Font setup** (lines 10-10):
```typescript
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

**Viewport export** (lines 12-16):
```typescript
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};
```

**Metadata export** (lines 18-41):
```typescript
export const metadata: Metadata = {
    metadataBase: new URL("https://asorahura.vercel.app"),  // ← CHANGE THIS
    title: "Asor Ahura | AI Automation Authority",          // ← CHANGE THIS
    description: "Transforming Work into Flow. AI-powered automation systems that eliminate operational drag.",  // ← CHANGE THIS
    openGraph: {
        title: "Asor Ahura | AI Automation Authority",      // ← CHANGE THIS
        description: "Transforming Work into Flow. AI-powered automation systems that eliminate operational drag.",  // ← CHANGE THIS
        images: [
            {
                url: "/banner1.png",
                width: 1000,
                height: 400,
                alt: "Asor Ahura Banner",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/banner1.png"],
    },
    icons: {
        icon: "/logo.png",
    },
};
```

**Key mutations for Phase 9:**
- Change metadataBase (line 19):
  - FROM: `new URL("https://asorahura.vercel.app")`
  - TO: `new URL("https://asorahura.com")` (or confirmed production domain)
  - **Critical:** Verify production domain is live and DNS-pointed before merge (09-RESEARCH.md Pitfall 4)
- Update title (line 20 + openGraph line 23):
  - FROM: "Asor Ahura | AI Automation Authority"
  - TO: "Grow Your Income Through Automation | Asor Ahura" (includes positioning statement)
- Update description (line 21 + openGraph line 24):
  - FROM: "Transforming Work into Flow. AI-powered automation systems that eliminate operational drag."
  - TO: "Automations that work like your best hire — reliable, consistent, and yours to keep. Start with Instagram leads, scale to five offerings." (includes positioning statement + product ladder info)
- Alt text (line 29): can stay or be updated to match new positioning
- Keep viewport, font setup, openGraph images, twitter card, and layout structure unchanged

**Pattern note:** Metadata in Next.js is inherited by all pages. Changes here apply globally unless overridden by individual page metadata exports. Single metadataBase change ensures OG previews use production domain.

---

### `src/app/engage/page.tsx` (page, client-side form, request-response)

**Analog:** `src/app/engage/page.tsx` (lines 1-163)

**Client boundary marker** (line 1):
```typescript
"use client";
```

**Imports pattern** (lines 3-6):
```typescript
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitInquiry } from "./actions";
import styles from "./engage.module.css";
```

**Inner component structure** (lines 7-155):
- EngageFormInner functional component
- useSearchParams() to read query params (score, tier, enterprise)
- useState for form status and message
- async handleSubmit with server action `submitInquiry`
- Form JSX with:
  - Header section (eyebrow, headline, subhead)
  - Form wrapper
  - Success message conditional render
  - Form element with multiple input groups:
    - Text inputs (name, email, company, role)
    - Select dropdowns (serviceInterest, companySize, operationalVolume, timeline, budget)
    - Textarea (challenge, context)
    - Hidden inputs (score, enterprise)
    - Submit button with loading state
  - Error message conditional render

**Key mutations for Phase 9:**
- Update eyebrow text (line 35):
  - FROM: `{isEnterprise ? "Enterprise Discovery Brief" : "Discovery Brief"}`
  - TO: Keep this structure but ensure enterprise path is more prominent
  - Consider: Always show "Enterprise Discovery Brief" for Phase 9 since SMB should not reach this page (per 09-RESEARCH.md Pitfall 1)
- Update headline (line 36):
  - FROM: `{isEnterprise ? "Discuss Your Enterprise Challenges" : "Tell Me About Your Problem"}`
  - TO: Force enterprise framing: "Enterprise Discovery Brief" (simpler, consistent)
  - Consider: Add redirect at top if SMB user lands here (check referrer or session state)
- Keep form fields, submit logic, and styling unchanged
- Note: Phase 10's assessment gate handles the SMB → /automate redirection, so Phase 9 just needs to reframe the copy

**Pattern note:** This component uses Next.js server actions (submitInquiry) for form submission. The action itself is defined in `./actions.ts` (not shown in this reading, but pattern is consistent with other forms in codebase).

**CSS token usage:**
- Form inputs: standard form styling with border tokens
- Submit button: should use `--accent` token for primary action
- Success/error messages: `--success` / `--error` tokens

---

## Shared Patterns

### Imports & Structure (all home components)
**Source:** All files in `src/components/home/`
**Apply to:** HeroSection, PainSection, ServicesPreview, SocialProof, Footer

Pattern:
```typescript
import Link from "next/link";
import Image from "next/image"; // if needed
import styles from "./ComponentName.module.css";
// Additional imports as needed (lucide-react, JSON, etc.)

export default function ComponentName() {
  // Optional: data array/object
  const data = [...];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Content structure */}
      </div>
    </section>
  );
}
```

---

### CSS Module Token Usage (all styled components)
**Source:** `src/app/globals.css` (Phase 8 Direction B canonical)
**Apply to:** All components with styling

Standard tokens available:
```css
/* Color */
--surface-1: #FDFAF4 (page backgrounds)
--surface-2: #F9F4ED (cards, nav, footer)
--ink-1: #1F1B17 (primary text)
--ink-2: #5D564E (secondary text, links)
--accent: #C9A86D (reserved for primary CTA + featured card)
--accent-hover: #B5985B
--accent-active: #A1854A
--success: #3D6B1F
--error: #AA3918

/* Spacing */
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 16px
--spacing-4: 24px
--spacing-5: 32px
--spacing-6: 48px

/* Typography */
--fontSize-1: 12px (labels, eyebrow)
--fontSize-2: 16px (body)
--fontSize-5: 24px (card titles)
--fontSize-6: 32px (section headings)
--fontSize-7: 48px (hero h1)
--fontWeight-bold: 700
--fontWeight-normal: 400
--lineHeight-tight: 1.1
--lineHeight-normal: 1.5
```

**Rule:** Every spacing/color/typography value must use a token variable, not hardcoded values. No new tokens should be introduced in Phase 9 (Phase 8 complete).

---

### JSON Data Import & Mapping (testimonial-based components)
**Source:** `src/components/home/SocialProof.tsx` + `src/content/testimonials.json`
**Apply to:** HeroSection (TestimonialCard), SocialProof

Pattern:
```typescript
import testimonials from "@/content/testimonials.json";

// In component:
const HERO_TESTIMONIAL = testimonials.hero; // or specific field
const proofItems = [
  testimonials.services[0],
  testimonials.services[1],
  // etc.
];

// In JSX:
{proofItems.map((t) => (
  <div key={t.name}>
    {/* Render testimonial fields: t.quote, t.name, t.title, t.headshot */}
  </div>
))}
```

**Fields available in testimonials.json:**
```json
{
  "hero": { "quote": "...", "name": "...", "title": "...", "headshot": "..." },
  "assessmentResults": { /* same */ },
  "services": [
    { "quote": "...", "name": "...", "title": "...", "headshot": "..." },
    { /* ... */ }
  ]
}
```

---

### Client-Side State & Routing (Navigation, Forms)
**Source:** `src/components/Navigation.tsx` + `src/app/engage/page.tsx`
**Apply to:** Navigation, engage form components

Pattern for nav:
```typescript
"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false); // Close menu on route change
  }, [pathname]);

  return (
    <nav>
      <Link href="/" className={pathname === "/" ? styles.active : ""}>
        Home
      </Link>
      {/* ... */}
    </nav>
  );
}
```

Pattern for form:
```typescript
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { serverAction } from "./actions";

export default function Form() {
  const params = useSearchParams();
  const [status, setStatus] = useState("idle" | "loading" | "success" | "error");

  async function handleSubmit(e: FormEvent) {
    setStatus("loading");
    const result = await serverAction(formData);
    setStatus(result.success ? "success" : "error");
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## No Analog Found

All files have exact or near-exact analogs in the codebase. No gaps requiring fallback to RESEARCH.md patterns.

---

## Metadata

**Analog search scope:** 
- `src/components/home/` — homepage section components
- `src/components/` — shared and layout components
- `src/app/` — page layouts and routes
- `src/content/` — data files (JSON)

**Files scanned:** 43 component/page files

**Pattern extraction date:** 2026-08-11

**Key assumptions verified:**
- ✅ All home components use CSS modules + Next.js Link/Image
- ✅ Testimonials.json exists and contains required fields (quote, name, title, headshot)
- ✅ globals.css tokens are canonical and available sitewide
- ✅ Client components use "use client" directive
- ✅ Server components (layout, page) use server-side metadata export

---

## Critical Phase 9 Pattern Notes

1. **Primary CTA consolidation:** Both Navigation and HeroSection must link to `/automate`, not `/assessment` or `/engage`. Verify no competing CTAs above fold (09-RESEARCH.md Pitfall 5).

2. **Positioning statement consistency:** The hero eyebrow, layout.tsx description, and footer tagline must all contain or match the same key phrase for automated verification. Recommended: "Automations that work like your best hire — reliable, consistent, and yours to keep."

3. **Accent token restriction:** Only two surfaces should use `--accent` color in Phase 9:
   - Navigation primary CTA button
   - ServicesPreview Rung 1 featured card (border or badge)
   - All other interactive elements use `--ink-2` underline or neutral styling

4. **No hardcoded testimonials:** SocialProof.tsx must import from testimonials.json, never hardcode names or quotes. This ensures updates don't require code changes.

5. **Metadata domain:** Verify production domain (asorahura.com) is live before changing metadataBase. If not live, keep vercel.app as fallback (noted in 09-RESEARCH.md Open Questions #3).

6. **Escape-hatch links:** PainSection and SocialProof should include links to `/enterprise` for users in regulated verticals or seeking case studies, marked with secondary styling (--ink-2, not accent).

7. **Mobile menu consistency:** Any nav updates must be reflected in both desktop nav links AND mobile menu JSX (Navigation.tsx has two parallel link lists, lines 38-56 and 74-79).

8. **Form reframing scope:** `/engage/page.tsx` needs only copy updates for enterprise framing. Schema and server action remain unchanged. Phase 10's assessment gate provides SMB redirection logic.
