"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitInquiry } from "./actions";
import styles from "./engage.module.css";
import Testimonials from "@/components/Testimonials";

function EngageFormInner() {
    const score = useSearchParams().get("score");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const result = await submitInquiry(formData);

        if (result && result.success) {
            setStatus("success");
            setMessage(result.message);
        } else if (result) {
            setStatus("error");
            setMessage(result.message);
        }
    }

    return (
        <main className={styles.main}>
            <div className="container">
                <section className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.headline}>Tell Me About Your Problem</h1>
                        <p className={styles.subhead}>
                            Describe what&apos;s slowing your operations down. I&apos;ll tell you what can be built, how long, and what it costs.
                        </p>
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
                                        <option value="under-5k">Under $5k</option>
                                        <option value="5k-15k">$5k–$15k</option>
                                        <option value="15k-30k">$15k–$30k</option>
                                        <option value="30k-plus">$30k+</option>
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
                                <input type="hidden" name="score" value={score ?? ""} />
                                <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                                    {status === "loading" ? "Submitting..." : "Submit My Project Brief"}
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

export default function EngagePage() {
    return (
        <Suspense fallback={null}>
            <EngageFormInner />
        </Suspense>
    );
}
