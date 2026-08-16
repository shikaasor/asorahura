import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/automate/HeroSection";
import ComparisonStrip from "@/components/automate/ComparisonStrip";
import PricingSection from "@/components/automate/PricingSection";
import PhoneMockup from "@/components/automate/PhoneMockup";
import FAQSection from "@/components/automate/FAQSection";
import { LandEventTracker } from "../LandEventTracker";
import MaskText from "@/components/motion/MaskText";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Instagram Lead Automation for Creators | Asor Ahura",
};

export default function AutomateInstagramPage() {
  return (
    <>
      <Suspense fallback={null}>
        <LandEventTracker />
      </Suspense>

      <HeroSection />
      <ComparisonStrip />
      <PricingSection />
      <PhoneMockup />
      <FAQSection />

      <section className={styles.closing}>
        <div className={styles.closingContainer}>
          <MaskText as="h2" text="This is the first rung" className={styles.closingHeading} />
          <p className={styles.closingBody}>
            Get your Instagram automation live, start converting comments into leads, and you own
            the whole system, no per-contact fees, ever. We&apos;re building the next rung on the
            ladder. Get in now and you&apos;ll be first to hear about it.
          </p>
        </div>
      </section>
    </>
  );
}
