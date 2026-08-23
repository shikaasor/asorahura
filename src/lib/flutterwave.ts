import { createHmac, timingSafeEqual } from "node:crypto";
import { getInvoiceItem, type InvoiceLineItem } from "@/lib/invoicePricing";

/**
 * Flutterwave, server side. Paddle declined the account and Stripe does not
 * onboard Nigerian entities, so Flutterwave is the card rail — it settles to
 * the USD/GBP/EUR balances on the merchant account.
 *
 * The one rule in this file: the browser is never believed. Flutterwave's
 * inline callback fires in the customer's page and can be forged or replayed,
 * so nothing is treated as paid until this module has re-queried Flutterwave
 * with the secret key and matched the amount against our own price table.
 *
 * Server only — reads FLW_SECRET_KEY. The publishable key is read directly
 * from NEXT_PUBLIC_FLW_PUBLIC_KEY in the client component.
 */

const VERIFY_ENDPOINT = "https://api.flutterwave.com/v3/transactions";

/** Everything is priced in USD: the buyers are US/UK/EU and the catalog is
 *  written in dollars. Flutterwave settles this to the USD balance. */
export const CHECKOUT_CURRENCY = "USD";

export function isFlutterwaveConfigured(): boolean {
  return Boolean(process.env.FLW_SECRET_KEY && process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY);
}

/** True while the test keys are in place. Flutterwave prefixes both keys with
 *  FLWSECK_TEST / FLWPUBK_TEST in sandbox, so the mode is readable off the key
 *  rather than needing its own env var to fall out of sync. */
export function isFlutterwaveTestMode(): boolean {
  return (process.env.FLW_SECRET_KEY ?? "").includes("_TEST");
}

export interface VerifiedPayment {
  transactionId: number;
  txRef: string;
  status: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  productId?: string;
}

/** Shape of the bits of Flutterwave's verify response we rely on. Everything
 *  is optional because this is a third party's JSON, not our own. */
interface VerifyResponse {
  status?: string;
  message?: string;
  data?: {
    id?: number;
    tx_ref?: string;
    status?: string;
    amount?: number;
    charged_amount?: number;
    currency?: string;
    customer?: { email?: string; name?: string };
    meta?: Record<string, string>;
  };
}

/**
 * Re-queries Flutterwave for the real state of a transaction.
 *
 * Returns null when the call fails or the payload is unusable, rather than
 * throwing — every caller's correct response to "we could not confirm this" is
 * the same as "this is not paid", and an exception thrown inside a webhook
 * just becomes a retry.
 */
export async function verifyTransaction(transactionId: number): Promise<VerifiedPayment | null> {
  const secret = process.env.FLW_SECRET_KEY;
  if (!secret) {
    console.error("[flutterwave] FLW_SECRET_KEY is not set; cannot verify");
    return null;
  }

  let body: VerifyResponse;
  try {
    const res = await fetch(`${VERIFY_ENDPOINT}/${transactionId}/verify`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[flutterwave] verify returned HTTP ${res.status}`);
      return null;
    }
    body = (await res.json()) as VerifyResponse;
  } catch (err) {
    console.error("[flutterwave] verify request threw:", err);
    return null;
  }

  const data = body.data;
  if (body.status !== "success" || !data?.tx_ref || !data.id) {
    console.error("[flutterwave] verify payload unusable:", body.message ?? "no message");
    return null;
  }

  return {
    transactionId: data.id,
    txRef: data.tx_ref,
    status: String(data.status ?? "unknown"),
    // `amount` is the figure in `currency` — the currency we asked to charge
    // in — and is the pair Flutterwave's own docs say to verify against.
    //
    // Deliberately NOT charged_amount. That is what the customer's card was
    // actually debited, which for an international card is denominated in the
    // card's currency, not ours: a $500 charge on a GBP card reports roughly
    // 395. Comparing it against a USD catalog price is comparing two different
    // currencies, and would reject perfectly good payments as underpaid.
    amount: Number(data.amount ?? 0),
    currency: String(data.currency ?? ""),
    customerEmail: String(data.customer?.email ?? ""),
    customerName: data.customer?.name,
    productId: data.meta?.product,
  };
}

export type PaymentRejection =
  | "not-successful"
  | "unknown-product"
  | "wrong-currency"
  | "underpaid";

export interface PaymentCheck {
  ok: boolean;
  reason?: PaymentRejection;
  item?: InvoiceLineItem;
}

/**
 * Decides whether a verified transaction actually entitles the buyer to the
 * product. The price comes from our own table — never from the transaction —
 * so a browser that opened the checkout with a tampered amount fails here.
 */
export function checkPaymentAgainstCatalog(payment: VerifiedPayment): PaymentCheck {
  if (payment.status.toLowerCase() !== "successful") {
    return { ok: false, reason: "not-successful" };
  }

  const item = payment.productId ? getInvoiceItem(payment.productId) : null;
  if (!item) return { ok: false, reason: "unknown-product" };

  if (payment.currency.toUpperCase() !== CHECKOUT_CURRENCY) {
    return { ok: false, reason: "wrong-currency", item };
  }

  // Greater-than is fine (an overpayment is still entitlement); short is not.
  // A cent of tolerance absorbs float noise in the JSON, nothing more.
  if (payment.amount + 0.01 < item.amountUsd) {
    return { ok: false, reason: "underpaid", item };
  }

  return { ok: true, item };
}

/**
 * Verifies a webhook came from Flutterwave.
 *
 * Two header conventions are in the wild: the current docs sign the raw body
 * as base64 HMAC-SHA256 under `flutterwave-signature`, while older v3
 * integrations send the dashboard's secret hash verbatim as `verif-hash`.
 * Both are accepted so a dashboard configured either way keeps working;
 * a request carrying neither is rejected.
 */
export function isValidWebhookSignature(params: {
  rawBody: string;
  signatureHeader?: string | null;
  verifHashHeader?: string | null;
}): boolean {
  const secretHash = process.env.FLW_SECRET_HASH;
  if (!secretHash) {
    console.error("[flutterwave] FLW_SECRET_HASH is not set; rejecting webhook");
    return false;
  }

  if (params.signatureHeader) {
    const expected = createHmac("sha256", secretHash)
      .update(params.rawBody)
      .digest("base64");
    return safeEqual(expected, params.signatureHeader);
  }

  if (params.verifHashHeader) {
    return safeEqual(secretHash, params.verifHashHeader);
  }

  return false;
}

/** Constant-time compare that tolerates length mismatches without throwing,
 *  which Node's timingSafeEqual does on unequal buffers. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
