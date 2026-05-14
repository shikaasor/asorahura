"use server";

import { emailGateSchema } from "@/lib/validation";
import { generateAssessmentPDF } from "@/lib/pdf";
import { sendAssessmentEmail } from "@/lib/email";
import {
  calculateScore,
  getTierName,
  getTierDescription,
  getPreviewBullets,
} from "@/lib/assessment";

export async function submitAssessmentForEmail(
  firstName: string,
  email: string,
  answers: Record<number, string>
): Promise<{ success: boolean; score?: number; tier?: string; error?: string }> {
  // Validate email gate inputs server-side
  const parsed = emailGateSchema.safeParse({ firstName, email });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const score = calculateScore(answers);
  const tier = getTierName(score);
  const tierDescription = getTierDescription(score);
  const previewBullets = getPreviewBullets(score);

  // Generate PDF
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateAssessmentPDF(
      firstName,
      score,
      tier,
      tierDescription,
      previewBullets
    );
  } catch (err) {
    console.error("PDF generation failed:", err);
    return { success: false, error: "Failed to generate report. Please try again." };
  }

  // Send email (non-blocking failure — still return score)
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
    console.error("Email delivery failed:", result.error);
    // Return success with score even if email fails (dev mode without real API key)
    return { success: true, score, tier };
  }

  return { success: true, score, tier };
}
