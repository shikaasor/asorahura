---
phase: 01-critical-path
plan: 1c
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/checkout/page.tsx
  - src/app/checkout/success/page.tsx
  - src/components/checkout/TierSelector.tsx
  - src/components/checkout/PaddleCheckout.tsx
  - src/components/checkout/TrustBadges.tsx
  - src/components/checkout/OrderSummary.tsx
  - .env.local
autonomous: false
requirements:
  - CHECK-01
  - CHECK-02
  - CHECK-03
  - CHECK-04
  - CHECK-05
user_setup:
  - service: paddle
    why: "Inline checkout payment processing for all 4 service tiers"
    env_vars:
      - name: NEXT_PUBLIC_PADDLE_TOKEN
        source: "Paddle Dashboard → Developer Tools → Authentication → Client-side tokens"
      - name: PADDLE_PRICE_ID_STARTER
        source: "Paddle Dashboard → Catalog → Products → [AI Audit product] → Prices → copy price ID"
      - name: PADDLE_PRICE_ID_OPS
        source: "Paddle Dashboard → Catalog → Products → [Ops Automation product] → Prices → copy price ID"
      - name: PADDLE_PRICE_ID_SYSTEMS
        source: "Paddle Dashboard → Catalog → Products → [Systems Architecture product] → Prices → copy price ID"
      - name: PADDLE_PRICE_ID_ENTERPRISE
        source: "Paddle Dashboard → Catalog → Products → [Enterprise Retainer product] → Prices → copy price ID"
    dashboard_config:
      - task: "Create a Paddle sandbox account and enable sandbox environment"
        location: "https://sandbox-vendors.paddle.com → sign up"
      - task: "Create 4 products (one per tier) in Paddle catalog with one-time prices matching your tier pricing"
        location: "Paddle Dashboard → Catalog → Products → New Product"
      - task: "Copy the client-side token (NOT secret API key) for NEXT_PUBLIC_PADDLE_TOKEN"
        location: "Paddle Dashboard → Developer Tools → Authentication"

must_haves:
  truths:
    - "Checkout page at /checkout renders with an order summary section listing service name, what's included, timeline, and support level"
    - "All 4 pricing tiers are visible and selectable ($5k, $5-15k, $15-30k, $30k+)"
    - "Selecting a tier updates the Paddle inline checkout frame to reflect that tier's price"
    - "Paddle checkout loads inline (not as an overlay/popup) inside a dedicated container div"
    - "Trust badges are visible on the page (Oracle Certified, Secure Payment, 100% Ownership)"
    - "A subtle test mode disclaimer appears below the payment form"
    - "After a successful checkout, user is redirected to /checkout/success"
  artifacts:
    - path: "src/components/checkout/PaddleCheckout.tsx"
      provides: "Paddle.js v2 inline checkout integration — loads script, initializes, opens checkout in container div"
      min_lines: 60
    - path: "src/components/checkout/TierSelector.tsx"
      provides: "4-tier pricing selector that passes selected tier to PaddleCheckout"
      min_lines: 40
    - path: "src/components/checkout/OrderSummary.tsx"
      provides: "Per-tier order summary (name, deliverables, timeline, support)"
      min_lines: 40
    - path: "src/components/checkout/TrustBadges.tsx"
      provides: "Trust badge row: Oracle Certified, Secure Payment, 100% IP Ownership"
      min_lines: 20
    - path: "src/app/checkout/page.tsx"
      provides: "Checkout route composing all checkout components with tier state"
      min_lines: 40
  key_links:
    - from: "src/components/checkout/TierSelector.tsx"
      to: "src/components/checkout/PaddleCheckout.tsx"
      via: "selectedTier prop passed down from checkout page"
      pattern: "selectedTier|tier"
    - from: "src/components/checkout/PaddleCheckout.tsx"
      to: "paddle.js CDN"
      via: "dynamic script injection in useEffect"
      pattern: "cdn.paddle.com"
    - from: "src/components/checkout/PaddleCheckout.tsx"
      to: "NEXT_PUBLIC_PADDLE_TOKEN"
      via: "process.env.NEXT_PUBLIC_PADDLE_TOKEN in Initialize()"
      pattern: "NEXT_PUBLIC_PADDLE_TOKEN"
