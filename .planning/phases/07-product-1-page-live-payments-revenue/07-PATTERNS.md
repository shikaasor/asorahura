# Phase 7: Product #1 Page Live + Payments (REVENUE) - Pattern Map

**Mapped:** 2026-08-07
**Files analyzed:** 11 new/modified files
**Analogs found:** 9 / 11 (all core patterns exist; 2 files are new categories)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/app/(automate)/page.tsx` | page | request-response | `src/app/checkout/page.tsx` | role-match |
| `src/app/(automate)/layout.tsx` | layout | request-response | `src/app/layout.tsx` | role-match |
| `src/app/(automate)/success/page.tsx` | page | request-response | `src/app/checkout/success/page.tsx` | role-match |
| `src/app/api/paddle/webhook/route.ts` | route (webhook) | event-driven | `src/app/api/subscribe/route.ts` | role-match |
| `src/app/api/subscribe/route.ts` | route (modify) | CRUD | existing (reuse) | exact |
| `src/components/(automate)/BuildMapForm.tsx` | component (form) | request-response | `src/components/blog/EmailCaptureWidget.tsx` | role-match |
| `src/components/(automate)/HeroSection.tsx` | component (hero) | request-response | `src/components/home/HeroSection.tsx` | role-match |
| `src/components/(automate)/ComparisonStrip.tsx` | component (display) | request-response | `src/components/home/PainSection.tsx` | role-match |
| `src/components/(automate)/PricingSection.tsx` | component (display) | request-response | `src/components/checkout/OrderSummary.tsx` | role-match |
| `src/components/(automate)/FAQSection.tsx` | component (accordion) | request-response | No analog (new) | none |
| `src/components/checkout/PaddleCheckout.tsx` | component (modify) | request-response | existing (reuse) | exact |
| `src/lib/checkout.ts` | utility (modify) | configuration | existing (reuse) | exact |
| `src/lib/paddle-webhook.ts` | utility | utility | No analog (new) | none |
| `src/lib/analytics.ts` | utility | utility | No analog (new) | none |
| `src/lib/schemas.ts` | utility (modify/new) | configuration | `src/lib/validation.ts` | role-match |
| `src/emails/PurchaseConfirmation.tsx` | email template | utility | `src/emails/AssessmentReport.tsx` | role-match |
| `src/emails/OrderNotification.tsx` | email template | utility | `src/emails/AssessmentReport.tsx` | role-match |

---

## Pattern Assignments

### `src/app/(automate)/page.tsx` (page, request-response)

**Analog:** `src/app/checkout/page.tsx`

**Purpose:** Server-rendered product landing page with client components for interactive sections (forms, checkout buttons).

**Structure pattern** (lines 1-30):
```typescript
// src/app/checkout/page.tsx shows the pattern:
"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";

// Export metadata for SEO
export const metadata = { title: "..." };

