---
phase: 01-critical-path
plan: 1a
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/page.tsx
  - src/components/home/HeroSection.tsx
  - src/components/home/PainSection.tsx
  - src/components/home/ServicesPreview.tsx
  - src/components/home/SocialProof.tsx
  - src/components/home/ProcessTimeline.tsx
  - src/components/home/AboutSection.tsx
  - src/components/home/LeadMagnetStrip.tsx
  - src/components/home/Footer.tsx
  - src/components/shared/TrustSignals.tsx
  - public/images/asor.jpg
autonomous: false
requirements:
  - HOME-01
  - HOME-02
  - HOME-03
  - HOME-04
  - HOME-05
  - HOME-06
  - HOME-07
  - HOME-08
  - HOME-09
  - HOME-10
  - HOME-11
user_setup:
  - service: assets
    why: "Asor's hero photo required for homepage layout"
    env_vars: []
    dashboard_config:
      - task: "Place Asor's headshot at public/images/asor.jpg (JPG, web-optimized, minimum 800x800px recommended)"
        location: "Local filesystem — copy into project before running dev server"

must_haves:
  truths:
    - "Homepage renders with Asor's photo on the right and pain-first copy on the left in a two-column layout on desktop"
    - "Primary CTA 'Take the Free AI Readiness Assessment' is visible above the fold and links to /assessment"
    - "Secondary CTA 'Book a Strategy Call' links to the Calendly URL"
    - "Trust signals (Oracle Certified, 7,200+ hours, 3 continents) appear below the CTAs"
    - "Pain section shows 3 columns describing time/effort waste"
    - "Social proof section shows 3 testimonials referencing Lloyd's List / specific credentials"
    - "Footer renders with navigation links, social links, and legal text"
    - "All sections are mobile-responsive (single column on small screens)"
  artifacts:
    - path: "src/app/page.tsx"
      provides: "Homepage route — composes all section components"
      min_lines: 40
    - path: "src/components/home/HeroSection.tsx"
      provides: "Two-column hero with Asor photo, pain-first copy, and both CTAs"
      min_lines: 50
    - path: "src/components/shared/TrustSignals.tsx"
      provides: "Reusable trust badges used below hero CTAs and elsewhere"
      min_lines: 20
    - path: "src/components/home/PainSection.tsx"
      provides: "3-column pain card grid"
      min_lines: 30
    - path: "src/components/home/SocialProof.tsx"
      provides: "3-testimonial section with names and credentials"
      min_lines: 30
    - path: "src/components/home/Footer.tsx"
      provides: "Full site footer"
      min_lines: 30
  key_links:
    - from: "src/components/home/HeroSection.tsx"
      to: "/assessment"
      via: "Next.js Link href"
      pattern: "href.*assessment"
    - from: "src/components/home/LeadMagnetStrip.tsx"
      to: "/assessment"
      via: "Next.js Link href"
      pattern: "href.*assessment"
    - from: "src/app/page.tsx"
      to: "src/components/home/HeroSection.tsx"
      via: "import and JSX usage"
      pattern: "import.*HeroSection"
---

<objective>
Build the complete pain-first homepage for asorahura.com with all 11 required sections, delivering a desktop two-column hero (copy left, photo right), mobile single-column layout, both CTAs routing to the correct destinations, trust signals, pain/services/social proof/process/about sections, lead magnet strip, and footer.

Purpose: This is the top of the funnel. Every visitor enters here. The homepage must communicate the pain narrative immediately and drive clicks to the assessment (primary CTA) and Calendly (secondary CTA).

Output: A fully rendered homepage at / composed from individual section components, mobile-responsive, with no placeholder content.
</objective>

<execution_context>
@C:/Users/HP_PC/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/HP_PC/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-critical-path/01-CONTEXT.md
@.planning/phases/01-critical-path/01-RESEARCH.md
</context>

<tasks>

