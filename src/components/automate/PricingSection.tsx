"use client";

import { useState } from "react";
import { getAutomateTierById, type AutomateTierId } from "@/lib/checkout";
import { CheckoutPanel } from "@/components/checkout/CheckoutPanel";
import { BuildMapForm } from "./BuildMapForm";
import { trackAnalyticsEvent } from "@/lib/analytics";
import Scatter from "@/components/motion/Scatter";
import styles from "./PricingSection.module.css";

type PurchasableId = Extract<AutomateTierId, "dfy" | "dwy">;

export default function PricingSection() {
  const [showBuildMapForm, setShowBuildMapForm] = useState(false);
  const [checkoutOpenFor, setCheckoutOpenFor] = useState<PurchasableId | null>(null);

  const dfy = getAutomateTierById("dfy");
  const dwy = getAutomateTierById("dwy");

  function openCheckout(tierId: PurchasableId) {
    trackAnalyticsEvent("Checkout Opened", { product_type: tierId });
    setCheckoutOpenFor(tierId);
  }

  // The $9.99/mo Care Plan add-on was sold here as a second Paddle line item.
  // Nothing bills recurring now that Paddle is off, so the toggle is gone
  // rather than left offering a subscription we cannot charge for.

  // Only used in Paddle mode. The invoice flow keeps the buyer on this page
  // and sends them to onboarding once payment clears instead.
  function goToOnboarding(tierId: PurchasableId) {
    window.location.href = `/automate/instagram/success?product=${tierId}`;
  }

  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.headlineFact}>
          $500 one-time + $6/mo, unlimited contacts, forever. ManyChat charges by contact volume
          and climbs from $14/mo at 250 contacts past $139/mo at 25,000 &mdash; the math favors
          you the moment you're past 2,500 new contacts a month.
        </p>

        <Scatter className={styles.grid}>
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
            </ul>
            <button type="button" className={styles.cta} onClick={() => openCheckout("dfy")}>
              Buy now
            </button>
            {checkoutOpenFor === "dfy" && (
              <div className={styles.inlineForm}>
                <CheckoutPanel
                  productId="dfy"
                  priceId={dfy.paddlePriceId}
                  onSuccess={() => goToOnboarding("dfy")}
                />
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
              Buy now
            </button>
            {checkoutOpenFor === "dwy" && (
              <div className={styles.inlineForm}>
                <CheckoutPanel
                  productId="dwy"
                  priceId={dwy.paddlePriceId}
                  onSuccess={() => goToOnboarding("dwy")}
                />
              </div>
            )}
          </div>
        </Scatter>
      </div>
    </section>
  );
}
