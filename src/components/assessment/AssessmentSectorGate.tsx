"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AssessmentSectorGate.module.css";

interface Props {
  onContinue: () => void;
}

export function AssessmentSectorGate({ onContinue }: Props) {
  const router = useRouter();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Which path describes you best?</h1>
      <p className={styles.subheading}>Both paths are equally valid, pick the one that fits.</p>

      <div className={styles.choices}>
        <button type="button" className={styles.choice} onClick={() => onContinue()}>
          <span className={styles.choiceHeading}>Small Business</span>
          <span className={styles.choiceExamples}>Creators, Coaches, Local Services</span>
          <span className={styles.choiceDescription}>
            Fast self-serve assessment, low-ticket products, straight to automation
          </span>
          <span className={styles.choiceFooter}>Continue to Assessment →</span>
        </button>

        <button
          type="button"
          className={styles.choice}
          onClick={() => router.push("/enterprise")}
        >
          <span className={styles.choiceHeading}>Enterprise</span>
          <span className={styles.choiceExamples}>Law, Finance, Real Estate, Construction</span>
          <span className={styles.choiceDescription}>
            Compliance-aware scoping, custom solutions, discovery call included
          </span>
          <span className={styles.choiceFooter}>Explore Enterprise Path →</span>
        </button>
      </div>

      <p className={styles.learnMore}>
        Not sure? <Link href="/enterprise">See differences →</Link>
      </p>
    </div>
  );
}