<task type="checkpoint:human-action" gate="blocking">
  <name>Setup: Place Asor hero photo</name>
  <files>public/images/asor.jpg</files>
  <action>This step requires a human asset — Claude cannot source Asor's personal headshot. See how-to-verify for instructions.</action>
  <verify>Run: ls public/images/asor.jpg — file must exist before proceeding</verify>
  <done>public/images/asor.jpg exists on disk (minimum 800x800px web-optimized JPG, or a placeholder named asor.jpg)</done>
  <what-built>Nothing yet — this is a prerequisite asset step</what-built>
  <how-to-verify>
    Place Asor's headshot at `public/images/asor.jpg`. The file must exist before the build proceeds; Next.js Image will 404 otherwise.
    - Minimum 800x800px, web-optimized JPG
    - Can use a placeholder stock image temporarily if the real photo isn't ready — name it `asor.jpg` regardless
  </how-to-verify>
  <resume-signal>Type "photo ready" when public/images/asor.jpg exists</resume-signal>
</task>

<task type="auto">
  <name>Task 1: Install new dependencies and scaffold component directories</name>
  <files>package.json, src/components/home/, src/components/shared/</files>
  <action>
    Run: `npm install react-hook-form zod @hookform/resolvers`

    These are needed across plans 1A, 1B, and 1C. Installing now so Wave 1 plans don't duplicate installation.

    Then create the component directory scaffolding (empty index files to confirm structure):
    - `src/components/home/` directory
    - `src/components/shared/` directory

    Do NOT create component files yet — that is Task 2.
  </action>
  <verify>
    Run `npm list react-hook-form zod @hookform/resolvers` — all three show installed versions.
    Run `ls src/components/home src/components/shared` — directories exist.
  </verify>
  <done>Dependencies installed without errors; component directories exist.</done>
</task>

<task type="auto">
  <name>Task 2: Build HeroSection and TrustSignals</name>
  <files>
    src/components/home/HeroSection.tsx
    src/components/shared/TrustSignals.tsx
  </files>
  <action>
    Create `src/components/shared/TrustSignals.tsx`:
    - Export a `TrustSignals` component rendering 3 inline badges:
      "Oracle Certified" | "7,200+ Hours Delivered" | "3 Continents"
    - Use Tailwind: `flex gap-4 flex-wrap text-sm font-medium text-gray-600`
    - Each badge is a `<span>` with a subtle border: `border border-gray-200 rounded-full px-3 py-1`

    Create `src/components/home/HeroSection.tsx`:
    - Desktop: two-column grid (`md:grid-cols-2 gap-12 items-center`)
    - Mobile: single column (default flex-col)
    - Left column:
      - Eyebrow: small uppercase text "AI Systems Consultant" in muted color
      - H1 (pain-first): "You're spending more time managing your business than growing it." — bold, large (text-4xl md:text-5xl)
      - Subheading: "AI-powered systems that eliminate the repetitive work keeping you stuck in operations." — text-lg text-gray-600
      - Primary CTA button: `<Link href="/assessment">` with label "Take the Free AI Readiness Assessment" — solid dark background, white text, rounded-lg, px-6 py-3
      - Secondary CTA: `<a href="https://calendly.com/asorahura" target="_blank" rel="noopener">` with label "Book a Strategy Call" — outlined variant, same sizing
      - `<TrustSignals />` below the two CTAs
    - Right column: `<Image src="/images/asor.jpg" alt="Asor Ahura" width={480} height={480} className="rounded-2xl object-cover w-full" priority />`
    - Use `next/image` for the photo (not `<img>`). Add `priority` prop since it's above-fold.
    - Wrap entire section in `<section className="container mx-auto px-4 py-16 md:py-24">`
  </action>
  <verify>
    Run `npx tsc --noEmit` — no TypeScript errors in new files.
    Run `npm run dev` and visit http://localhost:3000 — two-column layout visible on desktop, single column on mobile (resize browser).
    Confirm photo renders and both CTA buttons are visible above fold.
  </verify>
  <done>
    HeroSection renders two-column on desktop, single-column on mobile. Both CTAs present with correct hrefs. TrustSignals show 3 badges below CTAs. Asor photo renders via next/image without 404.
  </done>
