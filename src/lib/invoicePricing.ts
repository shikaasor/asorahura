import { productLabel } from "@/lib/products";

/**
 * The client-safe half of the invoice module: what things cost, and how much
 * information we need from the buyer at that price.
 *
 * Split from lib/invoice.ts deliberately. That file reads bank-account and
 * Payoneer/PayPal env vars, and the checkout form is a client component — the
 * two must not end up in the same bundle.
 */

/** Amount per purchasable product, in whole US dollars.
 *
 *  These duplicate the display strings in lib/checkout.ts on purpose. Those
 *  strings used to be decorative because Paddle held the authoritative price;
 *  with Paddle off, an amount printed on an invoice is the amount owed, so it
 *  needs a numeric source a formatter can consume and a test can assert on.
 *  Labels are NOT duplicated — those come from productLabel(). */
const AMOUNTS_USD: Record<string, number> = {
  consultation: 200,
  dfy: 500,
  dwy: 800,
  "email-triage-tier1": 500,
  "email-triage-tier2": 900,
};

/** At or above this, the buyer is asked for a name and company so the invoice
 *  carries a real "Bill To" block — someone expensing four figures has to hand
 *  it to a finance team. Below it, email alone keeps the form to one field. */
export const BILLING_DETAILS_THRESHOLD_USD = 1000;

/** At or above this, the checkout leads with the invoice rather than the card
 *  form. Nobody puts five figures through a card, and card fees on a sum that
 *  size are worth the extra friction of a transfer. Below it, the card is the
 *  default and the invoice sits behind a link — the reverse. */
export const INVOICE_DEFAULT_THRESHOLD_USD = 5000;

/** True when the invoice should be the default view for this amount. */
export function prefersInvoiceFirst(amountUsd: number): boolean {
  return amountUsd >= INVOICE_DEFAULT_THRESHOLD_USD;
}

export interface InvoiceLineItem {
  productId: string;
  label: string;
  amountUsd: number;
}

/** Null for an id with no price — a waitlist-only offering, or a typo in a
 *  client-supplied product field. Callers must treat that as "cannot invoice"
 *  rather than invoicing for $0. */
export function getInvoiceItem(productId: string): InvoiceLineItem | null {
  const amountUsd = AMOUNTS_USD[productId];
  if (amountUsd === undefined) return null;
  return { productId, label: productLabel(productId), amountUsd };
}

export function isInvoiceableProduct(productId: string): boolean {
  return productId in AMOUNTS_USD;
}

export function requiresBillingDetails(amountUsd: number): boolean {
  return amountUsd >= BILLING_DETAILS_THRESHOLD_USD;
}

export function formatUsd(amountUsd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amountUsd);
}
