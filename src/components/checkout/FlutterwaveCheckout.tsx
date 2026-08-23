"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getInvoiceItem, formatUsd } from "@/lib/invoicePricing";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./FlutterwaveCheckout.module.css";

const SCRIPT_SRC = "https://checkout.flutterwave.com/v3.js";
const CURRENCY = "USD";

interface FlutterwavePayment {
  status?: string;
  tx_ref?: string;
  transaction_id?: number;
}

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: Record<string, unknown>) => { close: () => void };
  }
}

type Status = "idle" | "paying" | "verifying" | "paid" | "error";

interface Props {
  productId: string;
  /** Runs after the payment is confirmed server-side, not when the modal closes. */
  onSuccess?: () => void;
}

/**
 * Flutterwave inline card checkout.
 *
 * The modal's callback is treated as a hint, never as proof: it fires in the
 * customer's browser and carries no authentication. On success we hand the
 * transaction id to /api/flutterwave/verify, which re-queries Flutterwave with
 * the secret key and matches the amount against our own price table. Only that
 * response is allowed to say "paid".
 */
export function FlutterwaveCheckout({ productId, onSuccess }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const item = getInvoiceItem(productId);
  const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;

  useEffect(() => {
    if (window.FlutterwaveCheckout) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => setScriptReady(true), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => setErrorMessage("Couldn't load the payment form. Check your connection.");
    document.head.appendChild(script);
  }, []);

  const confirmServerSide = useCallback(async (transactionId: number) => {
    setStatus("verifying");
    try {
      const res = await fetch("/api/flutterwave/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        // The charge may well have gone through — we just could not confirm
        // it. Never imply the money is lost, and never imply it succeeded.
        setErrorMessage(
          payload.error ?? "We couldn't confirm that payment. Email us and we'll check."
        );
        setStatus("error");
        return;
      }

      trackAnalyticsEvent("Purchase", { product_type: productId });
      setStatus("paid");
      onSuccessRef.current?.();
    } catch {
      setErrorMessage("We couldn't confirm that payment. Email us and we'll check.");
      setStatus("error");
    }
  }, [productId]);

  function pay() {
    if (!item || !publicKey || !window.FlutterwaveCheckout) return;

    setErrorMessage(null);
    setStatus("paying");
    trackAnalyticsEvent("Checkout Opened", { product_type: productId });

    const modal = window.FlutterwaveCheckout({
      public_key: publicKey,
      // Unique per attempt. A retry after a declined card must not collide
      // with the reference of the attempt that failed.
      tx_ref: `asa-${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount: item.amountUsd,
      currency: CURRENCY,
      payment_options: "card",
      customer: { email },
      // Read back off the verified transaction to decide what was bought —
      // the server never trusts a product id sent straight from the browser.
      meta: { product: productId },
      customizations: {
        title: "Asor Ahura",
        description: item.label,
      },
      callback: (payment: FlutterwavePayment) => {
        modal.close();
        if (payment.status === "successful" && payment.transaction_id) {
          void confirmServerSide(payment.transaction_id);
        } else {
          setErrorMessage("That payment didn't go through. Nothing was charged.");
          setStatus("error");
        }
      },
      onclose: () => {
        // Only reset if the callback has not already moved us on — closing the
        // modal after a success must not wipe the confirmation.
        setStatus((current) => (current === "paying" ? "idle" : current));
      },
    });
  }

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

  if (!publicKey) {
    return (
      <div className={styles.wrap}>
        <p className={styles.notice}>
          Card payment isn&apos;t configured yet. Use the invoice option below and we&apos;ll send
          transfer details.
        </p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className={styles.wrap}>
        <p className={styles.successHeadline}>Payment received — thank you.</p>
        <p className={styles.successBody}>
          Your receipt is on its way to {email}. We&apos;ll be in touch shortly with next steps.
        </p>
      </div>
    );
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const busy = status === "paying" || status === "verifying";

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <span className={styles.summaryLabel}>{item.label}</span>
        <span className={styles.summaryAmount}>{formatUsd(item.amountUsd)}</span>
      </div>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Email for your receipt</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          disabled={busy}
        />
      </label>

      <button
        type="button"
        onClick={pay}
        disabled={!emailLooksValid || !scriptReady || busy}
        className={styles.payButton}
      >
        {status === "verifying"
          ? "Confirming payment…"
          : status === "paying"
            ? "Opening…"
            : `Pay ${formatUsd(item.amountUsd)} by card`}
      </button>

      {status === "verifying" && (
        <p className={styles.notice}>
          Don&apos;t close this tab — we&apos;re confirming the payment with your bank.
        </p>
      )}

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <p className={styles.rails}>Visa, Mastercard, and Amex. Charged in USD.</p>
    </div>
  );
}
