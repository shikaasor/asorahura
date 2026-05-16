import Link from "next/link";
import Image from "next/image";
import TrustSignals from "@/components/shared/TrustSignals";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import styles from "./HeroSection.module.css";

import testimonials from "@/content/testimonials.json";

const HERO_TESTIMONIAL = testimonials.hero;

export default function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left column: pain-first copy */}
          <div className={styles.copy}>
            <p className={styles.eyebrow}>AI Systems Consultant</p>
            <h1 className={styles.headline}>
              You&rsquo;re spending more time managing your business than growing it.
            </h1>
            <p className={styles.subheading}>
              AI-powered systems that eliminate the repetitive work keeping you stuck in operations.
            </p>
            <div className={styles.actions}>
              <Link href="/assessment" className={styles.primaryBtn}>
                Take the Free AI Readiness Assessment
              </Link>
              <Link href="/engage" className={styles.secondaryBtn}>
                Work With Me
              </Link>
            </div>
            <TrustSignals />
            <TestimonialCard {...HERO_TESTIMONIAL} />
          </div>

          {/* Right column: Asor photo */}
          <div className={styles.imageWrapper}>
            <Image
              src="/images/asor.png"
              alt="Asor Ahura"
              width={480}
              height={480}
              className={styles.photo}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
