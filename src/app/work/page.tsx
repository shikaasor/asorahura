import Link from "next/link";
import styles from "./work.module.css";

const caseStudies = [
  {
    headline: "2,000+ resumes screened with consistent AI scoring — eliminating reviewer fatigue across 3 HR departments",
    clientContext: "Three HR departments manually screening 100–150+ resumes per hiring cycle with no structured evaluation framework and single-vendor LLM dependency creating operational and privacy risk.",
    whatWeBuilt: "Provider-agnostic LLM dispatch platform with three domain-specific scorecards (AI Advisor, General Consultant, STL Consultant), evidence-anchored 1-5 scoring, and color-coded Excel batch exports. Supports Claude, GPT-4, Gemini, Groq, and local Ollama — switchable from a sidebar with no code changes.",
    businessImpact: "2,000+ resumes processed. Reviewer fatigue eliminated through consistent AI rubrics. Fully local operation via Ollama enabled for data-sensitive environments. Deployed across 3 active HR departments.",
    stack: "Streamlit · PyPDF2 · Multi-provider LLM Dispatch · OpenPyXL",
  },
  {
    headline: "16,454 chatbot conversations analyzed — surfacing knowledge gaps that explained 100% of escalation spikes for a Swiss insurance company",
    clientContext: "Swiss pet insurance company with a deployed multilingual chatbot (German, French, Spanish) experiencing unexpectedly high human escalation rates with no visibility into why.",
    whatWeBuilt: "LLM-based multi-dimensional classification pipeline across topic category, knowledge gap detection, escalation detection, and engagement patterns — with abstracted provider dispatch for GPT-4 and Gemini.",
    businessImpact: "Revealed that escalations directly tracked knowledge gaps in claims and coverage topics. Surfaced operational blindness the client had no metrics for. Delivered actionable knowledge base expansion roadmap that reduced escalation rate.",
    stack: "GPT-4 · Gemini · Python · Multi-provider LLM Dispatch · Excel Reporting",
  },
  {
    headline: "43,103 structured records extracted from 7,826 pages of 18th-century maritime documents — 260 years of history made searchable",
    clientContext: "European research institution with 20 bound editions of Lloyd's List (1762–1826) locked in archaic handwritten typography with multi-column layouts, ditto marks, and zero standardization.",
    whatWeBuilt: "Two-model pipeline: Chandra OCR for structure-preserving markdown extraction, Gemini for JSON normalization with 25KB of precision prompt rules and a three-stage extractor/verifier/corrector loop to enforce verbatim accuracy.",
    businessImpact: "43,103 marine incident records delivered at research-grade verbatim accuracy. 260 years of shipping history searchable for the first time. Fully auditable extraction process with correction logs.",
    stack: "Chandra OCR · Gemini API · Python · Three-Stage Verification Workflow",
  },
  {
    headline: "Offline-first AI diagnostic tool deployed across 39 health facilities — zero patient data leaving the clinic",
    clientContext: "Rural health facilities in Kano State, Nigeria with no reliable internet, no nearby specialists, and existing AI models trained on Caucasian data making them clinically unsafe for African populations.",
    whatWeBuilt: "Local YOLOv8 inference with in-memory EXIF stripping, confidence-based clinical escalation protocol, blind review workflow for edge cases, and automated retraining data flywheel — all running fully offline.",
    businessImpact: "Live across 39+ facilities. Zero patient PII leaves the clinic at any point. Clinically validated for local population. Offline-first architecture eliminates cloud dependency risk entirely.",
    stack: "YOLOv8 · Streamlit · Supabase · Python/Pillow · Offline Queue",
  },
];

export default function WorkPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.headline}>Real Problems. Real Systems. Real Results.</h1>
          <p className={styles.subhead}>
            Every engagement starts with a specific operational problem. Here&apos;s what gets built when we solve them.
          </p>
        </div>
      </section>

      <section className={styles.caseStudies}>
        <div className="container">
          {caseStudies.map((cs, i) => (
            <article key={i} className={styles.caseStudyCard}>
              <h2 className={styles.caseHeadline}>{cs.headline}</h2>
              <div className={styles.caseBody}>
                <div className={styles.caseSection}>
                  <h3 className={styles.caseSectionLabel}>Client Context</h3>
                  <p>{cs.clientContext}</p>
                </div>
                <div className={styles.caseSection}>
                  <h3 className={styles.caseSectionLabel}>What We Built</h3>
                  <p>{cs.whatWeBuilt}</p>
                </div>
                <div className={styles.caseSection}>
                  <h3 className={styles.caseSectionLabel}>Business Impact</h3>
                  <p>{cs.businessImpact}</p>
                </div>
                <div className={styles.caseStack}>
                  <span className={styles.caseStackLabel}>Stack: </span>
                  <span>{cs.stack}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div className="container">
          <h2 className={styles.bottomCtaHeadline}>See how I can do this for your business</h2>
          <p className={styles.bottomCtaSub}>Describe your operational problem. I&apos;ll tell you what can be built, how long, and what it costs.</p>
          <Link href="/engage" className={styles.bottomCtaBtn}>
            Work With Me →
          </Link>
          <Link href="/assessment" style={{ color: '#a3a3a3', fontSize: '0.875rem', textDecoration: 'underline', marginTop: '0.75rem', display: 'block', textAlign: 'center' }}>
            Or take the AI Readiness Assessment first
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Asor Ahura. Real Systems. Real Results.</p>
        </div>
      </footer>
    </main>
  );
}
