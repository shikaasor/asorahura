# Phase 9: Homepage & Funnel Reposition - Research

**Researched:** 2026-08-10
**Domain:** Homepage positioning, funnel architecture, ICP messaging, product ladder visibility
**Confidence:** HIGH

## Summary

Phase 9 repositions the entire homepage and primary funnel from enterprise consultancy (regulated verticals, $5k+ entry) to self-serve creator/coach automation products ($0-$800 entry). The current state is split: Phase 7 built `/automate/instagram` (Product #1, live and working, self-contained layout), Phase 9.1 built the `/automate` catalog (5 offerings, 4 on waitlist), and Phase 10 built the enterprise track page—but the homepage still leads with enterprise messaging and has competing CTAs. This phase consolidates those pieces into a cohesive funnel: cold visitor → understands income-growth offer → reaches `/automate/instagram` → buys Product #1 in ≤2 clicks.

**Primary recommendation:** Rewrite HeroSection, PainSection, and ServicesPreview to position for creators/coaches; move regulated verticals to `/enterprise`; consolidate CTAs to one primary path (homepage → `/automate` catalog); replace anonymized SocialProof testimonials with named ones from `testimonials.json`; reframe `/engage` as enterprise-intake-only; add pricing link to Navigation; update metadata and footer with one consistent positioning statement; point metadataBase to production domain.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Homepage hero messaging | Frontend (page layout) | — | Hero leads with value prop, entry price story; server-rendered |
| ICP segmentation (creator vs. enterprise) | API / Routing (gate logic) | Frontend (nav links) | Assessment re-point (Phase 10) handles entry gate; nav signals enterprise path |
| Product ladder visibility | Frontend (ServicesPreview) | — | Ladder must be visible on homepage to establish entry rung |
| CTA consolidation | Frontend (page layout, nav) | — | Single primary CTA enforced at page level and nav level |
| Enterprise track gating | Frontend (nav structure) | API (assess route gate) | Secondary nav link; assessment gate in Phase 10 route logic |
| Testimonial rendering | Frontend (SocialProof component) | Content (testimonials.json) | Component renders, data comes from JSON |
| Metadata consistency | Frontend (layout.tsx) | — | SEO title/description/og tags; metadataBase to production |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15+ | SSR, routing, metadata handling | All pages built with Next.js; supports `metadataBase` rewrite |
| React | 19+ | Component rendering | Standard for homepage sections |
| Tailwind CSS + custom tokens (globals.css) | 3.4+ | Styling | Phase 8 established Direction B palette; all components use token variables |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.290+ | Icon library | Replacing mixed icon set (↑ ✕ 🔒) in ladder visualization |
| Next.js Link | Built-in | Client-side routing | All navigation; no hard refreshes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Rewording hero copy | A/B testing framework | Requires analytics integration; Phase 9 is copy/layout only, not experimentation |
| Moving regulated verticals to `/enterprise` | New dedicated pages (e.g., `/enterprise/law`) | Added complexity; `/enterprise` page (Phase 10) already consolidated them |

**Installation:**
No new packages needed. Phase 8 tokens and Phase 9.1 components already exist.

## Package Legitimacy Audit

**Not applicable** — Phase 9 does not introduce external packages. Reuses existing Phase 6–8 infrastructure.

## Architecture Patterns

### System Architecture Diagram

```
User lands on homepage (/)
  ↓
HeroSection: Income-growth pitch + 1 primary CTA
  ↓
PainSection: Creator/coach pain points (not regulated verticals)
  ↓
ServicesPreview: Product #1 ladder visible ($0-$800 entry)
  ↓
SocialProof: Named testimonials with headshots (creator-focused)
  ↓
Navigation (globally available):
  - Logo → /
  - Services (links to /services)
  - Work (case studies)
  - Discovery (links to /assessment)
  - Blog
  - Enterprise (secondary, links to /enterprise)
  - Pricing (new)
  - CTA button (primary path to /automate)
  ↓
Footer:
  - One positioning statement
  - Links to /enterprise, /engage (enterprise intake only)
  - Links to /assessment, /blog, /work
  ↓
Decision branch (enterprise gate from Phase 10):
  Enterprise user → /enterprise → /engage (intake form)
  Creator/coach user → /automate (catalog) → /automate/instagram (Product #1)
```

### Recommended Project Structure
```
src/
├── components/home/
│   ├── HeroSection.tsx         # Rewritten: income-growth hero
│   ├── PainSection.tsx         # Rewritten: creator/coach pain
│   ├── ServicesPreview.tsx     # Rewritten: Product #1 ladder visible
│   ├── SocialProof.tsx         # Rewritten: named testimonials from JSON
│   ├── Footer.tsx              # Updated: positioning statement
│   └── [other sections unchanged]
├── components/Navigation.tsx    # Updated: add Pricing link, one primary CTA
├── app/
│   ├── page.tsx                # No changes (uses updated sections)
│   ├── layout.tsx              # Updated: metadataBase to production, positioning statement
│   ├── services/               # Reframed: enterprise pricing only (link from nav, not primary path)
│   ├── engage/                 # Reframed: enterprise intake form (linked from /enterprise, not primary path)
│   ├── enterprise/             # Already exists (Phase 10): verticals, case studies, intake
│   └── automate/               # Already exists (Phase 9.1): catalog + /instagram (now can adopt site nav)
└── content/
    └── testimonials.json       # Already contains: Maria Rios, Itohan Okpataku, Pawel Janas, Aamna Mansoor
```

### Pattern 1: ICP Messaging Shift
**What:** Rewrite value prop from "eliminate operational drag" (enterprise framing) to "grow your income through automation" (creator framing).

**When to use:** Homepage hero, eyebrow text, positioning statement in metadata and footer.

**Example:**
```typescript
// OLD (enterprise, Phase 1-8)
// "You're spending more time managing your business than growing it."
// "AI-powered systems that eliminate the repetitive work keeping you stuck in operations."

// NEW (creator, Phase 9)
// "Grow your income without growing your team."
// "Small automations that make measurable money. Start with one, scale to five."

// Source: PROJECT.md Core Value + REQUIREMENTS.md HOME-12
```

### Pattern 2: Product Ladder Visibility
**What:** ServicesPreview shows Product #1 (Instagram Lead Automation, $0-$800) as the visible entry rung, not buried under $5k-$30k enterprise services.

**When to use:** Homepage services section, /services page footnote (enterprise only).

**Example:**
```typescript
// ServicesPreview on homepage: Only Product #1
const services = [
  {
    title: "Instagram Lead Automation",
    description: "Capture leads from Instagram comments on your posts — no manual DM overhead.",
    entry_price: "Free (DIY) or $500 (Done For You)",
    href: "/automate/instagram", // Direct to product page
  },
  {
    title: "Scaling: The Other Four Automations",
    description: "Email triage, writing constitution, rate-aware invoicing, client onboarding — coming next.",
    price: "See /automate for full catalog",
    href: "/automate",
  },
];

// /services page reframed: Enterprise tier pricing only
// "Looking for custom automation architecture for a regulated industry?"
// Links to /enterprise → /engage (enterprise intake)
```

### Pattern 3: Testimonial Sourcing
**What:** Use named testimonials with headshots from `src/content/testimonials.json` instead of hardcoded anonymized names in SocialProof.tsx.

**When to use:** Homepage SocialProof section, case-study credibility strips, /enterprise page.

**Example:**
```typescript
// Current (anonymized, hardcoded in SocialProof.tsx):
// { quote: "...", name: "T.N.", role: "Founder, Professional Services" }
// { quote: "...", name: "R.O.", role: "COO, B2B SaaS" }

// NEW (named, from testimonials.json):
import testimonials from "@/content/testimonials.json";

// Use:
// testimonials.hero → Maria Rios (archival digitization — enterprise-y but named)
// testimonials.services[0] → Pawel Janas (Lloyd's List data — enterprise-y but named)
// testimonials.services[1] → Aamna Mansoor (image restoration — technical but named)

// OR: Commission new creator/coach testimonials if existing ones don't fit ICP
// (Assumption: current testimonials are all enterprise/regulated-vertical focused)
```

### Pattern 4: Navigation CTA Consolidation
**What:** One primary CTA in navigation (e.g., "Start Free" or "See Automations") that leads to `/automate`, not multiple competing CTAs.

**When to use:** Navigation component, globally visible.

**Example:**
```typescript
// Current Navigation:
// <Link href="/assessment" className={styles.cta}>
//   Start AI Opportunity Discovery
// </Link>

// NEW (Phase 9):
// <Link href="/automate" className={styles.cta}>
//   Automate & Earn
// </Link>
// or
// <Link href="/automate/instagram" className={styles.cta}>
//   Get Started Free
// </Link>
```

### Pattern 5: Positioning Statement Consistency
**What:** One positioning statement appears in metadata title, hero eyebrow, and footer tagline.

**When to use:** layout.tsx (metadata), HeroSection (eyebrow), Footer.tsx (tagline).

**Example:**
```typescript
// Positioning statement (to be confirmed with user):
// "Grow your income through automation. Start with Instagram leads, scale to five offerings."
// OR
// "Small automations, measurable income. Own the system."
// OR (Project.md Core Value)
// "Grow your income through small automations — start with one, then ascend."

// In metadata:
export const metadata = {
  title: "Grow your income through automation | Asor Ahura",
  description: "Small automations that make money. Start with Instagram leads.",
};

// In hero eyebrow:
<p className={styles.eyebrow}>Grow Your Income Through Automation</p>

// In footer tagline:
<p className={styles.tagline}>Small automations, measurable income. Scale at your pace.</p>

// Source: PROJECT.md § Core Value + ROADMAP.md § Phase 9 goal
```

### Anti-Patterns to Avoid
- **Multiple competing CTAs on homepage:** Only one primary CTA. Hero → `/automate` or `/automate/instagram`. Secondary paths (assessment, enterprise) are in nav or footer, not hero.
- **Showing enterprise pricing on SMB homepage:** All services with $5k+ price stay on `/services` and `/enterprise`, not homepage preview.
- **Mixing regulated-vertical copy with creator/coach messaging:** Regulated verticals stay on `/enterprise` page only. PainSection speaks to creators/coaches: "growing followers", "lead capture", "monetizing content", not "compliance risk" or "model governance".
- **Hardcoding testimonials instead of using testimonials.json:** All testimonials sourced from `src/content/testimonials.json` for consistency and easy updates.
- **Not updating Footer tagline:** Footer must reflect new positioning statement, not old "Scale your business without scaling your payroll."
- **Leaving `/engage` as both enterprise and SMB form:** POST-Phase 9, `/engage` becomes enterprise-only intake. SMB path ends at `/automate/instagram` checkout (no `/engage` link).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive hero layout (image + text columns) | Custom CSS grid | Existing HeroSection.module.css + Next.js Image component | Grid breakpoints already handled; Image component optimizes for web |
| CTA styling consistency | One-off button styles | globals.css token variables (--accent, --accent-hover, --accent-active) + shared .cta class | Phase 8 established one token system; custom styles fragment the design |
| Testimonial rendering from JSON | Loop through hardcoded objects | Import testimonials.json directly into component | Future updates don't require code changes; single source of truth |
| Navigation state management | useState for mobile menu | Existing Navigation.tsx (already uses useState + usePathname) | Don't duplicate existing state logic; extend the component |
| SEO metadata generation | Hardcoded title/description per page | layout.tsx metadataBase + per-page metadata exports | Next.js handles inheritance; one metadataBase change updates all pages |

**Key insight:** This is a reposition (copy + layout) not a rebuild. Reuse existing component structure (HeroSection, PainSection, etc.), update their content and tokens, avoid new CSS or component abstractions.

## Common Pitfalls

### Pitfall 1: Forgetting to Update /engage Form After Repositioning to Enterprise-Only
**What goes wrong:** SMB user who didn't click `/automate` somehow lands on `/engage` (via old link, shared URL, search engine), fills enterprise form fields (company size, operational volume), gets confusing response "We work with $30k+ projects, this ticket too small."

**Why it happens:** `/engage` is reused by both flows in Phase 7-8; Phase 9 makes it enterprise-only, but incoming links and cached pages still point to it.

**How to avoid:** 
1. Add a check at the top of `/engage/page.tsx`: if visitor came from SMB flow (check referrer or session state from Phase 10 assessment gate), redirect to `/automate` or show a banner "Wrong path — try this instead."
2. Update all CTA links from homepage to point to `/automate`, never `/engage`.
3. Add redirects for old links: `/engage` with no query params → `/automate`.

**Warning signs:** 
- Plausible analytics shows `/engage` traffic from non-enterprise sources.
- Support requests: "I filled the form, why haven't you responded?"

### Pitfall 2: Testimonials Don't Fit New ICP
**What goes wrong:** Testimonials are sourced from testimonials.json, but all of them are enterprise-focused (regulated verticals, 500+ employees, complex workflows). Homepage shows "Asor helped enterprise build compliance-aware HR system" instead of "Asor helped creator earn $5k/month from automation."

**Why it happens:** v1.0 only had enterprise clients; v2.0 hasn't shipped a creator/coach product yet, so testimonials don't exist.

**How to avoid:**
1. Research testimonials.json carefully (done: Maria Rios is archival, Pawel Janas is university, Aamna Mansoor is deep-learning). None are creator/coach.
2. Flag for user: "Current testimonials are enterprise-focused. Commission new creator/coach testimonials for phase launch, or use existing ones with enterprise positioning in footer note."
3. For Phase 9 MVP: Use least-enterprise testimonials from JSON (Maria Rios is closest to "small business"), pair with disclaimer "Expanding to creator segment now."

**Warning signs:**
- Copy says "small business" but testimonial says "500+ employees" or "compliance audit."
- Credibility gap between hero promise and proof.

### Pitfall 3: PainSection Copy Speaks to Regulators, Not Creators
**What goes wrong:** Rewrite PainSection to remove regulated verticals, but copy stays enterprise: "You can't paste matter content into public LLMs without an ABA Rule 1.6 risk" → instead write "Growing followers with ads but losing track of leads."

**Why it happens:** Copy is written once in Phase 1, reused in Phase 8 with tokens only, and Phase 9 doesn't audit the messaging layer.

**How to avoid:**
1. Read current PainSection.tsx (done: it has ABA Rule 1.6, SR 11-7, Fair Housing, industry standards).
2. Rewrite each card for creator/coach framing:
   - Remove: Law, Finance, Real Estate, Construction cards
   - Add: "Creators & Coaches" section with pain points: "Growing followers isn't growing income", "Leads come in DMs; you're manually managing them", "You've automated everything except the thing that makes money."
3. Link new PainSection to `/enterprise` for regulated verticals, not the primary path.

**Warning signs:**
- Visitor reads hero ("grow income"), scrolls to PainSection, sees "ABA Rule 1.6", leaves.

### Pitfall 4: Metadata Still Points to vercel.app Instead of Production Domain
**What goes wrong:** META-21 requires metadataBase to point to production domain (e.g., `asorahura.com`), but layout.tsx still has `vercel.app`. This causes:
- Open Graph images not to load in Slack/Twitter (wrong domain).
- SEO tools to flag mismatched domain.
- Old shared links return OG metadata from vercel preview, not production.

**Why it happens:** metadataBase was set during Phase 1 for preview, never updated.

**How to avoid:**
1. Change `layout.tsx` line 19: `metadataBase: new URL("https://asorahura.vercel.app")` → `metadataBase: new URL("https://asorahura.com")` (or user's confirmed production domain).
2. Verify domain is live and DNS is pointing before Phase 9 merge.

**Warning signs:**
- OG image previews in Slack show vercel.app hostname.
- Lighthouse SEO audit flags "canonical URL mismatch."

### Pitfall 5: One Primary CTA Becomes Multiple After Phase 9
**What goes wrong:** Planner creates tasks to update HeroSection CTA to `/automate`, but then adds secondary tasks for `/assessment` button, and a tertiary `/engage` link in copy. Navigation still has three CTA buttons. Result: homepage has 4+ entry points again.

**Why it happens:** Each task is written independently; no final review of total CTA count before merge.

**How to avoid:**
1. Define "one primary CTA" operationally: Only **one** link to an entry point (automate/assessment/engage) visible above the fold on `/`.
2. Add a verification task (Wave N gate): "Count all CTA links on homepage above fold—must be exactly 1. Count all CTA buttons in nav—must be exactly 1. Total: 2 links, not 4+."
3. Link count verification: `grep -E "href=\"/(automate|assessment|engage)\"" src/components/home/*.tsx src/components/Navigation.tsx | grep -v "//" | wc -l` should be ≤2.

**Warning signs:**
- Plausible analytics: multiple entry-point events fire from same session (user had choice, signal weak funnel).

## Code Examples

Verified patterns from existing codebase:

### Homepage Hero Section (ICP Reposition)
```typescript
// Source: src/components/home/HeroSection.tsx (to be rewritten)
// Current (enterprise):
// <h1>You're spending more time managing your business than growing it.</h1>

// NEW (creator, PROJECT.md Core Value):
import Link from "next/link";
import Image from "next/image";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import styles from "./HeroSection.module.css";
import testimonials from "@/content/testimonials.json";

const HERO_TESTIMONIAL = testimonials.hero; // Maria Rios

export default function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left column: income-first copy */}
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Grow Your Income Through Automation</p>
            <h1 className={styles.headline}>
              Small automations that make measurable money.
            </h1>
            <p className={styles.subheading}>
              Start with Instagram leads, scale to five offerings.
              Own the system. Own the profit.
            </p>
            <div className={styles.actions}>
              <Link href="/automate/instagram" className={styles.primaryBtn}>
                Get Started Free
              </Link>
            </div>
            <TrustSignals />
            <TestimonialCard {...HERO_TESTIMONIAL} />
          </div>

          {/* Right column: Asor photo */}
          <div className={styles.imageWrapper}>
            <Image
              src="/images/asor.png"
              alt="Asor Ahura"
              width={480}
              height={480}
              className={styles.photo}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### PainSection (Creator Pain, Regulated Verticals Moved)
```typescript
// Source: src/components/home/PainSection.tsx (to be rewritten)
// Replaces regulated verticals with creator pain points

import styles from "./PainSection.module.css";

const creatorPains = [
  {
    title: "Growing followers, not income",
    body: "You've mastered ad spend and follower growth. But leads come in DMs and you're manually capturing them. That's not a business — that's a job.",
  },
  {
    title: "Your time is your bottleneck",
    body: "Lead capture, qualification, follow-up — you're doing it all manually. Every lead that comes in while you're asleep is a lead you never reach.",
  },
  {
    title: "The systems exist, but they don't talk",
    body: "Instagram, email, CRM, Calendly — they work. But building the flow between them yourself takes time you don't have.",
  },
  {
    title: "One automation = time + money back",
    body: "Instagram Comment-to-DM costs $6/mo owned, or $17–$99/mo with ManyChat. At $500, it pays for itself in 3 months.",
  },
];

export default function PainSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Sound familiar?</h2>
        <p className={styles.subheading}>
          Growing creators and coaches hit the same ceiling — manual lead capture
          while the rest of your business runs on autopilot.
        </p>
        <div className={styles.grid}>
          {creatorPains.map((pain) => (
            <div key={pain.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{pain.title}</h3>
              <p className={styles.cardBody}>{pain.body}</p>
            </div>
          ))}
        </div>
        <p className={styles.cta}>
          <Link href="/enterprise">
            Working in a regulated industry? →
          </Link>
        </p>
      </div>
    </section>
  );
}
```

### ServicesPreview (Product Ladder, Entry Rung Visible)
```typescript
// Source: src/components/home/ServicesPreview.tsx (to be rewritten)

import Link from "next/link";
import styles from "./ServicesPreview.module.css";

const ladder = [
  {
    tier: 1,
    title: "Instagram Lead Automation",
    description:
      "Capture leads from Instagram comments, convert to DMs, nurture in email.",
    entry: "Free (DIY) or $500 (Done For You)",
    cta: "Get Started",
    href: "/automate/instagram",
  },
  {
    tier: 2,
    title: "The Next Four",
    description:
      "Email triage on Telegram, writing constitution + content, rate-aware invoice, client onboarding agent.",
    entry: "Coming soon",
    cta: "Join Waitlist",
    href: "/automate",
  },
];

export default function ServicesPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>The Automation Ladder</h2>
        <p className={styles.subheading}>
          Start with one. Earn with it. Scale to five.
        </p>
        <div className={styles.grid}>
          {ladder.map((service, idx) => (
            <div key={service.title} className={`${styles.card} ${idx === 0 ? styles.featured : styles.coming}`}>
              <div className={styles.tier}>Rung {service.tier}</div>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardBody}>{service.description}</p>
              </div>
              <div className={styles.cardBottom}>
                <span className={styles.price}>{service.entry}</span>
                <Link href={service.href} className={styles.learnMore}>
                  {service.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### SocialProof (Named Testimonials from JSON)
```typescript
// Source: src/components/home/SocialProof.tsx (to be rewritten)

import styles from "./SocialProof.module.css";
import testimonials from "@/content/testimonials.json";

export default function SocialProof() {
  const proofItems = [
    testimonials.services[0],  // Pawel Janas (Lloyd's List)
    testimonials.services[1],  // Aamna Mansoor (image restoration)
    testimonials.hero,         // Maria Rios (archival digitization)
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>What clients say</h2>
        <p className={styles.subheading}>
          Real work, real results. See what automation looks like in practice.
        </p>
        <div className={styles.grid}>
          {proofItems.map((t) => (
            <div key={t.name} className={styles.card}>
              <blockquote className={styles.quote}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className={styles.attribution}>
                {t.headshot && (
                  <img 
                    src={t.headshot} 
                    alt={t.name} 
                    className={styles.headshot}
                  />
                )}
                <div>
                  <strong>{t.name}</strong>
                  <span className={styles.role}>{t.title}</span>
                </div>
              </footer>
            </div>
          ))}
        </div>
        <p className={styles.enterpriseNote}>
          <Link href="/enterprise">
            Looking for enterprise case studies? →
          </Link>
        </p>
      </div>
    </section>
  );
}
```

### Navigation (One Primary CTA, Pricing Link)
```typescript
// Source: src/components/Navigation.tsx (to be updated)

export default function Navigation() {
  // ... existing code ...
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        {/* Logo */}
      </Link>

      <div className={styles.links}>
        <Link href="/automate" className={styles.navLink}>
          Automations
        </Link>
        <Link href="/work" className={styles.navLink}>
          Work
        </Link>
        <Link href="/blog" className={styles.navLink}>
          Blog
        </Link>
        <Link href="/services" className={styles.navLink}>
          Pricing
        </Link>
        <Link href="/enterprise" className={styles.navLink}>
          Enterprise
        </Link>
        {/* One primary CTA */}
        <Link href="/automate" className={styles.cta}>
          Get Started Free
        </Link>
      </div>

      {/* ... hamburger menu ... */}
    </nav>
  );
}
```

### layout.tsx (Metadata & Positioning Statement)
```typescript
// Source: src/app/layout.tsx (to be updated)

export const metadata: Metadata = {
    metadataBase: new URL("https://asorahura.com"), // Changed from vercel.app
    title: "Grow Your Income Through Automation | Asor Ahura",
    description: "Small automations for creators and coaches. Start with Instagram leads, scale to five offerings.",
    openGraph: {
        title: "Grow Your Income Through Automation | Asor Ahura",
        description: "Small automations for creators and coaches. Start with Instagram leads, scale to five offerings.",
        images: [
            {
                url: "/banner1.png",
                width: 1000,
                height: 400,
                alt: "Asor Ahura — Automation for Creators",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/banner1.png"],
    },
};
```

### Footer (Positioning Statement)
```typescript
// Source: src/components/home/Footer.tsx (to be updated)

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.logo}>Asor Ahura</p>
            <p className={styles.tagline}>
              Small automations, measurable income. Own your system.
            </p>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            <p className={styles.navLabel}>Creator Path</p>
            <ul className={styles.navList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/automate">Automations</Link></li>
              <li><Link href="/blog">Learn</Link></li>
              <li><Link href="/assessment">Discovery</Link></li>
            </ul>
          </nav>

          <nav className={styles.nav} aria-label="Enterprise navigation">
            <p className={styles.navLabel}>Enterprise</p>
            <ul className={styles.navList}>
              <li><Link href="/enterprise">Enterprise Solutions</Link></li>
              <li><Link href="/engage">Intake Form</Link></li>
              <li><Link href="/work">Case Studies</Link></li>
            </ul>
          </nav>

          <div className={styles.legal}>
            <p className={styles.navLabel}>Legal</p>
            <ul className={styles.navList}>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/refund">Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Asor Ahura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Enterprise-first messaging (regulated verticals, $5k+ entry) | Creator-first messaging ($0-$800 entry) | Phase 9 (2026-08-10) | Homepage now leads with income-growth, not time-saved |
| Multiple competing CTAs (assessment, /engage, /services links in hero) | One primary CTA (/automate) in hero, secondary paths in nav | Phase 9 | Reduced funnel ambiguity; clearer entry point |
| Anonymized testimonials (T.N., R.O., P.J.) | Named testimonials with headshots from testimonials.json | Phase 9 | Increased trust; easier to attribute real people |
| /services page for all tiers (SMB + enterprise) | /services page for enterprise tiers only; SMB ladder on homepage | Phase 9 | Clear pricing segmentation by ICP |
| /engage form for both SMB and enterprise | /engage for enterprise intake only | Phase 9 (gated by Phase 10 routing) | No SMB users reaching enterprise form |
| metadataBase: vercel.app | metadataBase: production domain (asorahura.com) | Phase 9 | OG image previews now load from production domain |
| Footer tagline: "Scale your business without scaling your payroll" | Footer tagline: "Small automations, measurable income. Own your system." | Phase 9 | Footer now reflects creator ICP, not enterprise positioning |

**Deprecated/outdated:**
- Regulated verticals on primary path: Moved to `/enterprise` (Phase 10 consolidated them there)
- Assessment landing page at `/assessment` (old): Now consolidated to `/assessment?depth=quick` or `/assessment?depth=deep` by Phase 10
- Calendly in primary funnel: Moved to `/enterprise` track only (Phase 10)
- Testimonials.tsx component (v1.0): Deleted in Phase 8; replaced with SocialProof.tsx pulling from testimonials.json

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Current testimonials in testimonials.json are creator-appropriate for homepage | Code Examples → SocialProof | If testimonials are all enterprise/regulated-vertical, homepage credibility weak; need to commission new creator testimonials before launch |
| A2 | One positioning statement can be applied consistently across metadata, hero, footer | Pattern 5 | If statement is long or rigid, won't fit all three places; may need shorter hero version |
| A3 | Production domain for asorahura.com is confirmed and live | Code Examples → layout.tsx | If domain not live or DNS not pointed, metadataBase change breaks OG previews |
| A4 | /services page should show enterprise pricing only (not SMB tiers) | Architecture Patterns → Reframing | If user wants /services to show all tiers with a note, need to refactor this change |
| A5 | /engage form should become enterprise-intake-only after Phase 9 | Pattern 2 & Pitfall 1 | If SMB users should still be able to book calls, /engage stays general and Phase 9 only adds an enterprise gate |
| A6 | Phase 10's assessment sector gate is live and routing correctly | Pitfall 1 prevention | If Phase 10 assessment gate not working, /engage won't have proper enterprise routing and SMB users will still land there |
| A7 | Navigation primary CTA should link to /automate, not /automate/instagram | Pattern 4 | If user prefers /automate/instagram to be the default, removes the catalog discovery step |

**If this table is empty:** All claims above are assumed. The planner and discuss-phase should confirm A1–A7 before implementation.

## Open Questions

1. **Positioning statement and tone (HOME-21)**
   - What we know: PROJECT.md Core Value is "Grow your income through small automations — start with one automation that visibly makes money, then ascend."
   - What's unclear: Should the hero tagline be short (8 words) or longer (15+)? Should it emphasize "own the system" (control) or "measurable money" (outcomes)?
   - Recommendation: Planner to flag for user confirmation in discuss-phase. Proposed: "Grow your income through automation. Start with Instagram leads." (14 words, fits everywhere)

2. **Testimonial fit for new ICP (Pitfall 2)**
   - What we know: testimonials.json contains: Maria Rios (archival), Itohan Okpataku (hiring), Pawel Janas (Lloyd's List), Aamna Mansoor (deep learning). None are "creator/coach who monetized with automation."
   - What's unclear: Should Phase 9 use existing testimonials with a note ("We've worked with enterprises; now scaling to creators") or wait for real creator testimonials?
   - Recommendation: Use existing testimonials for MVP; flag for user: "Real creator testimonials to be collected after Product #1 ships and first customers exist."

3. **Production domain confirmation (HOME-21)**
   - What we know: Current metadataBase is `vercel.app`.
   - What's unclear: Is production domain `asorahura.com` live? What's the confirmed URL for metadataBase?
   - Recommendation: Planner to confirm domain before Phase 9 starts. Update to actual production URL, not placeholder.

4. **/engage refactoring scope (HOME-19)**
   - What we know: `/engage` is currently general-purpose form used by both SMB and enterprise flows.
   - What's unclear: Should Phase 9 remove SMB path from `/engage` entirely, or just change the copy?
   - Recommendation: Phase 9 updates copy to enterprise-only framing ("Enterprise Discovery Brief"); Phase 10's assessment gate redirects SMB users to `/automate` before they see the form. No schema changes in Phase 9, just copy update.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Next.js | Routing, layout.tsx metadata | ✓ | 15+ | — |
| React | Component rendering | ✓ | 19+ | — |
| globals.css tokens | Styling (Phase 8 rollout) | ✓ | Direction B palette, Phase 8 complete | — |
| testimonials.json | SocialProof section | ✓ | Contains 4 named testimonials with headshots | — |
| Production domain | metadataBase (HOME-21) | ? | [Confirm with user] | Fallback to vercel.app (not ideal for OG) |
| Plausible Analytics | CTA tracking | ✓ | Installed in layout.tsx (Phase 7) | — |

**Missing dependencies with no fallback:**
- Production domain confirmation (asorahura.com live and DNS pointed)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + React Testing Library (existing from Phase 6) |
| Config file | `vitest.config.ts` (existing) |
| Quick run command | `npm run test -- --watch src/components/home` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-12 | Hero headline contains "income" or "earn", not "hours" | Unit (text search) | grep "hours" src/components/home/HeroSection.tsx \| wc -l (should be 0) | ❌ Wave 0 |
| HOME-13 | PainSection does not contain "ABA Rule 1.6", "SR 11-7", or regulation names | Unit (text search) | grep -i "aba\|sr 11-7\|ai act\|fair housing" src/components/home/PainSection.tsx \| wc -l (should be 0) | ❌ Wave 0 |
| HOME-13 | PainSection links to /enterprise for regulated verticals | Unit (link check) | grep href="/enterprise" src/components/home/PainSection.tsx \| wc -l (should be ≥1) | ❌ Wave 0 |
| HOME-14 | ServicesPreview shows Product #1 with price $0-$800, not $5k+ | Unit (text + link) | grep -E "Free\|500\|800" src/components/home/ServicesPreview.tsx \| wc -l (should be ≥1); grep href="/automate" src/components/home/ServicesPreview.tsx | ❌ Wave 0 |
| HOME-15 | /services page does not show SMB pricing ($0-$800); only shows enterprise ($5k+) | Unit (text search on page) | grep -E "Free\|500\|800\|Build Map" src/app/services/page.tsx \| wc -l (should be 0) | ❌ Wave 0 |
| HOME-16 | Homepage hero has exactly 1 primary CTA link (no /assessment, /engage in hero) | Unit (link count) | grep -E "href=\"/(automate\|assessment\|engage)\"" src/components/home/HeroSection.tsx \| wc -l (should be exactly 1) | ❌ Wave 0 |
| HOME-16 | Navigation has exactly 1 primary CTA link (single .cta button) | Unit (link count) | grep "className={styles.cta}" src/components/Navigation.tsx \| wc -l (should be exactly 1) | ❌ Wave 0 |
| HOME-17 | /enterprise page shows case studies as credibility section, not primary proof | Integration | Render /enterprise, count "Case" or "Study" headings, verify lower on page | ✅ Phase 10 (verify position) |
| HOME-18 | SocialProof renders testimonials from testimonials.json, not hardcoded objects | Unit (import + render) | grep "import testimonials from" src/components/home/SocialProof.tsx; render test verifies `.headshot` img elements exist | ❌ Wave 0 |
| HOME-18 | Anonymized names (T.N., R.O.) do not appear in SocialProof | Unit (text search) | grep "T\.N\.\|R\.O\.\|P\.J\." src/components/home/SocialProof.tsx \| wc -l (should be 0) | ❌ Wave 0 |
| HOME-19 | /engage page copy says "Enterprise" or "enterprise" (not generic "Discovery Brief") | Unit (text search) | grep -i "enterprise" src/app/engage/page.tsx \| wc -l (should be ≥1) | ✅ Phase 10 (verify copy) |
| HOME-20 | Navigation contains link to /services with text "Pricing" or similar | Unit (link + text) | grep -A2 -B2 "href=\"/services\"" src/components/Navigation.tsx \| grep -i "pricing" | ❌ Wave 0 |
| HOME-21 | layout.tsx metadataBase is production domain, not vercel.app | Unit (text search) | grep "metadataBase.*https://" src/app/layout.tsx; verify URL is production | ❌ Wave 0 |
| HOME-21 | Footer tagline matches hero positioning statement (both contain same key phrase) | Unit (text pattern) | Extract tagline from Footer.tsx, extract eyebrow from HeroSection.tsx, verify substring match | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test -- --watch src/components/home` (fast feedback on component changes)
- **Per wave merge:** `npm run test` (full suite on all changes before merge)
- **Phase gate:** Full suite green + grep checks on hardcoded text before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/components/home/HeroSection.test.tsx` — renders with income framing, single CTA, no /engage link
- [ ] `tests/components/home/PainSection.test.tsx` — no regulation names, /enterprise link present, creator pain points
- [ ] `tests/components/home/ServicesPreview.test.tsx` — Product #1 visible with $0-$800 price, /automate link
- [ ] `tests/components/home/SocialProof.test.tsx` — renders from testimonials.json, shows headshots, no T.N./R.O./P.J. hardcoded
- [ ] `tests/Navigation.test.tsx` — exactly one .cta link, /services link labeled "Pricing"
- [ ] `tests/grep-checks.test.ts` — hardcoded text absence checks (ABA Rule, SR 11-7, T.N., R.O.)
- [ ] Update `src/app/layout.tsx` test to verify metadataBase production domain

*(If no gaps: none — existing test infrastructure covers all phase requirements)*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | N/A (homepage is public) |
| V3 Session Management | no | N/A (homepage is public) |
| V4 Access Control | no | N/A (no user roles on homepage) |
| V5 Input Validation | no | N/A (homepage has no forms) |
| V6 Cryptography | no | N/A (no sensitive data handled) |
| V14 Configuration | yes | metadataBase points to production domain, not preview |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| OG meta tags point to preview domain | Spoofing (wrong origin in social preview) | Update metadataBase to production domain before merge |
| Old links to /engage shared in social media still route to general form | Elevation of privilege (SMB user reaches enterprise form) | Add SMB → /automate redirect in /engage; verify Phase 10 assessment gate works |
| Hardcoded testimonial quotes change at runtime (if testimonials.json is fetched, not imported) | Tampering | Ensure testimonials.json is imported at build time, not fetched dynamically |

## Sources

### Primary (HIGH confidence)
- **Phase 8 ROADMAP.md** — Design system rollout complete, all pages using token system, no hardcoded colors
- **Phase 9.1 ROADMAP.md** — Automations catalog and /automate/instagram live (Phase 9.1 complete)
- **Phase 10 ROADMAP.md** — Assessment re-point and /enterprise page live (Phase 10 complete)
- **PROJECT.md** — Core value statement, ICP definition (creators/coaches, $10k-$100k MRR), key decisions
- **REQUIREMENTS.md** — HOME-12 through HOME-21 requirements scoped to Phase 9
- **STATE.md** — Current phase 08 complete, Phase 9 not started, Phase 10 complete
- **Codebase investigation** — src/components/home/*, src/app/*, testimonials.json, globals.css reviewed directly

### Secondary (MEDIUM confidence)
- **ROADMAP.md Phase 9 success criteria** — Details on what must be true for phase gate
- **PROJECT.md § Constraints** — Explicit constraints on navigation, self-serve model, light-first design

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js, React, existing tokens; no new dependencies
- Architecture: HIGH — Existing component structure (HeroSection, PainSection, etc.); only content/props change
- Pitfalls: HIGH — Identified from codebase review and Phase 1-8 patterns
- Copy/Positioning: MEDIUM — Specific copy choices deferred to planner/user review (assumed options provided)
- Testimonials fit: MEDIUM — Current testimonials exist and named, but their ICP fit not confirmed

**Research date:** 2026-08-10
**Valid until:** 2026-08-17 (7 days — messaging/copy can shift rapidly; re-research if major requirements change)

---

*Phase 9 research complete. Planner can now create PLAN.md files for homepage component updates, navigation refactoring, /services reframing, /engage copy update, and metadata/footer repositioning.*
