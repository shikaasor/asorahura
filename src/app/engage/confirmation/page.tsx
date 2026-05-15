import Link from "next/link";

export default function EngageConfirmationPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#0a0a0a",
                color: "#fff",
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
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: "1.5rem",
                    }}
                >
                    Thanks for Reaching Out
                </h1>
                <p
                    style={{
                        fontSize: "1rem",
                        color: "#d1d5db",
                        lineHeight: 1.7,
                        marginBottom: "1rem",
                    }}
                >
                    Based on what you&apos;ve shared, you&apos;re in early stages of your AI journey. I&apos;ve noted
                    your submission and will follow up with resources tailored to where you are now.
                </p>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#9ca3af",
                        lineHeight: 1.7,
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
                        background: "#C9A84C",
                        color: "#0a0a0a",
                        padding: "0.875rem 2rem",
                        borderRadius: "0.625rem",
                        fontWeight: 700,
                        fontSize: "0.975rem",
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
                            color: "#9ca3af",
                            textDecoration: "underline",
                            textUnderlineOffset: "3px",
                        }}
                    >
                        Retake the Assessment
                    </Link>
                </div>
            </div>
        </main>
    );
}
