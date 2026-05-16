"use server";

import { emailGateSchema } from "@/lib/validation";
import { sendAssessmentEmailSequence } from "@/lib/email";
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

  // Fire-and-forget — never blocks the results response
  void sendAssessmentEmailSequence({
    email,
    firstName,
    score,
    tier,
    tierDescription,
    previewBullets,
    answers,
  });

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType: "assessment_quick", firstName, email, score, tier }),
      redirect: "follow",
    }).catch(() => {});
  }

  return { success: true, score, tier };
}
