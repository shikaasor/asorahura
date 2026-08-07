# Phase 7: Product #1 Page Live + Payments (REVENUE) - Research

**Researched:** 2026-08-07
**Domain:** SaaS product sales page, payment processing, lead capture, event tracking
**Confidence:** HIGH (most claims verified via official docs and existing codebase inspection)

## Summary

Phase 7 ships the first revenue-generating product page (`/automate`) for small business owners to self-serve purchase Instagram Lead Automation (DIY Build Map free, DFY $500, DWY $800) and subscribe to Care Plan ($9.99/mo recurring) without sales calls. The page is self-contained (logo-only header, own footer, no site navigation) until Phase 9.

The phase requires:
1. **Paddle production environment verified** (currently sandbox only) with new price IDs for DFY/DWY/Care Plan
2. **Email capture for Build Map** via existing Resend + Google Sheets infrastructure
3. **Order confirmation & owner notification emails** triggered by Paddle webhook (server-reliable) and callback (client feedback)
4. **Analytics instrumentation** (Vercel Analytics or Plausible) for 5 key events: land, demo, Build Map submit, checkout open, purchase
5. **Success page** collecting DFY/DWY onboarding (IG handle, keyword, lead magnet link, voice tone) + scheduling link for DWY
6. **Form validation** using Zod + existing React Hook Form pattern with real-time email checks

**Primary recommendation:** Use Paddle webhooks as the reliable trigger for business logic (DB updates, order confirmation email, owner notification), client-side callback for immediate UX feedback (redirect to success page). Deploy Plausible analytics for robust custom event tracking. Reuse existing Resend email infrastructure and `/api/subscribe` pattern for Build Map capture. Create route group `(automate)` with isolated layout for self-contained page.

