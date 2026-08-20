// Product identifiers as they travel in Paddle custom_data.
//
// Deliberately typed as plain strings rather than a union: custom_data is
// client-supplied, and a transaction created in the Paddle dashboard or from a
// payment link carries none at all. Anything that renders a product must cope
// with a value it does not recognise instead of producing `undefined`.

// Each label names the offering first, then the tier. "Done For You" on its own
// describes the delivery model, not the purchase — and it reads identically for
// every offering that ever gains a DFY tier. These strings go to the buyer as
// well as the owner, so they have to stand alone in an inbox with no context.
const PRODUCT_LABELS: Record<string, string> = {
  consultation: "Consultation Call — AI Opportunity Discovery",
  dfy: "Instagram Comment-to-DM — Done For You",
  dwy: "Instagram Comment-to-DM — Done With You",
  "care-plan": "Instagram Comment-to-DM — Care Plan (monthly)",
  "email-triage-tier1": "Email Triage on Telegram — Inbox Assistant",
  "email-triage-tier2": "Email Triage on Telegram — Inbox Assistant Pro",
};

/** Human-readable product name. Falls back to the raw id so a new product
 *  added to the catalog before this map shows up as e.g. "invoice-agent"
 *  rather than a blank space in an order email. */
export function productLabel(productType: string): string {
  return PRODUCT_LABELS[productType] || productType || "unknown";
}

/** Every line on one transaction as a single name. A checkout can bundle the
 *  Care Plan add-on with a tier, and both have to show up wherever one product
 *  name used to. Falls back to "unknown" for a transaction with no line items. */
export function productSummary(products: string[]): string {
  if (!products.length) return productLabel("");
  return products.map(productLabel).join(" + ");
}

const NEXT_STEPS: Record<string, string> = {
  consultation: "Check your inbox for a scheduling link to book your call.",
  dfy: "We'll build this in 3–5 days.",
  dwy: "Check your inbox for a scheduling link to start your build session.",
  "care-plan":
    "Your subscription is active: token renewals, uptime, and copy updates are now handled.",
  "email-triage-tier1": "We'll be in touch to connect your inbox and set up Telegram.",
  "email-triage-tier2": "We'll be in touch to connect your inbox and set up Telegram.",
};

export function productNextSteps(productType: string): string {
  return NEXT_STEPS[productType] || "We'll be in touch shortly with your next steps.";
}

/** Products that need a build/scheduling step after payment, so the order
 *  notification can tell you an onboarding form is still outstanding. A
 *  Care-Plan-only transaction (a renewal) needs nothing; a tier bought with the
 *  Care Plan still does. */
export function productNeedsOnboarding(productType: string): boolean {
  return productType !== "care-plan";
}

// Fallback for transactions that carry no custom_data: the price ID on the
// line item identifies the product on its own. Built as pairs rather than an
// object literal because an unset env var would otherwise key the map under
// the string "undefined" and match every other unset one.
const PRICE_ID_TO_PRODUCT: Array<[string | undefined, string]> = [
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CONSULTATION, "consultation"],
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY, "dfy"],
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DWY, "dwy"],
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN, "care-plan"],
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_EMAIL_TRIAGE_TIER1, "email-triage-tier1"],
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_EMAIL_TRIAGE_TIER2, "email-triage-tier2"],
];

export function productFromPriceId(priceId?: string): string | undefined {
  if (!priceId) return undefined;
  return PRICE_ID_TO_PRODUCT.find(([id]) => id && id === priceId)?.[1];
}
