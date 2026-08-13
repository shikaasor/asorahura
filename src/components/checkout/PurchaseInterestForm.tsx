"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildMapSchema, type BuildMapFormData } from "@/lib/schemas";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Toast } from "@/components/ui/Toast";
import styles from "./PurchaseInterestForm.module.css";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  offer?: string;
}

export function PurchaseInterestForm({ offer }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [showToast, setShowToast] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BuildMapFormData>({
    resolver: zodResolver(buildMapSchema),
    mode: "onChange",
  });

  async function onSubmit(data: BuildMapFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, source: "purchase-interest", offer }),
      });

      if (!res.ok) throw new Error("subscribe failed");

      trackAnalyticsEvent("Purchase Interest Submit", offer ? { product_type: offer } : undefined);
      setStatus("success");
      setShowToast(true);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.notice}>
        Online checkout for this tier isn&apos;t live yet. Leave your email and our team will
        reach out directly to get you started.
      </p>

      {status === "success" ? (
        <p className={styles.success}>✓ Got it. We&apos;ll be in touch by email shortly.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={styles.input}
            disabled={status === "loading"}
          />
          <button type="submit" disabled={!isValid || status === "loading"} className={styles.submit}>
            {status === "loading" ? "Sending..." : "Notify Me"}
          </button>
        </form>
      )}
      {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
      {status === "error" && (
        <p className={styles.fieldError}>Couldn&apos;t send that. Please try again.</p>
      )}

      {showToast && (
        <Toast
          message="Thanks! A member of our team will contact you by email shortly."
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
