---
phase: 01-critical-path
plan: 1b
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/assessment/page.tsx
  - src/app/assessment/actions.ts
  - src/components/assessment/AssessmentShell.tsx
  - src/components/assessment/QuestionCard.tsx
  - src/components/assessment/ProgressBar.tsx
  - src/components/assessment/EmailGate.tsx
  - src/components/assessment/ResultsScreen.tsx
  - src/lib/assessment.ts
  - src/lib/validation.ts
  - src/lib/pdf.ts
  - src/lib/email.ts
  - src/emails/AssessmentReport.tsx
  - public/ai-readiness-scorecard.pdf
  - .env.local
autonomous: false
requirements:
  - ASSESS-01
  - ASSESS-02
  - ASSESS-03
  - ASSESS-04
  - ASSESS-05
  - ASSESS-06
  - ASSESS-07
  - ASSESS-08
  - ASSESS-09
  - ASSESS-10
user_setup:
  - service: resend
    why: "Transactional email delivery for assessment results PDF"
    env_vars:
      - name: RESEND_API_KEY
        source: "Resend Dashboard → API Keys → Create API Key (full access)"
    dashboard_config:
      - task: "Verify sending domain asorahura.com in Resend → add SPF/DKIM DNS records at your registrar"
        location: "Resend Dashboard → Domains → Add Domain"

must_haves:
  truths:
    - "Assessment page at /assessment shows entry hero with 'Find Out Exactly Where AI Can Save...' heading, sub-copy, and micro-trust badges"
    - "Assessment presents one question per screen with a visible progress bar (e.g., '3 of 8')"
    - "Q1 captures role (Founder / CTO / Operations Manager / Other); Q2-Q8 show role-adapted answer options"
    - "After completing Q8, user sees an email gate (First Name + Email) — results are NOT shown yet"
    - "After submitting the email gate, results display with a 0-100 score, tier name, and 2-3 preview bullets"
    - "Results screen shows primary message 'Your Full Report Is On Its Way' and secondary 'Book a Discovery Call' Calendly link"
    - "Results screen shows 'Download Full PDF' button linking to /ai-readiness-scorecard.pdf (the full 20-question scorecard) — no 404"
    - "Submitting the email gate triggers a Server Action that generates a PDF and sends it via Resend to the captured email"
    - "Assessment answers survive browser refresh via localStorage (user can resume from last question)"
  artifacts:
    - path: "src/lib/assessment.ts"
      provides: "Question data, role-based branching, calculateScore(), getTierName(), getQuestionOptions()"
      min_lines: 80
    - path: "src/lib/validation.ts"
      provides: "emailGateSchema (Zod), EmailGateInput type"
      min_lines: 20
    - path: "src/app/assessment/actions.ts"
      provides: "submitAssessmentForEmail() Server Action — validates, generates PDF, sends email via Resend"
      min_lines: 40
      exports: ["submitAssessmentForEmail"]
    - path: "src/components/assessment/AssessmentShell.tsx"
      provides: "Orchestrator client component managing step state (intro → questions → email gate → results)"
      min_lines: 60
    - path: "src/components/assessment/ResultsScreen.tsx"
      provides: "Score display + tier + preview bullets + download link for full 20-question scorecard PDF + CTAs"
      min_lines: 55
    - path: "public/ai-readiness-scorecard.pdf"
      provides: "Pre-built static 20-question full scorecard PDF served at /ai-readiness-scorecard.pdf — this is a separate asset from the personalized 8-question results PDF generated server-side. Must be placed in /public so Next.js serves it as a static file."
    - path: "src/emails/AssessmentReport.tsx"
      provides: "React Email template for personalized assessment result email"
      min_lines: 40
  key_links:
    - from: "src/components/assessment/AssessmentShell.tsx"
      to: "src/lib/assessment.ts"
      via: "import calculateScore, getQuestionOptions, assessmentQuestions"
      pattern: "import.*assessment"
    - from: "src/components/assessment/EmailGate.tsx"
      to: "src/app/assessment/actions.ts"
      via: "Server Action call on form submit"
      pattern: "submitAssessmentForEmail"
    - from: "src/app/assessment/actions.ts"
      to: "resend"
      via: "new Resend(process.env.RESEND_API_KEY)"
      pattern: "RESEND_API_KEY"
    - from: "src/lib/pdf.ts"
      to: "pdfkit"
      via: "import PDFDocument from 'pdfkit'"
      pattern: "PDFDocument"
