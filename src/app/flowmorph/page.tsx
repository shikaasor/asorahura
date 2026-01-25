"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./flowmorph.module.css";

export default function FlowmorphPage() {
    return (
        <main className={styles.main}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.backLink}>&larr; Asor Ahura</Link>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.logoWrapper}
                >
                    <Image src="/logo.png" alt="Flowmorph Logo" width={60} height={60} />
                    <span className={styles.logoText}>Flowmorph</span>
                </motion.div>
                <Link href="/engage" className={styles.ctaSmall}>Engage</Link>
            </nav>

            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.label}>Automation Agency</div>
                    <h1 className={styles.headline}>Transforming Work into Flow.</h1>
                    <p className={styles.subhead}>
                        We design and deploy AI automation systems that eliminate operational bottlenecks,
                        freeing human creative energy and unlocking business scale.
                    </p>
                    <Link href="/engage" className={styles.primaryBtn}>Engage Flowmorph</Link>
                </div>
            </section>

            <div className={styles.systemDiagram}>
                <motion.div
                    initial={{ opacity: 0, filter: "grayscale(100%)" }}
                    whileInView={{ opacity: 1, filter: "grayscale(0%)" }}
                    transition={{ duration: 1 }}
                    className={styles.diagramImageWrapper}
                >
                    <Image
                        src="/diagram.png"
                        alt="Flowmorph System Architecture"
                        width={400}
                        height={300}
                        style={{ objectFit: 'contain' }}
                    />
                </motion.div>
            </div>

            <section className={styles.philosophy}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>The Flowmorph Philosophy</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h3>Automation {'\u2260'} scripts</h3>
                            <p>We build systems, not one-off shortcuts.</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Systems {'>'} Tools</h3>
                            <p>The architecture defines the outcome, not the stack.</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Flow {'>'} Optimization</h3>
                            <p>We eliminate friction instead of just making it faster.</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Humans create, machines execute</h3>
                            <p>We return cognitive bandwidth to your team.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.howWeWork}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Engagement Model</h2>
                    <div className={styles.engagementGrid}>
                        <div className={styles.engagementStep}>
                            <span>01</span>
                            <h4>Deep Process Diagnosis</h4>
                            <p>We identify the kinetic bottlenecks in your current operation.</p>
                        </div>
                        <div className={styles.engagementStep}>
                            <span>02</span>
                            <h4>System Design</h4>
                            <p>We architect the automation layer from first principles.</p>
                        </div>
                        <div className={styles.engagementStep}>
                            <span>03</span>
                            <h4>Deployment</h4>
                            <p>We integrate the systems into your existing stack with zero downtime.</p>
                        </div>
                        <div className={styles.engagementStep}>
                            <span>04</span>
                            <h4>Optimization</h4>
                            <p>Continuous refinement as your business scales and evolves.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.services}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Capabilities</h2>
                    <ul className={styles.serviceList}>
                        <li>Intelligent Document Processing</li>
                        <li>High-volume Workflow Automation</li>
                        <li>AI Agent System Design</li>
                        <li>Compliance-first Automation</li>
                        <li>SaaS System Integration</li>
                        <li>End-to-end Process Elimination</li>
                    </ul>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container">
                    <h2 className={styles.headlineSmall}>Ready for Elite Leverage?</h2>
                    <p>High-value, limited engagements only.</p>
                    <Link href="/engage" className={styles.primaryBtn}>Work With Flowmorph</Link>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Flowmorph. Engineering Transformation.</p>
                </div>
            </footer>
        </main>
    );
}
