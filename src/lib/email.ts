import { Resend } from "resend";
import { draftEmailSequence, draftNurtureEmailSequence, generatePDFContent } from "@/lib/llm";
import { generateAssessmentPDF } from "@/lib/pdf";
import { getSegment, DEFAULT_SECTOR, type Sector } from "@/lib/assessment";
export { CALENDLY_URL } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Asor Ahura <hello@asorahura.com>";
const RESOURCES_FROM = "Asor Ahura <resources@asorahura.com>";
const BUILD_MAP_DOWNLOAD_URL = "https://drive.google.com/file/d/1jDFFWWg2JsEy9vlRtMVwkdeLggqStcOZ/view?usp=drive_link";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://asorahura.vercel.app';

function unsubscribeFooter(email: string) {
  return `\n\n---\nTo stop receiving emails: ${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
}

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
    subject ?? `Your AI Readiness Report: ${score}/100`;

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
            email,
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

export async function sendBuildMapEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const text =
    `Your Build Map is ready. Download it here: ${BUILD_MAP_DOWNLOAD_URL}` +
    unsubscribeFooter(email);

  const { error } = await resend.emails.send({
    from: RESOURCES_FROM,
    to: email,
    subject: "Your Build Map is ready",
    text,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function sendPurchaseConfirmationEmail(params: {
  email: string;
  firstName?: string;
  productType: "dfy" | "dwy" | "care-plan";
  transactionId: string;
  amount: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { PurchaseConfirmation } = await import("@/emails/PurchaseConfirmation");

    const { error } = await resend.emails.send({
      from: FROM,
      to: params.email,
      subject: "Order confirmed",
      react: PurchaseConfirmation({ ...params }),
    });

    if (error) {
      console.error("[email] sendPurchaseConfirmationEmail failed:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("[email] sendPurchaseConfirmationEmail threw:", err);
    return { success: false, error: err instanceof Error ? err.message : "unknown error" };
  }
}

export async function sendOrderNotificationEmail(params: {
  productType: "dfy" | "dwy" | "care-plan";
  transactionId: string;
  amount: string;
  buyerEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { OrderNotification } = await import("@/emails/OrderNotification");

    const { error } = await resend.emails.send({
      from: FROM,
      to: process.env.OWNER_EMAIL ?? "hello@asorahura.com",
      subject: `New Order: ${params.productType} from ${params.buyerEmail}`,
      react: OrderNotification({ ...params }),
    });

    if (error) {
      console.error("[email] sendOrderNotificationEmail failed:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("[email] sendOrderNotificationEmail threw:", err);
    return { success: false, error: err instanceof Error ? err.message : "unknown error" };
  }
}

export async function sendOnboardingNotification(params: {
  product: "dfy" | "dwy";
  igHandle: string;
  keyword: string;
  leadMagnetLink: string;
  voiceTone: string;
}): Promise<{ success: boolean; error?: string }> {
  const { product, igHandle, keyword, leadMagnetLink, voiceTone } = params;

  const text = [
    `New ${product.toUpperCase()} onboarding submission`,
    `Instagram handle: ${igHandle}`,
    `Keyword: ${keyword}`,
    `Lead magnet link: ${leadMagnetLink}`,
    `Voice/tone notes: ${voiceTone}`,
  ].join("\n");

  const { error } = await resend.emails.send({
    from: FROM,
    to: process.env.OWNER_EMAIL ?? "hello@asorahura.com",
    subject: `New ${product.toUpperCase()} onboarding: ${igHandle}`,
    text,
  });

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
  sector?: Sector;
}): Promise<void> {
  const { email, firstName, score, tier, tierDescription, previewBullets, answers } = params;
  const sector = params.sector ?? DEFAULT_SECTOR;
  // sector is also visible to the LLM via formatAnswers (Q1 = "Sector: <sector>"); kept here
  // as an explicit param so future template branching can use it without touching callers.
  void sector;

  const segment = getSegment(score);

  // Run all LLM calls in parallel, they're independent
  const [pdfContent, sequence, nurture] = await Promise.all([
    generatePDFContent({ firstName, answers, score, tier, segment }).catch((err) => {
      console.error("[email] PDF content generation failed:", err);
      return null;
    }),
    draftEmailSequence({ firstName, email, score, segment, tier, tierDescription, previewBullets, answers }).catch((err) => {
      console.error("[email] LLM sequence drafting failed:", err);
      return undefined;
    }),
    draftNurtureEmailSequence({ firstName, score, segment, answers }).catch((err) => {
      console.error("[email] LLM nurture sequence drafting failed:", err);
      return undefined;
    }),
  ]);

  let pdf: Buffer | undefined;
  try {
    pdf = await generateAssessmentPDF({
      firstName,
      score,
      tier,
      tierDescription,
      segment,
      previewBullets: pdfContent?.opportunities ?? previewBullets,
      answers,
      personalizedNextStep: pdfContent?.nextStep,
    });
  } catch (err) {
    console.error("[email] PDF generation failed:", err);
  }

  // Initial email, immediate, with PDF attached
  try {
    const initialBody =
      (sequence?.initial.body ?? `Hey ${firstName}, your score is ${score}/100.`) +
      `\n\nSee your purchase options: ${BASE_URL}/checkout` +
      unsubscribeFooter(email);
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject:
        sequence?.initial.subject ??
        `Your AI Readiness Report: ${score}/100`,
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

  // Day 3, Problem deepening
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: nurture?.day3.subject ?? "The cost of doing this manually",
      text: (nurture?.day3.body ?? `Hey ${firstName}, following up on your AI Opportunity Discovery.`) + unsubscribeFooter(email),
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (error) console.error("[email] Day 3 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 3 send threw:", err);
  }

  // Day 7, Case study with /blog link
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: nurture?.day7.subject ?? "A project you might find relevant",
      text: (nurture?.day7.body ?? `Hey ${firstName}, here's a relevant case study from our blog.`) + unsubscribeFooter(email),
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (error) console.error("[email] Day 7 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 7 send threw:", err);
  }

  // Day 14, Process reveal
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: nurture?.day14.subject ?? "What working with me actually looks like",
      text: (nurture?.day14.body ?? `Hey ${firstName}, here's what a typical engagement looks like.`) + unsubscribeFooter(email),
      scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (error) console.error("[email] Day 14 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 14 send threw:", err);
  }

  // Day 30, Offer with segment CTA
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: nurture?.day30.subject ?? "Still thinking about this?",
      text: (nurture?.day30.body ?? `Hey ${firstName}, a month ago you completed the AI Opportunity Discovery.`) + unsubscribeFooter(email),
      scheduledAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (error) console.error("[email] Day 30 send failed:", error.message);
  } catch (err) {
    console.error("[email] Day 30 send threw:", err);
  }
}
