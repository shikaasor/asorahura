# Requirements: asorahura.com — Milestone v2.0 Reposition to Small Business Owners

**Defined:** 2026-07-31
**Core Value:** Grow your income through small automations — start with one automation that visibly makes money, then ascend.

**Source:** [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) and [WEBSITE_AUDIT.md](../WEBSITE_AUDIT.md). Section references (§A1, §H4-R, …) point at the audit finding each requirement resolves.

**v1.0 requirements** are archived at `.planning/archive/v1.0-REQUIREMENTS.md` — 75 requirements, all Complete.

## v2.0 Requirements

### Design System Foundation

- [ ] **DESIGN-01**: Creative director can compare 2–3 light-first palette directions on a static board, each applied to the same hero, pricing card, and CTA button
- [ ] **DESIGN-02**: Each direction ships with pre-computed contrast ratios for every text/background pairing — none below 4.5:1 body, 3:1 large (§B4)
- [ ] **DESIGN-03**: Selected direction exists in `globals.css` as color tokens — surface scale (3–4 steps), text scale (3 steps), accent + accent states, semantic (success/error/warn), borders — replacing the dark token block
- [ ] **DESIGN-04**: A type scale of ~7 steps on one ratio exists as tokens, replacing the 20+ ad-hoc font sizes (§B6)
- [ ] **DESIGN-05**: Spacing scale (~6 steps) plus radius, shadow, and transition (3 steps each) exist as tokens
- [ ] **DESIGN-06**: Playfair Display is resolved — either committed to display headings with the `h1–h4 → sans` override in `globals.css` fixed, or dropped and no longer downloaded (§B6, §H9)
- [ ] **DESIGN-07**: A repeatable script checks contrast for every text/surface token pairing and reports failures

### Product #1 Page (`/automate`)

- [ ] **PROD-01**: A visitor can reach `/automate`, rebuilt from `ai_learnt/assets/automate-landing-page.html` structure and copy on Phase 0 tokens — styling not ported (§H9)
- [ ] **PROD-02**: `/automate` renders self-contained — logo-only header, its own footer, no site nav — until the homepage is repositioned
- [ ] **PROD-03**: The Care Plan price reads **$9.99/mo** everywhere on the page (§H4-R — currently printed as $99/mo, a 10× error)
- [ ] **PROD-04**: The page states $15.99/mo all-in ($6 droplet + $9.99 care) against ManyChat's cheapest 250-contact tier as a headline fact, in large type
- [ ] **PROD-05**: The comparison strip presents all four ManyChat tiers as a path with arrows, contact counts leading and prices secondary (§H3-R)
- [ ] **PROD-06**: The trajectory line — "the bill climbs as your ads work" — is a section heading, with the flat $6/mo line running underneath as visual counterpoint
- [ ] **PROD-07**: The acquisition Reel is embedded on the page (§H5-R)
- [ ] **PROD-08**: A "try it right now" block invites the visitor to comment the keyword on the live post and receive the DM themselves
- [ ] **PROD-09**: The phone mockup is labelled as a real screenshot of a live account, not an illustration
- [ ] **PROD-10**: DFY bullets sell speed and certainty — an afternoon of technical setup done right the first time — not access the free tier already grants (§H10)
- [ ] **PROD-11**: The pain section carries the revenue framing — the follow-gate grows followers and lead list together from ad spend already being made (§H6)
- [ ] **PROD-12**: A closing section names the next rung of the ladder in copy and applies an `automate-buyer` segmentation tag; it does **not** link into the assessment until ASSESS-11 lands (§H8, §A2)
- [ ] **PROD-13**: Refund policy and an FAQ are visible in text on the page

### Build Map Lead Capture

- [ ] **LEAD-01**: A visitor can submit their email inline on `/automate` to request the Build Map (§H10 — currently a raw Drive link collecting nothing)
- [ ] **LEAD-02**: Submission subscribes the address via the existing Resend `contacts.create` + Google Sheets mirror path
- [ ] **LEAD-03**: The download link arrives by email from `Asor Ahura <hello@asorahura.com>` using `src/lib/email.ts`
- [ ] **LEAD-04**: Build Map downloaders carry a segmentation tag so they are addressable separately for the DFY upsell

