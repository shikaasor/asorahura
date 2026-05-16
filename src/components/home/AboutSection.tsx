import Image from "next/image";
import Link from "next/link";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/asor.png"
              alt="Asor Ahura"
              width={240}
              height={240}
              className={styles.photo}
            />
          </div>
          <div className={styles.copy}>
            <h2 className={styles.heading}>Who&rsquo;s behind this</h2>
            <p className={styles.text}>
              I&rsquo;m Asor — Oracle Certified AI professional. I&rsquo;ve built automation systems
              that have saved clients 7,200+ hours of operational work — from extracting 260 years
              of Lloyd&rsquo;s List maritime data to eliminating thousands of hours of manual support,
              helping founders reclaim time they thought was gone.
            </p>
            <p className={styles.text}>
              My work isn&rsquo;t about applying AI for its own sake. It&rsquo;s about removing
              the friction that keeps skilled people stuck doing operational work instead of the
              high-leverage work only they can do.
            </p>
            <p className={styles.text}>
              If you&rsquo;re drowning in manual processes and ready to build something that runs
              without you in the loop, I&rsquo;d like to help.
            </p>
            <Link href="/engage" className={styles.workWithMe}>
              Work With Me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
