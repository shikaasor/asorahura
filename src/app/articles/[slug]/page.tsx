import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { articles, getArticleBySlug } from "@/lib/articles";
import styles from "./article.module.css";

export function generateStaticParams() {
    return articles.map(a => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) notFound();

    return (
        <main className={styles.main}>
            <div className="container">
                <div className={styles.layout}>
                    {/* Back link */}
                    <Link href="/articles" className={styles.backLink}>
                        <ArrowLeft size={16} /> All Articles
                    </Link>

                    {/* Article Header */}
                    <header className={styles.header}>
                        <div className={styles.headerMeta}>
                            <span className={styles.metrics}>{article.metrics}</span>
                        </div>
                        <h1 className={styles.title}>{article.title}</h1>
                        <p className={styles.subtitle}>{article.subtitle}</p>
                        <div className={styles.tags}>
                            {article.tags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </header>

                    {/* Divider */}
                    <div className={styles.divider} />

                    {/* Article Body */}
                    <article className={styles.body}>
                        {article.sections.map((section, i) => (
                            <section key={i} className={styles.section}>
                                {section.heading && (
                                    <h2 className={styles.sectionHeading}>{section.heading}</h2>
                                )}
                                {section.body.map((paragraph, j) => {
                                    const isArrow = paragraph.startsWith("→");
                                    return (
                                        <p
                                            key={j}
                                            className={isArrow ? styles.arrowLine : styles.paragraph}
                                        >
                                            {paragraph}
                                        </p>
                                    );
                                })}
                            </section>
                        ))}
                    </article>

                    {/* CTA */}
                    <div className={styles.cta}>
                        <p>Ready to build AI that works where it matters most?</p>
                        <Link href="/engage" className={styles.ctaBtn}>
                            Work With Me
                        </Link>
                        <Link href="/articles" className={styles.ctaSecondary}>
                            <ArrowLeft size={14} /> Back to Articles
                        </Link>
                    </div>
                </div>
            </div>

            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Asor Ahura. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
