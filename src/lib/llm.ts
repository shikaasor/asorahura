import { complete } from "@/lib/llm-client";
import {
  pdfContentPrompt,
  emailSequencePrompt,
  nurtureSequencePrompt,
  SEGMENT_CASE_STUDY,
  SEGMENT_CTA,
} from "@/lib/prompts";

export const maxDuration = 30;

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

export type NurtureEmailSequence = {
  day3: EmailDraft;
  day7: EmailDraft;
  day14: EmailDraft;
  day30: EmailDraft;
};

export type PDFContent = {
  opportunities: string[];
  nextStep: string;
};

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

function buildNurtureFallback(firstName: string, segment: "cold" | "warm" | "hot"): NurtureEmailSequence {
  const greeting = `Hey ${firstName},`;
  const caseStudyUrl = `https://asorahura.com/blog/${SEGMENT_CASE_STUDY[segment]}`;
  const offerCta = SEGMENT_CTA[segment];

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

export async function generatePDFContent(params: {
  firstName: string;
  answers: Record<number, string>;
  score: number;
  tier: string;
  segment: "cold" | "warm" | "hot";
}): Promise<PDFContent | null> {
  const { system, user } = pdfContentPrompt(params);

  try {
    const raw = await complete(system, user);
    const parsed = JSON.parse(raw) as PDFContent;

    if (Array.isArray(parsed.opportunities) && parsed.opportunities.length >= 3 && parsed.nextStep) {
      return { opportunities: parsed.opportunities.slice(0, 3), nextStep: parsed.nextStep };
    }
    return null;
  } catch {
    return null;
  }
}

export async function draftEmailSequence(params: {
  firstName: string;
  email: string;
  score: number;
  segment: "cold" | "warm" | "hot";
  tier: string;
  tierDescription: string;
  previewBullets: string[];
  answers: Record<number, string>;
}): Promise<EmailSequence> {
  const { firstName, score } = params;
  const { system, user } = emailSequencePrompt(params);

  try {
    const raw = await complete(system, user);
    const parsed = JSON.parse(raw) as EmailSequence;

    if (parsed.initial && parsed.day3 && parsed.day7 && parsed.day14 && parsed.day30) {
      return parsed;
    }
    return buildFallbackSequence(firstName, score);
  } catch {
    return buildFallbackSequence(firstName, score);
  }
}

export async function draftNurtureEmailSequence(params: {
  firstName: string;
  score: number;
  segment: "cold" | "warm" | "hot";
  answers?: Record<number, string>;
}): Promise<NurtureEmailSequence> {
  const { firstName, segment } = params;
  const { system, user } = nurtureSequencePrompt(params);

  try {
    const raw = await complete(system, user);
    const parsed = JSON.parse(raw) as NurtureEmailSequence;

    if (parsed.day3 && parsed.day7 && parsed.day14 && parsed.day30) {
      return parsed;
    }
    return buildNurtureFallback(firstName, segment);
  } catch {
    return buildNurtureFallback(firstName, segment);
  }
}
