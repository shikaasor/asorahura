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
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
