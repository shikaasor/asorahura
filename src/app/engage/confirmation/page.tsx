import Link from "next/link";

export default function EngageConfirmationPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                background: "var(--surface-1)",
                color: "var(--ink-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 1.5rem",
            }}
        >
            <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontWeight: 500,
                        letterSpacing: "-0.036em",
                        color: "var(--cream)",
                        lineHeight: 1.03,
                        marginBottom: "1.5rem",
                    }}
                >
                    Thanks for Reaching Out
                </h1>
                <p
                    style={{
                        fontSize: "1.0625rem",
                        color: "#b6b5ad",
                        fontWeight: 300,
                        lineHeight: 1.62,
                        marginBottom: "1rem",
                    }}
                >
                    Based on what you&apos;ve shared, you&apos;re in early stages of your AI journey. I&apos;ve noted
                    your submission and will follow up with resources tailored to where you are now.
                </p>
                <p
                    style={{
                        fontSize: "0.9375rem",
                        color: "var(--ink-2)",
                        fontWeight: 300,
                        lineHeight: 1.62,
                        marginBottom: "2.5rem",
                    }}
                >
                    In the meantime, the best next step is to explore what automation has done for businesses at your
                    stage.
                </p>
                <Link
                    href="/work"
                    style={{
                        display: "inline-block",
                        background: "var(--accent)",
                        color: "var(--on-accent)",
                        padding: "0.875rem 2rem",
                        borderRadius: "var(--radius-full)",
                        fontWeight: 500,
                        fontSize: "1rem",
                        textDecoration: "none",
                        marginBottom: "1rem",
                    }}
                >
                    See Real Case Studies →
                </Link>
                <div>
                    <Link
                        href="/assessment"
                        style={{
                            fontSize: "0.875rem",
                            color: "var(--ink-2)",
                            textDecoration: "underline",
                            textUnderlineOffset: "3px",
                        }}
                    >
                        Retake the Discovery
                    </Link>
                </div>
            </div>
        </main>
    );
}
