---
phase: 01-critical-path
plan: 2
type: execute
wave: 2
depends_on:
  - 01-1a-homepage
  - 01-1b-assessment
  - 01-1c-checkout
files_modified:
  - src/app/layout.tsx
  - src/app/globals.css
  - next.config.mjs
autonomous: false
requirements:
  - HOME-01
  - HOME-02
  - HOME-03
  - ASSESS-01
  - CHECK-01

must_haves:
  truths:
    - "Homepage, assessment, and checkout all render without JavaScript errors in the browser console"
    - "Navigating from the homepage CTA to /assessment works without a 404"
    - "Navigating from /assessment results 'Book a Discovery Call' to Calendly opens in a new tab"
    - "The site builds successfully with npm run build and no TypeScript errors"
    - "All three pages are mobile-responsive — no horizontal scroll on 375px viewport"
    - "No orphaned imports or unused components from Wave 1 work"
  artifacts:
    - path: "src/app/layout.tsx"
      provides: "Root layout wrapping all pages with consistent fonts and global styles"
      min_lines: 20
    - path: "next.config.mjs"
      provides: "Next.js config with any required settings for Paddle script and external domains"
      min_lines: 10
  key_links:
    - from: "src/app/layout.tsx"
      to: "src/app/globals.css"
      via: "import statement"
      pattern: "import.*globals.css"
    - from: "src/app/page.tsx"
      to: "src/components/home/HeroSection.tsx"
      via: "import and JSX render"
      pattern: "HeroSection"
    - from: "src/app/assessment/page.tsx"
      to: "src/components/assessment/AssessmentShell.tsx"
      via: "import and JSX render"
      pattern: "AssessmentShell"
    - from: "src/app/checkout/page.tsx"
      to: "src/components/checkout/PaddleCheckout.tsx"
      via: "import and JSX render"
      pattern: "PaddleCheckout"
---

<objective>
Integration and polish pass: verify that all three Wave 1 builds (homepage, assessment, checkout) work together as a cohesive site. Fix any cross-cutting issues (layout, fonts, global CSS, Next.js config), confirm end-to-end navigation works, and validate a clean production build.

Purpose: Wave 1 plans run in parallel and may have minor inconsistencies — different Tailwind class approaches, missing layout wrappers, font inconsistencies, or build errors introduced by new dependencies. This plan resolves all of that before Phase 1 is declared complete.

Output: A production build that compiles cleanly, with consistent visual styling across all three pages, working navigation between pages, and no console errors.
</objective>

