"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./FAQSection.module.css";

const faqs = [
  {
    question: "What if I already use ManyChat or Zapier?",
    answer:
      "This integrates alongside your existing tools. It's not a replacement, it's an owned system that doesn't grow in cost.",
  },
  {
    question: "Can I move to a different platform later?",
    answer: "Yes. The source code is yours, and all data stays in your database. You own the system.",
  },
  {
    question: "What if I'm not a creator or coach?",
    answer:
      "This works for any business using Instagram ads. Creators and coaches see the fastest ROI because lead volume is predictable.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes. 30-day money-back guarantee on DFY and DWY. Care Plan is billed monthly and can be cancelled anytime.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>FAQ</h2>
        <ul className={styles.list}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <li key={faq.question} className={styles.item}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={isOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
                  />
                </button>
                {isOpen && <p className={styles.answer}>{faq.answer}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
