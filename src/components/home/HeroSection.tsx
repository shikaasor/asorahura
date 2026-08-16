import Link from "next/link";
import LineSphere from "./LineSphere";
import ProcessPills from "./ProcessPills";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.section} id="home-hero">
      <div className={styles.card}>
        <LineSphere />
        {/* Two columns: the claim on the left, the proof running beside it.
            Stacking them put the evidence below the fold on most screens,
            which is the one place it earns nothing. */}
        <div className={styles.inner} data-theme="ink">
          <div className={styles.copy}>
            <span className={styles.eyebrow}>The automation ladder</span>
            <h1 className={styles.headline}>
              Automating businesses, <em className={styles.emphasis}>one process</em> at a time.
            </h1>
            <p className={styles.subheading}>
              Small automations compound. One proven process becomes a workflow; workflows become
              a system running whole departments, sometimes most of the business. It&apos;s the
              smartest way to automate: prove it small, then scale what&apos;s already trusted.
            </p>
            <div className={styles.actions}>
              <Link href="/checkout" className={styles.primaryBtn}>
                Book a Call — $200
              </Link>
              <Link href="#system" className={styles.ghostBtn}>
                How the system works
              </Link>
            </div>

            {/* The guarantee is the offer. Without it the price is just a
                number, and the price is the first objection. */}
            <p className={styles.guarantee}>
              I&rsquo;ll find you an automation worth <strong>10+ hours a week</strong> — or you
              get your money back.
            </p>

            <div className={styles.metric}>
              <span className={styles.metricValue}>7,200+</span>
              <span className={styles.metricLabel}>
                hours of operational work removed for clients, across archives, support, and lead
                capture.
              </span>
            </div>
          </div>

          {/* The running automation, framed like a window. The chrome bar is
              what turns an abstract animation into "a thing you'd use". */}
          <div className={styles.stage}>
            <div className={styles.mockup}>
              <div className={styles.mockupBar} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className={styles.mockupBody}>
                <ProcessPills />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
