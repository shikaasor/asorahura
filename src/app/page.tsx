"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={styles.headline}
                    >
                        Transforming Work into Flow.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className={styles.subhead}
                    >
                        I design AI-powered automation systems that eliminate operational drag,
                        freeing human creativity and accelerating business growth.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className={styles.actions}
                    >
                        <Link href="/engage" className={styles.primaryBtn}>Work With Me</Link>
                        <Link href="/flowmorph" className={styles.secondaryBtn}>Explore Flowmorph &rarr;</Link>
                    </motion.div>
                </div>
            </section>

            <section className={styles.problem}>
                <div className="container">
                    <div className={styles.problemGrid}>
                        <div className={styles.problemItem}>
                            <h3>Operational Friction</h3>
                            <p>Manual processes that drain team energy and introduce risk.</p>
                        </div>
                        <div className={styles.problemItem}>
                            <h3>Cognitive Overload</h3>
                            <p>Founders stuck in "the machine" instead of building the future.</p>
                        </div>
                        <div className={styles.problemItem}>
                            <h3>Scaling Debt</h3>
                            <p>Systems that break under growth instead of enabling it.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.philosophy}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Philosophy</h2>
                    <div className={styles.philosophyGrid}>
                        <div className={styles.philosophyItem}>
                            <h3>Systems {'>'} Tools</h3>
                            <p>We don't just add tools; we architect systems that redefine operations.</p>
                        </div>
                        <div className={styles.philosophyItem}>
                            <h3>Flow {'>'} Optimization</h3>
                            <p>Removing friction is more powerful than optimizing a broken process.</p>
                        </div>
                        <div className={styles.philosophyItem}>
                            <h3>Automation = Liberation</h3>
                            <p>We automate the mechanical to liberate the creative.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.signals}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Proof of Capability</h2>
                    <div className={styles.signalsGrid}>
                        <div className={styles.signalCard}>
                            <div className={styles.signalIcon}>🧪</div>
                            <h4>Technical Artifacts</h4>
                            <p>Rigorous research and system blueprints.</p>
                        </div>
                        <div className={styles.signalCard}>
                            <div className={styles.signalIcon}>💻</div>
                            <h4>SaaS Demos</h4>
                            <p>Live demonstrations of autonomous agents.</p>
                        </div>
                        <div className={styles.signalCard}>
                            <div className={styles.signalIcon}>🐙</div>
                            <h4>GitHub References</h4>
                            <p>Open-source contributions to AI infrastructure.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.bridge}>
                <div className="container">
                    <p className={styles.bridgeText}>
                        For companies seeking deep operational transformation &rarr;
                        <Link href="/flowmorph"><strong>Flowmorph</strong></Link>
                    </p>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Asor Ahura. Elite AI Automation Authority.</p>
                </div>
            </footer>
        </main>
    );
}
