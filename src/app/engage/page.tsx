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

                    <div className={styles.filtering}>
                        <div className={styles.filterSection}>
                            <h3>Criteria</h3>
                            <ul>
                                <li>High-volume operational complexity</li>
                                <li>Scaling startups (Series A+) or established enterprises</li>
                                <li>Data-heavy or compliance-sensitive workflows</li>
                                <li>Founders who value leverage over activity</li>
                            </ul>
                        </div>

                        <div className={styles.filterSection}>
                            <h3>Threshold</h3>
                            <p>Minimum engagement starts at $15k per month or project-based equity/performance models.</p>
                        </div>
                    </div>

                    <div className={styles.formWrapper}>
                        <h2 className={styles.formTitle}>Initiate Inquiry</h2>
                        {status === "success" ? (
                            <div className={styles.successMessage}>
                                <h3>{message}</h3>
                                <p>We've received your inquiry and will review it against our current availability.</p>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" placeholder="John Doe" required />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="company">Company / Organization</label>
                                    <input type="text" id="company" name="company" placeholder="Acme Corp" required />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="details">Operational Challenge</label>
                                    <textarea id="details" name="details" rows={5} placeholder="What friction are we eliminating?" required></textarea>
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
