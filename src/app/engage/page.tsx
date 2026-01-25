"use client";

import { useState } from "react";
import { submitInquiry } from "./actions";
import styles from "./engage.module.css";

export default function EngagePage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const result = await submitInquiry(formData);

        if (result.success) {
            setStatus("success");
            setMessage(result.message);
        } else {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <main className={styles.main}>
            <div className="container">
                <section className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.headline}>Selective Engagement.</h1>
                        <p className={styles.subhead}>
                            I only partner with founders and organizations where my systems can
                            generate 10x-100x leverage. This is not for everyone.
                        </p>
                    </div>

                    {/* Background Narrative Section */}
                    <div className={styles.backgroundSection}>
                        <h2>The Architect Behind the Systems</h2>
                        <div className={styles.backgroundContent}>
                            <div className={styles.backgroundBlock}>
                                <h3>Corporate Foundation</h3>
                                <p>
                                    Years in enterprise environments taught me that most operational
                                    inefficiencies aren't technical problems—they're systems problems.
                                    I've witnessed organizations drown in manual processes while
                                    sitting on powerful tools they never properly architected.
                                </p>
                            </div>
                            <div className={styles.backgroundBlock}>
                                <h3>Software Engineering Roots</h3>
                                <p>
                                    My software engineering background gives me the rare ability to
                                    see both the forest and the trees. I don't just recommend
                                    solutions—I build them. From AI agent architectures to
                                    compliance-first automation pipelines, every system I design
                                    is grounded in production-grade engineering.
                                </p>
                            </div>
                            <div className={styles.backgroundBlock}>
                                <h3>The Synthesis</h3>
                                <p>
                                    This dual perspective—corporate operations meets software
                                    architecture—is what enables the transformations I deliver.
                                    I understand the business context, speak the language of
                                    stakeholders, and possess the technical depth to execute.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Who I Work With Section */}
                    <div className={styles.whoIWorkWith}>
                        <h2>Who I Work With</h2>
                        <div className={styles.audienceGrid}>
                            <div className={styles.audienceCard}>
                                <h3>Founders & Executives</h3>
                                <p>
                                    Leaders who understand that operational leverage is their
                                    competitive moat. You're not looking for incremental improvements—
                                    you want order-of-magnitude transformations.
                                </p>
                            </div>
                            <div className={styles.audienceCard}>
                                <h3>Operations Leaders</h3>
                                <p>
                                    COOs and Ops Directors drowning in manual processes, reconciliation
                                    nightmares, and scaling bottlenecks. You need systems that grow
                                    with your volume, not headcount.
                                </p>
                            </div>
                            <div className={styles.audienceCard}>
                                <h3>Compliance & Risk</h3>
                                <p>
                                    Teams in regulated industries who need automation that doesn't
                                    compromise auditability. SOC 2, HIPAA, financial services—
                                    compliance-first is non-negotiable.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Engagement Thresholds */}
                    <div className={styles.filtering}>
                        <div className={styles.filterSection}>
                            <h3>Engagement Criteria</h3>
                            <ul>
                                <li>High-volume operational complexity (1000+ documents/month or equivalent)</li>
                                <li>Scaling startups (Series A+) or established enterprises</li>
                                <li>Data-heavy or compliance-sensitive workflows</li>
                                <li>Founders who value leverage over activity</li>
                                <li>Willingness to invest in proper architecture, not quick fixes</li>
                            </ul>
                        </div>

                        <div className={styles.filterSection}>
                            <h3>Investment Threshold</h3>
                            <p>
                                Minimum engagement starts at <strong>$15,000/month</strong> for
                                ongoing advisory and implementation, or project-based models
                                with equity/performance components for the right fit.
                            </p>
                            <p className={styles.filterNote}>
                                If this feels expensive, we're likely not the right match.
                                The ROI on properly architected systems is measured in multiples, not percentages.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={styles.formWrapper}>
                        <h2 className={styles.formTitle}>Initiate Inquiry</h2>
                        {status === "success" ? (
                            <div className={styles.successMessage}>
                                <h3>{message}</h3>
                                <p>We've received your inquiry and will review it against our current availability.</p>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.formRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="name">Full Name</label>
                                        <input type="text" id="name" name="name" placeholder="John Doe" required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" name="email" placeholder="john@company.com" required />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="company">Company / Organization</label>
                                        <input type="text" id="company" name="company" placeholder="Acme Corp" required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="role">Your Role</label>
                                        <input type="text" id="role" name="role" placeholder="COO, Founder, etc." required />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="companySize">Company Size</label>
                                    <select id="companySize" name="companySize" required>
                                        <option value="">Select company size...</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="operationalVolume">Monthly Operational Volume</label>
                                    <select id="operationalVolume" name="operationalVolume" required>
                                        <option value="">Select approximate volume...</option>
                                        <option value="under-1000">Under 1,000 documents/transactions</option>
                                        <option value="1000-10000">1,000 - 10,000 documents/transactions</option>
                                        <option value="10000-100000">10,000 - 100,000 documents/transactions</option>
                                        <option value="100000+">100,000+ documents/transactions</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="challenge">Primary Operational Challenge</label>
                                    <textarea
                                        id="challenge"
                                        name="challenge"
                                        rows={4}
                                        placeholder="What bottleneck or friction point is limiting your growth?"
                                        required
                                    ></textarea>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="timeline">Engagement Timeline</label>
                                    <select id="timeline" name="timeline" required>
                                        <option value="">When are you looking to start?</option>
                                        <option value="immediate">Immediately (within 2 weeks)</option>
                                        <option value="1-month">Within 1 month</option>
                                        <option value="1-3-months">1-3 months</option>
                                        <option value="exploring">Just exploring options</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="budget">Budget Alignment</label>
                                    <select id="budget" name="budget" required>
                                        <option value="">Select budget range...</option>
                                        <option value="under-15k">Under $15k/month (may not be a fit)</option>
                                        <option value="15k-30k">$15k - $30k/month</option>
                                        <option value="30k-50k">$30k - $50k/month</option>
                                        <option value="50k+">$50k+/month or project-based</option>
                                        <option value="equity">Open to equity/performance models</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="context">Additional Context (Optional)</label>
                                    <textarea
                                        id="context"
                                        name="context"
                                        rows={3}
                                        placeholder="Any other details that would help us understand your situation..."
                                    ></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                                    {status === "loading" ? "Processing..." : "Submit Inquiry"}
                                </button>
                                {status === "error" && <p className={styles.errorMessage}>{message}</p>}
                            </form>
                        )}
                    </div>
                </section>
            </div>

            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Asor Ahura. Intentional Growth.</p>
                </div>
            </footer>
        </main>
    );
}
