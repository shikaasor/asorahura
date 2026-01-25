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
                    <h2 className={styles.sectionTitle}>Core Services</h2>
                    <div className={styles.servicesGrid}>
                        <div className={styles.serviceCard}>
                            <h3>Intelligent Document Processing</h3>
                            <p>Extract, classify, and route unstructured documents at scale. Transform PDFs, emails, and scans into structured, actionable data.</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>AI Agent Systems</h3>
                            <p>Autonomous agents that execute complex multi-step workflows, make decisions, and adapt to edge cases without human intervention.</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>High-Volume Automation</h3>
                            <p>Systems built to handle millions of transactions. From compliance workflows to customer operations.</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>Process Orchestration</h3>
                            <p>End-to-end workflow automation that eliminates handoffs and integrates across your entire stack.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.audience}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Who Flowmorph Is For</h2>
                    <div className={styles.audienceGrid}>
                        <div className={styles.audienceCard}>
                            <h4>High-Volume Operations</h4>
                            <p>Companies processing thousands of documents, transactions, or workflows per day.</p>
                        </div>
                        <div className={styles.audienceCard}>
                            <h4>Scaling Startups</h4>
                            <p>Fast-growing companies where manual processes are breaking under growth pressure.</p>
                        </div>
                        <div className={styles.audienceCard}>
                            <h4>Regulated Industries</h4>
                            <p>Organizations requiring compliance-first automation with full audit trails.</p>
                        </div>
                    </div>
                    <p className={styles.audienceFilter}>
                        If you're looking for off-the-shelf SaaS or simple integrations, we're not the right fit.
                        We build custom automation systems for complex, high-stakes operations.
                    </p>
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
