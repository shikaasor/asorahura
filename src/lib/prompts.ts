// Prompt templates for all LLM calls.
// Edit prompts here — llm.ts contains no prompt strings.

export const QUESTION_LABELS: Record<number, string> = {
  1: "Role",
  2: "Biggest time drain each week",
  3: "How often they handle automatable tasks",
  4: "Number of disconnected tools",
  5: "Who handles tasks",
  6: "Confidence team can run without them",
  7: "What happens when they take a week off",
  8: "Client onboarding process clarity",
};

export const SEGMENT_CASE_STUDY: Record<"cold" | "warm" | "hot", string> = {
  cold: "cervical-cancer-screening-tool",
  warm: "ai-resume-reviewer",
  hot: "chatbotly-nlp-analytics",
};

export const SEGMENT_CTA: Record<"cold" | "warm" | "hot", string> = {
  cold: "https://asorahura.com/blog",
  warm: "https://asorahura.com/checkout?tier=discovery",
  hot: "https://asorahura.com/checkout?tier=strategy",
};

export const PDF_CTA: Record<"cold" | "warm" | "hot", string> = {
  cold: "Reply to this email with your top 3 recurring tasks. I'll tell you — for free — which ones are costing you the most every week they stay manual.",
  warm: "Stop guessing which processes to automate. Book a Discovery Call and I'll map the exact 3 that will recover the most hours in your business: https://asorahura.com/checkout?tier=discovery",
  hot: "You're not 'thinking about' AI anymore — you're ready to build. Book a Strategy Session and we'll scope your first system this week: https://asorahura.com/checkout?tier=strategy",
};

export function formatAnswers(answers: Record<number, string>): string {
  return Object.entries(answers)
    .map(([q, a]) => `${QUESTION_LABELS[Number(q)] || `Q${q}`}: ${a}`)
    .join("\n");
}

export function segmentAngle(segment: "cold" | "warm" | "hot"): string {
  if (segment === "cold") {
    return "Opportunity-cost angle — quantify what manual operations are costing them every single week (hours, dollars, missed revenue). Make the pain of staying the same greater than the pain of changing. Don't pitch services — give them one specific, actionable insight they can use this week. Build trust by being useful first.";
  }
  if (segment === "warm") {
    return "Proof-of-result angle — they already see the gap. Show them someone with their exact context who closed it. Specific numbers, specific timeframe, specific outcome. Social proof first, soft CTA second.";
  }
  return "Urgency + ROI angle — they're ready. Every week of delay is leaking money. Primary CTA is direct: https://asorahura.com/checkout?tier=strategy. No free options, no soft asks, no 'learn more'. Frame the strategy session as the cheapest, fastest path to a working system.";
}

export function nurtureSegmentAngle(segment: "cold" | "warm" | "hot"): string {
  if (segment === "cold") {
    return "Educational + opportunity-cost angle — every email surfaces a specific, costly problem manual operations create. Show them what's possible. Soft CTA only: read a blog post or re-take the assessment as their team grows. Do NOT pitch services or ask for a call. Goal: become the trusted voice in their inbox.";
  }
  if (segment === "warm") {
    return "Proof + identity angle — share case study results from someone with their context. Show what a person at their readiness level looks like 90 days from now after working with Asor. CTA to book a discovery call at https://asorahura.com/checkout?tier=discovery — frame it as 'the conversation that costs nothing but reveals everything'.";
  }
  return "Urgency + cost-of-inaction angle — they're AI-ready. Every week they wait, competitors are compounding. Direct CTA to a strategy session at https://asorahura.com/checkout?tier=strategy. Emphasize: timeline (when they'll see results), ROI (what one automated workflow returns annually), and risk reversal (the session itself produces a scoped plan they can take anywhere). No soft options. No 'maybe later'.";
}

// ── PDF content prompt ────────────────────────────────────────────────────────

export function pdfContentPrompt(params: {
  firstName: string;
  answers: Record<number, string>;
  score: number;
  tier: string;
  segment: "cold" | "warm" | "hot";
}): { system: string; user: string } {
  const { firstName, answers, score, tier, segment } = params;

  return {
    system:
      "You are Asor Ahura, an AI systems consultant who writes like a sharp operator, not a brochure. You speak in specifics — hours, dollars, named bottlenecks — never vague benefits. You frame every insight against the cost of staying the same. Return valid JSON only. No markdown, no code fences.",
    user: `A prospect completed an AI Readiness Assessment. Generate personalized PDF report content based on their specific answers. Every line must feel like it was written for this person — not pasted from a template.

Name: ${firstName}
Score: ${score}/100
Tier: ${tier}
Segment: ${segment}

Their answers:
${formatAnswers(answers)}

Return JSON with exactly these keys:
{
  "opportunities": ["string", "string", "string"],
  "nextStep": "string"
}

opportunities: 3 specific automation opportunities tied directly to what they said. Each is ONE action-oriented sentence. Required structure for each:
  → Name the exact bottleneck from their answers (their role, time drain, tool fragmentation, key-person dependency).
  → Quantify the cost of leaving it manual (hours/week, missed revenue, error rate, or "what breaks when you're not there").
  → State the specific automation that fixes it.
Example shape (do not copy verbatim): "Your 8 disconnected tools are silently costing 6+ hours/week in copy-paste work — a single integration layer between [their stack] eliminates 90% of it."
Use their actual words where possible. No generic claims. No "leverage AI to streamline" language.

nextStep: 1-2 sentences personalized to their score and answers. Lead with the most expensive problem they have right now (cost of staying the same). End with the literal CTA below — do not rewrite it:
"${PDF_CTA[segment]}"

Return JSON only. No markdown. No code fences.`,
  };
}