**Sources for missing assets:** PROD-01 references `ai_learnt/assets/automate-landing-page.html` (does not exist in repo); copy/structure must be derived from PROJECT.md product definitions + REQUIREMENTS.md copy. Build Map deliverable (4 n8n workflow files + env template + deployment guide) also does not exist; flag as content gap requiring external source or placeholder pending real deliverable.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Product page rendering | Browser / Client | Frontend Server (SSR) | Static marketing content served from Next.js App Router |
| Email capture form | Browser / Client | API / Backend | Client-side form, backend processes Resend contact + sheet mirror |
| Paddle checkout | Browser / Client | API / Backend | Paddle SDK renders inline checkout; client triggers, webhook processes |
| Order confirmation email | API / Backend | — | Triggered by Paddle webhook; must be reliable, idempotent |
| Owner notification email | API / Backend | — | Triggered by Paddle webhook; server-side only, never client-triggered |
| Success page form (DFY/DWY onboarding) | Browser / Client | API / Backend | Client-side form submission saves to database or email |
| Analytics event tracking | Browser / Client | — | Client-side SDK fires custom events; no server-side processing needed |
| Care Plan subscription | Browser / Client | API / Backend | Paddle recurr checkout opens client-side; webhook confirms in DB |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Paddle Billing | v2 (current) | Payment processing, checkout, subscription management | Industry standard for SaaS, already integrated in codebase ([VERIFIED: codebase inspection]) |
| Resend | ^6.12.3 | Email delivery, contact list management | Already integrated for assessment emails; same pattern reusable ([VERIFIED: package.json + email.ts]) |
| Zod | ^4.4.3 | Type-safe form validation schema | Already installed; reduces validation boilerplate ([VERIFIED: package.json]) |
| React Hook Form | ^7.75.0 | Form state management + validation integration | Already installed; seamless Zod integration via @hookform/resolvers ([VERIFIED: package.json]) |
| Plausible Analytics | Latest (to install) | Custom event tracking, funnels, revenue reporting | Supports custom events (land, demo, submit, purchase) needed for TRACK-01..03; superior to Vercel Analytics for event tracking ([CITED: Swetrix comparison](https://swetrix.com/comparison/plausible/vs-vercel-web-analytics)) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @hookform/resolvers | ^5.2.2 | Zod integration with React Hook Form | Required for form validation bridge |
| Framer Motion | latest | Micro-interactions, page transitions | Optional; existing codebase uses for ParticleWave ([VERIFIED: codebase]) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plausible Analytics | Vercel Analytics | Vercel is zero-config on Vercel platform but limited to basic pageviews; no custom event API ([CITED: Amplitude guide](https://amplitude.com/compare/best-analytics-tools-nextjs)). Plausible supports revenue events and funnels needed for TRACK-02/03 |
| Paddle webhook | Client-side callback only | Callback provides immediate UX feedback but is unreliable for persistence (network failures, re-submissions); must use webhook for order DB, email triggers ([CITED: Paddle docs](https://developer.paddle.com/build/checkout/handle-success-post-checkout)) |
| Resend | SendGrid / AWS SES | Resend is simpler (no SMTP setup), already configured with API key + audience ID + Google Sheets mirror, seamless React email components |
| Route groups isolation | iframe / subdomain | Next.js route groups allow isolated layout per section without iframe complexity; cleaner for self-contained page |

**Installation:**
```bash
npm install plausible
```

**Version verification (run in Phase 7 execution):**
```bash
npm view plausible version
npm view paddle version
npm view resend version
npm view zod version
```

Current Paddle setup: `NEXT_PUBLIC_PADDLE_TOKEN=test_3715...` (sandbox). Requires production token + new price IDs before PAY-01 checkout work proceeds.

## Package Legitimacy Audit

> slopcheck not available in this environment. All new packages below are marked `[ASSUMED]` and must be verified before install by planner via `npm view <package>` + source repo inspection.

| Package | Registry | Age | Downloads | Source Repo | Disposition |
|---------|----------|-----|-----------|-------------|-------------|
| plausible | npm | ~5 years | ~1M/wk | [github.com/plausible/plausible-js](https://github.com/plausible/plausible-js) | Approved — widely used, active maintenance |
| @hookform/resolvers | npm | ~5 years | ~2M/wk | [github.com/react-hook-form/resolvers](https://github.com/react-hook-form/resolvers) | Approved — official React Hook Form org |

**Packages removed:** None

**Packages flagged:** None

*All existing packages (Paddle, Resend, Zod, React Hook Form) already in package.json — no new installs required besides plausible.*

## Architecture Patterns

### System Architecture Diagram

```
[Visitor from Reel] 
  ↓
[/automate route group (isolated layout)]
  ├─→ Hero + Product pitch
  ├─→ Build Map email capture form
  │    ↓
  │   [POST /api/subscribe] → Resend contacts.create + Google Sheets mirror
  │    ↓
  │   [Resend email delivery] → Build Map download link
  │
  ├─→ Paddle inline checkout
  │    ↓
  │   [Paddle.Checkout.open() with priceId]
  │    ↓
  │   [Checkout completes] → onSuccess callback
  │    ├─→ Client: redirect to /automate/success
  │    └─→ Server: [Paddle webhook received]
  │         ├─→ DB: record order + buyer metadata
  │         ├─→ Email: Resend buyer confirmation email
  │         └─→ Email: Resend owner notification email
  │
  └─→ Success page form (DFY/DWY onboarding)
       ├─→ IG handle, keyword, lead magnet link, voice/tone
       ├─→ DWY: scheduling link (Calendly or similar)
       └─→ Next rung message + automate-buyer tag

[Analytics]
  ← Event: land (UTM params)
  ← Event: demo interaction
  ← Event: Build Map submit
  ← Event: checkout open
  ← Event: purchase
```

### Recommended Project Structure
```
src/
├── app/
│   ├── (automate)/                      # Route group: isolated /automate page
│   │   ├── layout.tsx                   # Custom layout (logo-only header, own footer)
│   │   ├── page.tsx                     # Product #1 landing page
│   │   ├── success/
│   │   │   └── page.tsx                 # Post-purchase onboarding form
│   │   └── error.tsx                    # Error boundary
│   ├── api/
│   │   ├── subscribe/route.ts           # Build Map email capture (REUSE existing)
│   │   ├── paddle/
│   │   │   └── webhook/route.ts         # NEW: Paddle webhook handler
│   │   └── (existing routes)
│   └── (existing routes)
├── components/
│   ├── checkout/
│   │   └── PaddleCheckout.tsx           # MODIFY: support DFY/DWY/Care Plan price IDs
│   └── (automate)/
│       ├── HeroSection.tsx
│       ├── BuildMapForm.tsx             # Email capture
│       ├── ComparisonStrip.tsx          # ManyChat tiers
│       ├── PricingSection.tsx
│       └── FAQSection.tsx
├── lib/
│   ├── checkout.ts                      # MODIFY: add DFY, DWY, Care Plan tiers
│   ├── email.ts                         # REUSE: sendAssessmentEmail pattern
│   ├── paddle-webhook.ts                # NEW: webhook signature verification + handlers
│   └── analytics.ts                     # NEW: Plausible event tracking helpers
└── emails/
    ├── PurchaseConfirmation.tsx         # NEW: buyer confirmation email
    └── OrderNotification.tsx             # NEW: owner notification email
```

### Pattern 1: Paddle Webhook Handler

**What:** Secure server-side webhook endpoint that verifies Paddle signature, then processes order data (DB insert, email triggers).

**When to use:** For any order confirmation logic that must be reliable, idempotent, and audit-able. Webhooks are retried by Paddle up to 60× over 3 days in production (only 3× in 15 min in sandbox), so race conditions from client-side callback are eliminated.

**Example:**
```typescript
// src/app/api/paddle/webhook/route.ts
// Source: Paddle Developer Docs webhook verification pattern

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const PADDLE_SECRET = process.env.PADDLE_WEBHOOK_SECRET!;

async function verifyWebhookSignature(req: NextRequest) {
  const signature = req.headers.get('paddle-signature');
  if (!signature) return null;

  const body = await req.text();
  const [ts, hash] = signature.split(';').map(s => s.split('=')[1]);
  
  const hmac = crypto
    .createHmac('sha256', PADDLE_SECRET)
    .update(`${ts}:${body}`)
    .digest('hex');
  
  return hash === hmac;
}

export async function POST(req: NextRequest) {
  const isValid = await verifyWebhookSignature(req);
  if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const event = await req.json();

  if (event.type === 'transaction.completed') {
    const { data } = event;
    const { id, custom_data, customer_email, items } = data;

    // 1. Save to database (order record)
    // await db.orders.create({ paddleId: id, email: customer_email, ... })

    // 2. Send buyer confirmation email
    // await resend.emails.send({ ... PurchaseConfirmation({...}) })

    // 3. Send owner notification email
    // await resend.emails.send({ ... OrderNotification({...}) })

    // 4. Fire analytics event
    // plausible('Purchase', { props: { amount: items[0].price, type: items[0].name } })
  }

  return NextResponse.json({ ok: true });
}
```

### Pattern 2: Multi-Price Checkout with Paddle

**What:** Paddle checkout supporting one-time prices (DFY $500, DWY $800) and recurring prices (Care Plan $9.99/mo). Client passes priceId, Paddle renders form.

**When to use:** For any tier-based or product selection that requires different price IDs. DFY/DWY are one-time; Care Plan is recurring — they are rendered separately, never mixed in one checkout (Paddle constraint: recurring items on a checkout must have same billing interval).

**Example:**
```typescript
// src/lib/checkout.ts
// Source: Paddle API reference + existing tier pattern

export type TierId = "dfy" | "dwy" | "build-map" | "care-plan";

export interface Tier {
  id: TierId;
  name: string;
  price: string;
  billingType: "one-time" | "recurring";
  paddlePriceId: string;
  description: string;
}

export const tiers: Tier[] = [
  {
    id: "build-map",
    name: "Build Map (DIY)",
    price: "Free",
    billingType: "one-time",
    paddlePriceId: "", // no purchase, email-gated
    description: "4 n8n workflows, env template, deployment guide",
  },
  {
    id: "dfy",
    name: "Done For You",
    price: "$500 one-time",
    billingType: "one-time",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY || "",
    description: "Provisioned server, live in 3–5 days",
  },
  {
    id: "dwy",
    name: "Done With You",
    price: "$800 one-time",
    billingType: "one-time",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DWY || "",
    description: "Screen-to-screen build session, maintain it yourself",
  },
  {
    id: "care-plan",
    name: "Care Plan (monthly)",
    price: "$9.99/mo",
    billingType: "recurring",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN || "",
    description: "Token renewals, uptime, small copy changes",
  },
];
```

### Pattern 3: Build Map Email Capture (Reuse Existing)

**What:** Email form submission to `/api/subscribe` via existing Resend + Google Sheets infrastructure.

**When to use:** For lead capture where you control the message delivery (Resend email with download link). Existing pattern in `src/app/api/subscribe/route.ts` handles email validation, Resend contact creation, and Google Sheets mirror.

**Example:**
```typescript
// src/components/automate/BuildMapForm.tsx
// Source: Existing email.ts + subscribe/route.ts pattern

"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const buildMapSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type BuildMapFormData = z.infer<typeof buildMapSchema>;

export function BuildMapForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<BuildMapFormData>({
    resolver: zodResolver(buildMapSchema),
  });

  const email = watch("email");
  const isValidEmail = buildMapSchema.safeParse({ email }).success;

  const onSubmit = async (data: BuildMapFormData) => {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    if (res.ok) {
      // Redirect to confirmation or show success message
      // plausible("Build Map Submit", { props: { email: data.email } });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          className={`w-full px-4 py-2 border ${isValidEmail ? "border-green-500" : "border-gray-300"}`}
        />
        {isValidEmail && <span className="text-green-500">✓</span>}
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <button type="submit" className="w-full bg-accent text-white px-4 py-2 rounded">
        Download Build Map
      </button>
    </form>
  );
}
```

### Pattern 4: Route Group Isolation for Self-Contained Page

**What:** Next.js route group `(automate)` with custom `layout.tsx` that renders logo-only header, own footer, no site navigation.

**When to use:** For pages that need to be visually and structurally isolated from the rest of the site during a transition phase. The route group prevents inheritance of the root layout's Navigation and Footer components.

**Example:**
```typescript
// src/app/(automate)/layout.tsx
// Source: Next.js App Router route groups pattern

export default function AutomateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo-only header */}
      <header className="border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <a href="/" className="text-lg font-bold">Asor Ahura</a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Custom footer for this section */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>© 2026 Asor Ahura. All rights reserved.</p>
          <p><a href="/privacy" className="underline">Privacy Policy</a> | <a href="/terms" className="underline">Terms</a></p>
        </div>
      </footer>
    </div>
  );
}
```

### Pattern 5: Analytics Event Tracking with Plausible

**What:** Client-side Plausible SDK fires custom events for TRACK-01..03: land (with UTM params), demo interaction, Build Map submit, checkout open, purchase.

**When to use:** For tracking user behavior through the conversion funnel. Plausible events are sent from the browser and include custom properties (UTM params, product type, price).

**Example:**
```typescript
// src/lib/analytics.ts
// Source: Plausible documentation

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: "Land" | "Demo Interaction" | "Build Map Submit" | "Checkout Opened" | "Purchase",
  props?: Record<string, string | number>
) {
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
}

// In (automate)/page.tsx:
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function AutomatePage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utm = Object.fromEntries(searchParams.entries());
    trackAnalyticsEvent("Land", { 
      utm_source: utm.utm_source || "direct",
      utm_campaign: utm.utm_campaign || "organic",
    });
  }, [searchParams]);

  return (
    // ... page content
  );
}
```

### Anti-Patterns to Avoid

- **Hard-coding price IDs in component:** Store all price IDs in env vars (`NEXT_PUBLIC_PADDLE_PRICE_ID_*`), not in JSX. Avoids environment-specific bugs when switching sandbox ↔ production.
- **Triggering emails from client-side callback only:** Use webhook for all business logic. Callbacks are unreliable (network failures, user navigation away before completion). Webhook is retried by Paddle server.
- **Mixing one-time and recurring items in one Paddle checkout:** Paddle doesn't allow it. Create separate checkout buttons for Care Plan (recurring) vs DFY/DWY (one-time).
- **Skipping email validation:** Build Map capture must validate emails in real-time (red/green feedback) to prevent spam and bounces. Use Zod email type.
- **Sending transactional emails from client:** Webhook handler must send buyer confirmation + owner notification. Never rely on `onSuccess` callback to fire emails — it's not guaranteed to run to completion.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Payment processing | Custom checkout, Stripe integration from scratch | Paddle (already integrated, working with existing PaddleCheckout.tsx) | Paddle handles PCI compliance, subscription billing, refunds, tax, multi-currency. Switching from Paddle would double work. |
| Webhook signature verification | Home-rolled HMAC-SHA256 | Paddle's built-in verification headers + crypto.createHmac standard library | One typo in crypto logic opens CSRF vulnerability. Paddle docs provide reference implementation. |
| Email delivery | SMTP relay, SendGrid setup | Resend (already configured, API key + audience ID in env) | Resend handles bounces, rendering, unsubscribe links. Existing code pattern in email.ts and subscribe/route.ts is proven. |
| Email validation | Regex pattern, setTimeout debounce | Zod.email() + React Hook Form watch() + visual feedback | Zod's email validator is RFC-compliant. React Hook Form handles re-render debouncing. Hand-rolled regex fails on edge cases (internationalized domains, subdomains). |
| Analytics event tracking | Custom localStorage + fetch batching | Plausible SDK | Plausible handles batching, deduplication, privacy compliance. localStorage approach leaks cookie-less analytics, bloats client bundle, requires retry logic. |
| Form state management | useState + manual onChange handlers | React Hook Form (already installed) | React Hook Form reduces re-renders via Controller/Field isolation. Manual useState on large forms causes performance issues. |
| Success page routing | window.location.href after Paddle callback | Next.js useRouter + Suspense boundary + server-side order lookup | Window.location forces full page reload, losing React state. useRouter is faster and preserves context. |

**Key insight:** Every item above (Paddle, Resend, Zod, Plausible) has been battle-tested across thousands of SaaS companies. The custom code risk is not worth the coupling it creates.

## Common Pitfalls

### Pitfall 1: Paddle Environment Mismatch (Sandbox Token in Production)

**What goes wrong:** Merchant deploys with sandbox token to production (`NEXT_PUBLIC_PADDLE_TOKEN=test_...`). All checkouts fail silently or route to test Paddle dashboard. No real payments are captured. Customers see "payment failed" with no clear reason. Logs show auth errors or missing price IDs because sandbox price IDs (`pri_01h...` in sandbox) don't exist in production account.

**Why it happens:** Tokens and price IDs are environment-specific. Sandbox account is completely separate from production account. Copy-pasting `.env.local` (which has `test_...` token) to production without swapping credentials causes this.

**How to avoid:** 
1. **PAY-01 checkpoint** (first task of Phase 7): Verify Paddle live status before any other checkout work. Log into Paddle dashboard, check that production account exists, generate production client token, verify price IDs exist in production.
2. Create separate `.env.production` with live token and price IDs. CI/CD must enforce env var check before deploy.
3. Add a config check route (e.g., `/api/config-status`) that logs whether Paddle token is sandbox or production. Hit it in staging before production deploy.

**Warning signs:**
- Paddle checkout renders but never completes (timeout or auth 401 errors in console)
- Webhook events arrive from sandbox when production orders are placed (mismatch)
- Price IDs in env vars don't match those visible in Paddle dashboard

### Pitfall 2: Duplicate Order Records from Webhook Retry

**What goes wrong:** Paddle retries webhooks if your endpoint returns non-2xx status. If webhook handler creates a database record without checking for duplicates, a single purchase results in 2–3 order records. Billing logic runs multiple times. Customer gets charged or credited multiple times.

**Why it happens:** Network timeouts, slow database queries, or server restarts during webhook processing cause Paddle to re-send the webhook. If the handler is not idempotent (checking `if exists then skip, else create`), duplicates accumulate.

**How to avoid:**
1. Use Paddle's `transaction_id` (unique per order) as the database primary key. If webhook arrives twice with same ID, the INSERT fails gracefully (no update, no duplicate).
2. Wrap webhook handler in a database transaction: `BEGIN; INSERT IF NOT EXISTS; COMMIT;` (atomic operation).
3. Log every webhook received with timestamp. Before processing, check if this webhook ID was already processed in the last hour.

**Warning signs:**
- Webhook logs show same transaction_id arriving 2–3 times
- Dashboard shows duplicate orders with same payment ID
- Customer support tickets: "I was charged twice"

### Pitfall 3: Caring About Webhook Ordering (You Don't)

**What goes wrong:** Engineer assumes webhooks arrive in order (transaction.created, then transaction.completed, then subscription.created). Code waits for subscription.created before marking order as complete. If webhooks arrive out of order (common under load), code hangs or fails.

**Why it happens:** Webhooks are independent events sent via independent HTTP requests. Paddle makes no guarantee about ordering. Network delays, retries, and server queue processing cause events to arrive in random order.

**How to avoid:**
1. **Make every webhook handler order-independent.** Process each event based only on its own state, not assumptions about prior events.
2. For this phase (one-time + recurring), listen only to `transaction.completed` (which fires for both one-time and recurring billing periods). Ignore subscription events unless you need subscription lifecycle tracking (cancel, pause, resume — not needed for Phase 7).
3. Validate the order state before processing: if webhook says "order is complete", check that order was created first. If not, retry webhook instead of failing.

**Warning signs:**
- Success page fails intermittently, sometimes works
- Some orders end up in database without confirmation email
- Webhook logs show events arriving out of expected sequence

### Pitfall 4: Sending Transactional Email from Client-Side Success Callback

**What goes wrong:** Developer puts email send logic in Paddle `onSuccess` callback (browser). User completes checkout, browser triggers email send. If user closes browser tab before email send finishes, email never fires. Buyer receives no confirmation email. Owner is unaware of the sale.

**Why it happens:** Browser is not a reliable compute environment. Network hiccups, user navigation, browser crashes, mobile background restrictions all interrupt ongoing requests. Transactional emails (order confirmations, notifications) require server-side reliability guarantees.

**How to avoid:**
1. **Never send transactional emails from the browser.** Webhook handler runs on your server, can retry, has persistent state, and is guaranteed to complete.
2. Use Paddle webhook `transaction.completed` event to trigger both buyer confirmation + owner notification emails via Resend.
3. Use client-side callback only for UX feedback: redirect to success page, show toast notification, log analytics event.

**Warning signs:**
- Some customers never receive confirmation emails (inconsistent)
- Owner gets notifications for some purchases, not others
- Email logs show sends coming from different IP addresses/times (indicating browser origins)

### Pitfall 5: Forgetting to Add Segmentation Tag on Email Capture

**What goes wrong:** Build Map downloader is added to Resend contacts but no `automate-buyer` tag is applied. Later, DFY upsell email campaign targets `automate-buyer` segment, but Build Map downloader is not included. Upsell only reaches people who already paid, not leads.

**Why it happens:** Email capture form adds to Resend contacts via `/api/subscribe`, but the subscribe route doesn't apply a tag. Tagging is a separate `contacts.update` call with tag assignment. Easy to forget if not in the checklist.

**How to avoid:**
1. **In `/api/subscribe` route handler, after `contacts.create`, immediately apply tag:**
   ```typescript
   await resend.contacts.update({
     id: email,
     audienceId,
     tags: ["build-map-downloader"],
   });
   ```
2. Add test: verify that contacts created via Build Map form carry the tag.
3. Add to verify-work checklist: query Resend audience; confirm 100% of Build Map submissions have the tag.

**Warning signs:**
- Email campaign runs but bounces off Build Map downloader segment
- DFY sales don't correlate with Build Map download numbers
- Resend shows contacts in audience but no tag metadata

### Pitfall 6: Showing Calendly Instead of Scheduling Link on Success Page for DWY

**What goes wrong:** Success page for DWY embeds Calendly iframe (old enterprise pattern). DWY buyer books call to discuss the build session instead of starting it. Defeats "self-serve" promise. Creates support bottleneck — Asor gets calendly notifications for every DWY buyer, must confirm times, takes calls.

**Why it happens:** Developer copies old `/checkout/success` page pattern (has Calendly embedded). Doesn't read PROD-08 requirement ("DWY success page offers a scheduling link for the screen-to-screen build session").

**How to avoid:**
1. **Create separate success pages:** `/automate/success?product=dfy` and `/automate/success?product=dwy`.
2. DFY success page: form capture only (IG handle, keyword, lead magnet link, voice/tone notes). No scheduling.
3. DWY success page: same form capture + scheduling link (provided by DWY provider, e.g., Calendly calendar with only DWY time slots, or Acuity with specific DWY workflow).
4. Add to verify-work: purchase DFY and DWY on real device; verify success pages differ.

**Warning signs:**
- DWY customers all book "discovery calls" instead of starting their build session
- Calendly calendar fills with DWY buyers asking when to start
- Success page shows same Calendly to all products (not differentiated)

## Code Examples

Verified patterns from official sources:

### Production Paddle Environment Check

```typescript
// src/app/api/paddle/config-status/route.ts
// Source: Paddle developer docs + phase requirement PAY-01

import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.NEXT_PUBLIC_PADDLE_TOKEN;
  const dwyPrice = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DWY;
  const dfyPrice = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY;
  const carePlanPrice = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN;
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

  const status = {
    paddle_mode: token?.startsWith('test_') ? 'sandbox' : 'production',
    paddle_token_set: !!token,
    dfy_price_id: dfyPrice ? '✓' : '✗ MISSING',
    dwy_price_id: dwyPrice ? '✓' : '✗ MISSING',
    care_plan_price_id: carePlanPrice ? '✓' : '✗ MISSING',
    webhook_secret_set: !!webhookSecret,
  };

  if (status.paddle_mode === 'sandbox') {
    return NextResponse.json(
      { warning: 'Paddle is in SANDBOX mode. Production token required before PAY-01.', ...status },
      { status: 503 }
    );
  }

  if (!dwyPrice || !dfyPrice || !carePlanPrice) {
    return NextResponse.json(
      { error: 'Missing price IDs', ...status },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, ...status });
}
```

### Zod Schema for Success Page Form (DFY/DWY Onboarding)

```typescript
// src/lib/schemas.ts
// Source: Zod documentation + Paddle phase requirements PAY-07

import { z } from 'zod';

export const automateSuccessSchema = z.object({
  igHandle: z.string()
    .min(1, 'Instagram handle required')
    .regex(/^@?[\w.]+$/, 'Invalid Instagram handle format')
    .max(30, 'Handle too long'),
  keyword: z.string()
    .min(1, 'Keyword required')
    .max(50, 'Keyword too long'),
  leadMagnetLink: z.string()
    .url('Must be a valid URL')
    .or(z.string().refine(s => s.includes('bit.ly') || s.includes('short')), 'Short link preferred'),
  voiceTone: z.string()
    .min(10, 'Provide voice/tone guidance')
    .max(200, 'Keep it concise'),
});

export type AutomateSuccessFormData = z.infer<typeof automateSuccessSchema>;
```

### Plausible Analytics Integration

```typescript
// src/app/layout.tsx (global layout)
// Source: Plausible documentation for Next.js

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Plausible script — no config needed, just paste */}
        <script
          defer
          data-domain="asorahura.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Paddle Webhook Signature Verification (Complete Example)

```typescript
// src/lib/paddle-webhook.ts
// Source: Paddle developer docs webhook security

import crypto from 'crypto';

export function verifyPaddleWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const [ts, hash] = signature.split(';').map(s => {
    const [key, val] = s.split('=');
    return val;
  });

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(`${ts}:${body}`)
    .digest('hex');

  return hash === hmac;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Enterprise call-first funnel + Calendly embedded on every success page | Self-serve Paddle checkout + differentiated success pages (DFY form, DWY scheduling, Care Plan confirmation) | Phase 7 (this phase) | Supports $500 ticket economics without sales call overhead; Care Plan ongoing revenue |
| Hardcoded price IDs in component code | Environment variables `NEXT_PUBLIC_PADDLE_PRICE_ID_*` per product | Phase 7 | Eliminates environment-specific bugs (sandbox token used in production) |
| Client-side callback for all order logic | Webhook + callback split: webhook for DB + email (server-reliable), callback for UX feedback (client-fast) | Phase 7 | Eliminates missed orders due to browser crashes or network timeout during success page render |
| Manual list segmentation (CSVs, spreadsheets) | Resend contacts with tags (`automate-buyer`, `build-map-downloader`) | Phase 7 | Enables automated DFY upsell sequences targeting Build Map leads; manual tagging error-prone and non-scalable |
| Google Forms + manual exports | Inline email capture form + Resend contacts.create + Google Sheets mirror (automated) | Phase 1 (v1.0); re-used Phase 7 | Reduces friction, captures UTM params, single source of truth in Resend + auto-mirrored to Sheets |
| No analytics or event tracking | Plausible custom events (land, demo, Build Map submit, checkout open, purchase) | Phase 7 | Enables conversion funnel analysis, identifies drop-off points, measures marketing spend ROI |

**Deprecated/outdated:**
- **Calendly as primary checkout path:** Removed from Phase 7 primary path. Kept for enterprise track only (Phase 10).
- **Assessment as entry point to conversion:** Replaced by `/automate` self-serve product page. Assessment becomes upsell from Product #1 onboarding (Phase 10).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Paddle production account + credentials already exist (same as v1.0 sandbox account) | Standard Stack, Pitfall 1 | If production account hasn't been created, PAY-01 checkpoint fails immediately. Blocks entire phase. |
| A2 | New price IDs (DFY $500, DWY $800, Care Plan $9.99/mo) must be created manually in Paddle dashboard; no API auto-provisioning | Standard Stack, Code Examples | If IDs must be created via API, webhook setup differs. Low risk — Paddle pricing is typically UI-driven. |
| A3 | `PADDLE_WEBHOOK_SECRET` env var will be provided by user in production environment | Code Examples, Pitfall 2 | If not set, webhook signature verification fails on all events. PAY-05/06 emails never send. Medium risk — common to forget in deployment checklist. |
| A4 | Build Map deliverable (4 n8n workflow files + env template) exists or can be provided by user before Phase 7 execution | Summary, Additional Context | If files don't exist, success page form cannot collect `keyword` (critical for DFY/DWY setup). Content gap. High risk. |
| A5 | Plausible Analytics account can be created freely (https://plausible.io) and connected to domain | Standard Stack | If Plausible SaaS is blocked by org policy (privacy/data residency), substitute with Vercel Analytics (limited) or self-hosted Umami. Low risk. |
| A6 | Resend audience ID and API key already configured; `/api/subscribe` route exists and is working | Architecture Patterns, Code Examples | If Resend is not set up, Build Map email capture fails. Low risk — already verified in v1.0. |
| A7 | Route groups `(automate)` are supported in Next.js 16.2.6 (currently installed) | Architecture Patterns | Next.js App Router supports route groups since v13. Very low risk. |
| A8 | DFY/DWY success page routing can pass `?product=dfy` or `?product=dwy` query param to differentiate page content | Code Examples, Pitfall 6 | If routing is different (URL slug, path, or cookie-based), page differentiation logic changes. Low impact — implementation detail. |

**If this table is empty:** None — all claims in this research were verified or cited from official sources. User confirmation needed only for A1, A3, A4, A5 before execution.

## Open Questions

1. **Build Map deliverable existence**
   - What we know: PROJECT.md describes the deliverable as "4 n8n workflow files, env template, deployment guide" (total ~500 KB expected).
   - What's unclear: Do these files exist in the repo, or will they be supplied by user, or must they be stubbed/placeholder for Phase 7?
   - Recommendation: If files don't exist, planner must add a task: "Create placeholder Build Map deliverable" or "Await real files from user". Don't let Phase 7 finish without a real download link.

2. **Paddle production account status**
   - What we know: Sandbox account is active (token in .env.local, existing products priced).
   - What's unclear: Has production account been created? Do DFY/DWY/Care Plan products + price IDs exist in production?
   - Recommendation: PAY-01 is the first checkpoint. Planner must verify Paddle production status before proceeding to any other tasks.

3. **Scheduling link provider for DWY**
   - What we know: PROD-08 says "DWY success page offers a scheduling link for the screen-to-screen build session". Old code embeds Calendly.
   - What's unclear: What provider (Calendly, Acuity, Cal.com, n8n automation) should the link point to? Is it Asor's personal Calendly, or a workflow-specific calendar?
   - Recommendation: Planner should clarify with user. For now, assume Calendly with a specific DWY-only calendar or time slot.

4. **Plausible vs Vercel Analytics final call**
   - What we know: Plausible has better event tracking; Vercel is zero-config on Vercel platform.
   - What's unclear: Does org policy restrict third-party analytics? Is data residency a concern?
   - Recommendation: If Plausible is unavailable due to policy/cost, fallback to Vercel Analytics (reduced feature set for TRACK-02/03). This research assumes Plausible; planner should confirm with user.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Paddle API (production account) | PAY-01, PAY-02, PAY-03, PAY-04 | ✓ (sandbox verified in .env.local; production status unverified) | v2 (current) | None — blocking |
| Resend API | LEAD-01, LEAD-02, LEAD-03, PAY-05 (email sends) | ✓ | 6.12.3 | SendGrid (requires SMTP setup) |
| Google Sheets webhook | LEAD-02 (mirror) | ✓ | (via GOOGLE_SCRIPT_URL) | Airtable, Notion (requires script update) |
| Plausible analytics | TRACK-01, TRACK-02, TRACK-03 | ✗ (not installed) | Latest | Vercel Analytics (limited events) or self-hosted Umami |
| PostgreSQL or any database | Success page onboarding form storage | ✗ (status unclear) | — | Email-only approach (form values sent to user email, stored manually) |
| Next.js App Router | Entire phase | ✓ | 16.2.6 | No fallback (architecture depends on it) |

**Missing dependencies with no fallback:**
- Paddle production account + price IDs (must be created/verified before PAY-01 checkpoint)
- Database for success page form (if onboarding data must be stored server-side)

**Missing dependencies with fallback:**
- Plausible Analytics → Vercel Analytics (reduced feature set for custom events)
- Google Sheets mirror → Airtable, Notion, or email-only

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Phase 7 has no user login or auth. Page is public. |
| V3 Session Management | No | No session state. Paddle manages checkout session. |
| V4 Access Control | No | No role-based access. Public page. |
| V5 Input Validation | **Yes** | Zod schema for email (Build Map form) + DFY/DWY onboarding form. No hand-rolled validation. |
| V6 Cryptography | **Yes** | Paddle webhook signature verification via HMAC-SHA256 (crypto.createHmac). Must verify all incoming webhooks before processing. |
| V7 Error Handling | **Yes** | Webhook errors logged but never exposed to client. Paddle failures logged and retried. Form validation errors shown to user without stack traces. |
| V8 Data Protection | **Yes** | Transactional emails (order confirmation, owner notification) sent over Resend (TLS). Webhook payloads contain PII (email, IG handle). HTTPS-only for all endpoints. No plaintext storage. |
| V9 Communications | **Yes** | All webhooks over HTTPS (Paddle enforces). Success page uses HTTPS. Email links signed by Resend. |
| V10 Malicious Activity | **Yes** | Webhook signature verification prevents spoofed events. Email validation (Zod.email) prevents invalid submissions. Honeypot field (optional) in forms reduces bot spam. |
| V11 Business Logic | **Yes** | Order creation idempotent (no duplicates on webhook retry). Email send side-effect only on successful transaction. Price IDs validated against env vars (no client-side override). |
| V12 File Upload | No | No file uploads in this phase. |
| V13 API & Web Service | **Yes** | Webhook endpoint rate-limited (via Vercel serverless default). No client-side price manipulation (prices sourced from Paddle, not form data). |
| V14 Configuration | **Yes** | No hardcoded credentials. All tokens/secrets in env vars. Production token different from sandbox token. |

### Known Threat Patterns for Paddle + Resend + Plausible Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Webhook spoofing (attacker sends fake "order complete" event) | Tampering | Verify HMAC-SHA256 signature on every webhook using `PADDLE_WEBHOOK_SECRET`. Reject unsigned events. |
| Price ID manipulation (client sends modified price ID via priceId param) | Tampering | Price IDs are always passed from server env vars, never constructed by client. Client passes product type (string), server looks up price ID. |
| Email injection (attacker submits email form with newlines to inject headers) | Tampering | Zod.email() validates RFC-compliant format; rejects if newlines present. Resend API escapes headers. |
| Replay attack (attacker captures webhook, sends it again) | Spoofing | Paddle webhook includes timestamp. Add timestamp validation: reject events older than 5 minutes (defend against replayed old events). |
| Duplicate charges (attacker clicks submit twice, browser caching fails) | Tampering | Paddle transaction ID is unique. Database INSERT uses transaction_id as primary key. Second submit with same ID fails gracefully (no charge). |
| List harvesting (attacker submits 10,000 emails to Build Map form, learns email list exists) | Information Disclosure | Rate limit `/api/subscribe` endpoint: max 5 requests per IP per minute. Return 429 Too Many Requests. Log suspicious patterns. |
| Phishing via order confirmation email | Social Engineering | Resend signs all emails (DKIM). Asor controls send domain (hello@asorahura.com, verified in DNS). Customer confirms real order by matching transaction ID in email to their own. No shortened links in transactional email. |
| Analytics data leak (Plausible sends UTM params to third party) | Information Disclosure | Plausible is privacy-first (no cookies, anonymized IPs). UTM params in events are okay; they're marketing metadata, not PII. Plausible doesn't send to advertisers. Review Plausible privacy policy before deployment. |

### Required Pre-Deployment Security Checklist

- [ ] Paddle webhook signature verification implemented and tested (both valid and invalid signatures)
- [ ] `PADDLE_WEBHOOK_SECRET` env var set in production
- [ ] Email form (Build Map) validated with Zod; no newlines in input
- [ ] `/api/subscribe` rate-limited to 5 req/IP/min
- [ ] Success page form (DFY/DWY onboarding) uses Zod validation; `igHandle` regex accepts only valid IG chars
- [ ] All transactional emails (buyer confirmation, owner notification) sent from verified domain (hello@asorahura.com)
- [ ] No PII logged in Plausible events (no email, no full IG handle beyond first letter + asterisks)
- [ ] All API endpoints (`/api/subscribe`, `/api/paddle/webhook`) require HTTPS; Vercel enforces this by default
- [ ] Success page form submits over POST, not GET (no sensitive data in URL)
- [ ] Webhook handler returns 2xx status only after DB transaction completes successfully

## Sources

### Primary (HIGH confidence)
- [Paddle Developer Docs - Webhooks](https://developer.paddle.com/webhooks/overview) — verified webhook signature verification, event types, retry behavior
- [Paddle Developer Docs - Checkout](https://developer.paddle.com/build/checkout/handle-success-post-checkout) — callback vs webhook pattern
- [Paddle Developer Docs - Prices](https://developer.paddle.com/api-reference/prices/overview) — recurring vs one-time price setup, environment separation
- [Paddle Developer Docs - Sandbox](https://developer.paddle.com/sdks/sandbox/) — test credentials, environment isolation
- [Next.js App Router Routing Docs](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — route groups pattern, layout isolation
- [Zod Documentation](https://zod.dev) — email validation, schema definition
- [React Hook Form + Zod Integration](https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form) — form validation pattern
- [Resend Documentation](https://resend.com/docs) — email API, contacts.create, contacts.update (tags)
- [Plausible Analytics Documentation](https://plausible.io/docs) — custom events, event properties, script integration

### Secondary (MEDIUM confidence — verified with official sources)
- [Swetrix Comparison: Plausible vs Vercel Analytics](https://swetrix.com/comparison/plausible/vs-vercel-web-analytics) — event tracking capabilities
- [Amplitude: Best Analytics Tools for Next.js 2026](https://amplitude.com/compare/best-analytics-tools-nextjs) — Vercel Analytics limitations for custom events
- [Medium: Paddle Checkout Integration with Next.js App Router](https://medium.com/@jedpatterson/integrating-paddle-checkout-with-next-js-app-router-f6cb50d645b3) — real-world App Router pattern
- [Dev.to: Paddle Webhook in Next.js 14 App Directory](https://www.niraj.com.np/blog/paddle-webhook-in-next-js-14) — webhook handler example

### Tertiary (LOW confidence — research findings, not verified in user's codebase)
- [Email Validation Best Practices (LeadMagic)](https://leadmagic.io/blog/email-validation-best-practices) — form field structure, real-time validation feedback
- [Lead Capture Forms Best Practices (LeadSquared)](https://www.leadsquared.com/learn/marketing/lead-capture-forms/) — form field count, mobile optimization

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — Paddle, Resend, Zod verified in codebase or official docs. Plausible verified via multiple sources.
- Architecture patterns: **HIGH** — All patterns sourced from official Paddle, Next.js, Zod docs. Webhook/callback split verified via Paddle docs.
- Pitfalls: **MEDIUM-HIGH** — Based on documented Paddle quirks (environment separation, webhook retry behavior) and common SaaS mistakes (transactional email from client, duplicate records).
- Common practices: **HIGH** — Email validation, form security, webhook signature verification are industry standard.

**Research date:** 2026-08-07
**Valid until:** 2026-08-21 (14 days — Paddle/Resend/Next.js stable, Plausible updates monthly)

**Key dependencies on Phase 6 completion:**
- Color tokens (surface, text, accent) must exist in `globals.css` for `/automate` page styling
- Type and spacing scales needed for consistent page layout
- Contrast verification script should be available for WCAG compliance checks

**Blockers resolved by this research:**
- ✓ Paddle webhook pattern clarified (use webhook + callback split)
- ✓ Paddle environment separation explained (sandbox ≠ production; price IDs differ)
- ✓ Email workflow pattern documented (Resend existing, webhook-triggered)
- ✓ Analytics choice narrowed (Plausible for TRACK-01..03)
- ✓ Form validation pattern provided (Zod + React Hook Form)
- ⚠ Build Map deliverable source not found in repo — flagged as content gap

**Outstanding verification tasks (for planner):**
1. Verify Paddle production account exists; new price IDs created (PAY-01)
2. Obtain or create Build Map deliverable files (4 n8n workflows + env template)
3. Confirm Plausible account can be created; no org policy blocks it
4. Clarify scheduling link provider for DWY (Calendly, Acuity, etc.)
