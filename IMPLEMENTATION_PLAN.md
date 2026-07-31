# Implementation Plan — Reposition to Small Business Owners

**Date:** 2026-07-30
**Companion doc:** [WEBSITE_AUDIT.md](WEBSITE_AUDIT.md) — findings and decisions this plan executes.
**Repo:** `asorahura` (Next.js 16, App Router, CSS Modules)

---

## Settled inputs

| | |
|---|---|
| **ICP** | Small business owners, $10k–$100k MRR. Wedge: creators / coaches / info-product sellers running Instagram lead gen. |
| **Promise** | Grow income through small automations, ascending to full operational automation. |
| **Product #1** | Instagram Lead Automation. Free Build Map → DFY $500 / DWY $800 → Care Plan $9.99/mo. |
| **Model** | Self-serve, no call in the primary path. Paddle. |
| **Channel** | `@ai_learnt` Instagram — Reel drives traffic, account is the live demo. |
| **Brand** | Asor Ahura owns everything. |
| **Visual** | Light-first. Moving off dark + gold. |
| **Old verticals** | Retained as a secondary enterprise track. |

---

## Sequencing logic

Revenue first, then foundation, then the rest of the site.

The Reel is the traffic driver and it points at a product page that doesn't exist yet — so **Product #1 ships first.** But it shouldn't ship in a palette we've already decided to retire, because that's double work.

So: **make the palette decision first (Phase 0, ~1 day), then build the product page directly in the new system.** The product page becomes the pilot for the design system — one self-contained page, no legacy CSS, perfect testbed. It validates the tokens before we commit to refactoring 36 stylesheets.

```
Phase 0  Palette decision + token system          ~1 day     → unblocks everything
Phase 1  Product #1 page live + payments          ~3-4 days  → REVENUE
Phase 2  Design system rollout + dead code        ~3-4 days  → unblocks Phase 3
Phase 3  Homepage + funnel reposition             ~4-5 days  → conversion
Phase 4  Assessment re-point + enterprise track   ~3-4 days  → ladder
Phase 5  Cleanup + consistency pass               ~2 days
```

Phases 0→1 are the critical path to money. Everything after can flex.

---

## Phase 0 — Palette decision and token foundation

**Goal:** a committed light-first design system, expressed as tokens, ready to build against.

### Tasks

**0.1 — Produce 2–3 light-first palette directions**
Static HTML comparison board showing each direction applied to the same three components (hero, pricing card, CTA button) so the creative director compares like with like rather than swatches.

Constraints to design within: existing logo (`/logomain.png`), and the accent must survive on both white and a mid-tone surface. Each direction ships with contrast ratios pre-computed for every text/background pairing — no pairing below 4.5:1 for body text, 3:1 for large text. The §B4 failure (3.4:1) does not recur.

**0.2 — Creative director selects a direction**
Blocking. Everything downstream depends on it.

**0.3 — Write the token system into `globals.css`**
Replace the current dark token block. Define, and commit to:
- **Color** — surface scale (3–4 steps), text scale (3 steps), accent + accent states, semantic (success/error/warn), borders.
- **Type scale** — one ratio, ~7 steps. Kills the current 20+ ad-hoc sizes (§B6).
- **Spacing scale** — ~6 steps. Currently arbitrary.
- **Radius, shadow, transition** — 3 steps each.
- **Type decision** — resolve Playfair. Either commit it to display headings (and fix the `h1–h4 → sans` override in `globals.css` that currently makes it dead) or drop the font and stop shipping the download. Do not leave it half-used.

**Verify:** every token referenced at least once in Phase 1. Any value used more than twice across the codebase exists as a token. Contrast checked with a script, not by eye.

---

## Phase 1 — Product #1 page live (REVENUE)

**Goal:** a visitor from the Reel can buy DFY or DWY, or download the Build Map against an email, without talking to anyone.

