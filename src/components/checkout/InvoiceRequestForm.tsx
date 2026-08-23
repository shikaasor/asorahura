"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceRequestSchema, type InvoiceRequestData } from "@/lib/schemas";
import { getInvoiceItem, requiresBillingDetails, formatUsd } from "@/lib/invoicePricing";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./InvoiceRequestForm.module.css";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  /** Product id as it travels everywhere else: "dfy", "email-triage-tier1", … */
  productId: string;
}

/**
 * Checkout while there is no payment processor. The buyer gives us an email,
 * we email them an invoice with transfer details, and they pay by bank
 * transfer or ask for a PayPal/Payoneer request.
 *
 * The copy here must never say anything has been paid or reserved. Submitting
 * this form issues an invoice, nothing more.
 */
export function InvoiceRequestForm({ productId }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const item = getInvoiceItem(productId);
  // At or above the threshold the invoice needs a real Bill To block, so we ask
  // for a name. Below it, one field is the whole form.
  const needsBillingDetails = item ? requiresBillingDetails(item.amountUsd) : false;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<InvoiceRequestData>({
    resolver: zodResolver(invoiceRequestSchema),
    mode: "onChange",
    defaultValues: { productId },
  });

  async function onSubmit(data: InvoiceRequestData) {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, productId }),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        invoiceNumber?: string;
        error?: string;
      };

      if (!res.ok) {
        setErrorMessage(payload.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      trackAnalyticsEvent("Invoice Requested", { product_type: productId });
      setInvoiceNumber(payload.invoiceNumber ?? null);
      setStatus("success");
    } catch {
      setErrorMessage("Couldn't reach us just now. Please try again.");
      setStatus("error");
    }
  }

  // No price for this id — a waitlist-only offering reached this component by
  // mistake. Say something true rather than render a form that would 400.
  if (!item) {
    return (
      <div className={styles.wrap}>
        <p className={styles.notice}>
          This offering isn&apos;t open for direct purchase yet. Email us and we&apos;ll set it up
          with you.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.wrap}>
        <div className={styles.success}>
          <p className={styles.successHeadline}>Invoice sent — check your inbox.</p>
          <p className={styles.successBody}>
            {invoiceNumber ? (
              <>
                Your invoice is <span className={styles.invoiceNumber}>{invoiceNumber}</span>. It
                has our transfer details, with a PDF copy attached.
              </>
            ) : (
              <>It has our transfer details, with a PDF copy attached.</>
            )}{" "}
            Quote the invoice number as your payment reference. Prefer a Payoneer request instead?
            Reply to that email and we&apos;ll send one.
          </p>
          <p className={styles.successBody}>
            We&apos;ll confirm as soon as the payment lands, and work starts from there.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <span className={styles.summaryLabel}>{item.label}</span>
        <span className={styles.summaryAmount}>{formatUsd(item.amountUsd)}</span>
      </div>

      <p className={styles.notice}>
        Enter your email and we&apos;ll send the invoice straight away, with transfer details and a
        PDF copy. No card needed.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <input type="hidden" {...register("productId")} value={productId} readOnly />

        {needsBillingDetails && (
          <div className={styles.row}>
            <input
              type="text"
              placeholder="Full name"
              autoComplete="name"
              {...register("name")}
              className={styles.input}
              disabled={status === "loading"}
            />
            <input
              type="text"
              placeholder="Company (optional)"
              autoComplete="organization"
              {...register("company")}
              className={styles.input}
              disabled={status === "loading"}
            />
          </div>
        )}

        <div className={styles.row}>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className={styles.input}
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={!isValid || status === "loading"}
            className={styles.submit}
          >
            {status === "loading" ? "Sending…" : "Email me the invoice"}
          </button>
        </div>
      </form>

      {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
      {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
      {status === "error" && errorMessage && <p className={styles.fieldError}>{errorMessage}</p>}

      <p className={styles.rails}>Pay by bank transfer (ACH or wire) or Payoneer.</p>
    </div>
  );
}