### Payments and Fulfilment

- [ ] **PAY-01**: Paddle live status is verified and `NEXT_PUBLIC_PADDLE_PRICE_ID_*` confirmed set in production before further checkout work proceeds
- [ ] **PAY-02**: A visitor can purchase DFY ($500) from `/automate` without talking to anyone
- [ ] **PAY-03**: A visitor can purchase DWY ($800) from `/automate` without talking to anyone
- [ ] **PAY-04**: The Care Plan is purchasable as a separate recurring price
- [ ] **PAY-05**: The buyer receives a purchase confirmation email
- [ ] **PAY-06**: The owner receives a notification email on purchase, so DFY builds start without polling the Paddle dashboard
- [ ] **PAY-07**: The success page collects DFY/DWY onboarding details — IG handle, keyword, lead magnet link, voice/tone notes — in four fields, not via `/engage`
- [ ] **PAY-08**: The DWY success page offers a scheduling link for the screen-to-screen build session
- [ ] **PAY-09**: The success page names the next rung of the ladder to the buyer

### Funnel Instrumentation

- [ ] **TRACK-01**: Lightweight analytics (Vercel Analytics or Plausible) is installed and reporting
- [ ] **TRACK-02**: A land event fires carrying the UTM parameters from the Reel link
- [ ] **TRACK-03**: Demo interaction, Build Map submit, checkout opened, and purchase events fire and are visible in the dashboard

### Design System Rollout

- [ ] **STYLE-01**: Dead code is deleted before any style conversion — `src/app/page.module.css`, `Testimonials.tsx`, `SaasShowcase.tsx`, `LinkedInFeed.tsx`, `YouTubeFeed.tsx` and their CSS modules, `public/images/testimonials/lloydlist.{jpg,png}`, `const year` in `services/page.tsx`, `const isEnterprise` in `checkout/page.tsx` (§D1)
- [ ] **STYLE-02**: `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css` returns only the token definitions in `globals.css` — all 66 hex and 43 rgba values converted (§B1)
- [ ] **STYLE-03**: Palette collisions are resolved — two golds to one accent, `#0a0a0a` vs `#04080F` to one surface, raw Tailwind grays to the text scale (§B2)
- [ ] **STYLE-04**: Every route renders on one theme — `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` no longer flip (§B3)
- [ ] **STYLE-05**: The type and spacing scales are applied across all stylesheets, replacing ad-hoc values
- [ ] **STYLE-06**: The DESIGN-07 contrast script passes on every text/surface pairing site-wide

### Homepage and Funnel Reposition

- [ ] **HOME-12**: The hero leads with income growth, not hours saved (§A6)
- [ ] **HOME-13**: `PainSection` speaks the new ICP's language; the four regulated-vertical cards (ABA Rule 1.6, SR 11-7, EU AI Act) move to the enterprise track (§A1)
- [ ] **HOME-14**: `ServicesPreview` reads as a ladder with Product #1 as the visible entry rung at its real price, then what comes after (§A7)
- [ ] **HOME-15**: One entry price story appears everywhere — the free/$50-per-hour/$5,000 contradiction is resolved and `/services` tiers become enterprise-track pricing (§A3, §C3)
- [ ] **HOME-16**: The homepage presents one primary CTA, replacing the current four competing entry points (§C2)
- [ ] **HOME-17**: Enterprise case studies appear as a credibility strip ("who I've built for"), not as primary proof (§A5)
- [ ] **HOME-18**: Named testimonials with headshots from `content/testimonials.json` replace the anonymized `SocialProof.tsx` set, with T.N. and R.O. either attributed specifically or removed (§D2)
- [ ] **HOME-19**: `/engage` is out of the primary path and reframed as the enterprise intake form
- [ ] **HOME-20**: Pricing appears in the navigation (§C7)
- [ ] **HOME-21**: One positioning statement runs across page metadata, hero eyebrow, and footer, and `metadataBase` points at the production domain rather than `vercel.app` (§A8)

