---
phase: 7
slug: product-1-page-live-payments-revenue
status: draft
shadcn_initialized: false
preset: none
created: 2026-08-07
---

# Phase 7 — UI Design Contract: Product #1 Page Live + Payments (REVENUE)

> Visual and interaction contract for the `/automate` product page and success flow. Phase 7 is the first revenue-generating page, built entirely on Phase 6 light-first token system. This contract specifies component structure, copy, and interaction states needed to convert a creator/coach from Reel to purchase.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | Custom CSS (Phase 6 tokens in globals.css) |
| Preset | not applicable |
| Component library | none |
| Icon library | lucide-react |
| Font | Inter (sans) — no serif override |
| Color model | Light-first Direction B (Phase 6 locked) |

**Token Location:** `src/app/globals.css` `:root` block (inherited from Phase 6)

**No new tokens are declared in Phase 7.** All spacing, color, type, radius, shadow, and transition values are sourced from Phase 6 definitions.

---

## Spacing Scale

Inherited directly from Phase 6. **No exceptions.**

| Token | Value | Usage on `/automate` |
|-------|-------|----------------------|
| `--spacing-xs` | 4px | Form field inline spacing, icon margins |
| `--spacing-sm` | 8px | Form input padding, button text padding |
| `--spacing-md` | 16px | Section gaps, card padding |
| `--spacing-lg` | 24px | Section top padding, form groups |
| `--spacing-xl` | 32px | Hero bottom spacing, comparison strip margins |
| `--spacing-2xl` | 48px | Major section breaks (Hero → Comparison → Pricing → Success) |

**Container and padding:**
- Hero section: `padding: var(--spacing-2xl) var(--spacing-lg)` (responsive: `var(--spacing-lg) var(--spacing-md)` on mobile)
- Product comparison strip: `padding: var(--spacing-2xl) var(--spacing-lg)` (horizontal scroll on mobile)
- Form sections: `gap: var(--spacing-md)` between fields, `gap: var(--spacing-lg)` between form groups
- CTA buttons: `padding: var(--spacing-sm) var(--spacing-md)` (44px min height for touch targets)

---

## Typography

Inherited directly from Phase 6. **All sizes, weights, and line heights match Phase 6 specification.**

### Usage on `/automate` Page

| Role | Size | Weight | Line Height | Usage on `/automate` |
|------|------|--------|-------------|----------------------|
| Body | 16px | 400 | 1.6 | Default prose, form labels, paragraph copy |
| Lead | 18px | 400 | 1.6 | Comparison strip tier names, form helper text |
| Subtitle | 20px | 700 | 1.5 | Section subheadings, card titles ("DFY" / "DWY" / "Care Plan"), pricing subtitles |
| Heading | 24px | 700 | 1.3 | Section headings ("Comparison", "Pricing", "FAQ") |
| Large | 32px | 700 | 1.2 | Page section heads ("Your bill goes up. Ours doesn't.") |
| Display | 48px | 700 | 1.1 | Hero headline ("Instagram Lead Automation for Creators") |
| Small | 12px | 400 | 1.4 | Form error messages, footnotes, timestamps |

**No new font sizes, weights, or line heights are declared.** All text on `/automate` uses these 7 predefined roles.

**Letter Spacing:** h1–h4 retain `-0.02em` tracking (set globally in `globals.css`).

---

## Color Palette

Inherited directly from Phase 6 Direction B. **All hex values are locked; no overrides.**

