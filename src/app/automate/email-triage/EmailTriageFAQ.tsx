"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { OfferingFAQItem } from "@/lib/checkout";
import styles from "./page.module.css";

export default function EmailTriageFAQ({ faqs }: { faqs: OfferingFAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <h2 className={styles.sectionHeading}>FAQ</h2>
        <ul className={styles.faqList}>
          {faqs.map((faq, index) => {
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
      </div>
    </section>
  );
}