---

<objective>
Build the /checkout page with Paddle inline checkout, 4-tier pricing selector, per-tier order summary, trust badges, and a success page. Checkout runs in sandbox/test mode. No payment taken yet — this is the scaffolding foundation for live checkout in a later phase.

Purpose: Closes the funnel. After assessment → email nurture, a warm lead clicks "Get Started" and lands here. The page must clearly show what they're buying, provide confidence through trust signals, and surface a working Paddle checkout frame.

Output: /checkout page with Paddle sandbox inline checkout that loads without errors, displays per-tier pricing, and redirects to /checkout/success on completion.
</objective>

<execution_context>
@C:/Users/HP_PC/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/HP_PC/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/01-critical-path/01-CONTEXT.md
@.planning/phases/01-critical-path/01-RESEARCH.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build tier data config, OrderSummary, TierSelector, and TrustBadges</name>
  <files>
    src/lib/checkout.ts
    src/components/checkout/OrderSummary.tsx
    src/components/checkout/TierSelector.tsx
    src/components/checkout/TrustBadges.tsx
    .env.local
  </files>
  <action>
    **Add Paddle env vars to `.env.local`** (append, don't replace existing lines):
    ```
    NEXT_PUBLIC_PADDLE_TOKEN=test_placeholder_replace_me
    PADDLE_PRICE_ID_STARTER=pri_placeholder_starter
    PADDLE_PRICE_ID_OPS=pri_placeholder_ops
    PADDLE_PRICE_ID_SYSTEMS=pri_placeholder_systems
    PADDLE_PRICE_ID_ENTERPRISE=pri_placeholder_enterprise
    ```

    **Create `src/lib/checkout.ts`:**
    Central config for all tier data. Paddle price IDs come from env vars — NOT hardcoded.
    ```typescript
    export type TierId = "starter" | "ops" | "systems" | "enterprise";

    export interface Tier {
      id: TierId;
      name: string;
      price: string;
      priceDetail: string;
      deliverables: string[];
      timeline: string;
      support: string;
      paddlePriceId: string;
    }

    export const tiers: Tier[] = [
      {
        id: "starter",
        name: "AI Audit & Roadmap",
        price: "$5,000",
        priceDetail: "One-time",
        deliverables: [
          "Full AI readiness audit (20-question deep-dive)",
          "Personalized automation roadmap (top 5 opportunities)",
          "Tool stack assessment and recommendations",
          "Written report with priority-ordered action plan",
        ],
        timeline: "5–7 business days",
        support: "1 × 60-min strategy call + async Q&A",
        paddlePriceId: process.env.PADDLE_PRICE_ID_STARTER || "pri_placeholder_starter",
      },
      {
        id: "ops",
        name: "Ops Automation Build",
        price: "$5,000–$15,000",
        priceDetail: "Scoped per project",
        deliverables: [
          "Full AI audit included",
          "Build and deploy 1–3 automation workflows",
          "Documentation and handover",
          "Team training session",
        ],
        timeline: "2–4 weeks",
        support: "Weekly check-ins + 30-day post-launch support",
        paddlePriceId: process.env.PADDLE_PRICE_ID_OPS || "pri_placeholder_ops",
      },
      {
        id: "systems",
        name: "Systems Architecture",
        price: "$15,000–$30,000",
        priceDetail: "Scoped per project",
        deliverables: [
          "Full operations architecture design",
          "Multi-system automation implementation",
          "AI-powered reporting and dashboards",
          "Scalable SOPs and process documentation",
        ],
        timeline: "4–8 weeks",
        support: "Bi-weekly strategy calls + 60-day post-launch support",
        paddlePriceId: process.env.PADDLE_PRICE_ID_SYSTEMS || "pri_placeholder_systems",
      },
      {
        id: "enterprise",
        name: "Enterprise Retainer",
        price: "$30,000+",
        priceDetail: "Monthly retainer",
        deliverables: [
          "Ongoing AI systems strategy and implementation",
          "Dedicated capacity — priority access",
          "Quarterly operations reviews",
          "Full IP ownership of all built systems",
        ],
        timeline: "Ongoing — minimum 3 months",
        support: "Weekly calls + unlimited async support",
        paddlePriceId: process.env.PADDLE_PRICE_ID_ENTERPRISE || "pri_placeholder_enterprise",
      },
    ];

    export function getTierById(id: TierId): Tier {
      return tiers.find((t) => t.id === id) || tiers[0];
    }
    ```

    Note: Paddle price IDs use `process.env` (server-side safe for tier config). The public token uses `NEXT_PUBLIC_` prefix for client-side use.

    **Create `src/components/checkout/OrderSummary.tsx`:**
    ```tsx
    import { getTierById, type TierId } from "@/lib/checkout";

    export function OrderSummary({ tierId }: { tierId: TierId }) {
      const tier = getTierById(tierId);
      return (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">You're getting</p>
            <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{tier.price}</p>
            <p className="text-sm text-gray-500">{tier.priceDetail}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">What's included:</p>
            <ul className="space-y-1">
              {tier.deliverables.map((d, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-green-500 shrink-0">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t pt-4 space-y-1">
            <p className="text-sm text-gray-600"><span className="font-medium">Timeline:</span> {tier.timeline}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Support:</span> {tier.support}</p>
          </div>
        </div>
      );
    }
    ```

    **Create `src/components/checkout/TierSelector.tsx`:**
    ```tsx
    "use client";

    import { tiers, type TierId } from "@/lib/checkout";

    interface Props {
      selected: TierId;
      onChange: (id: TierId) => void;
    }

    export function TierSelector({ selected, onChange }: Props) {
      return (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Select your tier</p>
          <div className="grid gap-3">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => onChange(tier.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  selected === tier.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 hover:border-gray-400 text-gray-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{tier.name}</span>
                  <span className={`text-sm ${selected === tier.id ? "text-gray-300" : "text-gray-500"}`}>
                    {tier.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }
    ```

    **Create `src/components/checkout/TrustBadges.tsx`:**
    ```tsx
    const badges = [
      { label: "Oracle Certified", icon: "🏆" },
      { label: "Secure Payment via Paddle", icon: "🔒" },
      { label: "100% IP Ownership", icon: "✅" },
    ];

    export function TrustBadges() {
      return (
        <div className="flex flex-wrap gap-3 justify-center">
          {badges.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600"
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      );
    }
    ```
  </action>
  <verify>
    Run `npx tsc --noEmit` — no TypeScript errors.
    Confirm `src/lib/checkout.ts` exports `tiers` array with 4 entries and `getTierById` function.
    Confirm Paddle env var placeholders in `.env.local`.
  </verify>
  <done>
    Tier config, OrderSummary, TierSelector, and TrustBadges created without TypeScript errors. All 4 tiers defined with correct price ranges, deliverables, timeline, and support details.
  </done>
</task>

<task type="auto">
  <name>Task 2: Build PaddleCheckout component and wire /checkout page</name>
  <files>
    src/components/checkout/PaddleCheckout.tsx
    src/app/checkout/page.tsx
    src/app/checkout/success/page.tsx
  </files>
  <action>
    **Create `src/components/checkout/PaddleCheckout.tsx`:**
    Per the CONTEXT.md locked decision: Paddle inline checkout with `displayMode: "inline"`. Use NEXT_PUBLIC_PADDLE_TOKEN client-side only. Keep PADDLE_PRICE_ID_* server-side (they're only accessed in checkout.ts, not in this component — the price ID is passed as a prop).

    ```tsx
    "use client";

    import { useEffect, useState, useRef } from "react";

    declare global {
      interface Window {
        Paddle?: {
          Initialize: (config: Record<string, unknown>) => void;
          Checkout: {
            open: (config: Record<string, unknown>) => void;
          };
        };
      }
    }

    interface Props {
      priceId: string;
      onSuccess?: () => void;
    }

    export function PaddleCheckout({ priceId, onSuccess }: Props) {
      const [isLoaded, setIsLoaded] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const initialized = useRef(false);

      useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const script = document.createElement("script");
        script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
        script.async = true;

        script.onload = () => {
          if (!window.Paddle) {
            setError("Payment system failed to load. Please refresh the page.");
            return;
          }

          try {
            window.Paddle.Initialize({
              token: process.env.NEXT_PUBLIC_PADDLE_TOKEN!,
              environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
              eventCallback: (event: { name: string }) => {
                if (event.name === "checkout.loaded") {
                  setIsLoaded(true);
                }
                if (event.name === "checkout.completed") {
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    window.location.href = "/checkout/success";
                  }
                }
              },
            });

            window.Paddle.Checkout.open({
              items: [{ priceId, quantity: 1 }],
              settings: {
                displayMode: "inline",
                frameTarget: "paddle-checkout-container",
                frameInitialHeight: "500px",
                frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
              },
            });
          } catch (err) {
            setError("Failed to initialize payment system. Please refresh and try again.");
            console.error("Paddle init error:", err);
          }
        };

        script.onerror = () => {
          setError("Could not load payment system. Please check your connection and try again.");
        };

        document.head.appendChild(script);

        return () => {
          // Cleanup: remove script if component unmounts
          try { document.head.removeChild(script); } catch {}
        };
      }, [priceId, onSuccess]);

      if (error) {
        return (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        );
      }

      return (
        <div className="relative">
          {!isLoaded && (
            <div className="h-96 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
              <p className="text-gray-400 text-sm">Loading payment form...</p>
            </div>
          )}
          <div id="paddle-checkout-container" className={isLoaded ? "block" : "hidden"} />
          <p className="text-xs text-gray-400 mt-3 text-center">
            This is a test transaction. No charges will be applied.
          </p>
        </div>
      );
    }
    ```

    **Create `src/app/checkout/page.tsx`:**
    ```tsx
    "use client";

    import { useState } from "react";
    import { TierSelector } from "@/components/checkout/TierSelector";
    import { OrderSummary } from "@/components/checkout/OrderSummary";
    import { PaddleCheckout } from "@/components/checkout/PaddleCheckout";
    import { TrustBadges } from "@/components/checkout/TrustBadges";
    import { getTierById, type TierId } from "@/lib/checkout";

    export default function CheckoutPage() {
      const [selectedTier, setSelectedTier] = useState<TierId>("starter");
      const tier = getTierById(selectedTier);

      return (
        <main className="min-h-screen bg-gray-50 py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
              <p className="text-gray-600 mt-2">Choose the engagement that fits your goals.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left: tier selection + order summary + trust badges */}
              <div className="space-y-6">
                <TierSelector selected={selectedTier} onChange={setSelectedTier} />
                <OrderSummary tierId={selectedTier} />
                <TrustBadges />
              </div>

              {/* Right: Paddle inline checkout */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">Payment</p>
                <PaddleCheckout priceId={tier.paddlePriceId} />
              </div>
            </div>
          </div>
        </main>
      );
    }
    ```

    Note: CheckoutPage is a client component (`"use client"`) because TierSelector and PaddleCheckout require client-side state and browser APIs. This is intentional.

    **Create `src/app/checkout/success/page.tsx`:**
    ```tsx
    import Link from "next/link";

    export const metadata = {
      title: "Payment Successful | Asor Ahura",
    };

    export default function CheckoutSuccessPage() {
      return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-md space-y-6">
            <div className="text-5xl">✅</div>
            <h1 className="text-3xl font-bold text-gray-900">You're in.</h1>
            <p className="text-gray-600 text-lg">
              Payment received. Asor will be in touch within 1 business day to confirm next steps and schedule your kickoff.
            </p>
            <p className="text-gray-500 text-sm">
              Check your inbox for a receipt from Paddle. If you have any questions, email{" "}
              <a href="mailto:hello@asorahura.com" className="underline text-gray-700">hello@asorahura.com</a>.
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </main>
      );
    }
    ```
  </action>
  <verify>
    Run `npx tsc --noEmit` — no TypeScript errors.
    Run `npm run dev`, visit http://localhost:3000/checkout:
    - Page renders with tier selector on left, Paddle container on right
    - All 4 tiers are selectable
    - Selecting a different tier updates the OrderSummary (name, price, deliverables change)
    - Trust badges row visible
    - Paddle container area shows loading skeleton (checkout frame may not fully load without a real token — that's acceptable)
    - "This is a test transaction" disclaimer visible below payment area
    - Visit http://localhost:3000/checkout/success — success page renders with "You're in." heading
  </verify>
  <done>
    /checkout page renders with 4-tier selector, per-tier order summary, trust badges, and Paddle inline checkout container. /checkout/success page renders. TypeScript compiles without errors. Test mode disclaimer visible.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Verify: Checkout page visual and functional review</name>
  <files>src/app/checkout/page.tsx</files>
  <action>No automated action — this is a human visual verification step after all auto tasks complete.</action>
  <verify>Human confirms checkout page renders with 4 tiers, Paddle frame, trust badges, and test disclaimer per the how-to-verify checklist below</verify>
  <done>User types "checkout approved" — all 4 tiers selectable, order summary updates, trust badges visible, Paddle container present</done>
  <what-built>Complete /checkout page with tier selector, order summary, Paddle inline checkout, trust badges, test disclaimer, and /checkout/success page.</what-built>
  <how-to-verify>
    1. Visit http://localhost:3000/checkout
    2. Confirm: 4 tier options visible (AI Audit, Ops Automation, Systems Architecture, Enterprise)
    3. Confirm: Selecting each tier updates the order summary (name, price, deliverables, timeline, support)
    4. Confirm: Trust badges row shows "Oracle Certified", "Secure Payment via Paddle", "100% IP Ownership"
    5. Confirm: Paddle checkout area is visible with a loading state or loaded iframe
    6. Confirm: "This is a test transaction. No charges will be applied." text visible below payment area
    7. Visit http://localhost:3000/checkout/success — confirm success page renders
    8. (Optional) If Paddle token is configured: confirm Paddle checkout loads an actual payment form
    9. Resize to mobile width (~375px) — confirm layout stacks to single column
  </how-to-verify>
  <resume-signal>Type "checkout approved" or describe any issues to fix</resume-signal>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes with zero errors
- `npm run build` completes without errors
- All 5 requirement IDs (CHECK-01 through CHECK-05) have corresponding implementation
- Paddle price IDs come from env vars (not hardcoded) — verified by checking src/lib/checkout.ts
- NEXT_PUBLIC_PADDLE_TOKEN used client-side only; PADDLE_PRICE_ID_* not exposed to client directly
- displayMode: "inline" used in Paddle.Checkout.open settings
- "This is a test transaction" disclaimer present in PaddleCheckout.tsx
- All 4 tiers have correct price ranges matching requirement ($5k, $5-15k, $15-30k, $30k+)
</verification>

<success_criteria>
- /checkout page renders with all 4 tiers selectable
- Switching tier updates OrderSummary content without page reload
- Trust badges visible (Oracle Certified, Secure Payment, 100% IP Ownership)
- Paddle checkout container present with test mode disclaimer
- /checkout/success page renders without errors
- Zero TypeScript errors
- Zero build errors
</success_criteria>

<output>
After completion, create `.planning/phases/01-critical-path/01-1c-SUMMARY.md` documenting:
- All files created
- Paddle setup status (sandbox account created? real price IDs configured?)
- Any placeholder data that needs replacing before Phase 5 live launch
- Verification results
</output>
