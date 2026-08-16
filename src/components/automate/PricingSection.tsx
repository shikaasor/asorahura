"use client";

import { useState } from "react";
import { getAutomateTierById, type AutomateTierId } from "@/lib/checkout";
import { PaddleCheckout } from "@/components/checkout/PaddleCheckout";
import { BuildMapForm } from "./BuildMapForm";
import { trackAnalyticsEvent } from "@/lib/analytics";
import Scatter from "@/components/motion/Scatter";
import styles from "./PricingSection.module.css";

type PurchasableId = Extract<AutomateTierId, "dfy" | "dwy">;

export default function PricingSection() {
  const [showBuildMapForm, setShowBuildMapForm] = useState(false);
  const [checkoutOpenFor, setCheckoutOpenFor] = useState<PurchasableId | null>(null);
  const [addCarePlan, setAddCarePlan] = useState(false);

  const dfy = getAutomateTierById("dfy");
  const dwy = getAutomateTierById("dwy");
  const carePlan = getAutomateTierById("care-plan");

  function openCheckout(tierId: PurchasableId) {
    trackAnalyticsEvent("Checkout Opened", { product_type: tierId, care_plan: addCarePlan ? "yes" : "no" });
    setCheckoutOpenFor(tierId);
  }

  const carePlanExtraItems = addCarePlan
    ? [{ priceId: carePlan.paddlePriceId, quantity: 1 }]
    : undefined;

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
            <label className={styles.carePlanToggle}>
              <input
                type="checkbox"
                checked={addCarePlan}
                onChange={(e) => setAddCarePlan(e.target.checked)}
              />
              Add Care Plan ({carePlan.price}) — {carePlan.description}
            </label>
            <button type="button" className={styles.cta} onClick={() => openCheckout("dfy")}>
              Purchase DFY
            </button>
            {checkoutOpenFor === "dfy" && (
              <div className={styles.inlineForm}>
                <PaddleCheckout
                  key={`dfy-${addCarePlan}`}
                  priceId={dfy.paddlePriceId}
                  customData={{ product: "dfy" }}
                  extraItems={carePlanExtraItems}
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
            <label className={styles.carePlanToggle}>
              <input
                type="checkbox"
                checked={addCarePlan}
                onChange={(e) => setAddCarePlan(e.target.checked)}
              />
              Add Care Plan ({carePlan.price}) — {carePlan.description}
            </label>
            <button type="button" className={styles.cta} onClick={() => openCheckout("dwy")}>
              Purchase DWY
            </button>
            {checkoutOpenFor === "dwy" && (
              <div className={styles.inlineForm}>
                <PaddleCheckout
                  key={`dwy-${addCarePlan}`}
                  priceId={dwy.paddlePriceId}
                  customData={{ product: "dwy" }}
                  extraItems={carePlanExtraItems}
                />
              </div>
            )}
          </div>
        </Scatter>
      </div>
    </section>
  );
}
