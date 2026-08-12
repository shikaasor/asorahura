"use client";

import Link from "next/link";
import type { OfferingMetadata } from "@/lib/checkout";
import { trackAnalyticsEvent } from "@/lib/analytics";
import WaitlistModal from "./WaitlistModal";
import styles from "./OfferingCard.module.css";

interface OfferingCardProps {
  offering: OfferingMetadata;
}

export default function OfferingCard({ offering }: OfferingCardProps) {
  return (
    <div className={styles.card}>
      <Link
        href={`/automate/${offering.id}`}
        className={styles.cardLink}
        onClick={() => trackAnalyticsEvent("Offering Card Click", { offering_id: offering.id })}
      >
        <h3 className={styles.title}>{offering.name}</h3>
        {offering.tagline && <p className={styles.tagline}>{offering.tagline}</p>}
        <p className={styles.description}>{offering.description}</p>
      </Link>

      <div className={styles.pricing}>
        {offering.setupPrice !== null && (
          <>
            <p className={styles.price}>{offering.setupPrice}</p>
            <p className={styles.label}>{offering.setupLabel}</p>
          </>
        )}
        {offering.monthlyPrice !== null && (
          <>
            <p className={styles.price}>{offering.monthlyPrice}</p>
            <p className={styles.label}>{offering.monthlyLabel}</p>
          </>
        )}
      </div>

      {offering.included.length > 0 && (
        <ul className={styles.included}>
          {offering.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      <p className={styles.turnaround}>
        {offering.turnaround ? `Live in ${offering.turnaround}` : "Timeline confirmed on your call"}
      </p>

      {offering.diyNote && <p className={styles.diyNote}>{offering.diyNote}</p>}
      {offering.addonNote && <p className={styles.diyNote}>{offering.addonNote}</p>}

      {offering.hasLiveCheckout ? (
        <Link
          href={offering.ctaHref ?? "/automate"}
          className={styles.cta}
          onClick={() => trackAnalyticsEvent("Offering Card Click", { offering_id: offering.id })}
        >
          {offering.ctaLabel}
        </Link>
      ) : (
        <WaitlistModal
          offeringId={offering.id}
          offeringName={offering.name}
          triggerLabel={offering.ctaLabel}
          triggerClassName={styles.cta}
        />
      )}
    </div>
  );
}
