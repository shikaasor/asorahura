"use client";

import styles from "./HeroSection.module.css";

const REEL_URL = process.env.NEXT_PUBLIC_AUTOMATE_REEL_URL;

export default function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.headline}>Instagram Lead Automation for Creators</h1>
        <p className={styles.subheading}>
          Stop paying by the contact. Own your list. The bill stays flat at $6/mo.
        </p>

        <div className={styles.reelWrapper}>
          {REEL_URL ? (
            <iframe
              className={styles.reel}
              src={REEL_URL}
              title="Instagram Lead Automation demo Reel"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className={styles.reelPlaceholder}>
              Reel embed pending — set NEXT_PUBLIC_AUTOMATE_REEL_URL
            </div>
          )}
        </div>

        <a href="#pricing" className={styles.primaryBtn}>
          Get Yours Now
        </a>
      </div>
    </section>
  );
}
