import styles from "./TrustSignals.module.css";

const badges = [
  "Oracle Certified",
  "7,200+ Hours Saved Through Automation",
  "43,103 Maritime Records Processed",
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
