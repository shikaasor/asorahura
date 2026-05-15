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

// ── Nurture sequence (Day 3 / 7 / 14 / 30 follow-ups) ──────────────────────

export type NurtureEmailSequence = {
  day3: EmailDraft;  // Problem deepening
  day7: EmailDraft;  // Case study with /blog link
  day14: EmailDraft; // Process reveal
  day30: EmailDraft; // Offer with segment CTA
};

// Fixed case study blog slug per segment for Day 7 email
// cold → cervical cancer (healthcare, resilience), warm → ai-resume-reviewer (ops efficiency), hot → chatbotly-nlp-analytics (multilingual NLP, high-readiness match)
const SEGMENT_CASE_STUDY: Record<"cold" | "warm" | "hot", string> = {
  cold: "cervical-cancer-screening-tool",
  warm: "ai-resume-reviewer",
  hot: "chatbotly-nlp-analytics",
};

function getNurtureSegmentAngle(segment: "cold" | "warm" | "hot"): string {
  if (segment === "cold") {
    return "Educational angle — surface the cost of manual operations, show what's possible with AI. Soft CTA to read a blog post or re-take the assessment. Do NOT pitch services or ask for a call yet.";
  }
  if (segment === "warm") {
    return "Proof angle — share a case study result matching their context. Show social proof. CTA to book a discovery call at https://asorahura.com/checkout?tier=discovery";
  }
  return "Urgency angle — they are AI-ready. Direct CTA to book a strategy session at https://asorahura.com/checkout?tier=strategy. Emphasise timeline and ROI. No soft options.";
}

function buildNurtureFallback(firstName: string, segment: "cold" | "warm" | "hot"): NurtureEmailSequence {
  const greeting = `Hey ${firstName},`;
  const caseStudySlug = SEGMENT_CASE_STUDY[segment];
  const caseStudyUrl = `https://asorahura.com/blog/${caseStudySlug}`;
  const offerCta =
    segment === "cold"
      ? "https://asorahura.com/blog"
      : segment === "warm"
      ? "https://asorahura.com/checkout?tier=discovery"
      : "https://asorahura.com/checkout?tier=strategy";

  return {
    day3: {
      subject: "The cost of doing this manually",
      body: `${greeting}\n\nA few days ago you completed the AI Readiness Assessment.\n\nMost businesses I work with are spending 10-20 hours a week on tasks that AI systems can handle — data entry, document processing, report generation, customer triage.\n\nThe question isn't whether AI can help. It's which tasks are costing you the most.\n\nIf you want to talk through what that looks like for your business, just reply to this email.\n\nBest,\nAsor`,
      day: 3,
    },
    day7: {
      subject: "A project you might find relevant",
      body: `${greeting}\n\nI thought you'd find this case study useful based on your assessment results:\n\n${caseStudyUrl}\n\nThe architecture principles here apply to a lot of operational challenges — I build custom solutions rather than plugging in generic tools.\n\nWorth a read.\n\nBest,\nAsor`,
      day: 7,
    },
    day14: {
      subject: "What working with me actually looks like",
      body: `${greeting}\n\nTwo weeks ago you took the AI Readiness Assessment. I wanted to give you a clear picture of how I work with clients.\n\nEvery engagement starts with a 60-minute discovery call where I map out exactly which processes are automatable and estimate the time/cost savings. No generic recommendations.\n\nFrom there it's a fixed-scope build: I design, build, test, and hand off a working system — not a prototype, not a proof of concept.\n\nIf that sounds like what you're looking for, the next step is here:\n${offerCta}\n\nBest,\nAsor`,
      day: 14,
    },
    day30: {
      subject: "Still thinking about this?",
      body: `${greeting}\n\nA month ago you scored on the AI Readiness Assessment.\n\nIf you're still thinking about automating operations — the next step:\n${offerCta}\n\nIf the timing isn't right, no problem. You can re-take the assessment any time at https://asorahura.com/assessment\n\nBest,\nAsor`,
      day: 30,
    },
  };
}

export async function draftNurtureEmailSequence(params: {
  firstName: string;
  score: number;
  segment: "cold" | "warm" | "hot";
  answers?: Record<number, string>;
}): Promise<NurtureEmailSequence> {
  const { firstName, score, segment, answers } = params;
  const angle = getNurtureSegmentAngle(segment);
  const caseStudySlug = SEGMENT_CASE_STUDY[segment];
  const caseStudyUrl = `https://asorahura.com/blog/${caseStudySlug}`;
  const offerCta =
    segment === "cold"
      ? "https://asorahura.com/blog"
      : segment === "warm"
      ? "https://asorahura.com/checkout?tier=discovery"
      : "https://asorahura.com/checkout?tier=strategy";

  const assessmentContext = answers
    ? `Assessment answers summary: ${Object.entries(answers)
        .map(([q, a]) => `Q${q}: ${a}`)
        .join("; ")}`
    : "";

  const systemPrompt =
    "You are Asor Ahura, an AI systems consultant, drafting a 4-email nurture sequence for a prospect who completed an AI Readiness Assessment. Return valid JSON with exactly these keys: day3, day7, day14, day30. Each key has: subject (string), body (string with \\n for newlines), day (number). Plain text only — no HTML, no markdown, no code fences.";

  const userPrompt = `Draft 4 follow-up emails for this prospect:
Name: ${firstName}
Assessment score: ${score}/100
Segment: ${segment}
${assessmentContext}

Segment angle (apply to all emails): ${angle}

Email arc:
- Day 3: Problem deepening — surface their specific operational pain based on their score and answers. Don't pitch yet.
- Day 7: Case study — reference this project: ${caseStudyUrl} — explain why it's relevant to their context. Embed the URL in the body.
- Day 14: Process reveal — explain what working with Asor looks like (discovery call → fixed-scope build → handoff). End with CTA: ${offerCta}
- Day 30: The offer — direct ask, segment-appropriate. CTA: ${offerCta}

Tone: Personal 1-on-1 from Asor. Conversational, direct, no fluff. Sign off "Best,\nAsor" in every email.

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
    const parsed = JSON.parse(raw) as NurtureEmailSequence;

    if (parsed.day3 && parsed.day7 && parsed.day14 && parsed.day30) {
      return parsed;
    }
    return buildNurtureFallback(firstName, segment);
  } catch {
    return buildNurtureFallback(firstName, segment);
  }
}
