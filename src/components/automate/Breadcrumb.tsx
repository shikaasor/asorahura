"use client";

import Link from "next/link";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbProps {
  offeringName: string;
}

export default function Breadcrumb({ offeringName }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <Link href="/automate" className={styles.link}>
        Automations
      </Link>
      <span className={styles.separator}> &gt; </span>
      <span className={styles.current}>{offeringName}</span>
    </nav>
  );
}
