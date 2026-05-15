import { Resend } from "resend";
import { draftEmailSequence } from "@/lib/llm";
import { generateAssessmentPDF } from "@/lib/pdf";
import { getSegment } from "@/lib/assessment";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Asor Ahura <hello@asorahura.com>";
const CALENDLY_URL = "https://calendly.com/asorahura";

export async function sendAssessmentEmail(params: {
  email: string;
  firstName: string;
  score: number;
  tier: string;
  tierDescription: string;
  previewBullets: string[];
  pdf?: Buffer;
  subject?: string;
  body?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { email, firstName, score, tier, tierDescription, previewBullets, pdf, subject, body } =
    params;

  const resolvedSubject =
    subject ?? `Your AI Readiness Report — Score: ${score}/100`;

  const sendParams: Parameters<typeof resend.emails.send>[0] = {
    from: FROM,
    to: email,
    subject: resolvedSubject,
    ...(body
      ? { text: body }
      : {
          react: (
            await import("@/emails/AssessmentReport")
          ).AssessmentReport({
            firstName,
            score,
            tier,
            tierDescription,
            previewBullets,
          }),
        }),
    ...(pdf
      ? {
          attachments: [
            { filename: "AI-Readiness-Report.pdf", content: pdf },
          ],
        }
      : {}),
  };

  const { error } = await resend.emails.send(sendParams);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function sendAssessmentEmailSequence(params: {
  email: string;
  firstName: string;
  score: number;
  tier: string;
  tierDescription: string;
  previewBullets: string[];
  answers: Record<number, string>;
}): Promise<void> {
  const { email, firstName, score, tier, tierDescription, previewBullets, answers } = params;

  const segment = getSegment(score);

  let pdf: Buffer | undefined;
  try {
    pdf = await generateAssessmentPDF({
      firstName,
      score,
      tier,
      tierDescription,
      segment,
      previewBullets,
      answers,
    });
  } catch (err) {
    console.error("[email] PDF generation failed:", err);
  }

  let sequence: Awaited<ReturnType<typeof draftEmailSequence>> | undefined;
  try {
    sequence = await draftEmailSequence({
      firstName,
      email,
      score,
      segment,
      tier,
      tierDescription,
      previewBullets,
    });
  } catch (err) {
    console.error("[email] LLM sequence drafting failed:", err);
  }

  // Initial email — immediate, with PDF attached
  try {
    const initialBody =
      (sequence?.initial.body ?? `Hey ${firstName}, your score is ${score}/100.`) +
      `\n\nBook a call: ${CALENDLY_URL}`;
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject:
        sequence?.initial.subject ??
        `Your AI Readiness Report — Score: ${score}/100`,
      text: initialBody,
      ...(pdf
        ? {
            attachments: [
              { filename: "AI-Readiness-Report.pdf", content: pdf },
            ],
          }
        : {}),
    });
    if (error) console.error("[email] Initial send failed:", error.message);
  } catch (err) {
    console.error("[email] Initial send threw:", err);
  }

  // Day 3 follow-up
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: sequence?.day3.subject ?? "Quick check-in on your AI report",
      text:
        sequence?.day3.body ??
        `Hey ${firstName}, just checking in on your AI Readiness Report.`,
      scheduledAt: "in 3 days",
    });
    if (error) console.error("[email] Day 3 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 3 send threw:", err);
  }

  // Day 7 follow-up
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: sequence?.day7.subject ?? "AI insights for your business",
      text:
        sequence?.day7.body ??
        `Hey ${firstName}, a quick follow-up from Asor.`,
      scheduledAt: "in 7 days",
    });
    if (error) console.error("[email] Day 7 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 7 send threw:", err);
  }

  // Day 14 follow-up
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: sequence?.day14.subject ?? "Still thinking about AI automation?",
      text:
        sequence?.day14.body ??
        `Hey ${firstName}, just wanted to check in.`,
      scheduledAt: "in 14 days",
    });
    if (error) console.error("[email] Day 14 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 14 send threw:", err);
  }

  // Day 30 follow-up
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: sequence?.day30.subject ?? "One last thought on AI readiness",
      text:
        sequence?.day30.body ??
        `Hey ${firstName}, a month ago you scored ${score}/100 on the AI Readiness Assessment.`,
      scheduledAt: "in 30 days",
    });
    if (error) console.error("[email] Day 30 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 30 send threw:", err);
  }
}