Source material: `ai_learnt/assets/automate-landing-page.html`. **Structure and copy port; styling does not** (§H9). Rebuild as `/automate` using Phase 0 tokens.

**Ship it self-contained.** Until Phase 3 lands, every other page contradicts this one — $5,000 entry pricing, enterprise copy, dark+gold. A $500 buyer *will* look around before paying. So `/automate` gets a minimal header (logo only, no site nav) and its own footer. Full nav returns when the homepage catches up in Phase 3.

### Tasks

**1.1 — Fix the Care Plan price** ⚠️ **CRITICAL**
Page says `$99/mo`; actual is **$9.99/mo** (§H4-R). The typo inverts the offer's core claim. Fix before anything else touches this page.

Then promote the corrected number to a headline fact — fully managed, no contact ceiling, **$15.99/mo all-in ($6 droplet + $9.99 care), cheaper than ManyChat's cheapest 250-contact tier**, and ~12× cheaper than their top one. This is the strongest fact in the entire offer and it currently reads as its weakest.

**1.2 — Rebuild the comparison strip as a ratchet, not a menu** (§H3-R)
Keep all four tiers. Present as a path with arrows, not four parallel options. Lead each with **contact count** (the ratchet mechanism), price secondary. Promote the trajectory line — *"the bill climbs as your ads work"* — from fine print to section heading. Add the flat $6/mo line running underneath as visual counterpoint.

The argument is the ceiling, not the payback period. Don't invite arithmetic.

**1.3 — Make the live demo explicit** (§H5-R)
The Reel and `@ai_learnt` already prove the mechanism. The page doesn't mention it's testable.

- Embed the Reel.
- Add a "try it right now" block: go comment the keyword, watch the DM arrive.
- Label the phone mockup as a real screenshot of a live account, not an illustration.

This is the risk reversal. A prospect who has personally received the DM has no objection left.

**1.4 — Email-gate the Build Map** (§H10)
Currently a raw Drive link collecting nothing.

`/api/subscribe` already does Resend `contacts.create` + Google Sheets mirror — so this is: an inline email form, a new route that subscribes then emails the download link (reuse `src/lib/email.ts`, `FROM = "Asor Ahura <hello@asorahura.com>"`), and a segmentation tag so Build Map downloaders are addressable separately for the DFY upsell.

Rewrite the DFY bullets while here: they currently restate what the free tier gives. DFY sells **speed and certainty** — an afternoon of technical setup you don't do, right the first time.

**1.5 — Wire Paddle**
Add `automate-dfy` ($500) and `automate-dwy` ($800) to `src/lib/checkout.ts`. Confirm `NEXT_PUBLIC_PADDLE_PRICE_ID_*` are set in production. Care Plan as a separate recurring price.

**Open item:** is Paddle live and tested? If not, this is the one thing that can block launch. Verify early, not at the end.

**1.6 — Add the next rung** (§H8)
Closing section naming what comes after this automation. Post-purchase, the success page names it — a buyer who just watched one automation work is the most qualified lead available for "what else looks like this?"

⚠️ **Do not link into the assessment yet.** It isn't re-pointed until Phase 4 — today it routes this exact buyer into the enterprise-tuned `Other / Cross-Industry` fallback (§A2), the worst experience on the site. Interim: the next rung is copy plus a segmentation tag ("automate-buyer") so the follow-up happens by email. Swap the link in when Phase 4 lands.

**1.7 — Reframe from savings to revenue** (§H6)
The follow-gate grows the account *while* capturing the lead — followers and list grow together from ad spend already being made. That's a growth mechanism ManyChat's pricing can't be compared against, and it's the only version of the pitch that connects to the income promise. Add it as a pain-section counterpart.

**1.8 — Close the loop after payment**
Task 1.5 ends at money moving. What happens next is currently unspecified, and DFY can't be delivered without it:

- **Paddle webhook** (or at minimum the checkout success callback) → owner notification email, so DFY builds start without polling the dashboard.
- **DFY/DWY onboarding intake on the success page** — IG handle, the keyword, lead magnet link, voice/tone notes. Four fields, not `/engage`. Without this the first deliverable step is a "so, what's your handle?" email.
- **DWY scheduling** — the screen-to-screen build inherently needs a scheduled session. Post-purchase scheduling doesn't violate "no call in the path"; put the link on the DWY success page only.
- **Refund policy + FAQ on the page.** §H5-R resolved *proof*; it didn't resolve *policy*. A $500 no-call purchase needs its refund terms in text, and Paddle requires visible terms regardless.

**1.9 — Instrument the funnel**
The whole thesis is Reel → page → purchase, and nothing currently measures where it leaks. Lightweight analytics (Vercel Analytics or Plausible) with five events: land (with UTM carried from the Reel link), demo interaction, Build Map submit, checkout opened, purchase. If conversion disappoints, this is the difference between diagnosing and guessing.

**Verify:** end-to-end on a real device — Reel → page → comment keyword → receive DM → return → purchase completes → confirmation email arrives → owner notification arrives → success page collects onboarding details and names the next rung. Build Map download gated and the address lands in Resend. All five analytics events visible in the dashboard.

---

## Phase 2 — Design system rollout

**Goal:** one visual system across every page; no hardcoded colors.

### Tasks

**2.1 — Delete dead code first** (§D1) — do this *before* touching styles so ~900 lines of dead CSS aren't carried through the refactor.
- `src/app/page.module.css` (~400 lines, imported by nothing)
- `Testimonials.tsx`, `SaasShowcase.tsx`, `LinkedInFeed.tsx`, `YouTubeFeed.tsx` + their 4 CSS modules
- `public/images/testimonials/lloydlist.{jpg,png}`
- `const year` in `services/page.tsx`, `const isEnterprise` in `checkout/page.tsx`

**2.2 — Convert all remaining stylesheets to tokens**
66 hex values and 43 rgba values → tokens. Order: conversion pages first (`/checkout`, `/assessment`, `/engage`), then marketing, then legal.

Resolve while converting: two golds → one accent; `#0a0a0a` vs `#04080F` → one surface; raw Tailwind grays → the text scale.

**2.3 — Kill the light/dark flip** (§B3)
Every page on one theme. `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` currently diverge.

**2.4 — Apply the type and spacing scales**
Replace the 20+ ad-hoc font sizes with scale steps.

**Verify:** `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css` returns only the token definitions in `globals.css`. Contrast script passes on every text/surface pairing. Click every route and confirm no theme flip.

---

## Phase 3 — Homepage and funnel reposition

**Goal:** a creator/coach landing cold understands the offer, believes it, and can buy — without a call.

### Tasks

**3.1 — Rewrite the hero** (§A6) — lead with income, not hours. Every current headline sells time saved, which is the weaker argument for this buyer.

**3.2 — Replace `PainSection`** (§A1) — the four regulated-vertical cards (ABA Rule 1.6, SR 11-7, EU AI Act) move to the enterprise track. New pain points in the ICP's own language.

**3.3 — Rebuild `ServicesPreview` as a ladder, not a menu** (§A7) — Product #1 as the visible entry rung with its real price, then what comes after. Ascension is the business model; the page should show it.

**3.4 — Resolve the three-price contradiction** (§A3, §C3) — free / $50-per-hour / $5,000 for a first step, depending on landing page. One price story. `/services` tiers become the enterprise track's pricing.

**3.5 — One primary CTA** (§C2) — currently "Start Your Free AI Opportunity Discovery" + "Work With Me" + a nav button + a nav link, for one product. Collapse.

**3.6 — Fix proof** (§A5, §D2) — enterprise case studies move to a credibility strip ("who I've built for"), not primary proof. Named testimonials with headshots (already in `content/testimonials.json`, currently unused on the homepage) replace the anonymized `SocialProof.tsx` set.

**Open item:** are T.N. and R.O. real? If yes, name them or attribute as specifically as the others. If placeholder, remove.