| Role | Value | Usage on `/automate` |
|------|-------|----------------------|
| **Surface 1** | `#FDFAF4` | Page background, default section backgrounds |
| **Surface 2** | `#F9F4ED` | Card backgrounds (pricing tiers, FAQs), form input backgrounds |
| **Surface 3** | `#F2EBDE` | Button/input hover state, form field focus state |
| **Surface 4** | `#FFFEF9` | Inverse text backgrounds, light overlays, quote/callout backgrounds |
| **Ink 1** | `#1F1B17` | Primary text (headlines, body), form labels |
| **Ink 2** | `#5D564E` | Secondary text (helper text, muted copy), comparison tier descriptions |
| **Ink 3** | `#8B827A` | Tertiary text (disabled form state, footnotes, disclaimer copy) |
| **Accent** | `#C9A86D` | Primary CTA buttons (Download, Purchase, Submit) — reserved for clickable actions only |
| **Accent Hover** | `#B5985B` | CTA button hover state |
| **Accent Active** | `#A1854A` | CTA button pressed/active state |
| **Success** | `#3D6B1F` | Form validation success (email valid), checkmark indicators |
| **Error** | `#AA3918` | Form validation errors, payment failures, destructive confirmations |
| **Warn** | `#9B5F1A` | Caution notices, refund policy disclaimers |
| **Border 1** | `rgba(31, 27, 23, 0.08)` | Subtle dividers, form field borders |
| **Border 2** | `rgba(31, 27, 23, 0.16)` | Default form input borders, card dividers |

### Accent Reservation (10% of visual weight)

Accent color (`#C9A86D`) is reserved exclusively for:
1. **Primary CTA buttons:** "Download Build Map", "Purchase DFY", "Purchase DWY", "Subscribe to Care Plan", "Submit", "Proceed to Checkout"
2. **Success indicators:** Email validation checkmark (inline icon), success page confirmation badge
3. **Active/selected states:** Tier cards when selected, selected comparison tier highlighting

Accent is **never** used for:
- Secondary buttons (use Ink 2 on Surface 2)
- Links (use Ink 1 with underline)
- Borders or dividers (use Border 1/2)
- Text emphasis (use Ink 1 weight increase instead)

---

## Page Structure & Sections

Phase 7 ships `/automate` as a self-contained page with no site navigation until Phase 9. All sections follow the spacing and typography contract above.

### Section 1: Header (Self-Contained)

**Route group:** `(automate)/layout.tsx`

- Logo-only header: "Asor Ahura" as text or small mark (44px height min for touch)
- No site navigation, no secondary menu
- Background: Surface 1
- Border bottom: Border 1
- Responsive: Sticky on mobile (does not scroll away)

### Section 2: Hero Section

**Copy Framework:** Revenue-first, operator-to-operator tone. Lead with income promise, not time saved.

**Layout:**
- Headline (Display, 48px): "Instagram Lead Automation for Creators"
- Subheading (Lead, 18px): "Stop paying by the contact. Own your list. The bill stays flat at $6/mo."
- Live Reel embed (iframe, 9:16 aspect ratio on mobile, 4:3 on desktop)
- CTA button (primary, Accent): "Get Yours Now" (opens checkout or scrolls to comparison)
- Background: Surface 1 with optional gradient overlay using Surface 2 at 0.1 opacity

**Spacing:**
- Padding: `var(--spacing-2xl)` top/bottom, `var(--spacing-lg)` left/right
- Headline to subheading gap: `var(--spacing-md)`
- Subheading to Reel: `var(--spacing-lg)`
- Reel to CTA: `var(--spacing-lg)`

### Section 3: "Try It Right Now" Block (PROD-08)

**Copy:** "Comment the keyword on the live post below and receive the DM yourself."

**Layout:**
- Headline (Subtitle, 20px): "Try it right now"
- Body text (Body, 16px): Instruction copy above
- Embedded Reel (same as Hero, or reference/link)
- Background: Surface 2 (light card-like container)
- Padding: `var(--spacing-lg)` all sides

### Section 4: Product Comparison Strip (PROD-05, PROD-06)

**Purpose:** Show ManyChat tiers as a ratchet (path of climbing costs) vs. owned system staying flat.

**Layout:**
- Section heading (Large, 32px): "Your bill climbs as your ads work. Ours doesn't."
- Four ManyChat tier cards (flow left-to-right with arrows between):
  - Card 1: "50 contacts" → $17/mo
  - Card 2: "250 contacts" → $39/mo
  - Card 3: "1,000 contacts" → $99/mo
  - Card 4: "5,000+ contacts" → $199/mo
