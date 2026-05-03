"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./work.module.css";

const systems = [
    {
        slug: "cervical-cancer-screening-tool",
        title: "AI-Powered Cervical Cancer Screening",
        description: "Offline-first diagnostic tool deployed across 39+ health facilities in Kano State, Nigeria. Built for frontline health workers with zero cloud dependency.",
        metrics: "39+ Facilities Deployed | EU HORIZON €2.25M | Zero Cloud Dependency",
        toolchain: "YOLOv8 + Streamlit + Supabase + Python/Pillow + Offline Queue",
        caseStudy: {
            context: "Rural health facilities in Kano State with no reliable internet and no nearby specialists",
            bottleneck: "Existing AI models trained on Caucasian data — clinically unsafe for African populations; no offline inference capability",
            approach: "Local YOLOv8 inference with in-memory EXIF stripping, confidence-based clinical escalation, blind review protocol, and automated retraining data flywheel",
            outcome: "Live across 39+ facilities; zero patient PII leaving the clinic; actively positioned for EU HORIZON grant up to €2.25M"
        }
    },
    {
        slug: "lloyds-list-ocr-pipeline",
        title: "Historical Document Digitization Pipeline",
        description: "Digitized 7,826 pages of 18th-century Lloyd's List maritime records for a European research institution — 260 years of shipping history made searchable.",
        metrics: "43,103 Records Extracted | 7,826 Pages | 260 Years of History",
        toolchain: "Chandra OCR + Gemini API + Python + Three-Stage Verification Workflow",
        caseStudy: {
            context: "European research institution with 20 bound editions of Lloyd's List (1762–1826) locked in archaic handwritten typography",
            bottleneck: "Multi-column layouts, ditto marks, pre-modern typography, and zero standardization made off-the-shelf OCR unviable",
            approach: "Two-model pipeline: Chandra OCR for structure-preserving markdown, Gemini for JSON extraction with 25KB of precision prompt rules and a three-stage extractor/verifier/corrector loop",
            outcome: "43,103 marine incident records delivered — verbatim accuracy enforced, fully auditable, research-grade"
        }
    },
    {
        slug: "ai-resume-reviewer",
        title: "Multi-LLM Resume Screening Platform",
        description: "Open-source AI hiring platform supporting Claude, GPT-4, Gemini, Groq, and local Ollama — switchable from a sidebar with no code changes.",
        metrics: "2,000+ Resumes Reviewed | 3 HR Departments | 5 AI Providers",
        toolchain: "Streamlit + PyPDF2 + Chandra OCR + Multi-provider LLM Dispatch + OpenPyXL",
        caseStudy: {
            context: "HR departments manually screening 100–150+ resumes per hiring cycle with no structured evaluation framework",
            bottleneck: "Reviewer fatigue, inconsistent scoring, and single-vendor LLM dependency creating operational and privacy risk",
            approach: "Provider-agnostic LLM dispatch layer with three domain-specific scorecards (AI Advisor, General, STL Consultant), evidence-anchored 1-5 scoring, and color-coded Excel batch exports",
            outcome: "2,000+ resumes processed across 3 active HR departments; fully local operation via Ollama for data-sensitive environments; MIT-licensed on GitHub"
        }
    },
    {
        slug: "chatbotly-nlp-analytics",
        title: "Chatbot NLP Analytics Pipeline",
        description: "Analyzed 16,454 chatbot conversation logs for a Swiss insurance company to surface knowledge gaps, escalation drivers, and engagement patterns.",
        metrics: "16,454 Conversations Analyzed | 15 Topic Categories | 3 Languages",
        toolchain: "GPT-4 + Gemini + Python + Multi-provider LLM Dispatch + Excel Reporting",
        caseStudy: {
            context: "Swiss pet insurance company with a deployed multilingual chatbot (German, French, Spanish) experiencing unexpectedly high human escalation rates",
            bottleneck: "No visibility into which topics were failing, why customers escalated, or what the knowledge base was missing",
            approach: "LLM-based multi-dimensional classification across topic category, knowledge gap detection, escalation detection, and engagement patterns — with abstracted provider dispatch for GPT-4 and Gemini",
            outcome: "Revealed that escalations directly tracked knowledge gaps in claims and coverage topics; surfaced operational blindness the client had no metrics for; delivered actionable knowledge base expansion roadmap"
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

                                <Link href={`/articles/${system.slug}`} className={styles.articleLink}>
                                    Read Full Article →
                                </Link>
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
