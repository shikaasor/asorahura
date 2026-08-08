import { Suspense } from "react";
import type { Metadata } from "next";
import Breadcrumb from "@/components/automate/Breadcrumb";
import HeroSection from "@/components/automate/HeroSection";
import TryItNowSection from "@/components/automate/TryItNowSection";
import ComparisonStrip from "@/components/automate/ComparisonStrip";
import PricingSection from "@/components/automate/PricingSection";
import PhoneMockup from "@/components/automate/PhoneMockup";
import FAQSection from "@/components/automate/FAQSection";
import { LandEventTracker } from "../LandEventTracker";
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

      <Breadcrumb offeringName="Instagram Comment-to-DM" />

      <HeroSection />
      <TryItNowSection />
      <ComparisonStrip />
      <PricingSection />
      <PhoneMockup />
      <FAQSection />

      <section className={styles.closing}>
        <div className={styles.closingContainer}>
          <h2 className={styles.closingHeading}>What&apos;s next</h2>
          <p className={styles.closingBody}>
            This is the first rung. Once your automation is live and generating leads, the next
            step is [Product #2 — coming soon].
          </p>
        </div>
      </section>
    </>
  );
}