- Flat line visual: "$6/mo forever" as a baseline under all cards
- Card styling: Surface 2 background, Border 2, radius-md
- Card text: Tier name (Lead, 18px), price (Heading, 24px), contact count (Body, 16px)
- Arrows between cards: Ink 2, with "→" symbol or icon
- Responsive: Horizontal scroll on mobile (not reflow to grid)

### Section 5: Pricing Section (PROD-01, PROD-03, PROD-04)

**Three tier cards side-by-side (responsive: stack to 2 cols on tablet, 1 col on mobile).**

**Tier 1: Build Map (DIY)**
- Card background: Surface 2
- Card title (Subtitle, 20px): "Build Map"
- Price (Display/Large, 32px): "Free"
- Description (Body, 16px): "4 n8n workflows, environment template, deployment guide. Self-host at ~$6/mo."
- Feature list (Body, 16px, Ink 2):
  - "Full source code + documentation"
  - "Deploy to your own server"
  - "No vendor lock-in"
- Primary CTA (Accent): "Download Build Map"
- CTA action: Opens inline email form (see Section 6 below)

**Tier 2: Done For You (DFY)**
- Card background: Surface 2 (highlight with subtle accent accent border if selected)
- Badge (Small, 12px, Error bg): "FASTEST" (optional, based on PROJECT.md intent)
- Card title (Subtitle, 20px): "Done For You"
- Price (Display/Large, 32px): "$500"
- Subheading (Lead, 18px): "one-time"
- Description (Body, 16px): "Provisioned server, Meta app setup, live in 3–5 days."
- Feature list (Body, 16px, Ink 2):
  - "We handle all technical setup"
  - "Live and tested on your account"
  - "Training call included"
  - "Care Plan recommended ($9.99/mo)"
- Primary CTA (Accent): "Purchase DFY"
- CTA action: Opens Paddle checkout with `NEXT_PUBLIC_PADDLE_PRICE_ID_DFY`

**Tier 3: Done With You (DWY)**
- Card background: Surface 2
- Card title (Subtitle, 20px): "Done With You"
- Price (Display/Large, 32px): "$800"
- Subheading (Lead, 18px): "one-time"
- Description (Body, 16px): "Screen-to-screen build session. You maintain it going forward."
- Feature list (Body, 16px, Ink 2):
  - "Learn as we build"
  - "You own all credentials"
  - "Full walkthrough included"
  - "Self-maintained after launch"
- Primary CTA (Accent): "Purchase DWY"
- CTA action: Opens Paddle checkout with `NEXT_PUBLIC_PADDLE_PRICE_ID_DWY`

**Care Plan (Recurring)**
- Separate from tier cards (can be below or to the side)
- Card background: Surface 2
- Badge (Small, 12px, Success bg): "ADD-ON"
- Card title (Subtitle, 20px): "Care Plan (optional)"
- Price (Heading, 24px): "$9.99/mo" (NOT $99/mo — §H4-R typo fixed)
- Description (Body, 16px): "Token renewals, uptime monitoring, copy updates, priority support."
- Feature list (Body, 16px, Ink 2):
  - "Meta API token refreshes"
  - "99.5% uptime SLA"
  - "Monthly review & optimization"
- Primary CTA (Accent, outlined): "Subscribe Now"
- CTA action: Opens Paddle checkout with `NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN`
- Note: Can be purchased standalone or added to DFY/DWY checkout

**Card styling (all tiers):**
- Border: Border 2
- Radius: radius-md
- Shadow: shadow-md
- Padding: `var(--spacing-lg)` all sides
- Gap between elements: `var(--spacing-md)`

### Section 6: Build Map Email Capture Form (LEAD-01, LEAD-04)

**Triggered by:** User clicks "Download Build Map" CTA

**Form behavior:**
- Appears inline on page or in modal (recommend inline to avoid friction)
- Background: Surface 2 card
- Padding: `var(--spacing-lg)`

**Form fields:**
1. Email input (required)
   - Label (Body, 16px): "Your email"
   - Placeholder: "you@example.com"
   - Validation: Real-time RFC-compliant email check (Zod)
   - Visual feedback:
     - Empty/invalid: Border 2 (neutral)
     - Valid: Border 1 with Success indicator (green checkmark, Ink 3 size)
     - Error: Error color border + error message below
   - On blur: If email exists in Resend contacts with `build-map-downloader` tag, show "You're already signed up" message (friendly, no error)
   - Max width: 400px

