"use client";

import { useState } from "react";
import { submitInquiry } from "./actions";
import styles from "./engage.module.css";
import Testimonials from "@/components/Testimonials";

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
            setMessage(result.message);
        }
    }

    return (
        <main className={styles.main}>
            <div className="container">
                <section className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.headline}>Let's Build Something Great.</h1>
                        <p className={styles.subhead}>
                            Whether you're a startup looking to scale or an enterprise needing operational efficiency, 
                            I'm here to help you architect the right solution.
                        </p>
                    </div>

                    {/* Who I Work With Section - Softened */}
                    <div className={styles.whoIWorkWith}>
                        <h2>How I Can Help</h2>
                        <div className={styles.audienceGrid}>
                            <div className={styles.audienceCard}>
                                <h3>Founders & Executives</h3>
                                <p>
                                    Unlock operational leverage and focus on strategy while your systems handle the execution.
                                </p>
                            </div>
                            <div className={styles.audienceCard}>
                                <h3>Operations Leaders</h3>
                                <p>
                                    Eliminate bottlenecks and manual data entry. Build workflows that scale with your growth.
                                </p>
                            </div>
                            <div className={styles.audienceCard}>
                                <h3>Compliance & Risk</h3>
                                <p>
                                    Automate with confidence. Create auditable, secure, and compliant digital trails.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Testimonials />

                    {/* Contact Form */}
                    <div className={styles.formWrapper} style={{ marginTop: "4rem" }}>
                        <h2 className={styles.formTitle}>Tell me about your project</h2>
                        {status === "success" ? (
                            <div className={styles.successMessage}>
                                <h3>{message}</h3>
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
                                        <option value="under-15k">Under $15k/month</option>
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