// ── Initial email sequence prompt ─────────────────────────────────────────────

export function emailSequencePrompt(params: {
  firstName: string;
  score: number;
  segment: "cold" | "warm" | "hot";
  tier: string;
  tierDescription: string;
  previewBullets: string[];
  answers: Record<number, string>;
}): { system: string; user: string } {
  const { firstName, score, segment, tier, tierDescription, previewBullets, answers } = params;

  return {
    system:
      "You are Asor Ahura, an AI systems consultant. You write emails like a sharp operator talking to one person — not a marketer broadcasting to a list. Your style: short punchy sentences, arrows (→) over bullets, no em-dashes, no corporate jargon, no 'LLM-speak'. Every email leads with value or insight before any ask. Every subject line earns the open. Return valid JSON with keys: initial, day3, day7, day14, day30. Each has: subject (string), body (string with \\n for line breaks), day (number).",
    user: `Draft an email sequence for:
Name: ${firstName}
Score: ${score}/100
Tier: ${tier}
Tier Description: ${tierDescription}
Top Opportunities:
${previewBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Their assessment answers:
${formatAnswers(answers)}

Segment angle for all emails: ${segmentAngle(segment)}

SUBJECT LINE RULES (apply to every email):
→ Max 7 words. Lowercase preferred. Specific over clever.
→ Use one of these proven patterns: curiosity gap ("the 6-hour leak in your week"), specific result ("how [role] cut admin by 73%"), pattern-interrupt question ("why your team can't run without you"), or named pain ("about your [their actual time drain]").
→ Never use: "Quick question", "Following up", "Checking in", "Your AI Readiness Report" (boring), or anything with emojis.

INITIAL EMAIL — non-negotiables:
→ Opens like a 1-on-1 message from Asor, not a system notification. First line references something specific they said (their role, their time drain, their tool count) — never "Thanks for completing the assessment".
→ States their score in plain terms + what it actually means for their business (not what the tier name is — what it COSTS them or UNLOCKS for them this quarter).
→ Gives them ONE specific insight they can act on this week, drawn from their answers. No paywall on this. Trust before transaction.
→ One clear next action. No double CTAs. No "feel free to reply if you have any questions".
→ Length: 120-180 words. Anything longer doesn't get read.
→ Sign off: "Best,\\nAsor"

Return JSON only. No markdown. No code fences.`,
  };
}

// ── Nurture sequence prompt ───────────────────────────────────────────────────

export function nurtureSequencePrompt(params: {
  firstName: string;
  score: number;
  segment: "cold" | "warm" | "hot";
  answers?: Record<number, string>;
}): { system: string; user: string } {
  const { firstName, score, segment, answers } = params;
  const caseStudyUrl = `https://asorahura.com/blog/${SEGMENT_CASE_STUDY[segment]}`;
  const offerCta = SEGMENT_CTA[segment];
  const assessmentContext = answers
    ? `Assessment answers:\n${formatAnswers(answers)}`
    : "";

  return {
    system:
      "You are Asor Ahura, an AI systems consultant, drafting a 4-email nurture sequence for a prospect who completed an AI Readiness Assessment. You write like a sharp operator talking to one person. Short punchy sentences. Arrows (→) over bullets. No em-dashes, no corporate jargon, no 'LLM-speak'. Every email earns its open and ends with one clear action. Return valid JSON with exactly these keys: day3, day7, day14, day30. Each key has: subject (string), body (string with \\n for newlines), day (number). Plain text only — no HTML, no markdown, no code fences.",
    user: `Draft 4 follow-up emails for this prospect:
Name: ${firstName}
Assessment score: ${score}/100
Segment: ${segment}
${assessmentContext}

Segment angle (apply to all emails): ${nurtureSegmentAngle(segment)}

SUBJECT LINE RULES (every email):
→ Max 7 words. Lowercase preferred. Specific, never clever-for-its-own-sake.
→ Patterns that work: curiosity gap, specific number/result, pattern-interrupt question, named pain from their answers.
→ Avoid: "Following up", "Checking in", "Quick question", any emoji, anything that smells like a sequence.

EMAIL ARC — each email must hit its job, no drift:

→ Day 3 — Problem deepening (the leak they don't see).
  Open with a specific, costly problem their score/answers reveal. Quantify it in hours or dollars per week if possible. Make them feel the slow bleed of staying the same. End by naming what they'd need to look at to fix it (no pitch, no link — just direction). Length: 100-150 words.

→ Day 7 — Case study (proof, not theory).
  Lead with a result — specific number, specific timeframe, specific business. Bridge to why it's relevant to ${firstName}'s context (their role, their score, their answers). Embed this URL in the body naturally: ${caseStudyUrl}. End with: "Worth 5 minutes." Length: 120-160 words.

→ Day 14 — Process reveal (eliminate the unknown).
  Most prospects don't buy because they don't know what working with you looks like. Walk them through it in 3 steps: discovery call → fixed-scope build → handoff. Be specific about what they get and when. Then the CTA: ${offerCta}. Length: 130-170 words.

→ Day 30 — The direct offer.
  No more warming up. State what's on the table, what it costs, what they walk away with, and the cost of waiting another quarter. Risk reversal where honest (e.g. "if the call doesn't produce a usable plan, you owe me nothing"). One CTA: ${offerCta}. Length: 120-160 words.

TONE NON-NEGOTIABLES:
→ Personal 1-on-1 from Asor. Conversational. Direct.
→ No fluff. No "I hope this email finds you well". No "Just wanted to reach out".
→ Reference their actual answers where it sharpens the email.
→ Sign off "Best,\\nAsor" in every email.

Return JSON only. No markdown. No code fences.`,
  };
}
