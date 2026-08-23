import { NextRequest, NextResponse, after } from "next/server";
import {
  isValidWebhookSignature,
  verifyTransaction,
  checkPaymentAgainstCatalog,
} from "@/lib/flutterwave";
import { formatUsd } from "@/lib/invoicePricing";
import { fulfilOrder, claimTransaction } from "@/lib/fulfilment";

export const runtime = "nodejs";

/**
 * Flutterwave's server-to-server notification. This is the path that survives
 * the buyer closing the tab mid-redirect, so it — not the browser callback —
 * is the one that must not be missed.
 *
 * The signed payload is only used to learn *which* transaction to look at. The
 * amount and status are then re-fetched from Flutterwave directly, per their
 * own guidance to re-query before granting value.
 */

interface WebhookEvent {
  event?: string;
  type?: string;
  data?: { id?: number; status?: string };
}

export async function POST(req: NextRequest) {
  // Must be read as raw text: the HMAC is computed over the exact bytes sent,
  // so re-serialising parsed JSON would produce a different digest.
  const rawBody = await req.text();

  if (
    !isValidWebhookSignature({
      rawBody,
      signatureHeader: req.headers.get("flutterwave-signature"),
      verifHashHeader: req.headers.get("verif-hash"),
    })
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Flutterwave has used both `event` (v3) and `type` (v4) for this field.
  const eventName = event.event ?? event.type ?? "";
  if (!eventName.startsWith("charge.completed") && !eventName.startsWith("charge.")) {
    console.log("[flutterwave-webhook] ignoring event", eventName);
    return NextResponse.json({ ok: true });
  }

  const transactionId = event.data?.id;
  if (!transactionId) {
    console.error("[flutterwave-webhook] event carried no transaction id");
    return NextResponse.json({ ok: true });
  }

  // Acknowledge immediately. The verify call and the emails run after the
  // response so a slow Resend or Apps Script can never push us past
  // Flutterwave's timeout and trigger a redelivery.
  after(async () => {
    const payment = await verifyTransaction(transactionId);
    if (!payment) {
      console.error("[flutterwave-webhook] could not verify", transactionId);
      return;
    }

    const check = checkPaymentAgainstCatalog(payment);
    if (!check.ok) {
      console.error(
        `[flutterwave-webhook] rejected ${payment.txRef}: ${check.reason}`,
        `(${payment.amount} ${payment.currency}, status ${payment.status})`
      );
      return;
    }

    const item = check.item!;

    // The browser's /verify call may already have handled this one.
    if (!claimTransaction(String(payment.transactionId))) {
      console.log("[flutterwave-webhook] already fulfilled", payment.transactionId);
      return;
    }

    await fulfilOrder({
      products: [item.productId],
      transactionId: String(payment.transactionId),
      amount: String(item.amountUsd),
      amountDisplay: formatUsd(item.amountUsd),
      buyerEmail: payment.customerEmail,
      sourceUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://asorahura.vercel.app"}/checkout`,
    });
  });

  return NextResponse.json({ ok: true });
}