### Assessment Re-point

- [ ] **ASSESS-11**: Sector routing serves the new ICP by default; the four regulated verticals sit behind an enterprise entry, so a creator no longer lands in `Other / Cross-Industry` (§A2)
- [ ] **ASSESS-12**: The output is revenue-framed — "here are three automations worth ~$X/month to you" — naming a number rather than an AI readiness score
- [ ] **ASSESS-13**: The results screen routes to purchase instead of the 10-field form (§C4)
- [ ] **ASSESS-14**: `/assessment` and `/assessment/deep` are resolved to one canonical route; the other is merged or deleted (§D3)
- [ ] **ASSESS-15**: Calendly is removed from the primary path — all five hardcoded occurrences — and appears on the enterprise track only (§C5)
- [ ] **ASSESS-16**: `BOOKING_SLOTS` manual scarcity is retired or automated so it cannot go stale (§C6)

### Enterprise Track

- [ ] **ENT-01**: An enterprise track page carries the case studies, the four regulated verticals, the `/engage` intake, and the `/services` tiers
- [ ] **ENT-02**: The enterprise track is reachable from the footer and a secondary nav slot, never the primary path

### Cleanup and Consistency

- [ ] **POLISH-01**: Redirects exist for every retired or moved route, so old Reel comments and shared links keep working
- [ ] **POLISH-02**: The footer copyright year is computed, not hardcoded (§D4)
- [ ] **POLISH-03**: The product page's mixed icon set (`↑ ✕ 🔒`) is replaced with lucide-react (§H9)
- [ ] **POLISH-04**: An accessibility pass covers focus states, alt text, heading order, and keyboard navigation across the site
- [ ] **POLISH-05**: Every page is verified responsive at 360, 768, 1024, and 1440
- [ ] **POLISH-06**: Lighthouse is run on `/` and `/automate` and meets agreed thresholds
- [ ] **POLISH-07**: The README documents the token system so it does not erode again

## Future Requirements

Deferred to a later milestone. Tracked but not in this roadmap.

### Segment Expansion

- **SEG-01**: Segment landing page for local service businesses
- **SEG-02**: Segment landing page for agencies and freelancers
- **SEG-03**: Segment landing page for e-commerce / DTC
- **SEG-04**: Assessment branches for each additional segment

### Proof

- **PROOF-01**: Before/after result captured from the first DFY customer — leads captured and follower growth
- **PROOF-02**: Small-business testimonials with revenue impact replace mechanism-only proof

### Ladder

- **LADDER-01**: Product #2 defined and priced as the next rung after Instagram Lead Automation
- **LADDER-02**: Post-purchase upsell sequence from `automate-buyer` into the next rung

## Out of Scope

| Feature | Reason |
|---------|--------|
| Launching all four ICP segments at once | 4× copy and 4× branching against zero proof in three of them; creators/coaches carries the launch |
| Deleting the regulated verticals, case studies, or `/engage` | Existing high-ticket deals are worth a path; they move behind an enterprise entry instead |
| New enterprise marketing or lead gen | The enterprise track is preserved, not grown |
| Rebuilding the assessment engine | Re-pointing the routing and output is the work; the engine is a validated v1.0 asset |
| Mobile app | Web-first only |
| Real-time chat | Not core to a self-serve purchase |
| Calendly in the primary funnel | Contradicts "no call in the path"; post-purchase DWY scheduling and the enterprise track are the exceptions |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| — | — | Pending |

**Coverage:**
- v2.0 requirements: 67 total (DESIGN 7, PROD 13, LEAD 4, PAY 9, TRACK 3, STYLE 6, HOME 10, ASSESS 6, ENT 2, POLISH 7)
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 67

---

*Requirements defined: 2026-07-31*
*Last updated: 2026-07-31 at milestone v2.0 start*
