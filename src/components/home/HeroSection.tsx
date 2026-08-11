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
            <p className={styles.eyebrow}>Automations that work like your best hire — reliable, consistent, and yours to keep.</p>
            <h1 className={styles.headline}>
              Small automations that make measurable money.
            </h1>
            <p className={styles.subheading}>
              Start with Instagram leads, scale to five offerings. Own the system. Own the profit.
            </p>
            <div className={styles.actions}>
              <Link href="/automate" className={styles.primaryBtn}>
                See Automations
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