2. CTA button (primary, Accent)
   - Label: "Send Download Link"
   - Disabled state: Ink 3 text, Surface 3 background (until email valid)
   - Loading state: Show spinner or "Sending..." text
   - Success state: "✓ Check your inbox" message (Success color), form clears after 2s

**Form submission:**
- POST to `/api/subscribe`
- Payload: `{ email: string }`
- Resend: Create contact with `automate-buyer` tag (LEAD-04)
- Email delivery: From `hello@asorahura.com`, template with download link for Build Map deliverable
- Error handling: If email already exists, silently succeed (idempotent); if Resend fails, show "Unable to send. Please try again." (Error color)

**Analytics:**
- Fire event: `"Build Map Submit"` on success

### Section 7: Phone Mockup (PROD-09)

**Copy:** "Real screenshot of @ai_learnt's live account. This works."

**Layout:**
- iPhone mockup frame (image or SVG)
- Screenshot inside: DM conversation showing lead capture in action
- Label below (Small, 12px, Ink 2): "Real screenshot. Live account. Working now."
- Positioning: Right-aligned on desktop (text left, mockup right), stacks on mobile

**Image:**
- Responsive: Max width 300px on desktop, full width on mobile
- Alt text: "Instagram DM showing lead capture in action"

### Section 8: FAQ Section (PROD-13)

**Sticky accordion or expandable list.**

**Sample Q&A (derived from REQUIREMENTS.md + common objections):**

1. **Q:** "What if I already use ManyChat or Zapier?"
   - A: "This integrates alongside your existing tools. It's not a replacement—it's an owned system that doesn't grow in cost."

2. **Q:** "Can I move to a different platform later?"
   - A: "Yes. The source code is yours, and all data stays in your database. You own the system."

3. **Q:** "What if I'm not a creator or coach?"
   - A: "This works for any business using Instagram ads. Creators and coaches see the fastest ROI because lead volume is predictable."

4. **Q:** "Can I get a refund?"
   - A: "Yes. 30-day money-back guarantee on DFY and DWY. Care Plan is billed monthly and can be cancelled anytime."

**Styling:**
- Accordion items: Surface 2 card, Border 2
- Question text (Subtitle, 20px, Ink 1): Bold, clickable area
- Answer text (Body, 16px, Ink 2): Appears below on expand
- Padding: `var(--spacing-md)` inside each item
- Icon: "+" (closed) and "−" (open) using lucide-react ChevronDown

### Section 9: Footer (Self-Contained)

**Route group:** `(automate)/layout.tsx` (custom footer for this route group)

- Text content (Small, 12px, Ink 2):
  - Copyright year (computed dynamically, not hardcoded)
  - Links: Privacy Policy, Terms of Service, Refund Policy
- Background: Surface 1
- Border top: Border 1
- Padding: `var(--spacing-lg)` all sides
- Text alignment: Center on mobile, left on desktop

---

## Form Validation & Interaction States

### Email Capture Form (Build Map)

| State | Visual | Copy | Color |
|-------|--------|------|-------|
| Empty | Border 2, placeholder text visible | "Your email" | Border 2 (Ink 3) |
| Focused | Border 2, Surface 3 background | "Your email" | Border 2 |
| Invalid (typing) | Border 2, error message below | "Invalid email format" | Error |
| Valid | Border 1, Success checkmark icon | (none, visual only) | Success |
| Submitting | Button shows spinner, input disabled | "Sending..." on button | Ink 3 |
| Success | Form clears, success message appears | "Check your inbox for your download link" | Success |
| Error | Error message replaces input (optional) | "Couldn't send email. Please try again." | Error |
| Already Signed Up | Friendly message, form remains | "You're already on our list. Check your email." | Ink 2 |

### DFY/DWY/Care Plan Purchase Buttons

