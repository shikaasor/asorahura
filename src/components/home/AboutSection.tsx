import Image from "next/image";
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
              I&rsquo;m Asor — Oracle Certified AI professional with over 7,200 hours delivered
              across clients on three continents. I&rsquo;ve built systems that extracted 260 years
              of Lloyd&rsquo;s List maritime data, automated thousands of support hours, and helped
              founders reclaim time they thought was gone.
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
          </div>
        </div>
      </div>
    </section>
  );
}