// Wrap in Suspense for useSearchParams
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const tierParam = useSearchParams().get("tier");
  // ... component logic
}
```

**Reuse pattern:** Import section components (`HeroSection`, `ComparisonStrip`, `PricingSection`, `FAQSection`), compose into single page. Use `useSearchParams()` for query params (e.g., tracking UTM params for analytics).

---

### `src/app/(automate)/layout.tsx` (layout, request-response)

**Analog:** `src/app/layout.tsx`

**Structure pattern** (lines 42-63):
```typescript
// src/app/layout.tsx shows the RootLayout pattern:
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <RouteChrome>
          <ParticleWave />
        </RouteChrome>
        <Navigation />
        <div className="nav-offset">
          {children}
          <RouteChrome>
            <Footer />
          </RouteChrome>
        </div>
      </body>
    </html>
  );
}
```

**Apply to `/automate` layout:** Replace `Navigation` and global `Footer` with custom logo-only header and self-contained footer. Do NOT include `ParticleWave`, `RouteChrome`, or site navigation. Keep `inter.variable` from root layout.

**Key difference:** Route group layout does NOT include Navigation or RouteChrome — isolated layout until Phase 9.

---

### `src/app/(automate)/success/page.tsx` (page, request-response)

**Analog:** `src/app/checkout/success/page.tsx`

**Pattern** (lines 1-50):
```typescript
// src/app/checkout/success/page.tsx
export const metadata = {
  title: "Payment Successful | Asor Ahura",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Confirmation header */}
        <div className="text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="text-3xl font-bold">Payment confirmed.</h1>
          <p className="text-gray-600">Confirmation details...</p>
        </div>
        {/* Form or next step CTA */}
      </div>
    </main>
  );
}
```

**Apply to `/automate/success`:** 
- Use `?product=dfy` or `?product=dwy` query param to differentiate page content
- DFY success: Show form with IG handle, keyword, lead magnet link, voice/tone fields (from UI-SPEC § Success Page Form)
- DWY success: Same form + scheduling link (Calendly or similar)
- Both: Show next rung message and `automate-buyer` tag copy
- No Calendly iframe on this page for DFY (avoid sales call friction)

---

### `src/app/api/paddle/webhook/route.ts` (route, event-driven)

**Analog:** `src/app/api/subscribe/route.ts` (for structure pattern)

**Purpose:** Server-side webhook endpoint that verifies Paddle signature, processes order data (DB insert), triggers emails (buyer confirmation, owner notification).

**Base route pattern** (lines 1-11, 19-41 from subscribe/route.ts):
```typescript
// src/app/api/subscribe/route.ts shows the NextRequest/NextResponse pattern:
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.error('[subscribe] RESEND_AUDIENCE_ID not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // Process async work
  const { error } = await resend.contacts.create({...});
  if (error) {
    console.error('[subscribe] Resend error:', error);
    return NextResponse.json({ error: 'Service error.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

**Apply to Paddle webhook:**
1. Verify HMAC-SHA256 signature (use `crypto.createHmac` from Node.js stdlib)
2. Extract Paddle `transaction.completed` event
3. Create order record in database (idempotent on `transaction_id`)
4. Send buyer confirmation email via Resend
5. Send owner notification email via Resend
6. Return `{ ok: true }` with 200 status
7. Reject unsigned/invalid signatures with 401

**Signature verification pattern** (from RESEARCH.md § Code Examples):
```typescript
import crypto from 'crypto';

async function verifyWebhookSignature(req: NextRequest) {
  const signature = req.headers.get('paddle-signature');
  if (!signature) return null;

  const body = await req.text();
  const [ts, hash] = signature.split(';').map(s => s.split('=')[1]);
  
  const hmac = crypto
    .createHmac('sha256', PADDLE_WEBHOOK_SECRET)
    .update(`${ts}:${body}`)
    .digest('hex');
  
  return hash === hmac;
}
```

---

### `src/app/api/subscribe/route.ts` (route, modify for Build Map form)

**Existing analog:** `src/app/api/subscribe/route.ts` (reuse with modifications)

**Current pattern** (lines 1-41):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.error('[subscribe] RESEND_AUDIENCE_ID not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const { error } = await resend.contacts.create({
    email: email.trim().toLowerCase(),
    audienceId,
    unsubscribed: false,
  });

  if (error) {
    console.error('[subscribe] Resend contacts error:', error);
    return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 });
  }

  // Mirror to Google Sheets
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType: 'newsletter', email: email.trim().toLowerCase() }),
      redirect: 'follow',
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
```

**Modification needed:** After `contacts.create`, call `contacts.update` to apply `build-map-downloader` tag (Phase 7 RESEARCH.md § Pitfall 5):
```typescript
// Add after contacts.create succeeds:
await resend.contacts.update({
  id: email.trim().toLowerCase(),
  audienceId,
  tags: ["build-map-downloader"],
});
```

---

### `src/components/(automate)/BuildMapForm.tsx` (component, request-response)

**Analog:** `src/components/blog/EmailCaptureWidget.tsx`

**Form pattern** (lines 1-130):
```typescript
// src/components/blog/EmailCaptureWidget.tsx
'use client';
import { useState } from 'react';

export default function EmailCaptureWidget() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? 'Something went wrong. Try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="your@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
      {status === 'error' && <p>{errorMsg}</p>}
      {status === 'success' && <p>Check your inbox.</p>}
    </form>
  );
}
```

**Apply to BuildMapForm:**
1. Use same fetch-to-`/api/subscribe` pattern
2. Add Zod email validation with real-time visual feedback (green checkmark for valid, red for invalid)
3. Use React Hook Form + Zod resolver (from EmailGate pattern below)
4. Show loading spinner during submit
5. Display success message: "✓ Check your inbox for your download link"
6. Handle "already signed up" state gracefully (not an error)

**Enhanced pattern with Zod + React Hook Form** (from `src/components/assessment/EmailGate.tsx`, lines 1-65):
```typescript
// src/components/assessment/EmailGate.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailGateSchema, type EmailGateInput } from "@/lib/validation";