| State | Visual | Copy | Color |
|-------|--------|------|-------|
| Default | Accent background, white text | "Purchase DFY" / "Purchase DWY" / "Subscribe Now" | Accent |
| Hover | Accent Hover background | Same | Accent Hover |
| Active/Pressed | Accent Active background | Same | Accent Active |
| Loading | Spinner inside button, text "Processing..." | "Processing..." | Accent (disabled) |
| Success | Button disappears, "✓ Redirecting to checkout" message | (success message) | Success |

### Success Page Form (DFY/DWY Onboarding)

After purchase, user lands on `/automate/success?product=dfy` or `?product=dwy`.

**Form fields:**

1. IG Handle (required)
   - Label (Body, 16px): "Your Instagram handle"
   - Placeholder: "@yourhandle"
   - Validation: Regex accepts alphanumeric, periods, underscores; @ is optional
   - Error: "Invalid Instagram handle"
   - Max length: 30 characters

2. Keyword (required)
   - Label (Body, 16px): "The keyword/phrase people comment"
   - Placeholder: "e.g., 'AUTOMATE'"
   - Validation: No validation; free text
   - Max length: 50 characters

3. Lead Magnet Link (required)
   - Label (Body, 16px): "Your lead magnet landing page (bit.ly or short link)"
   - Placeholder: "https://bit.ly/your-lead-magnet"
   - Validation: Must be valid URL or short link (contains 'bit.ly', 'short', etc.)
   - Error: "Please provide a valid URL"

4. Voice & Tone Notes (required)
   - Label (Body, 16px): "Brief notes on your voice/tone (so we match your style)"
   - Placeholder: "e.g., 'Casual and funny, use emojis, Gen Z audience'"
   - Validation: Min 10 chars, max 200 chars
   - Error: "Please provide at least 10 characters"

5. (DWY only) Scheduling Link
   - Label (Body, 16px): "When would you like to build? [Book a time]"
   - CTA button (outlined, Accent): "Schedule Build Session"
   - Opens Calendly/scheduling link in new tab

**Form styling:**
- Background: Surface 2 card
- Padding: `var(--spacing-lg)`
- Field gaps: `var(--spacing-md)`
- Input styling: Border 2, Surface 1 background, radius-md
- Label styling: Body 16px, Ink 1, weight 700, `margin-bottom: var(--spacing-sm)`

**Form submission:**
- POST to `/api/automate/onboarding` (new endpoint)
- Payload: `{ product: "dfy" | "dwy", igHandle, keyword, leadMagnetLink, voiceTone, [schedulingDate] }`
- Response: Show "✓ We'll be in touch soon. Check your email for next steps." (Success color)
- Store in database or send to owner email (via Resend) with purchase details

**Analytics:**
- Fire event: `"Success Page Submit"` on submission

### CTA Button Touch Targets

All CTA buttons must be **minimum 44px height** for mobile accessibility (WCAG AAA touch target).

- Padding: `var(--spacing-sm) var(--spacing-md)` = 8px top/bottom, 16px left/right = ~44px height with 16px body text
- Text alignment: Center
- Border radius: radius-md
- Font weight: 700 (bold) for emphasis

---

## Checkout Flow (Paddle Integration)

### Checkout Button States

**Primary flow: User clicks "Purchase DFY" → Paddle checkout opens → Purchase → Success page**

1. Click "Purchase DFY" button
2. Client-side: Button shows "Loading..." with spinner
3. Client calls `Paddle.Checkout.open({ priceId: NEXT_PUBLIC_PADDLE_PRICE_ID_DFY })`
4. Paddle renders checkout modal (inline or overlay — depends on Paddle SDK version)
5. On success callback: Client redirects to `/automate/success?product=dfy`
6. On webhook: Server records order in database, sends confirmation + owner notification emails
7. Success page loads with form (see Section 9 above)

**Error states:**
- If Paddle fails to load: Show "Couldn't load checkout. Please try again." (Error color)
- If purchase fails: Paddle displays error, user can retry. No custom error needed.