**3.7 — Demote `/engage`** — it becomes the enterprise intake form, which is what those 10 fields were designed for. Out of the primary path.

**3.8 — Nav and metadata** — add pricing. Fix the three competing positioning statements (§A8) and `metadataBase` still pointing at `vercel.app`.

**Verify:** cold reader reaches a purchase in ≤2 clicks from the homepage. One price for the entry offer everywhere. No enterprise-coded language on the primary path.

---

## Phase 4 — Assessment re-point and enterprise track

**Goal:** the assessment serves the new ICP and feeds the ladder; enterprise work keeps a home.

### Tasks

**4.1 — Re-point the sector routing** (§A2) — the four regulated verticals move behind an enterprise entry. New segments become the default path; the new ICP stops landing in the `Other / Cross-Industry` fallback.

**4.2 — Reframe the output** — from "AI readiness score" to *"here are three automations worth ~$X/month to you"*. Revenue-framed, names a number, links straight to purchase. This is the highest-leverage change in the phase.

**4.3 — Fix the results dead end** (§C4) — peak intent currently routes to a 10-field form. Route to purchase.

**4.4 — Build the enterprise track page** — case studies, the four verticals, `/engage` intake, `/services` tiers. Linked from the footer and a secondary nav slot, not the primary path.

**4.5 — Resolve `/assessment` vs `/assessment/deep`** — pick one, delete or merge the other.

**4.6 — Remove Calendly from the primary path** (§C5) — hardcoded in 5 places. Belongs on the enterprise track only.

**4.7 — Retire or automate `BOOKING_SLOTS`** (§C6) — manual scarcity that will go stale.

**Verify:** a creator completing the assessment gets segment-specific output naming automations and prices, with a purchase link. An enterprise visitor still reaches the old intake.

---

## Phase 5 — Cleanup and consistency

- Redirects for retired/moved routes — whichever of `/assessment` vs `/assessment/deep` dies (4.5), plus any URL that changed meaning in Phases 3–4. Old Reel comments and shared links keep working.
- Footer hardcoded `© 2026` → dynamic
- Mixed icon set on the product page (`↑ ✕ 🔒`) → lucide-react (§H9)
- Full accessibility pass: focus states, alt text, heading order, keyboard nav
- Responsive check at 360 / 768 / 1024 / 1440
- Lighthouse on `/` and `/automate`
- README documenting the token system so it doesn't erode again

---

## Risk register

| Risk | Mitigation |
|---|---|
| **Paddle isn't live** — blocks all revenue | Verify in Phase 1 immediately, not at the end |
| **Care Plan typo ships** | Task 1.1, before anything else |
| **Palette decision slips** — blocks Phase 0→1 | Product page can ship on tokens with a provisional accent; swapping one token later is cheap. Don't let this block revenue. |
| **Four segments dilute the wedge** | Launch creators/coaches only. Others get pages when they have products and proof. |
| **No outcome proof yet** | Mechanism proof (Reel + live demo) carries launch. Capture before/after from the first DFY customer. |
| **Buyer wanders off `/automate` into the un-repositioned site** — sees $5,000 pricing and enterprise copy mid-purchase | Ship `/automate` self-contained (no site nav) until Phase 3. |
| **Funnel converts poorly and nobody knows why** | Task 1.9 — instrument before launch, not after the first bad week. |
| **DFY sale arrives and delivery stalls** — no onboarding data, no notification | Task 1.8 — webhook + success-page intake ship with checkout, not as a follow-up. |
| **Design system erodes again** | Phase 2 verify is a grep that must return zero. Document in README. |

---

## What I'd do first, concretely

1. **Verify Paddle works.** Single largest launch risk, cheapest to check.
2. **Fix the $99 → $9.99 typo.** One character class, inverts the offer.
3. **Get the palette in front of the creative director.** Blocking, and it's a review cycle you don't control.

Then Phase 1 in full.