interface Props {
  onSubmit: (data: EmailGateInput) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function EmailGate({ onSubmit, isLoading, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailGateInput>({ resolver: zodResolver(emailGateSchema) });

  return (
    <div>
      <h2>Get the Build Map</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Download Build Map"}
        </button>
      </form>
    </div>
  );
}
```

---

### `src/lib/schemas.ts` (utility, configuration)

**Analog:** `src/lib/validation.ts`

**Pattern** (lines 1-16):
```typescript
// src/lib/validation.ts
import { z } from "zod";

export const emailGateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5)
    .max(255),
});

export type EmailGateInput = z.infer<typeof emailGateSchema>;
```

**Apply to Phase 7 schemas:**
1. Create `automateSuccessSchema` for DFY/DWY onboarding form (from RESEARCH.md § Code Examples):
   - `igHandle`: regex validation for Instagram handles, max 30 chars
   - `keyword`: required, max 50 chars, no validation
   - `leadMagnetLink`: URL validation (must be valid URL or contain 'bit.ly'/'short')
   - `voiceTone`: min 10 chars, max 200 chars
2. Create `buildMapSchema` for email capture form:
   - `email`: Zod email validation

```typescript
import { z } from 'zod';

export const buildMapSchema = z.object({
  email: z.string().email('Invalid email address'),
});

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
    .or(z.string().refine(s => s.includes('bit.ly') || s.includes('short'))),
  voiceTone: z.string()
    .min(10, 'Provide voice/tone guidance')
    .max(200, 'Keep it concise'),
});

export type BuildMapFormData = z.infer<typeof buildMapSchema>;
export type AutomateSuccessFormData = z.infer<typeof automateSuccessSchema>;
```

---

### `src/lib/checkout.ts` (utility, modify)

**Existing analog:** `src/lib/checkout.ts` (reuse and extend)

**Current pattern** (lines 1-52):
```typescript
// src/lib/checkout.ts
export type TierId = "discovery" | "strategy";

export interface Tier {
  id: TierId;
  name: string;
  tagline: string;
  price: string;
  priceDetail: string;
  deliverables: string[];
  timeline: string;
  support: string;
  paddlePriceId: string;
}

export const tiers: Tier[] = [
  {
    id: "discovery",
    name: "Discovery Call",
    tagline: "Understand exactly where AI can save you time…",
    price: "$50/hr",
    priceDetail: "Billed hourly",
    deliverables: [...],
    timeline: "5–7 business days",
    support: "1 × 60-min strategy call + async Q&A",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DISCOVERY_CALL || "",
  },
  // ... more tiers
];

export function getTierById(id: TierId): Tier {
  return tiers.find((t) => t.id === id) || tiers[0];
}
```

**Apply to Phase 7 (from RESEARCH.md § Pattern 2):**

Extend `TierId` union and `tiers` array to include `"dfy"`, `"dwy"`, `"build-map"`, `"care-plan"`. Each tier includes `billingType: "one-time" | "recurring"` (used to split checkout calls).

Use environment variables for all price IDs:
- `NEXT_PUBLIC_PADDLE_PRICE_ID_DFY`
- `NEXT_PUBLIC_PADDLE_PRICE_ID_DWY`
- `NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN`

---

### `src/components/checkout/PaddleCheckout.tsx` (component, modify)

**Existing analog:** `src/components/checkout/PaddleCheckout.tsx` (reuse; already supports multiple price IDs)

**Current pattern** (lines 1-135):
```typescript
// src/components/checkout/PaddleCheckout.tsx
"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  priceId: string;
  onSuccess?: () => void;
}

