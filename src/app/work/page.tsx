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
        caseStudy: {
            context: "Financial services company processing 5,000+ loan applications per week",
            bottleneck: "Manual document review creating 72-hour processing delays",
            approach: "Multi-stage extraction pipeline with confidence scoring and human-in-the-loop fallback",
            outcome: "Reduced processing time to 4 hours, 99.2% accuracy, zero compliance violations"
        }
    },
    {
        title: "Process Orchestration",
        description: "Dynamic workflow adaptation based on real-time business signals.",
        metrics: "40% Friction Reduction | 24/7 Autonomy",
        toolchain: "State Machines + Event-driven Streams + API Mesh",
        caseStudy: {
            context: "B2B SaaS company with complex multi-step customer onboarding",
            bottleneck: "Manual handoffs between teams causing 40% drop-off rate",
            approach: "Event-driven orchestration layer connecting CRM, billing, and provisioning systems",
            outcome: "Fully automated onboarding, 85% reduction in time-to-value, 12% increase in activation"
        }
    },
    {
        title: "AI Agent Architectures",
        description: "Multi-agent systems designed for autonomous task completion with safety guardrails.",
        metrics: "Sub-second Reasoning Latency | Multi-modal Support",
        toolchain: "LangGraph + Custom Agent Runtimes + Self-Correction Loops",
        caseStudy: {
            context: "Healthcare provider managing patient intake and triage workflows",
            bottleneck: "High-volume intake forms requiring clinical judgment for routing",
            approach: "Multi-agent system with specialized routing, validation, and escalation agents",
            outcome: "80% of cases auto-routed correctly, 60% faster triage, maintained quality standards"
        }
    },
    {
        title: "Compliance Automation",
        description: "Automated auditing and regulatory adherence at the speed of code.",
        metrics: "Zero-error Audit Logs | Real-time Governance",
        toolchain: "Policy-as-Code + Automated Verification + Immutable Logs",
        caseStudy: {
            context: "Fintech startup requiring SOC 2 compliance for enterprise sales",
            bottleneck: "Manual audit preparation consuming weeks of engineering time quarterly",
            approach: "Automated policy enforcement with real-time monitoring and immutable audit trails",
            outcome: "Continuous compliance posture, 90% reduction in audit prep time, zero findings"
        }
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
                    <div className={styles.disclaimer}>
                        <p><strong>Note:</strong> All case studies presented here are abstracted and anonymized to protect client confidentiality. Specific metrics and contexts have been generalized while preserving the technical essence and business impact of the work.</p>
                    </div>
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

                                <div className={styles.caseStudy}>
                                    <h4>Case Study</h4>
                                    <div className={styles.caseStudyItem}>
                                        <strong>Context:</strong> {system.caseStudy.context}
                                    </div>
                                    <div className={styles.caseStudyItem}>
                                        <strong>Bottleneck:</strong> {system.caseStudy.bottleneck}
                                    </div>
                                    <div className={styles.caseStudyItem}>
                                        <strong>Approach:</strong> {system.caseStudy.approach}
                                    </div>
                                    <div className={styles.caseStudyItem}>
                                        <strong>Outcome:</strong> {system.caseStudy.outcome}
                                    </div>
                                </div>
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
