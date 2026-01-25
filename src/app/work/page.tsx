"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./work.module.css";

const systems = [
    {
        title: "Document Intelligence",
        description: "Enterprise-scale extraction and reasoning from unstructured data.",
        metrics: "99.2% Accuracy | 10k docs/hr",
        toolchain: "LLM Orchestration + OCR Pipelines + Vector Stores",
    },
    {
        title: "Process Orchestration",
        description: "Dynamic workflow adaptation based on real-time business signals.",
        metrics: "40% Friction Reduction | 24/7 Autonomy",
        toolchain: "State Machines + Event-driven Streams + API Mesh",
    },
    {
        title: "AI Agent Architectures",
        description: "Multi-agent systems designed for autonomous task completion with safety guardrails.",
        metrics: "Sub-second Reasoning Latency | Multi-modal Support",
        toolchain: "LangGraph + Custom Agent Runtimes + Self-Correction Loops",
    },
    {
        title: "Compliance Automation",
        description: "Automated auditing and regulatory adherence at the speed of code.",
        metrics: "Zero-error Audit Logs | Real-time Governance",
        toolchain: "Policy-as-Code + Automated Verification + Immutable Logs",
    },
];

export default function WorkPage() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.headline}>Intellectual Dominance through Systems.</h1>
                    <p className={styles.subhead}>
                        Architecture over tools. Flow over optimization.
                        Precision engineering for high-stakes operational environments.
                    </p>
                </div>
            </section>

            <section className={styles.systemsGrid}>
                <div className="container">
                    {systems.map((system, i) => (
                        <div key={i} className={styles.systemEntry}>
                            <div className={styles.systemInfo}>
                                <h2 className={styles.systemTitle}>{system.title}</h2>
                                <p className={styles.systemDesc}>{system.description}</p>
                                <div className={styles.toolchain}>
                                    <span>Stack: </span>{system.toolchain}
                                </div>
                                <div className={styles.metrics}>{system.metrics}</div>
                            </div>
                            <div className={styles.systemDiagram}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className={styles.diagramImageWrapper}
                                >
                                    <Image
                                        src="/diagram.png"
                                        alt={`${system.title} Architecture`}
                                        width={500}
                                        height={350}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Asor Ahura. Systems & Architecture.</p>
                </div>
            </footer>
        </main>
    );
}
