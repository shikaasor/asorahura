"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getEmailTriageTierById, type EmailTriageTierId } from "@/lib/checkout";
import styles from "./success.module.css";

function SuccessInner() {
  const tierParam = useSearchParams().get("tier") as EmailTriageTierId | null;
  const tierId: EmailTriageTierId = tierParam === "tier2" ? "tier2" : "tier1";
  const tier = getEmailTriageTierById(tierId);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.headline}>Payment confirmed.</h1>
        <p className={styles.subcopy}>
          You&apos;re set up for {tier.name}. We&apos;ll email you within 1 business day to start
          Gmail verification and Telegram bot setup. Timeline depends on Gmail&apos;s API
          verification for your account.
        </p>

        <div className={styles.card}>
          <p className={styles.cardLabel}>What&apos;s included</p>
          <ul className={styles.featureList}>
            {tier.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className={styles.nextRung}>
          <p>Optional: $9.99/mo support retainer for ongoing help, no commitment required.</p>
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
