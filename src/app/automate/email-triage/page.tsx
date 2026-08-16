import { Suspense } from "react";
import type { Metadata } from "next";
import Breadcrumb from "@/components/automate/Breadcrumb";
import EmailTriagePricingSection from "@/components/automate/EmailTriagePricingSection";
import { getOfferingBySlug } from "@/lib/checkout";
import { LandEventTracker } from "../LandEventTracker";
import EmailTriageFAQ from "./EmailTriageFAQ";
import MaskText from "@/components/motion/MaskText";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Email Triage on Telegram | Asor Ahura",
  description:
    "A virtual email assistant that reads your inbox, alerts you instantly on Telegram for anything urgent, and sends a daily brief at a time you choose.",
};

const offering = getOfferingBySlug("email-triage")!;

export default function EmailTriagePage() {
  return (
    <>
      <Suspense fallback={null}>
        <LandEventTracker />
      </Suspense>

      <div className="container">
        <Breadcrumb offeringName={offering.name} />
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <MaskText as="h1" text={offering.heroHeadline} className={styles.heroHeadline} />
          <p className={styles.heroSubheading}>{offering.heroSubheading}</p>
          <a href="#pricing" className={styles.primaryBtn}>
            Get Yours Now
          </a>
        </div>
      </section>

      <EmailTriagePricingSection />

      <EmailTriageFAQ faqs={offering.faqs} />

      <section className={styles.closing}>
        <div className={styles.closingContainer}>
          <p className={styles.closingBody}>{offering.scopeConstraint}</p>
        </div>
      </section>
    </>
  );
}
