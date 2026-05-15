import OpenAI from "openai";

export const maxDuration = 30;

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export type EmailDraft = {
  subject: string;
  body: string;
  day: number;
};

export type EmailSequence = {
  initial: EmailDraft;
  day3: EmailDraft;
  day7: EmailDraft;
  day14: EmailDraft;
  day30: EmailDraft;
};

function getSegmentAngle(segment: "cold" | "warm" | "hot"): string {
  if (segment === "cold") {
    return "Education angle — 'What businesses like yours are saving/earning with AI' — opportunity cost framing. Don't pitch services yet.";
  }
  if (segment === "warm") {
    return "Case study angle — proof of what others with similar AI readiness scores achieved. Show social proof.";
  }
  return "Urgency angle — they're ready to build now. Primary CTA: go directly to https://asorahura.com/checkout?tier=strategy. Don't suggest free options.";
}

function buildFallbackSequence(firstName: string, score: number): EmailSequence {
  const greeting = `Hey ${firstName},`;
  return {
    initial: {
      subject: `Your AI Readiness Report — Score: ${score}/100`,
      body: `${greeting}\n\nThank you for completing the AI Readiness Assessment. Your score is ${score}/100.\n\nI've attached your full report with personalized next steps.\n\nBest,\nAsor`,
      day: 0,
    },
    day3: {
      subject: "Quick check-in on your AI Readiness Report",
      body: `${greeting}\n\nJust checking in — have you had a chance to review your AI Readiness Report?\n\nIf you have any questions, just reply to this email.\n\nBest,\nAsor`,
      day: 3,
    },
    day7: {
      subject: "How AI systems are saving businesses like yours 10+ hours/week",
      body: `${greeting}\n\nI wanted to share a quick insight from working with businesses at your readiness level.\n\nThe biggest wins come from automating the tasks that eat your time every single day.\n\nWant to talk through what that could look like for you?\n\nBest,\nAsor`,
      day: 7,
    },
    day14: {
      subject: "Still thinking about AI automation?",
      body: `${greeting}\n\nTwo weeks ago you took the AI Readiness Assessment. I hope the report was useful.\n\nIf you're still thinking about next steps, I'm happy to answer questions — just hit reply.\n\nBest,\nAsor`,
      day: 14,
    },
    day30: {
      subject: "Last thought on your AI readiness",
      body: `${greeting}\n\nA month ago you scored ${score}/100 on the AI Readiness Assessment.\n\nIf you're ready to take action, book a call at asorahura.com.\n\nBest,\nAsor`,
      day: 30,
    },
  };
}

export async function draftEmailSequence(params: {
  firstName: string;
  email: string;
  score: number;
  segment: "cold" | "warm" | "hot";
  tier: string;
  tierDescription: string;
  previewBullets: string[];
}): Promise<EmailSequence> {
  const { firstName, score, segment, tier, tierDescription, previewBullets } = params;
  const angle = getSegmentAngle(segment);

  const systemPrompt =
    "You are Asor Ahura, an AI systems consultant. Draft a personalized email sequence for a prospect. Return valid JSON with keys: initial, day3, day7, day14, day30. Each has: subject (string), body (string with \\n for line breaks), day (number). The initial email should be personal and conversational, not a formal notification.";

  const userPrompt = `Draft an email sequence for:
Name: ${firstName}
Score: ${score}/100
Tier: ${tier}
Tier Description: ${tierDescription}
Top Opportunities:
${previewBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Segment angle for all emails: ${angle}

Initial email tone: Personal from Asor, conversational 1-on-1, not a formal notification. Frame: "Hey ${firstName}, here's your AI Readiness Report. Based on your score of ${score}, here's what I'd suggest..."

Return JSON only. No markdown. No code fences.`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL || "gemini-2.0-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw) as EmailSequence;

    // Validate the expected shape before returning
    if (
      parsed.initial &&
      parsed.day3 &&
      parsed.day7 &&
      parsed.day14 &&
      parsed.day30
    ) {
      return parsed;
    }
    return buildFallbackSequence(firstName, score);
  } catch {
    return buildFallbackSequence(firstName, score);
  }
}
