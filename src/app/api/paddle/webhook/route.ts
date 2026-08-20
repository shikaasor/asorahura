import { NextRequest, NextResponse, after } from 'next/server';
import { Resend } from 'resend';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { verifyPaddleWebhookSignature } from '../../../../lib/paddle-webhook';
import { getPaddleEnvironment } from '../../../../lib/checkout';
import { formatMoney } from '../../../../lib/money';
import { productFromPriceId } from '../../../../lib/products';
import { sendPurchaseConfirmationEmail, sendOrderNotificationEmail } from '../../../../lib/email';

const resend = new Resend(process.env.RESEND_API_KEY);

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment:
    getPaddleEnvironment() === 'sandbox' ? Environment.sandbox : Environment.production,
});

// Paddle retries any delivery that times out or returns non-2xx, and replays
// the same event_id. Without a guard a retry re-sends the confirmation email
// and re-appends the Sheets row.
//
// This set only dedupes within one warm instance — a cold start or a second
// serverless instance will not see it. The durable guard is the transactionId
// check in googleScript.js; this is the cheap first line of defence.
const processedEvents = new Set<string>();
const MAX_TRACKED_EVENTS = 1000;

function claimEvent(eventId: string): boolean {
  if (!eventId) return true; // No id to dedupe on; process it.
  if (processedEvents.has(eventId)) return false;
  processedEvents.add(eventId);
  if (processedEvents.size > MAX_TRACKED_EVENTS) {
    // Sets iterate in insertion order, so this drops the oldest entry.
    processedEvents.delete(processedEvents.values().next().value!);
  }
  return true;
}

// Transaction payloads carry customer_id, not an email address, so the buyer
// email has to be fetched. Returns an empty string rather than throwing: a
// failed lookup must not cost us the Sheets row and the order notification.
async function resolveBuyerEmail(customerId?: string): Promise<string> {
  if (!customerId) return '';
  try {
    const customer = await paddle.customers.get(customerId);
    return customer.email ?? '';
  } catch (err) {
    console.error('[paddle-webhook] customer lookup failed', customerId, err);
    return '';
  }
}

// Apps Script answers 200 with a JSON error body for an unknown formType, so a
// rejected row is invisible unless the body is actually read.
async function recordInSheet(scriptUrl: string, payload: Record<string, string>) {
  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    const text = await res.text();
    if (!text.includes('"status":"ok"')) {
      console.error('[paddle-webhook] google sheets rejected the row:', text.slice(0, 300));
    }
  } catch (err) {
    console.error('[paddle-webhook] google sheets failed', err);
  }
}

async function handleTransactionCompleted(event: {
  event_id: string;
  data: Record<string, unknown> & { id: string };
}) {
  const data = event.data as {
    id: string;
    customer_id?: string;
    custom_data?: { product?: string };
    items?: { price?: { id?: string; custom_data?: { product?: string } } }[];
    currency_code?: string;
    details?: { totals?: { total?: string } };
  };

  // A transaction can carry more than one line: the Care Plan is sold as a
  // checkbox add-on bundled into the DFY and DWY checkouts, not as a standalone
  // purchase. custom_data names only the tier the buyer clicked, so reading it
  // alone reports a $509.99 DFY-with-Care-Plan as a plain $500 DFY and leaves a
  // live subscription invisible in both the notification and the Sheet.
  //
  // Each line is resolved on its own. custom_data is set by our own checkout
  // components and applies to the tier that opened the checkout, so it is only
  // consulted for the first line; every other line falls back to its price ID,
  // which is also all a Paddle-created transaction (dashboard, payment link,
  // simulator, subscription renewal) ever carries.
  const lines = data.items?.length ? data.items : [undefined];
  const products = lines.map(
    (item, i) =>
      item?.price?.custom_data?.product ??
      (i === 0 ? data.custom_data?.product : undefined) ??
      productFromPriceId(item?.price?.id) ??
      'unknown'
  );
  // The tier the buyer actually clicked; add-ons follow it. Analytics and
  // contact segmentation stay keyed on this so existing series keep their shape.
  const productType = products[0];
  const transactionId = data.id;
  // Paddle reports totals in minor units; the Sheet keeps the raw integer,
  // the emails get something a person can read.
  const amount = data.details?.totals?.total ?? '';
  const amountDisplay = amount ? formatMoney(amount, data.currency_code ?? 'USD') : '';
  const buyerEmail = await resolveBuyerEmail(data.customer_id);
  if (!buyerEmail) {
    console.warn('[paddle-webhook] no buyer email for', transactionId, '- skipping buyer-facing sends');
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
          resend.contacts.update({
            email: buyerEmail,
            properties: { segment: 'automate-buyer' },
          }),
        ]
      : []),
    sendOrderNotificationEmail({
      products,
      transactionId,
      amount: amountDisplay,
      buyerEmail,
    }),
    fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'asorahura-webhook' },
      body: JSON.stringify({
        name: 'Purchase',
        url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://asorahura.vercel.app'}/automate/instagram`,
        domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'asorahura.com',
        props: { product_type: productType, amount, currency: 'usd' },
      }),
    }).catch((err) => console.error('[paddle-webhook] plausible event failed', err)),
    ...(scriptUrl
      ? [
          recordInSheet(scriptUrl, {
            formType: 'purchase',
            email: buyerEmail,
            // The Sheet's Product column holds raw ids so an add-on stays
            // greppable: "dfy + care-plan".
            productType: products.join(' + '),
            transactionId,
            amount,
          }),
        ]
      : []),
  ]);

  console.log('[paddle-webhook] finished', transactionId);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature');
  const body = await req.text();

  if (!signature || !verifyPaddleWebhookSignature(body, signature, process.env.PADDLE_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event_type !== 'transaction.completed') {
    console.log('[paddle-webhook] ignoring event type', event.event_type);
    return NextResponse.json({ ok: true });
  }

  if (!claimEvent(event.event_id)) {
    console.log('[paddle-webhook] duplicate delivery, skipping', event.event_id);
    return NextResponse.json({ ok: true, duplicate: true });
  }

  console.log('[paddle-webhook] transaction.completed', event.data.id);

  // Acknowledge immediately; the downstream work runs after the response so a
  // slow Resend or Apps Script call can never push us past Paddle's timeout
  // and trigger a retry.
  after(() => handleTransactionCompleted(event));

  return NextResponse.json({ ok: true });
}
