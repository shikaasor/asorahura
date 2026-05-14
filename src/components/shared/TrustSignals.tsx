import styles from "./TrustSignals.module.css";

const badges = [
  "Oracle Certified",
  "7,200+ Hours Delivered",
  "3 Continents",
];

export default function TrustSignals() {
  return (
    <div className={styles.wrapper}>
      {badges.map((badge) => (
        <span key={badge} className={styles.badge}>
          {badge}
        </span>
      ))}
    </div>
  );
}
