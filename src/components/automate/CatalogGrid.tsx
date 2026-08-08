"use client";

import { offerings } from "@/lib/checkout";
import OfferingCard from "./OfferingCard";
import styles from "./CatalogGrid.module.css";

export default function CatalogGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {Object.values(offerings).map((offering) => (
            <OfferingCard key={offering.id} offering={offering} />
          ))}
        </div>
      </div>
    </section>
  );
}
