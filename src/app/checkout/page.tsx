"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PaddleCheckout } from "@/components/checkout/PaddleCheckout";
import { tiers, getTierById, type TierId } from "@/lib/checkout";
import styles from "./checkout.module.css";

const TRUST_ITEMS = [
  "Oracle Certified AI Professional",
  "Secure payment via Paddle",
  "100% IP ownership — yours on delivery",
  "Fixed scope, no surprise invoices",
];

function CheckoutInner() {
  const tierParam = useSearchParams().get("tier") as TierId | null;
  const initialTier: TierId =
    tierParam && (["discovery", "strategy"] as TierId[]).includes(tierParam) ? tierParam : "discovery";

  const [selectedTier, setSelectedTier] = useState<TierId>(initialTier);
  const tier = getTierById(selectedTier);
  const isEnterprise = false;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Engagement</p>
          <h1 className={styles.heroTitle}>Book Your Discovery Call</h1>
          <p className={styles.heroSub}>
            Select the engagement that fits your current phase. Payment secures your slot — your discovery call is scheduled immediately after.
          </p>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <span className={styles.stepNum}>1</span>
              Select tier
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <span className={styles.stepNum}>2</span>
              Pay to secure slot
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              Book your call
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepNum}>4</span>
              We build
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        {/* Left — tier selection */}
        <div className={styles.left}>
          <div>
            <p className={styles.sectionLabel}>Choose your engagement</p>
            <div className={styles.tiers}>
              {tiers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`${styles.tierCard} ${selectedTier === t.id ? styles.selected : ""}`}
                >
                  <div className={styles.tierCardTop}>
                    <span className={styles.tierName}>{t.name}</span>
                    <span className={styles.tierPrice}>{t.price}</span>
                  </div>
                  <span className={styles.tierDesc}>{t.tagline}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — summary + payment */}
        <div className={styles.right}>
          <div className={styles.panel}>
            {/* Order summary */}
            <div className={styles.summary}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryTier}>{tier.name}</span>
                <span className={styles.summaryPrice}>{tier.price}</span>
                <span className={styles.summaryPriceDetail}>{tier.priceDetail}</span>
              </div>

              <div className={styles.deliverables}>
                {tier.deliverables.map((d, i) => (
                  <div key={i} className={styles.deliverable}>
                    <span className={styles.deliverableCheck}>✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <div className={styles.meta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Timeline:</span>
                  <span>{tier.timeline}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Support:</span>
                  <span>{tier.support}</span>
                </div>
              </div>
            </div>

            {/* Payment or enterprise CTA */}
            {isEnterprise ? (
              <div className={styles.enterpriseCta}>
                <p className={styles.enterpriseCtaText}>
                  Enterprise engagements are scoped individually. Let&apos;s start with a conversation — no commitment required.
                </p>
                <Link href="https://calendly.com/asorahura" target="_blank" rel="noopener noreferrer" className={styles.enterpriseBtn}>
                  Schedule an Intro Call
                </Link>
              </div>
            ) : (
              <div className={styles.paymentPanel}>
                <p className={styles.paymentLabel}>Secure payment</p>
                <PaddleCheckout key={tier.paddlePriceId} priceId={tier.paddlePriceId} />
              </div>
            )}
          </div>

          {/* Trust */}
          <div className={styles.trust}>
            {TRUST_ITEMS.map((item) => (
              <div key={item} className={styles.trustItem}>
                <span className={styles.trustIcon}>
                  <span className={styles.trustDot} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
