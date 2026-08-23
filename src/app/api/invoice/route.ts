import { NextRequest, NextResponse } from "next/server";
import { invoiceRequestSchema } from "@/lib/schemas";
import {
  buildInvoice,
  getInvoiceItem,
  requiresBillingDetails,
  formatUsd,
} from "@/lib/invoice";
import { sendInvoiceEmail, sendInvoiceNotification } from "@/lib/email";

// pdfkit and Resend both need Node APIs; the edge runtime would break the
// attachment path.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = invoiceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const { productId, email, name, company } = parsed.data;

  // The price comes from our own table, never from the request — otherwise the
  // buyer picks the amount on their own invoice.
  const item = getInvoiceItem(productId);
  if (!item) {
    return NextResponse.json(
      { error: "That product isn't available for purchase right now." },
      { status: 400 }
    );
  }

  if (requiresBillingDetails(item.amountUsd) && !name?.trim()) {
    return NextResponse.json(
      { error: "A billing name is required for this amount." },
      { status: 400 }
    );
  }

  const invoice = buildInvoice({
    item,
    email: email.trim().toLowerCase(),
    name: name?.trim() || undefined,
    company: company?.trim() || undefined,
  });

  // The buyer is waiting on this specific email, so its failure is the
  // request's failure. Everything after it is bookkeeping.
  const sent = await sendInvoiceEmail(invoice);
  if (!sent.success) {
    console.error("[invoice] buyer email failed:", sent.error);
    return NextResponse.json(
      { error: "We couldn't send the invoice. Please try again or email us directly." },
      { status: 502 }
    );
  }

  sendInvoiceNotification(invoice).catch((err) => {
    console.error("[invoice] owner notification threw:", err);
  });

  // Google Sheets is the primary record of who owes what — it is the only
  // place an unpaid invoice is tracked, since nothing else stores one.
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "invoice",
        invoiceNumber: invoice.number,
        email: invoice.billTo.email,
        name: invoice.billTo.name ?? "",
        company: invoice.billTo.company ?? "",
        productType: item.productId,
        productLabel: item.label,
        amount: formatUsd(invoice.totalUsd),
        dueAt: invoice.dueAt.toISOString(),
      }),
      redirect: "follow",
    }).catch((err) => {
      console.error("[invoice] Failed to submit to Google Script:", err);
    });
  }

  return NextResponse.json({ ok: true, invoiceNumber: invoice.number });
}
