"use client";

import { trackAnalyticsEvent } from "@/lib/analytics";
import styles from "./TryItNowSection.module.css";

const REEL_URL = process.env.NEXT_PUBLIC_AUTOMATE_REEL_URL;

export default function TryItNowSection() {
  const handleClick = () => {
    trackAnalyticsEvent("Demo Interaction");
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Try it right now</h2>
        <p className={styles.body}>
          Comment the keyword on the live post below and receive the DM yourself.
        </p>

        {REEL_URL ? (
          <a
            href={REEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.reelLink}
            onClick={handleClick}
          >
            Watch the Reel
          </a>
        ) : (
          <div className={styles.reelPlaceholder} onClick={handleClick}>
            Reel embed pending — set NEXT_PUBLIC_AUTOMATE_REEL_URL
          </div>
        )}
      </div>
    </section>
  );
}
