import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyTransaction,
  checkPaymentAgainstCatalog,
  CHECKOUT_CURRENCY,
} from "@/lib/flutterwave";
import { formatUsd } from "@/lib/invoicePricing";
import { fulfilOrder, claimTransaction } from "@/lib/fulfilment";

export const runtime = "nodejs";

/**
 * Called by the browser the moment Flutterwave's inline modal reports success.
 *
 * The request body is untrusted — it carries only a transaction id, and the
 * real state of that transaction is fetched from Flutterwave with the secret
 * key before anything is granted. A forged id simply fails to verify.
 *
 * Flutterwave's webhook covers the case where the buyer closes the tab before
 * this fires; whichever arrives first claims the transaction.
 */

const bodySchema = z.object({
  transactionId: z.union([z.number(), z.string()]),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "A transaction id is required." }, { status: 400 });
  }

  const transactionId = Number(parsed.data.transactionId);
  if (!Number.isFinite(transactionId)) {
    return NextResponse.json({ error: "Invalid transaction id." }, { status: 400 });
  }

  const payment = await verifyTransaction(transactionId);
  if (!payment) {
    // Could not reach Flutterwave, or it does not recognise this id. Either
    // way the buyer must not be told they are paid.
    return NextResponse.json(
      { error: "We couldn't confirm that payment yet. If you were charged, email us." },
      { status: 502 }
    );
  }

  const check = checkPaymentAgainstCatalog(payment);
  if (!check.ok) {
    console.error(
      `[flutterwave/verify] rejected ${payment.txRef}: ${check.reason}`,
      `(${payment.amount} ${payment.currency}, status ${payment.status})`
    );
    // A currency mismatch means the buyer's card was very likely charged —
    // just in the wrong currency, so we cannot confirm the value and must not
    // grant the product. Their money is now sitting unfulfilled, which is the
    // one failure here that needs a human, so say so plainly and shout in the
    // log rather than filing it with the generic rejections.
    if (check.reason === "wrong-currency") {
      console.error(
        `[flutterwave/verify] CURRENCY MISMATCH — buyer may be out of pocket. ` +
          `tx=${payment.txRef} charged ${payment.amount} ${payment.currency}, ` +
          `expected ${CHECKOUT_CURRENCY}. Refund or fulfil by hand.`
      );
      return NextResponse.json(
        {
          error:
            `That payment went through in ${payment.currency} rather than ${CHECKOUT_CURRENCY}, ` +
            `so we couldn't confirm it against your order. We've been alerted — email us and ` +
            `we'll either complete the order or refund you.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          check.reason === "not-successful"
            ? "That payment hasn't completed."
            : "We couldn't match that payment to an order. Please email us and we'll sort it out.",
      },
      { status: 400 }
    );
  }

  const item = check.item!;

  // The webhook may already have handled this one.
  if (claimTransaction(String(payment.transactionId))) {
    await fulfilOrder({
      products: [item.productId],
      transactionId: String(payment.transactionId),
      amount: String(item.amountUsd),
      amountDisplay: formatUsd(item.amountUsd),
      buyerEmail: payment.customerEmail,
      sourceUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://asorahura.vercel.app"}/checkout`,
    });
  }

  return NextResponse.json({
    ok: true,
    productId: item.productId,
    label: item.label,
    amount: formatUsd(item.amountUsd),
    currency: CHECKOUT_CURRENCY,
  });
}
