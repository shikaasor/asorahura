"use client";

import { offerings } from "@/lib/checkout";
import OfferingCard from "./OfferingCard";
import FlameHover from "@/components/ui/FlameHover";
import Scatter from "@/components/motion/Scatter";
import styles from "./CatalogGrid.module.css";

export default function CatalogGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Scatter className={styles.grid}>
          {Object.values(offerings).map((offering) => (
            <FlameHover key={offering.id} className={styles.tile} radius={18}>
              <OfferingCard offering={offering} />
            </FlameHover>
          ))}
        </Scatter>
      </div>
    </section>
  );
}