**Anti-patterns to avoid (from RESEARCH.md):**
- Do NOT hard-code price IDs in button labels. Price IDs live in env vars.
- Do NOT send transactional emails from client-side callback. Use webhook only.
- Do NOT mix one-time (DFY/DWY) and recurring (Care Plan) items in single checkout. Create separate buttons.

---

## Analytics Events (TRACK-01, TRACK-02, TRACK-03)

All events fire client-side via Plausible SDK. No server-side processing needed.

### Event 1: Land
- **Fires on:** Page mount
- **Props:** `utm_source`, `utm_campaign`, `utm_medium`, `utm_content` (extracted from URL query params)
- **Example:** `trackAnalyticsEvent("Land", { utm_source: "instagram", utm_campaign: "reel-lead-gen" })`

### Event 2: Demo Interaction
- **Fires on:** User clicks on embedded Reel or "Try it right now" section
- **Props:** None (event name only)
- **Example:** `trackAnalyticsEvent("Demo Interaction")`

### Event 3: Build Map Submit
- **Fires on:** Email capture form submission succeeds
- **Props:** None (event name only; do NOT include email address for privacy)
- **Example:** `trackAnalyticsEvent("Build Map Submit")`

### Event 4: Checkout Opened
- **Fires on:** User clicks any "Purchase" or "Subscribe" button (before Paddle renders)
- **Props:** `product_type` (string: "dfy" | "dwy" | "care-plan")
- **Example:** `trackAnalyticsEvent("Checkout Opened", { product_type: "dfy" })`

### Event 5: Purchase
- **Fires on:** Paddle webhook `transaction.completed` received
- **Props:** `product_type`, `amount` (price in dollars), `currency` (e.g., "USD")
- **Implementation:** Webhook handler calls Plausible API via server-side SDK (if supported) OR
  - Alternative: Client-side callback fires event before redirect (less reliable but simpler)
  - Recommended: Webhook approach for reliability
- **Example:** `trackAnalyticsEvent("Purchase", { product_type: "dfy", amount: 500, currency: "usd" })`

**Integration:**
- Plausible script tag added to `src/app/layout.tsx` global head
- Custom event tracking helper in `src/lib/analytics.ts`
- All events fire only if `window.plausible` is available (graceful fallback if script fails to load)

---

## Copywriting Contract

### Voice & Tone

**Direct, operator-to-operator. No fluff, no hype.**
- Specific numbers (not "thousands of leads" but "250 contacts for $39/mo")
- Short sentences (5–10 words average)
- Revenue framing, not time-saved framing (e.g., "own your list" not "save hours")
- Second person ("you") except in testimonials

### Primary CTA Labels

| Context | Copy | Tone | Color |
|---------|------|------|-------|
| Download Build Map | "Download Build Map" or "Get the Guide" | Casual, welcoming | Accent |
| DFY Purchase | "Purchase DFY" or "Get It Done" | Direct, confident | Accent |
| DWY Purchase | "Purchase DWY" or "Learn & Build" | Collaborative | Accent |
| Care Plan Subscribe | "Subscribe Now" or "Add Care Plan" | Clear, simple | Accent |
| Success Form Submit | "Confirm & Continue" or "Next Step" | Forward-moving | Accent |

**Never use:** "Buy now", "Add to cart", "Proceed" (generic ecommerce language)

### Empty State Copy

Not applicable — `/automate` is a marketing page, not a data-driven interface. No empty states for forms (forms always render).

### Error State Copy

| Scenario | Copy | Color | Placement |
|----------|------|-------|-----------|
| Invalid email | "Please enter a valid email address" | Error | Below input field |
| Email already signed up | "You're already on our list. Check your inbox." | Ink 2 (friendly, not error) | Below input field |
| Form submission failed | "Something went wrong. Please try again." | Error | Alert box above form |
| Paddle checkout unavailable | "Couldn't load checkout. Please refresh and try again." | Error | In place of checkout button |
| Invalid IG handle (success form) | "Instagram handles use letters, numbers, periods, and underscores." | Error | Below input field |
| Invalid URL (success form) | "Please provide a valid link (e.g., https://bit.ly/...)" | Error | Below input field |

### Destructive Action Copy

