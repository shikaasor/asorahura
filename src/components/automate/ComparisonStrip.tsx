import styles from "./ComparisonStrip.module.css";

const MANYCHAT_TIERS = [
  { contacts: "50 contacts", price: "$17/mo" },
  { contacts: "250 contacts", price: "$39/mo" },
  { contacts: "1,000 contacts", price: "$99/mo" },
  { contacts: "5,000+ contacts", price: "$199/mo" },
];

export default function ComparisonStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Every other tool bills you more the better your ads work. We don&apos;t.
        </h2>

        <div className={styles.scrollRow}>
          {MANYCHAT_TIERS.map((tier, i) => (
            <div className={styles.tierGroup} key={tier.contacts}>
              <div className={styles.card}>
                <p className={styles.contacts}>{tier.contacts}</p>
                <p className={styles.price}>{tier.price}</p>
              </div>
              {i < MANYCHAT_TIERS.length - 1 && <span className={styles.arrow}>→</span>}
            </div>
          ))}
        </div>

        <div className={styles.flatLine}>$6/mo forever</div>
      </div>
    </section>
  );
}
