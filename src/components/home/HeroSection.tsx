import Link from "next/link";
import LiquidGoldBackground from "./LiquidGoldBackground";
import GlyphLadder from "./GlyphLadder";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.section}>
      <LiquidGoldBackground />
      <div className={styles.container}>
        <div className={styles.heroInner}>
          <div className={styles.copy}>
            <h1 className={styles.headline}>
              Automating businesses, <em className={styles.emphasis}>one process</em> at a time.
            </h1>
            <p className={styles.subheading}>
              Small automations compound. One proven process becomes a workflow; workflows become
              a system running whole departments — sometimes most of the business. It&apos;s the
              smartest way to automate: prove it small, then scale what&apos;s already trusted.
            </p>
            <div className={styles.actions}>
              <Link href="/automate" className={styles.primaryBtn}>
                See Automations
              </Link>
              <Link href="#system" className={styles.ghostBtn}>
                How the system works
              </Link>
            </div>
          </div>
          <div className={styles.stage}>
            <GlyphLadder />
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railActive}>01</span>
              <span className={styles.tick} />
              <span>02</span>
              <span className={styles.tick} />
              <span>03</span>
              <span className={styles.tick} />
              <span>04</span>
              <span className={styles.tick} />
              <span>05</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