export function PaddleCheckout({ priceId, onSuccess }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleEvent(e: Event) {
      const { name } = (e as CustomEvent).detail;
      if (name === "checkout.completed") {
        onSuccess ? onSuccess() : (window.location.href = "/checkout/success");
      }
    }
    window.addEventListener("paddle:event", handleEvent);
    return () => window.removeEventListener("paddle:event", handleEvent);
  }, []);

  useEffect(() => {
    // Lazy-load Paddle script
    if (!window.Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => {
        window.Paddle.Environment.set("sandbox");
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_TOKEN!,
          eventCallback: (event) => {
            window.dispatchEvent(new CustomEvent("paddle:event", { detail: event }));
          },
        });
        window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          settings: { displayMode: "inline", frameTarget: "paddle-checkout-frame" },
        });
      };
      document.head.appendChild(script);
    }
  }, [priceId]);

  return (
    <div>
      {!isLoaded && <div>Loading payment form…</div>}
      <div className="paddle-checkout-frame" ref={containerRef} />
    </div>
  );
}
```

**No modification needed for Phase 7:** The component already accepts `priceId` as a prop and supports multiple price IDs through env vars. Only the calling code (buttons in PricingSection) needs to pass the correct price ID.

---

### `src/emails/PurchaseConfirmation.tsx` (email template, utility)

**Analog:** `src/emails/AssessmentReport.tsx`

**Pattern** (lines 1-80 from AssessmentReport.tsx):
```typescript
// src/emails/AssessmentReport.tsx
import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Hr,
} from "@react-email/components";

interface Props {
  firstName: string;
  score: number;
  tier: string;
  tierDescription: string;
  previewBullets: string[];
  email: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://asorahura.vercel.app';

export function AssessmentReport({
  firstName,
  score,
  tier,
  tierDescription,
  previewBullets,
  email,
}: Props) {
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9fafb" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px" }}>
          <Heading style={{ fontSize: "24px" }}>
            Report Title
          </Heading>
          <Section>
            <Text>Email body content</Text>
          </Section>
          <Hr />
          {/* Unsubscribe footer */}
        </Container>
      </Body>
    </Html>
  );
}
```

**Apply to PurchaseConfirmation:**
1. Use `@react-email/components` (already installed)
2. Accept props: `firstName`, `productType` ("dfy" | "dwy" | "care-plan"), `transactionId`, `amount`, `email`
3. Show order confirmation header with checkmark
4. List purchased item(s) with price
5. Include transaction ID (so buyer can verify in Paddle receipt)
6. Provide next steps copy (DFY: "We'll build this in 3–5 days"; DWY: "Schedule your session"; Care Plan: "Your subscription is active")
7. Include unsubscribe footer

---

### `src/emails/OrderNotification.tsx` (email template, utility)

**Analog:** `src/emails/AssessmentReport.tsx`

**Purpose:** Server-sent email to Asor (owner) notifying of purchase, with buyer metadata for DFY/DWY build onboarding.

**Use same HTML structure** as AssessmentReport and PurchaseConfirmation.

**Content:**
1. Subject: "New Order: {Product Type} from {Buyer Email}" (or similar)
2. Buyer name, email, product type
3. If DFY/DWY: Include onboarding form data if available (IG handle, keyword, etc.) — if not yet submitted, say "Awaiting onboarding form"
4. Link to order in Paddle dashboard (if available) or manual action items

---

## Shared Patterns

### Email Sending Pattern
**Source:** `src/lib/email.ts`
**Apply to:** All webhook handlers that send email

**Pattern** (lines 1-64):
```typescript
// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Asor Ahura <hello@asorahura.com>";

export async function sendAssessmentEmail(params: {
  email: string;
  firstName: string;
  subject?: string;
  body?: string;
  react?: React.ReactNode;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    ...(body ? { text: body } : { react }),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
```

**Apply to Paddle webhook:**
1. Create `sendPurchaseConfirmationEmail()` and `sendOrderNotificationEmail()` helpers
2. Use Resend email template (React component)
3. Return `{ success: boolean; error?: string }`
4. Log errors but do not re-throw (webhook should return 200 even if email fails, so Paddle doesn't keep retrying)

---

### Validation Pattern
**Source:** `src/lib/validation.ts` + `src/components/assessment/EmailGate.tsx`
**Apply to:** All forms

**Pattern:**
1. Define Zod schema in `src/lib/schemas.ts`
2. Import in component: `import { zodResolver } from "@hookform/resolvers/zod"`
3. Use `useForm` hook: `const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })`
4. Render field with error display: `{errors.field && <span>{errors.field.message}</span>}`
5. Show real-time validation feedback (green checkmark for valid email, etc.)

---

### API Route Pattern
**Source:** `src/app/api/subscribe/route.ts`
**Apply to:** All API routes (webhook, onboarding form submission, etc.)

**Pattern** (lines 1-41):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 1. Parse and validate input
  const { field } = await req.json();
  if (!field) {
    return NextResponse.json({ error: 'Field required.' }, { status: 400 });
  }

  // 2. Check env var
  const envVar = process.env.SOME_ENV_VAR;
  if (!envVar) {
    console.error('[route-name] SOME_ENV_VAR not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // 3. Do async work
  const { error } = await someAsyncCall(...);
  if (error) {
    console.error('[route-name] Error:', error);
    return NextResponse.json({ error: 'Service error.' }, { status: 500 });
  }

  // 4. Return success
  return NextResponse.json({ ok: true });
}
```

