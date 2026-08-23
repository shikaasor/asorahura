import { Resend } from "resend";
import { sendPurchaseConfirmationEmail, sendOrderNotificationEmail } from "@/lib/email";

/**
 * What happens once money has actually arrived: confirm to the buyer, notify
 * the owner, segment the contact, count the conversion, and write the durable
 * row to Google Sheets.
 *
 * Extracted so the Flutterwave verify route and the Flutterwave webhook — two
 * paths that can both land the same payment — grant value identically.
 *
 * NOTE: api/paddle/webhook still carries its own copy of this sequence. It was
 * left alone deliberately: that route is disabled behind NEXT_PUBLIC_PAYMENTS_MODE
 * and cannot currently be exercised, so rewriting it would be an untestable
 * change to a dormant path. Fold it in here if Paddle is ever switched back on.
 */

// Constructed on demand rather than at module load: the Resend client throws
// when the key is absent, and an import-time throw takes down every route that
// touches this module — including the ones that would still work without email.
function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[fulfilment] RESEND_API_KEY is not set; skipping contact update");
    return null;
  }
  return new Resend(key);
}

// A payment can reach us twice: the browser calls /verify the moment the modal
// closes, and Flutterwave's webhook arrives independently. Whichever lands
// first claims the transaction so the buyer gets one confirmation email.
//
// This only dedupes within one warm serverless instance. The durable guard is
// the transactionId column in googleScript.js, which rejects a repeat row
// outright; this is the cheap first line of defence.
const fulfilled = new Set<string>();
const MAX_TRACKED = 1000;

export function claimTransaction(transactionId: string): boolean {
  if (!transactionId) return true;
  if (fulfilled.has(transactionId)) return false;
  fulfilled.add(transactionId);
  if (fulfilled.size > MAX_TRACKED) {
    // Sets iterate in insertion order, so this drops the oldest entry.
    fulfilled.delete(fulfilled.values().next().value!);
  }
  return true;
}

/** Test seam — the claim set is module state that would otherwise leak between
 *  cases and make the second test in a file see a "duplicate". */
export function resetClaimedTransactions(): void {
  fulfilled.clear();
}

// Apps Script answers 200 with a JSON error body for an unknown formType, so a
// rejected row is invisible unless the body is actually read.
async function recordInSheet(scriptUrl: string, payload: Record<string, string>) {
  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    const text = await res.text();
    if (!text.includes('"status":"ok"')) {
      console.error("[fulfilment] google sheets rejected the row:", text.slice(0, 300));
    }
  } catch (err) {
    console.error("[fulfilment] google sheets failed", err);
  }
}

export interface FulfilmentInput {
  /** Raw product ids, tier first. Single-element for a Flutterwave charge. */
  products: string[];
  /** The processor's transaction id — also the Sheets dedupe key. */
  transactionId: string;
  /** Machine amount for the Sheet and analytics, e.g. "500". */
  amount: string;
  /** Human amount for the emails, e.g. "$500.00". */
  amountDisplay: string;
  buyerEmail: string;
  /** Page credited with the conversion in Plausible. */
  sourceUrl: string;
}

/**
 * Runs every post-payment side effect. Nothing here is allowed to throw: each
 * task is settled independently so a Resend outage cannot cost us the Sheets
 * row, and a rejected Sheets row cannot cost the buyer their confirmation.
 */
export async function fulfilOrder(input: FulfilmentInput): Promise<void> {
  const { products, transactionId, amount, amountDisplay, buyerEmail, sourceUrl } = input;

  if (!buyerEmail) {
    console.warn("[fulfilment] no buyer email for", transactionId, "- owner notified only");
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  await Promise.allSettled([
    ...(buyerEmail
      ? [
          sendPurchaseConfirmationEmail({
            email: buyerEmail,
            products,
            transactionId,
            amount: amountDisplay,
          }),
          ...(() => {
            const client = resendClient();
            return client
              ? [
                  client.contacts.update({
                    email: buyerEmail,
                    properties: { segment: "automate-buyer" },
                  }),
                ]
              : [];
          })(),
        ]
      : []),
    sendOrderNotificationEmail({
      products,
      transactionId,
      amount: amountDisplay,
      buyerEmail,
    }),
    fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "asorahura-webhook" },
      body: JSON.stringify({
        name: "Purchase",
        url: sourceUrl,
        domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "asorahura.com",
        props: { product_type: products[0], amount, currency: "usd" },
      }),
    }).catch((err) => console.error("[fulfilment] plausible event failed", err)),
    ...(scriptUrl
      ? [
          recordInSheet(scriptUrl, {
            formType: "purchase",
            email: buyerEmail,
            productType: products.join(" + "),
            transactionId,
            amount,
          }),
        ]
      : []),
  ]);

  console.log("[fulfilment] finished", transactionId);
}
