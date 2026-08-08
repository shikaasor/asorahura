"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { automateSuccessSchema, type AutomateSuccessFormData } from "@/lib/schemas";
import { CALENDLY_URL } from "@/lib/email";
import { getAutomateTierById } from "@/lib/checkout";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./success.module.css";

type Product = "dfy" | "dwy";
type Status = "idle" | "loading" | "success" | "error";

const SUBCOPY: Record<Product, string> = {
  dfy: "We'll get your Instagram automation provisioned and live within 3–5 days.",
  dwy: "We'll build it screen-to-screen with you, so you can maintain it going forward.",
};

function SuccessInner() {
  const productParam = useSearchParams().get("product");
  const product: Product = productParam === "dwy" ? "dwy" : "dfy";

  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AutomateSuccessFormData>({
    resolver: zodResolver(automateSuccessSchema),
    mode: "onChange",
  });

  async function onSubmit(data: AutomateSuccessFormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/automate/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, ...data }),
      });

      if (res.ok) {
        trackAnalyticsEvent("Success Page Submit");
        setStatus("success");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const carePlan = getAutomateTierById("care-plan");

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.headline}>Payment confirmed.</h1>
          <p className={styles.subcopy}>{SUBCOPY[product]}</p>
        </div>

        <div className={styles.card}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="igHandle" className={styles.label}>
                Your Instagram handle
              </label>
              <input
                id="igHandle"
                type="text"
                placeholder="@yourhandle"
                {...register("igHandle")}
                className={styles.input}
                disabled={status === "loading" || status === "success"}
              />
              {errors.igHandle && (
                <span className={styles.fieldError}>{errors.igHandle.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="keyword" className={styles.label}>
                The keyword/phrase people comment
              </label>
              <input
                id="keyword"
                type="text"
                placeholder="e.g., 'AUTOMATE'"
                {...register("keyword")}
                className={styles.input}
                disabled={status === "loading" || status === "success"}
              />
              {errors.keyword && (
                <span className={styles.fieldError}>{errors.keyword.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="leadMagnetLink" className={styles.label}>
                Your lead magnet landing page (bit.ly or short link)
              </label>
              <input
                id="leadMagnetLink"
                type="text"
                placeholder="https://bit.ly/your-lead-magnet"
                {...register("leadMagnetLink")}
                className={styles.input}
                disabled={status === "loading" || status === "success"}
              />
              {errors.leadMagnetLink && (
                <span className={styles.fieldError}>{errors.leadMagnetLink.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="voiceTone" className={styles.label}>
                Brief notes on your voice/tone (so we match your style)
              </label>
              <textarea
                id="voiceTone"
                placeholder="e.g., 'Casual and funny, use emojis, Gen Z audience'"
                {...register("voiceTone")}
                className={styles.textarea}
                disabled={status === "loading" || status === "success"}
              />
              {errors.voiceTone && (
                <span className={styles.fieldError}>{errors.voiceTone.message}</span>
              )}
            </div>

            {product === "dwy" && (
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.scheduleBtn}
              >
                Schedule Build Session
              </a>
            )}

            {status === "success" ? (
              <p className={styles.success}>
                ✓ We&apos;ll be in touch soon. Check your email for next steps.
              </p>
            ) : (
              <>
                {status === "error" && (
                  <p className={styles.formError}>Couldn&apos;t submit. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={!isValid || status === "loading"}
                  className={styles.submit}
                >
                  {status === "loading" ? "Sending..." : "Submit"}
                </button>
              </>
            )}
          </form>
        </div>

        <div className={styles.nextRung}>
          <p>
            Your Care Plan keeps this running — token renewals, uptime, small copy changes,{" "}
            {carePlan.price}.
          </p>
          <a href="/automate#pricing" className={styles.nextRungLink}>
            See the Care Plan
          </a>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
