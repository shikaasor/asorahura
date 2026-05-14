"use server";

import { emailGateSchema } from "@/lib/validation";
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

  // Send email — non-blocking failure so score still shows if email fails (e.g. no API key in dev)
  const result = await sendAssessmentEmail({
    email,
    firstName,
    score,
    tier,
    tierDescription,
    previewBullets,
  });

  if (!result.success) {
    console.error("Email delivery failed:", result.error);
  }

  return { success: true, score, tier };
}
