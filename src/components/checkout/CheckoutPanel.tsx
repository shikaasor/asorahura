"use client";

import { useState } from "react";
import { getPaymentsMode } from "@/lib/checkout";
import { getInvoiceItem, prefersInvoiceFirst } from "@/lib/invoicePricing";
import { PaddleCheckout } from "./PaddleCheckout";
import { InvoiceRequestForm } from "./InvoiceRequestForm";
import { FlutterwaveCheckout } from "./FlutterwaveCheckout";
import styles from "./CheckoutPanel.module.css";

interface Props {
  /** Product id as it travels everywhere else: "dfy", "email-triage-tier1", … */
  productId: string;
  /** Only read in Paddle mode; ignored by the other two. */
  priceId: string;
  onSuccess?: () => void;
  extraItems?: { priceId: string; quantity: number }[];
}

/**
 * The one seam between the ways this site can take money.
 *
 * Which method leads depends on the price. Under $5k the card comes first,
 * because that is where a transfer would cost the sale. At or above it the
 * invoice leads: nobody puts five figures through a card, and the card fee on
 * a sum that size is worth a few days of settlement. Either way the other
 * method stays one click away — the threshold picks a default, not a rule.
 *
 * Paddle's path is left intact behind NEXT_PUBLIC_PAYMENTS_MODE rather than
 * deleted, so reinstating that account would be an env var, not a rewrite.
 */
export function CheckoutPanel({ productId, priceId, onSuccess, extraItems }: Props) {
  const mode = getPaymentsMode();
  const item = getInvoiceItem(productId);
  const invoiceLeads = item ? prefersInvoiceFirst(item.amountUsd) : false;

  const [showInvoice, setShowInvoice] = useState(invoiceLeads);

  if (mode === "paddle") {
    return (
      <PaddleCheckout
        priceId={priceId}
        customData={{ product: productId }}
        onSuccess={onSuccess}
        extraItems={extraItems}
      />
    );
  }

  // No publishable key means Flutterwave is activated but not yet wired up.
  // Fall through to invoicing rather than show a dead card form.
  const cardAvailable = mode === "flutterwave" && Boolean(process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY);

  if (!cardAvailable) {
    return <InvoiceRequestForm productId={productId} />;
  }

  if (showInvoice) {
    return (
      <div className={styles.stack}>
        <InvoiceRequestForm productId={productId} />
        <button type="button" className={styles.switch} onClick={() => setShowInvoice(false)}>
          {invoiceLeads ? "Rather pay by card? →" : "← Pay by card instead"}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      <FlutterwaveCheckout productId={productId} onSuccess={onSuccess} />
      <button type="button" className={styles.switch} onClick={() => setShowInvoice(true)}>
        Prefer a bank transfer? Get an invoice instead
      </button>
    </div>
  );
}
