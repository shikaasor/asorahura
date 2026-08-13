import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogGrid from "@/components/automate/CatalogGrid";
import { LandEventTracker } from "./LandEventTracker";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Automations Catalog | Asor Ahura",
  description:
    "Five ready-made automations for small businesses and creators. Start with one, scale to all five.",
};

const faqs = [
  {
    question: "How do I pick the right automation to start with?",
    answer:
      "Start with whichever offering matches the operational pain costing you the most time or money right now. Instagram Comment-to-DM has the lowest cost of entry if you want to test the model first.",
  },
  {
    question: "Can I get more than one automation?",
    answer:
      "Yes. Each offering is sold and delivered independently, buy or join the waitlist for as many as fit your business.",
  },
  {
    question: "What if the automation I need isn't listed here?",
    answer:
      "These five are what's built and proven today. Reach out via the waitlist form on any offering and describe what you need.",
  },
];

export default function AutomatePage() {
  return (
    <>
      <Suspense fallback={null}>
        <LandEventTracker />
      </Suspense>

      <section className={styles.hero}>
        <h1 className={styles.headline}>Automate the Bottlenecks That Cost You Margin</h1>
        <p className={styles.subheading}>
          Five ready-made automations for small businesses and creators
        </p>
        <p className={styles.intro}>
          We don&apos;t automate everything. We target the blockers slowing down your speed and
          quality of work. Choose the automation that fits your biggest bottleneck. Start with
          one, scale to all five.
        </p>
      </section>

      <CatalogGrid />

      <section className={styles.faq}>
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>

      <section className={styles.closing}>
        <div className={styles.closingContainer}>
          <h2 className={styles.closingHeading}>Ready to start?</h2>
          <p className={styles.closingBody}>
            Pick the offering that fits your next opportunity. Start with one automation, then
            scale to others as your confidence grows.
          </p>
        </div>
      </section>
    </>
  );
}