| Action | Confirmation | Color |
|--------|--------------|-------|
| Clear form fields | "Clear all fields? You'll need to re-enter." | Warn |
| Delete account (if applicable post-purchase) | "This cannot be undone. Permanently delete your account?" | Error |
| Refund request (if FAQ) | "Request a refund? We'll start processing immediately." | Warn |

---

## Responsive Breakpoints

All components must be responsive. Use Tailwind breakpoints (inherited from existing site):
- **Mobile:** 360–767px (default styles)
- **Tablet:** 768–1023px (`@media (min-width: 768px)`)
- **Desktop:** 1024px+ (`@media (min-width: 1024px)`)

### Mobile-Specific Adjustments

- Pricing cards: Stack to full width (1 col)
- Comparison strip: Horizontal scroll (do not reflow to grid)
- Hero section: Reduce padding to `var(--spacing-lg) var(--spacing-md)`
- Typography: No change to sizes (use same Scale as desktop; readability first)
- Touch targets: Buttons remain 44px minimum height
- Forms: Full width (max-width: 100%)

---

## No New Components

Phase 7 does **not** initialize shadcn or any third-party component library. All components are:
1. Custom HTML/CSS built to spec above
2. Reused from existing codebase if available (e.g., form patterns from `/assessment`)

**Reuse opportunities:**
- Email capture form: Pattern exists in `/api/subscribe` (v1.0). Reuse validation + Resend integration.
- Form styling: Use existing form classes if available; if not, create new `form.css` specific to `/automate`
- Button styling: Follow existing site button pattern (Surface 2, Ink 1 for secondary; Accent for primary)

---

## Registry Safety

Not applicable. Phase 7 uses only:
- Custom CSS (Phase 6 tokens)
- Paddle SDK (third-party, pre-existing v1.0)
- Resend (third-party, pre-existing v1.0)
- Plausible Analytics (new; already vetted in RESEARCH.md)

No shadcn or other component registries are used.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (operator-to-operator tone, specific CTAs, error copy)
- [ ] Dimension 2 Visuals: PASS (section structure clear, layout specs for all components)
- [ ] Dimension 3 Color: PASS (Direction B palette locked, accent reserved for CTAs only, semantic colors for validation)
- [ ] Dimension 4 Typography: PASS (7 sizes, 2 weights, line heights inherited from Phase 6)
- [ ] Dimension 5 Spacing: PASS (6-step scale, all multiples of 4, usage clear for each section)
- [ ] Dimension 6 Forms & Validation: PASS (email validation, success form schema, error states spec'd)

**Approval:** pending

---

## Phase 7 Outputs (Consumed by Phase 8+)

- `/automate` page built on Phase 6 tokens (all color, type, spacing locked)
- `(automate)` route group with isolated layout (logo-only header, custom footer)
- Email capture form with real-time validation (Zod, React Hook Form)
- Three pricing tier cards (Build Map, DFY, DWY, Care Plan)
- Paddle checkout integration (DFY/DWY one-time, Care Plan recurring, separate buttons)
- Success page with DFY/DWY onboarding form
- Analytics events tracking (Plausible: Land, Demo, Build Map Submit, Checkout Opened, Purchase)
- Webhook handler for order confirmation + owner notification emails

**Blockers resolved by this contract:**
- ✓ Design tokens inherited from Phase 6 (no new tokens declared)
- ✓ Page structure specified (9 sections, self-contained until Phase 9)
- ✓ CTA copy locked (no ambiguity on button labels)
- ✓ Form validation states spec'd (email, onboarding form, error messages)
- ✓ Responsive breakpoints defined (mobile-first)

**Outstanding for planner:**
- Verify Paddle production account + new price IDs exist (PAY-01 checkpoint)
- Obtain or create Build Map deliverable files (4 n8n workflows + env template)
- Confirm Plausible account can be created (or fallback to Vercel Analytics)

---

**Phase 7 UI-SPEC created:** 2026-08-07  
**Built on:** Phase 6 UI-SPEC (tokens locked)  
**Next phase:** Phase 8 (Design System Rollout) — applies Phase 7 token approach site-wide
