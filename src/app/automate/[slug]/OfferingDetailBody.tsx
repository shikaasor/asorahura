"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { OfferingMetadata } from "@/lib/checkout";
import styles from "./page.module.css";

export default function OfferingDetailBody({ offering }: { offering: OfferingMetadata }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <section className={styles.pricingSection}>
        <h2 className={styles.sectionHeading}>Pricing</h2>
        <div className={styles.pricingCard}>
          {offering.setupPrice && (
            <div className={styles.priceRow}>
              <span className={styles.price}>{offering.setupPrice}</span>
              <span className={styles.priceLabel}>{offering.setupLabel}</span>
            </div>
          )}
          {offering.monthlyPrice && (
            <div className={styles.priceRow}>
              <span className={styles.price}>{offering.monthlyPrice}</span>
              <span className={styles.priceLabel}>{offering.monthlyLabel}</span>
            </div>
          )}
          <p className={styles.pricingDescription}>
            Ready to automate? We&apos;ll schedule a time to build this for you.
          </p>
          {offering.scopeConstraint && (
            <p className={styles.scopeConstraint}>{offering.scopeConstraint}</p>
          )}
          <Link
            href={offering.ctaHref}
            className={styles.cta}
            onClick={() =>
              trackAnalyticsEvent("Waitlist CTA Click", { offering_id: offering.id })
            }
          >
            {offering.ctaLabel}
          </Link>
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionHeading}>FAQ</h2>
        <ul className={styles.faqList}>
          {offering.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <li key={faq.question} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={isOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
                  />
                </button>
                {isOpen && <p className={styles.faqAnswer}>{faq.answer}</p>}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
