import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyPaddleWebhookSignature } from '../../../../lib/paddle-webhook';
import { sendPurchaseConfirmationEmail, sendOrderNotificationEmail } from '../../../../lib/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature');
  const body = await req.text();

  if (!signature || !verifyPaddleWebhookSignature(body, signature, process.env.PADDLE_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.type === 'transaction.completed') {
    console.log('[paddle-webhook] transaction.completed', event.data.id);

    const productType =
      event.data.items?.[0]?.price?.custom_data?.product ??
      event.data.custom_data?.product ??
      'unknown';
    const transactionId = event.data.id;
    const amount = event.data.details?.totals?.total ?? '';
    const buyerEmail = event.data.customer_email ?? '';

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    await Promise.allSettled([
      sendPurchaseConfirmationEmail({ email: buyerEmail, productType, transactionId, amount }),
      sendOrderNotificationEmail({ productType, transactionId, amount, buyerEmail }),
      resend.contacts.update({
        email: buyerEmail,
        properties: { segment: 'automate-buyer' },
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
            fetch(scriptUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                formType: 'purchase',
                email: buyerEmail,
                productType,
                transactionId,
                amount,
              }),
              redirect: 'follow',
            }).catch((err) => console.error('[paddle-webhook] google sheets failed', err)),
          ]
        : []),
    ]);
  } else {
    console.log('[paddle-webhook] ignoring event type', event.type);
  }

  return NextResponse.json({ ok: true });
}