---

<objective>
Build the complete AI Readiness Assessment at /assessment: 8 role-branching questions one per screen with progress bar, an email gate (First Name + Email) that blocks results until submitted, a personalized 0-100 score results screen with tier name and preview bullets, and a Server Action that generates a PDF report and delivers it via Resend.

Purpose: This is the primary conversion engine for the site. It captures leads, qualifies them by score, and delivers immediate personalized value — all in under 4 minutes.

Output: Fully functional /assessment page with end-to-end flow: intro → 8 questions → email gate → results + email delivery.
</objective>

<execution_context>
@C:/Users/HP_PC/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/HP_PC/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/01-critical-path/01-CONTEXT.md
@.planning/phases/01-critical-path/01-RESEARCH.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install assessment dependencies and build data/logic layer</name>
  <files>
    package.json
    src/lib/assessment.ts
    src/lib/validation.ts
    src/lib/pdf.ts
    src/lib/email.ts
    src/emails/AssessmentReport.tsx
    .env.local
  </files>
  <action>
    **Install dependencies:**
    ```bash
    npm install resend react-email pdfkit @types/pdfkit
    ```
    Note: react-hook-form, zod, @hookform/resolvers may already be installed by Plan 1A. Run install regardless — npm will skip already-installed packages.

    **Create `.env.local`** (if it doesn't exist) with placeholders:
    ```
    RESEND_API_KEY=re_placeholder_replace_me
    ```
    Do NOT commit .env.local — verify .gitignore includes it.

    **Create `src/lib/assessment.ts`:**
    Define the full question dataset and scoring logic.

    ```typescript
    export type Role = "Founder" | "CTO" | "Operations Manager" | "Other";

    export interface Question {
      id: number;
      text: string;
      type: "single-select";
      options: string[];
      weight: number; // 0 for routing question, 12.5 for scored questions (8 questions × 12.5 = 100)
      roleSpecific?: Partial<Record<Role, string[]>>;
    }

    export const assessmentQuestions: Question[] = [
      {
        id: 1,
        text: "What best describes your role?",
        type: "single-select",
        options: ["Founder", "CTO", "Operations Manager", "Other"],
        weight: 0, // routing question — not scored
      },
      {
        id: 2,
        text: "Which activity consumes most of your manual time each week?",
        type: "single-select",
        options: ["Data entry", "Document processing", "Communications", "Reporting", "Scheduling"],
        weight: 12.5,
        roleSpecific: {
          "Founder": ["Hiring and onboarding", "Customer acquisition follow-up", "Strategic planning sessions", "Admin and operations"],
          "CTO": ["Architecture and design reviews", "Team management and 1:1s", "Tech debt triage", "Vendor and tooling decisions"],
          "Operations Manager": ["Data entry and reconciliation", "Status report generation", "Email and communication triage", "Scheduling and coordination"],
          "Other": ["Data entry", "Document processing", "Reporting", "Email and communication triage"],
        },
      },
      {
        id: 3,
        text: "How often do you personally handle a task that could be automated?",
        type: "single-select",
        options: ["Multiple times a day", "Once a day", "A few times a week", "Rarely"],
        weight: 12.5,
      },
      {
        id: 4,
        text: "How many tools does your team use daily that don't talk to each other?",
        type: "single-select",
        options: ["5 or more", "3–4", "1–2", "They're mostly integrated"],
        weight: 12.5,
      },
      {
        id: 5,
        text: "When a task needs doing, who typically does it?",
        type: "single-select",
        options: ["Me personally", "A team member I delegate to", "A documented process", "An automated system"],
        weight: 12.5,
        roleSpecific: {
          "Founder": ["Me — I'm the only one who can", "A trusted team member", "We have a documented process", "An automated workflow handles it"],
          "CTO": ["Me — it's faster than explaining", "I delegate to an engineer", "We have a documented runbook", "Automated CI/CD or tooling"],
          "Operations Manager": ["Me — it falls to ops", "A team member with a checklist", "A documented SOP", "An automated process"],
          "Other": ["Me personally", "A team member I delegate to", "A documented process", "An automated system"],
        },
      },
      {
        id: 6,
        text: "How confident are you that your team could run operations for a week without you?",
        type: "single-select",
        options: ["Not at all confident", "Slightly confident", "Fairly confident", "Very confident"],
        weight: 12.5,
      },
      {
        id: 7,
        text: "What happens to your business when you take a week off?",
        type: "single-select",
        options: ["It effectively stops", "It slows significantly", "It runs but I get constant messages", "It runs smoothly"],
        weight: 12.5,
      },
      {
        id: 8,
        text: "How clearly defined is your process for onboarding a new client?",
        type: "single-select",
        options: ["It's in my head", "Loosely documented", "Documented but inconsistent", "Fully systematized"],
        weight: 12.5,
      },
    ];

    // Answer index maps to score position within weight
    // Index 0 = lowest score, last index = highest score
    export function calculateScore(answers: Record<number, string>): number {
      let total = 0;
      assessmentQuestions.forEach((q) => {
        if (q.weight === 0) return;
        const answer = answers[q.id];
        if (!answer) return;
        const options = getQuestionOptions(q.id, (answers[1] as Role) || "Other");
        const idx = options.indexOf(answer);
        if (idx === -1) return;
        const answerScore = (idx / Math.max(options.length - 1, 1)) * q.weight;
        total += answerScore;
      });
      return Math.round(Math.min(total, 100));
    }

    export function getTierName(score: number): string {
      if (score < 30) return "Early Stage — Systems Needed";
      if (score < 60) return "Pre-Deployment Ready";
      if (score < 80) return "Deployment Ready";
      return "Advanced Optimization Ready";
    }

    export function getTierDescription(score: number): string {
      if (score < 30) return "You're running everything manually. AI systems could reclaim 10–20 hours per week and remove you as the bottleneck.";
      if (score < 60) return "You have some structure, but key processes still depend on you. Targeted automation could cut manual effort by 40–60%.";
      if (score < 80) return "Your systems are working, but there are clear opportunities to automate further and scale without adding headcount.";
      return "You're well-systematized. AI optimization can drive compounding efficiency gains and unlock growth without proportional cost.";
    }

    export function getPreviewBullets(score: number): string[] {
      if (score < 30) {
        return [
          "Automate client onboarding — eliminate 5+ manual touchpoints",
          "Build a reporting pipeline so data flows without you",
          "Document and systematize your top 3 recurring tasks",
        ];
      }
      if (score < 60) {
        return [
          "Connect your tool stack — eliminate copy-paste between platforms",
          "Automate your most frequent delegation loop",
          "Create a self-serve client portal to reduce inbound questions",
        ];
      }
      if (score < 80) {
        return [
          "Layer AI decision support on top of your existing workflows",
          "Automate exception handling so the team escalates less",
          "Build monitoring dashboards so issues surface without you",
        ];
      }
      return [
        "Explore AI agents for complex multi-step workflows",
        "Optimize your automation stack for reliability and cost",
        "Instrument your systems for continuous improvement",
      ];
    }

    export function getQuestionOptions(questionId: number, role: Role): string[] {
      const q = assessmentQuestions.find((q) => q.id === questionId);
      if (!q) return [];
      if (q.roleSpecific && q.roleSpecific[role]) {
        return q.roleSpecific[role]!;
      }
      return q.options;
    }
    ```

    **Create `src/lib/validation.ts`:**
    ```typescript
    import { z } from "zod";

    export const emailGateSchema = z.object({
      firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
      email: z.string().email("Invalid email address").min(5).max(255),
    });

    export type EmailGateInput = z.infer<typeof emailGateSchema>;
    ```

    **Create `src/lib/pdf.ts`:**
    Server-side PDF generation using PDFKit. Keep under 3 pages to avoid serverless timeout.
    ```typescript
    import PDFDocument from "pdfkit";

    export async function generateAssessmentPDF(
      firstName: string,
      score: number,
      tier: string,
      tierDescription: string,
      previewBullets: string[]
    ): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const chunks: Buffer[] = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Page 1: Score and tier
        doc.fontSize(24).font("Helvetica-Bold").text("AI Readiness Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).font("Helvetica").text(`Prepared for: ${firstName}`, { align: "center" });
        doc.moveDown(2);
        doc.fontSize(48).font("Helvetica-Bold").text(`${score}/100`, { align: "center" });
        doc.fontSize(18).font("Helvetica").text(tier, { align: "center" });
        doc.moveDown(2);
        doc.fontSize(12).font("Helvetica").text(tierDescription, { align: "left" });
        doc.moveDown(2);

        // Top opportunities
        doc.fontSize(16).font("Helvetica-Bold").text("Your Top Opportunities");
        doc.moveDown();
        previewBullets.forEach((bullet) => {
          doc.fontSize(12).font("Helvetica").text(`• ${bullet}`);
          doc.moveDown(0.5);
        });

        doc.moveDown(2);
        doc.fontSize(10).font("Helvetica").fillColor("gray")
          .text("asorahura.com | Scale Your Business Without Scaling Your Payroll", { align: "center" });

        doc.end();
      });
    }
    ```

    **Create `src/lib/email.ts`:**
    ```typescript
    import { Resend } from "resend";
    import { AssessmentReport } from "@/emails/AssessmentReport";

    const resend = new Resend(process.env.RESEND_API_KEY);

    export async function sendAssessmentEmail(params: {
      email: string;
      firstName: string;
      score: number;
      tier: string;
      tierDescription: string;
      previewBullets: string[];
      pdfBuffer: Buffer;
    }): Promise<{ success: boolean; error?: string }> {
      const { error } = await resend.emails.send({
        from: "Asor Ahura <hello@asorahura.com>",
        to: params.email,
        subject: `Your AI Readiness Report — ${params.score}/100 ${params.tier}`,
        react: AssessmentReport({
          firstName: params.firstName,
          score: params.score,
          tier: params.tier,
          tierDescription: params.tierDescription,
          previewBullets: params.previewBullets,
        }),
        attachments: [
          {
            filename: "AI_Readiness_Report.pdf",
            content: params.pdfBuffer,
          },
        ],
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    ```

    **Create `src/emails/AssessmentReport.tsx`:**
    ```tsx
    import {
      Html, Body, Container, Heading, Text, Button, Section, Hr
    } from "@react-email/components";

    interface Props {
      firstName: string;
      score: number;
      tier: string;
      tierDescription: string;
      previewBullets: string[];
    }

    export function AssessmentReport({ firstName, score, tier, tierDescription, previewBullets }: Props) {
      return (
        <Html>
          <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9fafb", padding: "20px" }}>
            <Container style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px", maxWidth: "600px" }}>
              <Heading style={{ fontSize: "24px", color: "#111" }}>
                Your AI Readiness Report is here, {firstName}
              </Heading>
              <Section style={{ textAlign: "center", padding: "24px 0" }}>
                <Text style={{ fontSize: "48px", fontWeight: "bold", color: "#111", margin: 0 }}>
                  {score}/100
                </Text>
                <Text style={{ fontSize: "18px", color: "#6b7280", margin: 0 }}>{tier}</Text>
              </Section>
              <Text style={{ fontSize: "15px", color: "#374151", lineHeight: "1.6" }}>
                {tierDescription}
              </Text>
              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
              <Heading as="h2" style={{ fontSize: "18px", color: "#111" }}>Your Top Opportunities</Heading>
              {previewBullets.map((bullet, i) => (
                <Text key={i} style={{ fontSize: "14px", color: "#374151" }}>• {bullet}</Text>
              ))}
              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
              <Text style={{ fontSize: "14px", color: "#6b7280" }}>
                Your full PDF report is attached. It includes a detailed breakdown of your score and a personalized roadmap.
              </Text>
              <Button
                href="https://calendly.com/asorahura"
                style={{ backgroundColor: "#111", color: "#fff", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", textDecoration: "none" }}
              >
                Book a Discovery Call
              </Button>
            </Container>
          </Body>
        </Html>
      );
    }

    export default AssessmentReport;
    ```
  </action>
  <verify>
    Run `npx tsc --noEmit` — no TypeScript errors across all new lib files and email template.
    Verify .env.local exists and includes RESEND_API_KEY placeholder.
    Verify .gitignore includes `.env.local` (check existing .gitignore).
  </verify>
  <done>
    All lib files created with no TypeScript errors. calculateScore() returns a number between 0-100. getTierName() returns one of four tier strings. generateAssessmentPDF() returns a Buffer. email template compiles without errors.
  </done>
</task>

<task type="auto">
  <name>Task 2: Build Server Action and assessment UI components</name>
  <files>
    src/app/assessment/actions.ts
    src/components/assessment/ProgressBar.tsx
    src/components/assessment/QuestionCard.tsx
    src/components/assessment/EmailGate.tsx
    src/components/assessment/ResultsScreen.tsx
    src/components/assessment/AssessmentShell.tsx
    src/app/assessment/page.tsx
  </files>
  <action>
    **Place the full 20-question scorecard PDF in `/public`:**
    The full 20-question scorecard is a separate static document from the personalized 8-question results PDF (which is generated server-side per user). Place the pre-built file at `public/ai-readiness-scorecard.pdf` — Next.js will serve it as `/ai-readiness-scorecard.pdf`, which the `ResultsScreen` download link targets.

    If the PDF does not yet exist, create a placeholder: use PDFKit inline (or any PDF tool) to generate a minimal 1-page PDF titled "AI Readiness Scorecard — Full 20-Question Assessment" with a note "Full scorecard coming soon" and save it at `public/ai-readiness-scorecard.pdf`. The placeholder ensures the download link works immediately rather than 404-ing. The real 20-question document can replace it in a later phase.

    **Create `src/app/assessment/actions.ts`:**
    ```typescript
    "use server";

    import { emailGateSchema } from "@/lib/validation";
    import { generateAssessmentPDF } from "@/lib/pdf";
    import { sendAssessmentEmail } from "@/lib/email";
    import { calculateScore, getTierName, getTierDescription, getPreviewBullets } from "@/lib/assessment";

    export async function submitAssessmentForEmail(
      firstName: string,
      email: string,
      answers: Record<number, string>
    ): Promise<{ success: boolean; score?: number; tier?: string; error?: string }> {
      // Validate email gate inputs server-side
      const parsed = emailGateSchema.safeParse({ firstName, email });
      if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
      }

      const score = calculateScore(answers);
      const tier = getTierName(score);
      const tierDescription = getTierDescription(score);
      const previewBullets = getPreviewBullets(score);

      // Generate PDF
      let pdfBuffer: Buffer;
      try {
        pdfBuffer = await generateAssessmentPDF(firstName, score, tier, tierDescription, previewBullets);
      } catch (err) {
        console.error("PDF generation failed:", err);
        return { success: false, error: "Failed to generate report. Please try again." };
      }

      // Send email
      const result = await sendAssessmentEmail({
        email,
        firstName,
        score,
        tier,
        tierDescription,
        previewBullets,
        pdfBuffer,
      });

      if (!result.success) {
        return { success: false, error: result.error || "Email delivery failed" };
      }

      return { success: true, score, tier };
    }
    ```

    **Create `src/components/assessment/ProgressBar.tsx`:**
    ```tsx
    export function ProgressBar({ current, total }: { current: number; total: number }) {
      const pct = Math.round((current / total) * 100);
      return (
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Question {current} of {total}</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    }
    ```

    **Create `src/components/assessment/QuestionCard.tsx`:**
    ```tsx
    "use client";

    interface Props {
      question: { id: number; text: string };
      options: string[];
      selectedAnswer?: string;
      onAnswer: (answer: string) => void;
    }

    export function QuestionCard({ question, options, selectedAnswer, onAnswer }: Props) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">{question.text}</h2>
          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onAnswer(option)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === option
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 hover:border-gray-400 text-gray-800"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }
    ```

    **Create `src/components/assessment/EmailGate.tsx`:**
    ```tsx
    "use client";

    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { emailGateSchema, type EmailGateInput } from "@/lib/validation";

    interface Props {
      onSubmit: (data: EmailGateInput) => Promise<void>;
      isLoading: boolean;
      error?: string;
    }

    export function EmailGate({ onSubmit, isLoading, error }: Props) {
      const { register, handleSubmit, formState: { errors } } = useForm<EmailGateInput>({
        resolver: zodResolver(emailGateSchema),
      });

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">You're done — see your results</h2>
            <p className="text-gray-600 mt-2">
              Enter your details below to unlock your personalized score. We'll also send your full report to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("firstName")}
                placeholder="First name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
            >
              {isLoading ? "Sending your report..." : "Access My Results"}
            </button>
          </form>
          <p className="text-xs text-gray-400">No spam. Unsubscribe any time.</p>
        </div>
      );
    }
    ```

    **Create `src/components/assessment/ResultsScreen.tsx`:**
    ```tsx
    import { getTierDescription, getPreviewBullets } from "@/lib/assessment";

    // LOCKED DECISION (CONTEXT.md): "results page offers downloadable full 20-question scorecard PDF"
    // The full scorecard PDF is a PRE-BUILT static file at /public/ai-readiness-scorecard.pdf
    // (separate from the personalized 8-question results PDF emailed server-side).
    // It is served by Next.js as /ai-readiness-scorecard.pdf — no API route needed.

    interface Props {
      score: number;
      tier: string;
      firstName: string;
    }

    export function ResultsScreen({ score, tier, firstName }: Props) {
      const description = getTierDescription(score);
      const bullets = getPreviewBullets(score);

      return (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-gray-500">Your AI Readiness Score</p>
            <div className="text-7xl font-bold text-gray-900">{score}/100</div>
            <div className="text-xl font-semibold text-gray-700">{tier}</div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Your Top Opportunities</h3>
            <ul className="space-y-2">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2 text-gray-700">
                  <span className="text-gray-400 shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6 space-y-4">
            {/* Email delivery confirmation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-800">Your Full Report Is On Its Way</p>
              <p className="text-green-700 text-sm mt-1">
                Check your inbox — your personalized PDF report with full breakdown and next steps has been sent.
              </p>
            </div>

            {/* Full 20-question scorecard download — LOCKED DECISION */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">Want the complete 20-question breakdown?</p>
                <p className="text-gray-600 text-sm mt-0.5">
                  Download the full AI Readiness Scorecard — all 20 questions with scoring guidance.
                </p>
              </div>
              <a
                href="/ai-readiness-scorecard.pdf"
                download="AI_Readiness_Scorecard.pdf"
                className="shrink-0 inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors text-center"
              >
                Download Full PDF
              </a>
            </div>

            {/* Discovery Call CTA */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Want to talk through your results?</p>
              <a
                href="https://calendly.com/asorahura"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
              >
                Book a Discovery Call
              </a>
            </div>
          </div>
        </div>
      );
    }
    ```

    **Create `src/components/assessment/AssessmentShell.tsx`:**
    This is the orchestrator client component. It manages all assessment state.
    ```tsx
    "use client";

    import { useState, useEffect } from "react";
    import { QuestionCard } from "./QuestionCard";
    import { ProgressBar } from "./ProgressBar";
    import { EmailGate } from "./EmailGate";
    import { ResultsScreen } from "./ResultsScreen";
    import { assessmentQuestions, getQuestionOptions, type Role } from "@/lib/assessment";
    import { submitAssessmentForEmail } from "@/app/assessment/actions";
    import type { EmailGateInput } from "@/lib/validation";

    type Step = "intro" | "questions" | "email-gate" | "results";

    const STORAGE_KEY = "asor_assessment_answers";
    const SCORED_QUESTIONS = assessmentQuestions.filter((q) => q.weight > 0);
    const TOTAL_QUESTIONS = SCORED_QUESTIONS.length + 1; // +1 for role question

    export function AssessmentShell() {
      const [step, setStep] = useState<Step>("intro");
      const [currentQ, setCurrentQ] = useState(0); // index into assessmentQuestions
      const [answers, setAnswers] = useState<Record<number, string>>({});
      const [result, setResult] = useState<{ score: number; tier: string; firstName: string } | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [emailError, setEmailError] = useState<string | undefined>();

      // Restore from localStorage on mount
      useEffect(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.answers && parsed.step === "questions") {
              setAnswers(parsed.answers);
              setCurrentQ(parsed.currentQ ?? 0);
              setStep("questions");
            }
          }
        } catch {}
      }, []);

      // Persist to localStorage on answer change
      useEffect(() => {
        if (step === "questions") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentQ, step }));
        }
      }, [answers, currentQ, step]);

      function handleAnswer(answer: string) {
        const q = assessmentQuestions[currentQ];
        const newAnswers = { ...answers, [q.id]: answer };
        setAnswers(newAnswers);

        if (currentQ < assessmentQuestions.length - 1) {
          setCurrentQ(currentQ + 1);
        } else {
          // All questions done — show email gate
          setStep("email-gate");
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      async function handleEmailSubmit(data: EmailGateInput) {
        setIsLoading(true);
        setEmailError(undefined);
        const res = await submitAssessmentForEmail(data.firstName, data.email, answers);
        setIsLoading(false);

        if (!res.success) {
          setEmailError(res.error || "Something went wrong. Please try again.");
          return;
        }

        setResult({ score: res.score!, tier: res.tier!, firstName: data.firstName });
        setStep("results");
      }

      const q = assessmentQuestions[currentQ];
      const role = (answers[1] as Role) || "Other";
      const displayQuestionNumber = currentQ + 1; // 1-based for display

      if (step === "intro") {
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Ready to find your score?</h2>
            <p className="text-gray-600 text-lg">8 questions · takes about 4 minutes · personalized score at the end</p>
            <button
              onClick={() => setStep("questions")}
              className="bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        );
      }

      if (step === "questions") {
        return (
          <div className="space-y-8">
            <ProgressBar current={displayQuestionNumber} total={assessmentQuestions.length} />
            <QuestionCard
              question={q}
              options={getQuestionOptions(q.id, role)}
              selectedAnswer={answers[q.id]}
              onAnswer={handleAnswer}
            />
          </div>
        );
      }

      if (step === "email-gate") {
        return (
          <EmailGate
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
            error={emailError}
          />
        );
      }

      if (step === "results" && result) {
        return (
          <ResultsScreen score={result.score} tier={result.tier} firstName={result.firstName} />
        );
      }

      return null;
    }
    ```

    **Create `src/app/assessment/page.tsx`:**
    ```tsx
    import { AssessmentShell } from "@/components/assessment/AssessmentShell";

    export const metadata = {
      title: "AI Readiness Assessment | Asor Ahura",
      description: "Answer 8 questions and get a personalized AI readiness score — free, takes 4 minutes.",
    };

    export default function AssessmentPage() {
      return (
        <main className="min-h-screen bg-white">
          {/* Entry hero — ASSESS-01, ASSESS-02, ASSESS-03 */}
          <section className="bg-gray-950 text-white py-16 px-4">
            <div className="container mx-auto max-w-2xl text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Find Out Exactly Where AI Can Save Your Business 10+ Hours a Week
              </h1>
              <p className="text-gray-300 text-lg">
                Answer 8 questions. Get a personalized AI readiness score and a report showing your highest-impact opportunities.
              </p>
              {/* ASSESS-03: micro-trust signals */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 pt-2">
                {["Free", "Takes 4 Minutes", "Instant Results", "No Sales Call"].map((t) => (
                  <span key={t} className="border border-gray-700 rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Assessment shell — handles all question/gate/results state */}
          <section className="container mx-auto max-w-2xl px-4 py-16">
            <AssessmentShell />
          </section>
        </main>
      );
    }
    ```
  </action>
  <verify>
    Run `npx tsc --noEmit` — no TypeScript errors.
    Verify `public/ai-readiness-scorecard.pdf` exists (placeholder or real file).
    Run `npm run dev`, visit http://localhost:3000/assessment:
    - Entry hero visible with H1 "Find Out Exactly Where AI Can Save..."
    - 4 micro-trust badges visible (Free, Takes 4 Minutes, Instant Results, No Sales Call)
    - "Start Assessment" button appears in shell
    - Click Start — Q1 appears with role options
    - Select "Founder" — Q2 appears with Founder-specific options
    - Progress bar advances through all 8 questions
    - After Q8 — email gate appears (no results yet)
    - Fill First Name + Email → click "Access My Results"
    - (Email may fail if RESEND_API_KEY not set — that's acceptable in dev; results should still appear after server action returns)
    - Results screen shows score (0-100), tier name, preview bullets, "Your Full Report Is On Its Way" green banner
    - Results screen shows "Want the complete 20-question breakdown?" section with "Download Full PDF" button
    - Click "Download Full PDF" — browser downloads `AI_Readiness_Scorecard.pdf` (or navigates to /ai-readiness-scorecard.pdf) — no 404
    - Confirm "Book a Discovery Call" button links to Calendly
    - Refresh during questions → answers restored from localStorage
    - Verify http://localhost:3000/ai-readiness-scorecard.pdf resolves (200, not 404)
  </verify>
  <done>
    End-to-end assessment flow works: 8 questions with role branching → email gate → results screen. Server Action calls Resend (may fail without real API key in dev — that's acceptable). Results display score, tier, bullets, "Your Full Report Is On Its Way" banner, "Download Full PDF" button linking to /ai-readiness-scorecard.pdf (no 404), and Calendly CTA. localStorage restores partial completion on refresh.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Verify: Assessment end-to-end flow</name>
  <files>src/app/assessment/page.tsx</files>
  <action>No automated action — this is a human functional verification step after all auto tasks complete.</action>
  <verify>Human confirms full assessment flow works end-to-end per the how-to-verify checklist below</verify>
  <done>User types "assessment approved" — all 8 questions work with role branching, email gate blocks results, score displays after submission</done>
  <what-built>Complete /assessment page with 8-question role-branching assessment, email gate, results screen, PDF generation, and Resend email delivery.</what-built>
  <how-to-verify>
    1. Visit http://localhost:3000/assessment
    2. Confirm: Hero section shows "Find Out Exactly Where AI Can Save..." heading
    3. Confirm: 4 micro-trust badges visible (Free, Takes 4 Minutes, Instant Results, No Sales Call)
    4. Click "Start Assessment" — confirm Q1 appears with progress bar "1 of 8"
    5. Select "Founder" — confirm Q2 shows Founder-specific options (not generic)
    6. Complete all 8 questions — confirm progress bar reaches 8 of 8 before email gate
    7. Confirm email gate appears BEFORE any score is shown
    8. Fill in a name and email — click "Access My Results"
    9. Confirm results appear: score number, tier name, 3 preview bullets
    10. Confirm "Your Full Report Is On Its Way" green banner visible
    11. Confirm "Want the complete 20-question breakdown?" section visible with "Download Full PDF" button
    12. Click "Download Full PDF" — confirm browser downloads the file (no 404 or broken link)
    13. Confirm "Book a Discovery Call" button visible (links to Calendly)
    14. Test localStorage: refresh browser at Q4 — confirm assessment resumes from Q4
    15. (Optional) If RESEND_API_KEY is set: check the email inbox for the PDF attachment
  </how-to-verify>
  <resume-signal>Type "assessment approved" or describe any issues to fix</resume-signal>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes with zero errors
- `npm run build` completes without errors
- All 10 requirement IDs (ASSESS-01 through ASSESS-10) have corresponding implementation
- submitAssessmentForEmail is a Server Action (has "use server" directive)
- Email gate appears BEFORE results (not after)
- localStorage save/restore implemented in AssessmentShell
- assessmentQuestions array has exactly 8 entries
- calculateScore() normalizes to 0-100
- getQuestionOptions() returns role-specific options for Q2, Q5 at minimum
</verification>

<success_criteria>
- /assessment page renders without errors
- All 8 questions display sequentially with role-based branching on Q2 and Q5
- Progress bar shows current/total correctly
- Email gate blocks results until name + email submitted
- Results screen shows score, tier, preview bullets, "Download Full PDF" button (links to /ai-readiness-scorecard.pdf, no 404), and two CTAs
- Server Action validates input, generates PDF buffer, calls Resend
- localStorage restores partial assessment on page reload
- Zero TypeScript errors
</success_criteria>

<output>
After completion, create `.planning/phases/01-critical-path/01-1b-SUMMARY.md` documenting:
- All files created and their roles
- Question copy used for Q1-Q8 (exact text for future reference)
- Tier thresholds and names (0-29, 30-59, 60-79, 80-100)
- Any deviations from the plan and why
- Verification results (did Resend deliver? did PDF generate?)
</output>
