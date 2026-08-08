"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildMapSchema, type BuildMapFormData } from "@/lib/schemas";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./BuildMapForm.module.css";

type Status = "idle" | "loading" | "success" | "error" | "already-subscribed";

export function BuildMapForm() {
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

  async function onSubmit(data: BuildMapFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, source: "build-map" }),
      });

      if (res.ok) {
        trackAnalyticsEvent("Build Map Submit");
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
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="build-map-email" className={styles.label}>
            Your email
          </label>
          <div className={styles.inputWrap}>
            <input
              id="build-map-email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`${styles.input} ${hasError ? styles.inputError : ""} ${isEmailValid ? styles.inputValid : ""}`}
              disabled={status === "loading" || status === "success"}
            />
            {isEmailValid && <span className={styles.checkmark}>✓</span>}
          </div>
          {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
        </div>

        {status === "already-subscribed" && (
          <p className={styles.info}>You&apos;re already signed up.</p>
        )}
        {status === "error" && (
          <p className={styles.formError}>Couldn&apos;t send email. Please try again.</p>
        )}
        {status === "success" && (
          <p className={styles.success}>✓ Check your inbox for your download link</p>
        )}

        <button
          type="submit"
          disabled={!isValid || status === "loading" || status === "success"}
          className={styles.submit}
        >
          {status === "loading" ? "Sending..." : "Download Build Map"}
        </button>
      </form>
    </div>
  );
}
