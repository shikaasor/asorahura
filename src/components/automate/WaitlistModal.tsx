"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildMapSchema, type BuildMapFormData } from "@/lib/schemas";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./WaitlistModal.module.css";

type Status = "idle" | "loading" | "success" | "error" | "already-subscribed";

interface WaitlistModalProps {
  offeringId: string;
  offeringName: string;
  triggerLabel: string;
  triggerClassName: string;
}

export default function WaitlistModal({
  offeringId,
  offeringName,
  triggerLabel,
  triggerClassName,
}: WaitlistModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm<BuildMapFormData>({
    resolver: zodResolver(buildMapSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function openModal() {
    setStatus("idle");
    reset();
    setOpen(true);
    trackAnalyticsEvent("Waitlist CTA Click", { offering_id: offeringId });
  }

  async function onSubmit(data: BuildMapFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, source: "waitlist", offer: offeringId }),
      });

      if (res.ok) {
        trackAnalyticsEvent("Waitlist Submit", { offering_id: offeringId });
        setStatus("success");
        reset();
        return;
      }

      const body = await res.json().catch(() => ({}));
      const message: string = body.error ?? "";
      setStatus(/already/i.test(message) ? "already-subscribed" : "error");
    } catch {
      setStatus("error");
    }
  }

  const hasError = !!errors.email;
  const isEmailValid = isValid && !!touchedFields.email;

  return (
    <>
      <button type="button" className={triggerClassName} onClick={openModal}>
        {triggerLabel}
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-modal-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.close}
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>

            <h2 id="waitlist-modal-heading" className={styles.heading}>
              Join the waitlist
            </h2>
            <p className={styles.subheading}>{offeringName}</p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <div className={styles.field}>
                <label htmlFor="waitlist-email" className={styles.label}>
                  Your email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`${styles.input} ${hasError ? styles.inputError : ""} ${isEmailValid ? styles.inputValid : ""}`}
                  disabled={status === "loading" || status === "success"}
                />
                {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
              </div>

              {status === "already-subscribed" && (
                <p className={styles.info}>You&apos;re already on the list.</p>
              )}
              {status === "error" && (
                <p className={styles.formError}>Couldn&apos;t submit. Please try again.</p>
              )}
              {status === "success" && (
                <p className={styles.success}>✓ You&apos;re on the waitlist, we&apos;ll be in touch.</p>
              )}

              <button
                type="submit"
                disabled={!isValid || status === "loading" || status === "success"}
                className={styles.submit}
              >
                {status === "loading" ? "Submitting..." : "Join Waitlist"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