---

### Paddle Webhook Event Handling Pattern
**Source:** RESEARCH.md § Pattern 1 (reference implementation)
**Apply to:** `src/app/api/paddle/webhook/route.ts`

**Key principles:**
1. **Verify signature first** (reject if invalid)
2. **Make each webhook idempotent** (use `transaction_id` as unique key in database)
3. **Extract `transaction.completed` event only** (ignore subscription lifecycle events for this phase)
4. **Process in single transaction** (DB insert + email send must succeed together or both fail)
5. **Return 200 immediately after DB commit** (don't wait for email to complete; fire-and-forget email)
6. **Log all webhook receives** with timestamp and transaction ID (for debugging)

---

### Component Import/Organization Pattern
**Source:** Existing codebase structure
**Apply to:** `/automate` components folder

```typescript
// src/components/(automate)/index.ts — optional barrel export
export { HeroSection } from './HeroSection';
export { BuildMapForm } from './BuildMapForm';
export { ComparisonStrip } from './ComparisonStrip';
export { PricingSection } from './PricingSection';
export { FAQSection } from './FAQSection';

// Usage in src/app/(automate)/page.tsx:
import { HeroSection, BuildMapForm, ComparisonStrip, PricingSection, FAQSection } from '@/components/(automate)';
```

---

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md patterns instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/lib/paddle-webhook.ts` | utility | utility | No webhook signature verification code exists in codebase; use RESEARCH.md Pattern 1 |
| `src/lib/analytics.ts` | utility | utility | No Plausible integration code exists in codebase; use RESEARCH.md Pattern 5 |
| `src/components/(automate)/FAQSection.tsx` | component (accordion) | request-response | No accordion/collapsible component exists in codebase; use Framer Motion or simple `useState` + conditional rendering |

---

## Metadata

**Analog search scope:** 
- `src/app/` — page and layout patterns
- `src/app/api/` — API route patterns
- `src/components/` — component patterns (forms, sections, checkout)
- `src/lib/` — utility and validation patterns
- `src/emails/` — email template patterns

**Files scanned:** 60+ TypeScript/TSX files

**Pattern extraction date:** 2026-08-07

**Key findings:**
- Email capture pattern fully replicated (Resend + Google Sheets, `/api/subscribe`)
- Form validation pattern established (Zod + React Hook Form in EmailGate)
- Paddle SDK integration pattern established (PaddleCheckout component, event bus)
- Tier definition pattern established (checkout.ts)
- Email template pattern established (AssessmentReport.tsx)
- **New implementations needed:** Paddle webhook handler (crypto signature verification), Plausible analytics helpers, FAQ accordion component

**Dependencies on prior phases:**
- Phase 6 tokens (color, type, spacing) must be in `globals.css` for `/automate` styling ✓ (verified in UI-SPEC.md)
- `@hookform/resolvers` (Zod bridge) already installed ✓
- Resend API key and audience ID already configured ✓
- Paddle SDK v2 already integrated in PaddleCheckout.tsx ✓
- Google Sheets mirror webhook URL (`GOOGLE_SCRIPT_URL`) already configured ✓

**Env vars required for Phase 7 execution:**
- `NEXT_PUBLIC_PADDLE_TOKEN` (production, not sandbox) — PAY-01 checkpoint
- `NEXT_PUBLIC_PADDLE_PRICE_ID_DFY` — new
- `NEXT_PUBLIC_PADDLE_PRICE_ID_DWY` — new
- `NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN` — new
- `PADDLE_WEBHOOK_SECRET` — new (from Paddle webhook settings page)
- `RESEND_API_KEY` — existing
- `RESEND_AUDIENCE_ID` — existing
- `GOOGLE_SCRIPT_URL` — existing
- `NEXT_PUBLIC_BASE_URL` — existing (used for unsubscribe links)

---

**Pattern Mapping Complete: 2026-08-07**