<execution_context>
@C:/Users/HP_PC/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/HP_PC/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/01-critical-path/01-1a-SUMMARY.md
@.planning/phases/01-critical-path/01-1b-SUMMARY.md
@.planning/phases/01-critical-path/01-1c-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix layout, global styles, and Next.js config</name>
  <files>
    src/app/layout.tsx
    src/app/globals.css
    next.config.mjs
  </files>
  <action>
    **Read the current `src/app/layout.tsx` and `next.config.mjs`** before editing — do not overwrite any existing configuration that's already working.

    **Update `src/app/layout.tsx`:**
    - Ensure the root layout wraps all page content with a consistent font (Next.js `localFont` or `next/font/google`)
    - Use Inter or Geist (whichever the existing project already has configured) — do not change if already set
    - Confirm metadata includes `title` and `description` defaults
    - Confirm there is no extra padding/margin on `<body>` that would conflict with section-level padding in the new components
    - Remove any stale placeholder content from the original page (e.g., old logo references, create-next-app boilerplate links)

    **Update `next.config.mjs`:**
    - Add `images.domains` or `images.remotePatterns` if any external image URLs are used (Asor's photo is local — no remote patterns needed for Phase 1)
    - If PDFKit causes any Node.js module warnings during build (common: `canvas`, `fs`), add to `webpack.externals` or configure `serverComponentsExternalPackages`:
      ```js
      // next.config.mjs
      const nextConfig = {
        experimental: {
          serverComponentsExternalPackages: ["pdfkit"],
        },
        images: {
          remotePatterns: [], // No external images in Phase 1
        },
      };
      export default nextConfig;
      ```
    - Do NOT add unnecessary config — only add what's needed to fix build errors.

    **Update `src/app/globals.css`:**
    - Confirm Tailwind base/components/utilities directives are present
    - Add only: `html { scroll-behavior: smooth; }` if not already present
    - Do NOT overwrite existing CSS — only append what's missing
  </action>
  <verify>
    Run `npm run build` — confirm it completes without errors.
    Check build output for any PDFKit-related warnings and confirm they're suppressed.
  </verify>
  <done>
    `npm run build` exits with code 0. No TypeScript errors. No webpack module errors. All three pages (/, /assessment, /checkout) appear in the build output routes list.
  </done>
</task>

<task type="auto">
  <name>Task 2: Cross-page consistency audit and navigation smoke test</name>
  <files>
    src/app/page.tsx
    src/app/assessment/page.tsx
    src/app/checkout/page.tsx
  </files>
  <action>
    **Visual consistency check (automated where possible):**

    Read each of the three page files and their key child components. Look for and fix:

    1. **Inconsistent container widths:** All sections should use `container mx-auto px-4` (or equivalent). If any section uses a fixed pixel width instead, standardize to the container approach.

    2. **Font size inconsistency:** H1 headings should be `text-4xl md:text-5xl` across pages. Check HeroSection, AssessmentPage hero, and CheckoutPage heading are consistent.

    3. **Missing `"use client"` directives:** Verify that any component using React hooks (`useState`, `useEffect`, `useForm`) has `"use client"` at the top. Scan: AssessmentShell, QuestionCard, EmailGate, TierSelector, CheckoutPage, PaddleCheckout.

    4. **Server Action boundary:** Verify `src/app/assessment/actions.ts` has `"use server"` at the top. If missing, add it.

    5. **Orphaned imports:** Check each page file for any imported components that are not used in the JSX. Remove unused imports.

    6. **Mobile overflow:** If any component uses fixed pixel widths (e.g., `w-[600px]`) on containers, replace with responsive equivalents (`max-w-xl w-full`).

    **Navigation links audit:**
    - Homepage primary CTA: `href="/assessment"` — confirm correct
    - Homepage secondary CTA: `href="https://calendly.com/asorahura"` — confirm external with `target="_blank" rel="noopener noreferrer"`
    - Homepage LeadMagnetStrip: `href="/assessment"` — confirm correct
    - Assessment results: Calendly link — confirm `target="_blank" rel="noopener noreferrer"`
    - Checkout success: "Return to Homepage" `href="/"` — confirm correct
    - Footer nav links: confirm they use Next.js `<Link>` not `<a>` for internal routes

    Fix any issues found. Do NOT change working code — only fix the specific items listed above.
  </action>
  <verify>
    Run `npx tsc --noEmit` — zero errors.
    Run `npm run dev`:
    - Visit / — no console errors
    - Click "Take the Free AI Readiness Assessment" — navigates to /assessment without 404
    - Complete assessment through to results — click "Book a Discovery Call" — opens Calendly in new tab
    - Navigate back to / — click "Book a Strategy Call" in hero — opens Calendly in new tab
    - Navigate to /checkout manually — page loads without errors
    - Navigate to /checkout/success manually — page loads without errors
    - Resize all three pages to 375px — no horizontal scroll on any page
  </verify>
  <done>
    All three pages load without console errors. Internal navigation works without 404. External Calendly links open in new tab. No horizontal scroll at 375px viewport on any page. Zero TypeScript errors.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Verify: Full Phase 1 end-to-end walkthrough</name>
  <files>src/app/page.tsx</files>
  <action>No automated action — this is the final human sign-off checkpoint for Phase 1. All auto tasks must complete before this step.</action>
  <verify>Human walks through the complete Phase 1 user journey per the how-to-verify checklist and confirms approval</verify>
  <done>User types "phase 1 approved" — full journey from homepage through assessment through checkout verified on desktop and mobile</done>
  <what-built>
    Complete Phase 1 site: pain-first homepage (11 sections), AI readiness assessment with 8 role-branching questions + email gate + results + PDF email delivery, and Paddle inline checkout with 4-tier pricing. All mobile-responsive, production build clean.
  </what-built>
  <how-to-verify>
    Run `npm run build` first — confirm it exits without errors.
    Then run `npm run dev` for interactive testing.

    **Homepage (/):**
    1. Confirm two-column hero on desktop (photo right, copy left), single-column on mobile
    2. Confirm "Take the Free AI Readiness Assessment" CTA visible above fold
    3. Confirm "Book a Strategy Call" secondary CTA visible
    4. Confirm 3 trust signal badges below CTAs
    5. Scroll through all 8 remaining sections — confirm all visible with real content (no Lorem ipsum)
    6. Confirm footer has nav links, social, copyright

    **Assessment (/assessment):**
    7. Click homepage primary CTA — confirm navigation to /assessment without errors
    8. Start assessment, complete all 8 questions using role "Founder"
    9. Confirm progress bar advances correctly (1/8 → 8/8)
    10. Confirm Q2 shows Founder-specific options
    11. Confirm email gate appears BEFORE score is shown
    12. Submit with a real email (if Resend is configured) or any email (to test flow)
    13. Confirm results screen shows a score (0-100), tier name, 3 bullets, green "report on the way" banner, Calendly CTA
    14. If Resend is configured: check email inbox for PDF attachment

    **Checkout (/checkout):**
    15. Navigate to /checkout
    16. Confirm all 4 tiers selectable, OrderSummary updates per tier
    17. Confirm Trust badges visible
    18. Confirm Paddle frame loads (or skeleton shows if token not yet configured)
    19. Confirm "This is a test transaction" disclaimer visible

    **Mobile (all pages):**
    20. Test all three pages at 375px — no horizontal scroll, all CTAs tappable

    Report any broken sections, 404s, or visual issues.
  </how-to-verify>
  <resume-signal>Type "phase 1 approved" or list specific issues to fix before sign-off</resume-signal>
</task>

</tasks>

<verification>
- `npm run build` exits with code 0 — no build errors
- `npx tsc --noEmit` — zero TypeScript errors
- All pages render: /, /assessment, /checkout, /checkout/success
- No 404s on internal navigation
- No horizontal overflow at 375px on any page
- "use client" present on all hook-using components
- "use server" present in assessment/actions.ts
- All 26 Phase 1 requirement IDs have been addressed across plans 1A, 1B, 1C, and 2
</verification>

<success_criteria>
- `npm run build` succeeds with all 4 pages in the output
- Full end-to-end user journey works: homepage → assessment → results → checkout
- Zero console errors across all pages on first load
- Site is visually consistent (same container widths, font scale, Tailwind spacing system)
- Mobile-responsive across all three journeys (no horizontal scroll at 375px)
- Phase 1 human approval received ("phase 1 approved" signal)
</success_criteria>

<output>
After completion, create `.planning/phases/01-critical-path/01-2-SUMMARY.md` documenting:
- Issues found and fixed during integration pass
- Build output routes (list of pages confirmed in build)
- Any remaining known issues to address in Phase 2
- Final verification results and approval timestamp
</output>
