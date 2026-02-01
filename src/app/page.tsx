"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import { Linkedin, Youtube, ArrowRight, Layers, Cpu, Globe, CheckCircle, Award, ShieldCheck, Database, Cloud } from "lucide-react";
import LinkedInFeed from "@/components/LinkedInFeed";
import YouTubeFeed from "@/components/YouTubeFeed";
import SaasShowcase from "@/components/SaasShowcase";

export default function Home() {
    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <motion.div 
                            className={styles.heroText}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className={styles.headline}>
                                <span style={{ color: "#64748b" }}>AI Automation</span> <br />
                                Made Simple.
                            </h1>
                            <p className={styles.subhead}>
                                My name is Asor. I am an Applied AI Engineer with 6+ years of experience. I help businesses master AI agents, build automations,
                                and turn complex workflows into smooth operations.
                            </p>
                            <div className={styles.actions}>
                                <Link href="/engage" className={styles.primaryBtn}>
                                    Work With Me
                                </Link>
                                <Link href="/flowmorph" className={styles.secondaryBtn}>
                                    Explore Flowmorph
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={styles.heroImageContainer}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Image
                                src="/headshot1.png"
                                alt="Asor Ahura"
                                width={800}
                                height={600}
                                style={{ width: "100%", height: "auto", display: "block" }}
                                priority
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trusted By / Signals */}
            <section className={styles.signals}>
                <div className={styles.signalsScroll}>
                    {/* Doubled for seamless loop */}
                    {[...Array(2)].map((_, i) => (
                        <div key={i} style={{ display: "flex", gap: "4rem" }}>
                            <div className={styles.signalItem}>
                                <Cpu size={32} />
                                <span>Python</span>
                            </div>
                            <div className={styles.signalItem}>
                                <Layers size={32} />
                                <span>n8n</span>
                            </div>
                            <div className={styles.signalItem}>
                                <Globe size={32} />
                                <span>LangChain</span>
                            </div>
                            <div className={styles.signalItem}>
                                <Cloud size={32} />
                                <span>AWS & Oracle</span>
                            </div>
                             <div className={styles.signalItem}>
                                <Database size={32} />
                                <span>RAG Pipelines</span>
                            </div>
                            <div className={styles.signalItem}>
                                <CheckCircle size={32} />
                                <span>Voiceflow</span>
                            </div>
                            <div className={styles.signalItem}>
                                <Cpu size={32} />
                                <span>FastAPI</span>
                            </div>
                             <div className={styles.signalItem}>
                                <Layers size={32} />
                                <span>Docker</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* What I Do */}
            <section className={styles.whatIDo}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>How I Can Help</h2>
                    <div className={styles.cardGrid}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <Cpu size={24} />
                            </div>
                            <h3 className={styles.cardTitle}>Build AI Agents</h3>
                            <p className={styles.cardText}>
                                Utilizing LangChain, RAG, and LLMs, I build intelligent agents that handle complex tasks—like legal docs or support tickets—acting as a digital workforce.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <Layers size={24} />
                            </div>
                            <h3 className={styles.cardTitle}>Connect Systems</h3>
                            <p className={styles.cardText}>
                                Expert in n8n and API integration. I connect disparate apps (CRM, EMR, Databases) to create seamless, automated workflows that run on autopilot.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <CheckCircle size={24} />
                            </div>
                            <h3 className={styles.cardTitle}>Scale Operations</h3>
                            <p className={styles.cardText}>
                                Proven track record of automating over 7,200 annual support hours and maintaining 98% system uptime. I build robust systems that grow with you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Certifications Section */}
             <section className={styles.whatIDo} style={{ background: "#f8fafc" }}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Certifications & Expertise</h2>
                    <div className={styles.cardGrid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon} style={{ color: "#d97706", background: "#fffbeb" }}>
                                <Award size={24} />
                            </div>
                            <h3 className={styles.cardTitle}>Oracle AI & GenAI</h3>
                            <p className={styles.cardText}>
                                Certified Professional in AI Vector Search and Generative AI (2024/2025). Expert in RAG and semantic search.
                            </p>
                        </div>
                         <div className={styles.card}>
                            <div className={styles.cardIcon} style={{ color: "#059669", background: "#ecfdf5" }}>
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className={styles.cardTitle}>Cybersecurity (CC)</h3>
                            <p className={styles.cardText}>
                                Certified in Cybersecurity by ISC². I prioritize data privacy, compliance (GDPR/HIPAA), and secure architecture.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon} style={{ color: "#2563eb", background: "#eff6ff" }}>
                                <Cloud size={24} />
                            </div>
                            <h3 className={styles.cardTitle}>Cloud Architecture</h3>
                            <p className={styles.cardText}>
                                Oracle APEX Cloud Developer & OCI Data Science Professional. Experienced in deploying scalable solutions on AWS & Cloud.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Activity / Connect */}
            <section className={styles.activity}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Connect & Learn</h2>
                    <div className={styles.feedGrid}>
                        <LinkedInFeed />
                        <YouTubeFeed />
                        <SaasShowcase />
                    </div>
                </div>
            </section>

            {/* About Section */}
             <section id="about" className={styles.about}>
                 <div className={styles.container}>
                     <div className={styles.aboutContent}>
                         <h2 className={styles.aboutTitle}>About Me</h2>
                         <div className={styles.aboutText}>
                             <p>
                                 Hi, I'm Asor. I'm an Applied AI Engineer and Health Informatics specialist with over 6 years of experience designing and deploying digital solutions.
                             </p>
                             <br />
                             <p>
                                 From overseeing EMR systems for 43 health facilities to building AI agents that automate thousands of support hours at ParsLabs, my career has been defined by one mission: using technology to solve real-world problems.
                             </p>
                             <br />
                             <p>
                                 I believe that removing friction is more powerful than optimizing a broken process.
                                 Whether it's building a local AI platform like Localens or orchestrating multi-agent workflows, I build systems that redefine operations.
                             </p>
                         </div>
                         <Link href="/engage" className={styles.secondaryBtn} style={{ background: "white", color: "#0f172a", border: "none" }}>
                             Work With Me
                         </Link>
                     </div>
                 </div>
             </section>

            
            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerSocials}>
                        <a href="https://www.youtube.com/@asorahura" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                            <Youtube size={20} /> YouTube
                        </a>
                        <a href="https://www.linkedin.com/in/aahura/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                            <Linkedin size={20} /> LinkedIn
                        </a>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Asor Ahura. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
