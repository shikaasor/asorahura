"use client";

import { Suspense } from "react";
import { PaddleCheckout } from "@/components/checkout/PaddleCheckout";
import { getTierById } from "@/lib/checkout";
import MaskText from "@/components/motion/MaskText";
import styles from "./checkout.module.css";

const TRUST_ITEMS = [
  "Oracle Certified AI Professional",
  "Secure payment via Paddle",
  "100% IP ownership, yours on delivery",
  "Fixed scope, no surprise invoices",
];

function CheckoutInner() {
  const tier = getTierById("consultation");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Engagement</p>
          <MaskText as="h1" text="Book Your Consultation Call" className={styles.heroTitle} />
          <p className={styles.heroSub}>
            Payment secures your slot, your consultation call is scheduled immediately after.
          </p>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <span className={styles.stepNum}>1</span>
              Pay to secure slot
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              Book your call
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              We build
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
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

            {/* Payment */}
            <div className={styles.paymentPanel}>
              <p className={styles.paymentLabel}>Secure payment</p>
              <PaddleCheckout
                key={tier.paddlePriceId}
                priceId={tier.paddlePriceId}
                customData={{ product: tier.id }}
              />
            </div>
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
