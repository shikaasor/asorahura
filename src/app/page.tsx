"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import LinkedInFeed from "@/components/LinkedInFeed";
import YouTubeFeed from "@/components/YouTubeFeed";
import SaasShowcase from "@/components/SaasShowcase";

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

            <section className={styles.whatIDo}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>What I Do</h2>
                    <div className={styles.whatIDoGrid}>
                        <div className={styles.whatIDoItem}>
                            <h3>AI Automation Architecture</h3>
                            <p>I design intelligent systems that understand, process, and act on unstructured data. From document intelligence to autonomous agents, I build the nervous system of modern operations.</p>
                        </div>
                        <div className={styles.whatIDoItem}>
                            <h3>Compliance-First Automation</h3>
                            <p>Automation in regulated industries requires precision. I architect systems that not only automate workflows but create auditable, compliant digital trails.</p>
                        </div>
                        <div className={styles.whatIDoItem}>
                            <h3>Process Orchestration</h3>
                            <p>Beyond point solutions, I build orchestration layers that connect disparate systems, eliminate handoffs, and create seamless operational flow.</p>
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

            <section className={styles.activity}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Recent Activity</h2>
                    <p className={styles.activitySubtitle}>
                        Stay connected with the latest insights, videos, and live systems.
                    </p>
                    <div className={styles.activityGrid}>
                        <LinkedInFeed />
                        <YouTubeFeed />
                        <SaasShowcase />
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
