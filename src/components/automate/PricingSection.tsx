"use client";

import { useState } from "react";
import { getAutomateTierById, type AutomateTierId } from "@/lib/checkout";
import { PaddleCheckout } from "@/components/checkout/PaddleCheckout";
import { BuildMapForm } from "./BuildMapForm";
import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./PricingSection.module.css";

type PurchasableId = Extract<AutomateTierId, "dfy" | "dwy" | "care-plan">;

export default function PricingSection() {
  const [showBuildMapForm, setShowBuildMapForm] = useState(false);
  const [checkoutOpenFor, setCheckoutOpenFor] = useState<PurchasableId | null>(null);

  const dfy = getAutomateTierById("dfy");
  const dwy = getAutomateTierById("dwy");
  const carePlan = getAutomateTierById("care-plan");

  function openCheckout(tierId: PurchasableId) {
    trackAnalyticsEvent("Checkout Opened", { product_type: tierId });
    setCheckoutOpenFor(tierId);
  }

  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.headlineFact}>
          $15.99/mo all-in ($6 droplet + $9.99 care) — against ManyChat&apos;s cheapest 250-contact
          tier at $39/mo
        </p>

        <div className={styles.grid}>
          {/* Build Map */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Build Map</h3>
            <p className={styles.price}>Free</p>
            <p className={styles.description}>
              4 n8n workflows, environment template, deployment guide. Self-host at ~$6/mo.
            </p>
            <ul className={styles.featureList}>
              <li>Full source code + documentation</li>
              <li>Deploy to your own server</li>
              <li>No vendor lock-in</li>
            </ul>
            <button
              type="button"
              className={styles.cta}
              onClick={() => setShowBuildMapForm((v) => !v)}
            >
              Download Build Map
            </button>
            {showBuildMapForm && (
              <div className={styles.inlineForm}>
                <BuildMapForm />
              </div>
            )}
          </div>

          {/* DFY */}
          <div className={styles.card}>
            <span className={styles.badge}>FASTEST</span>
            <h3 className={styles.cardTitle}>Done For You</h3>
            <p className={styles.price}>{dfy.price}</p>
            <p className={styles.priceDetail}>{dfy.priceDetail}</p>
            <p className={styles.description}>{dfy.description}</p>
            <ul className={styles.featureList}>
              <li>We handle all technical setup</li>
              <li>Live and tested on your account</li>
              <li>Training call included</li>
              <li>Care Plan recommended ({carePlan.price})</li>
            </ul>
            <button type="button" className={styles.cta} onClick={() => openCheckout("dfy")}>
              Purchase DFY
            </button>
            {checkoutOpenFor === "dfy" && (
              <div className={styles.inlineForm}>
                <PaddleCheckout priceId={dfy.paddlePriceId} customData={{ product: "dfy" }} />
              </div>
            )}
          </div>

          {/* DWY */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Done With You</h3>
            <p className={styles.price}>{dwy.price}</p>
            <p className={styles.priceDetail}>{dwy.priceDetail}</p>
            <p className={styles.description}>{dwy.description}</p>
            <ul className={styles.featureList}>
              <li>Learn as we build</li>
              <li>You own all credentials</li>
              <li>Full walkthrough included</li>
              <li>Self-maintained after launch</li>
            </ul>
            <button type="button" className={styles.cta} onClick={() => openCheckout("dwy")}>
              Purchase DWY
            </button>
            {checkoutOpenFor === "dwy" && (
              <div className={styles.inlineForm}>
                <PaddleCheckout priceId={dwy.paddlePriceId} customData={{ product: "dwy" }} />
              </div>
            )}
          </div>

          {/* Care Plan */}
          <div className={styles.card}>
            <span className={styles.badgeSuccess}>ADD-ON</span>
            <h3 className={styles.cardTitle}>Care Plan (optional)</h3>
            <p className={styles.priceSmall}>{carePlan.price}</p>
            <p className={styles.description}>{carePlan.description}</p>
            <ul className={styles.featureList}>
              <li>Meta API token refreshes</li>
              <li>99.5% uptime SLA</li>
              <li>Monthly review &amp; optimization</li>
            </ul>
            <button
              type="button"
              className={styles.ctaOutlined}
              onClick={() => openCheckout("care-plan")}
            >
              Subscribe Now
            </button>
            {checkoutOpenFor === "care-plan" && (
              <div className={styles.inlineForm}>
                <PaddleCheckout
                  priceId={carePlan.paddlePriceId}
                  customData={{ product: "care-plan" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
