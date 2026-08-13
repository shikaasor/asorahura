"use client";

import { useState } from "react";
import { emailTriageTiers, getEmailTriageTierById, type EmailTriageTierId } from "@/lib/checkout";
import { PaddleCheckout } from "@/components/checkout/PaddleCheckout";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./EmailTriagePricingSection.module.css";

export default function EmailTriagePricingSection() {
  const [selectedTierId, setSelectedTierId] = useState<EmailTriageTierId>("tier1");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const tier = getEmailTriageTierById(selectedTierId);

  function selectTier(id: EmailTriageTierId) {
    setSelectedTierId(id);
    setCheckoutOpen(false);
  }

  function handleBuyNow() {
    trackAnalyticsEvent("Checkout Opened", { product_type: `email-triage-${tier.id}` });
    setCheckoutOpen(true);
  }

  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Choose your tier</h2>

        <div role="radiogroup" aria-label="Choose your tier" className={styles.tiers}>
          {emailTriageTiers.map((t) => {
            const isSelected = t.id === selectedTierId;
            return (
              <label
                key={t.id}
                className={`${styles.tierCard} ${isSelected ? styles.selected : ""}`}
              >
                <input
                  type="radio"
                  name="email-triage-tier"
                  value={t.id}
                  checked={isSelected}
                  onChange={() => selectTier(t.id)}
                  className={styles.radio}
                />
                <div className={styles.tierBody}>
                  <div className={styles.tierTop}>
                    <span className={styles.tierName}>{t.name}</span>
                    <span className={styles.tierPrice}>{t.price}</span>
                  </div>
                  <p className={styles.tierDesc}>{t.description}</p>
                  <ul className={styles.featureList}>
                    {t.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </label>
            );
          })}
        </div>

        <div className={styles.summaryPanel}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryTier}>{tier.name}</span>
            <span className={styles.summaryPrice}>{tier.price}</span>
            <span className={styles.summaryPriceDetail}>{tier.priceDetail}</span>
          </div>

          <button type="button" className={styles.cta} onClick={handleBuyNow}>
            Buy Now
          </button>

          {checkoutOpen && (
            <div className={styles.inlineForm}>
              <PaddleCheckout
                key={tier.paddlePriceId}
                priceId={tier.paddlePriceId}
                customData={{ product: `email-triage-${tier.id}` }}
                onSuccess={() => {
                  window.location.href = `/automate/email-triage/success?tier=${tier.id}`;
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