</task>

<task type="auto">
  <name>Task 3: Build remaining homepage sections and wire into page.tsx</name>
  <files>
    src/components/home/PainSection.tsx
    src/components/home/ServicesPreview.tsx
    src/components/home/SocialProof.tsx
    src/components/home/ProcessTimeline.tsx
    src/components/home/AboutSection.tsx
    src/components/home/LeadMagnetStrip.tsx
    src/components/home/Footer.tsx
    src/app/page.tsx
  </files>
  <action>
    Create each section component as a named export. Use Tailwind throughout. All sections: `container mx-auto px-4 py-16`.

    **PainSection.tsx** (HOME-05):
    - Section heading: "Sound familiar?"
    - 3-column card grid (`grid md:grid-cols-3 gap-6`), responsive (1-col mobile)
    - Cards: (1) "You're the bottleneck" — copy about manual approval loops; (2) "Every task needs you" — copy about delegation failures; (3) "You can't scale without hiring" — copy about headcount pressure
    - Each card: white bg, subtle shadow, rounded-xl, p-6, icon from lucide-react (e.g., Clock, AlertCircle, Users)

    **ServicesPreview.tsx** (HOME-06):
    - Section heading: "How I help"
    - 3 service cards: "AI Audit & Roadmap" ($5k), "Ops Automation Build" ($5k–$15k), "Systems Architecture" ($15k–$30k+)
    - Each card: title, 2-line description, price anchor, "Learn More" link (href="/engage" for now)
    - Note: Pricing anchors are for signaling only — not wired to payment yet

    **SocialProof.tsx** (HOME-07):
    - Section heading: "What clients say"
    - 3 testimonials as blockquote cards
    - Testimonial 1: Reference Lloyd's List or shipping industry outcome
    - Testimonial 2: Resume/career transformation outcome with specific metric
    - Testimonial 3: Operations time saved with specific number
    - Each card: quote, name, title/company — use placeholder names (e.g., "C.M., Operations Director, Lloyd's List") if real names not yet provided
    - Use italic text for quote body, bold for attribution

    **ProcessTimeline.tsx** (HOME-08):
    - Section heading: "How it works"
    - 4-step horizontal timeline on desktop, vertical on mobile
    - Steps: 1. "Discovery Call" → 2. "AI Audit" → 3. "Systems Build" → 4. "You Scale"
    - Each step: numbered circle badge, step name, one-line description
    - Desktop: `flex gap-8 items-start`, Mobile: `flex flex-col gap-6`

    **AboutSection.tsx** (HOME-09):
    - Section heading: "Who's behind this"
    - Two-column: informal photo left (use `/images/asor.jpg` again, smaller, rounded-full), copy right
    - Copy: brief bio — Oracle Certified, 7,200+ hours, built systems for clients in 3 continents
    - Keep it human, first-person, 3-4 sentences max

    **LeadMagnetStrip.tsx** (HOME-10):
    - Full-width dark background strip (`bg-gray-900 text-white`)
    - Heading: "Not sure where to start?"
    - Subtext: "Take the 4-minute AI Readiness Assessment and get a personalized score."
    - CTA button: `<Link href="/assessment">` "Start Free Assessment" — white bg, dark text

    **Footer.tsx** (HOME-11):
    - Dark background (`bg-gray-950 text-gray-400`)
    - Three columns: logo/tagline | navigation links (Home, Assessment, Engage, Work) | legal (Privacy Policy, Terms)
    - Bottom bar: copyright line "© 2026 Asor Ahura. All rights reserved."
    - Social links: LinkedIn icon (lucide-react `Linkedin`), external link to profile

    **src/app/page.tsx** — update/replace to compose all sections:
    ```tsx
    import HeroSection from "@/components/home/HeroSection";
    import PainSection from "@/components/home/PainSection";
    import ServicesPreview from "@/components/home/ServicesPreview";
    import SocialProof from "@/components/home/SocialProof";
    import ProcessTimeline from "@/components/home/ProcessTimeline";
    import AboutSection from "@/components/home/AboutSection";
    import LeadMagnetStrip from "@/components/home/LeadMagnetStrip";
    import Footer from "@/components/home/Footer";

    export default function HomePage() {
      return (
        <main>
          <HeroSection />
          <PainSection />
          <ServicesPreview />
          <SocialProof />
          <ProcessTimeline />
          <AboutSection />
          <LeadMagnetStrip />
          <Footer />
        </main>
      );
    }
    ```

    Do NOT remove the existing layout.tsx — it stays in place. Only replace page.tsx content.
  </action>
  <verify>
    Run `npx tsc --noEmit` — no TypeScript errors.
    Run `npm run dev`, visit http://localhost:3000 — scroll through all sections:
    - Hero visible with photo + two CTAs
    - 3-column pain cards present
    - 3 service cards with pricing anchors
    - 3 testimonials with attributions
    - 4-step timeline
    - About section with photo
    - Lead magnet strip with assessment CTA
    - Footer with nav + social + copyright
    - Resize to mobile: all sections stack to single column
  </verify>
  <done>
    All 11 homepage sections render without errors. Homepage scrolls through HeroSection → PainSection → ServicesPreview → SocialProof → ProcessTimeline → AboutSection → LeadMagnetStrip → Footer. Both assessment CTAs link to /assessment. Strategy Call link points to Calendly. Mobile layout collapses correctly.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Verify: Homepage visual review</name>
  <files>src/app/page.tsx</files>
  <action>No automated action — this is a human visual verification step after all auto tasks complete.</action>
  <verify>Human confirms all 11 sections render correctly per the how-to-verify checklist below</verify>
  <done>User types "homepage approved" — all 11 sections visible, both CTAs working, mobile layout verified</done>
  <what-built>Complete 11-section homepage with hero, pain, services, social proof, timeline, about, lead magnet strip, and footer — all mobile-responsive.</what-built>
  <how-to-verify>
    1. Run `npm run dev`, open http://localhost:3000
    2. Confirm: Asor photo visible on right side of hero (desktop)
    3. Confirm: "Take the Free AI Readiness Assessment" button is above the fold
    4. Confirm: "Book a Strategy Call" secondary CTA present
    5. Confirm: 3 trust signal badges visible below CTAs
    6. Scroll down — confirm all 8 remaining sections visible
    7. Resize browser to mobile width (~375px) — confirm single column layout throughout
    8. Click assessment CTA — should route to /assessment (404 expected, page not built yet — that's fine)
  </how-to-verify>
  <resume-signal>Type "homepage approved" or describe any issues to fix</resume-signal>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes with zero errors
- `npm run build` completes without errors
- All 11 requirement IDs (HOME-01 through HOME-11) have corresponding implementation in section components
- `/assessment` href appears in HeroSection and LeadMagnetStrip
- Calendly href appears in HeroSection secondary CTA
- All images use `next/image` (not raw `<img>` tags)
- No console errors on page load
</verification>

<success_criteria>
- Homepage renders at / with all 11 sections in correct order
- Two-column hero on desktop, single-column on mobile (verified by visual resize)
- Primary CTA links to /assessment; secondary CTA links to Calendly
- TrustSignals component rendered below CTAs with Oracle Certified, 7,200+ hours, 3 continents
- Zero TypeScript errors
- Zero build errors
</success_criteria>

<output>
After completion, create `.planning/phases/01-critical-path/01-1a-SUMMARY.md` documenting:
- Components created and their file paths
- Copy decisions made (exact H1 text, tagline, testimonial placeholders used)
- Any deviations from the plan and why
- Verification results
</output>
