import { type Sector } from "./assessment";

export type TierLevel = 1 | 2 | 3 | 4; // 1 = lowest readiness, 4 = highest

export interface SectorRecommendation {
  /** 1–2 sentence diagnostic shown below the score. */
  paragraph: string;
  /** 3 sector-specific next-step bullets. */
  bullets: [string, string, string];
  /** Short imperative shown above the CTA button. */
  ctaHint: string;
}

// Score → tier level mappings ────────────────────────────────────────────────
// Quick assessment uses a 0–100 scale; Deep uses 0–72. Both mapped to 1–4.

export function quickScoreToTierLevel(score: number): TierLevel {
  if (score < 30) return 1;
  if (score < 60) return 2;
  if (score < 80) return 3;
  return 4;
}

export function deepScoreToTierLevel(score: number): TierLevel {
  if (score <= 23) return 1;
  if (score <= 41) return 2;
  if (score <= 56) return 3;
  return 4;
}

// Sector × Tier recommendation matrix ────────────────────────────────────────

export const SECTOR_RECOMMENDATIONS: Record<Sector, Record<TierLevel, SectorRecommendation>> = {
  Law: {
    1: {
      paragraph:
        "Your firm has the regulatory exposure to use AI carelessly but not yet the architecture to use it safely. Lawyers pasting matter content into public LLMs is the textbook ABA Rule 1.6 violation — and the 600+ sanctioned hallucination cases since Mata v. Avianca show how fast that turns into malpractice exposure.",
      bullets: [
        "Write and enforce a firm-wide 'no client info in public AI' policy this week",
        "Pick ONE matter type (NDA review, lease abstraction, contract redlining) for the first pilot — not 'AI for the whole firm'",
        "Audit shadow AI use: which lawyers are pasting what into which tools?",
      ],
      ctaHint:
        "Foundation work first. Lock the policy, scope the pilot, then talk tools.",
    },
    2: {
      paragraph:
        "You have process structure but the privilege architecture isn't there yet. The fastest unlock is a private-tenant AI for one matter type with a written verification protocol. Most firms at this tier benefit from a 4-week pilot-readiness sprint covering privilege impact assessment, one Harvey/CoCounsel/equivalent license, a citation-verification workflow, and a billing-model decision for AI-assisted matters.",
      bullets: [
        "Privilege impact assessment on one matter type before any tool selection",
        "Pilot Harvey or CoCounsel on a single practice group under an enterprise DPA",
        "Citation verification protocol — written, mandatory, tied to malpractice policy",
      ],
      ctaHint:
        "A 4-week pilot-readiness sprint closes the gap. Book the discovery call.",
    },
    3: {
      paragraph:
        "Your governance and process foundations are strong enough to deploy. The leverage is in scaling from one pilot matter type to two more, and in formalising the billing-model adaptation so AI productivity gains actually show up in the firm P&L instead of getting silently absorbed.",
      bullets: [
        "Expand the pilot from one matter type to two more practice groups within 90 days",
        "Finalise the fixed-fee vs blended-rate decision for AI-assisted matters",
        "Stand up the AI-usage metrics — hours saved per matter, partner adoption rate, draft-cycle time",
      ],
      ctaHint:
        "You're ready to scope a real implementation. Let's design the rollout.",
    },
    4: {
      paragraph:
        "You're in the top quartile of legal-AI readiness. The work shifts from 'can we use this' to 'how do we compound the advantage.' Build proprietary workflows on top of licensed tools, not next to them — and turn senior-partner judgment into reusable AI prompts.",
      bullets: [
        "Build custom Workflow Agents on Harvey or equivalent for your top three matter types",
        "Productise knowledge — turn senior-partner judgment into reviewable AI prompt libraries",
        "Measure matter-margin uplift, time-to-first-draft, and partner-hours reclaimed quarterly",
      ],
      ctaHint:
        "You're the profile we build for. Book the discovery call.",
    },
  },

  Finance: {
    1: {
      paragraph:
        "Your AI use is uninventoried and your model risk management framework doesn't name GenAI as in-scope — exactly the posture regulators are now scrutinising. SR 11-7 and EU AI Act Annex III both treat non-deterministic models as a separate class. Your first job is governance, not deployment.",
      bullets: [
        "Inventory every AI tool in use across the firm — including shadow LLM use by advisors and analysts",
        "Update MRM (or equivalent) to explicitly name generative AI and non-deterministic models as in-scope",
        "Eliminate public LLM use with customer PII via written policy and enforced tenant-isolated alternatives",
      ],
      ctaHint:
        "Governance first. Deployment can't precede this without regulatory exposure.",
    },
    2: {
      paragraph:
        "Your foundation is partial. The blocker is almost always MRM coverage of GenAI and a defensible answer for client PII residency. A 4–6 week readiness sprint should produce: a GenAI inventory mapped to SR 11-7 / Annex III, updated MRM policy, comms-surveillance capture for AI-generated client content, and a tenant-isolated environment for the first pilot.",
      bullets: [
        "Map every existing and proposed AI use case to SR 11-7 / EU AI Act Annex III classification",
        "Capture all AI-generated client comms under FINRA 2210 / SEC Marketing Rule / MiFID II",
        "Stand up a tenant-isolated AI environment for the first PII-touching pilot",
      ],
      ctaHint:
        "A 4–6 week readiness sprint closes the gap. Book the discovery call.",
    },
    3: {
      paragraph:
        "Governance is real, residency is enforced, and your first AI workflows sit inside a defensible MRM perimeter. The next moves are explainability tooling for any high-risk use case and scaling from one advisor workflow to firm-wide rollout with ongoing-monitoring infrastructure.",
      bullets: [
        "Build the explainability framework for any high-risk workflow before regulators ask",
        "Scale the proven advisor workflow (meeting prep, tax-loss harvesting, planning notes) firm-wide",
        "Stand up ongoing-monitoring dashboards that satisfy SR 11-7 monitoring requirements",
      ],
      ctaHint:
        "You're ready for firm-wide scaling. Let's scope the rollout.",
    },
    4: {
      paragraph:
        "You're operating ahead of most banks and RIAs on AI governance. The compounding leverage is in proprietary models trained or RAG-anchored on your own data — done within MRM — and in fully automated comms surveillance that turns compliance from a cost centre into a differentiator.",
      bullets: [
        "Move from generic LLMs to fine-tuned or RAG-anchored models on your proprietary data, inside MRM",
        "Automate the comms-surveillance pipeline end-to-end so review scales with comms volume",
        "Build the regulator-facing AI explainability story before your next exam",
      ],
      ctaHint:
        "You're the profile we build for. Book the discovery call.",
    },
  },

  "Real Estate & Property": {
    1: {
      paragraph:
        "Your data is fragmented across properties or markets and your fair-housing exposure is unreviewed — the two preconditions that turn an AI 'pilot' into a Mass-AG-style enforcement action. Start by standardising data and reviewing which use cases touch protected classes.",
      bullets: [
        "Inventory which AI use cases touch protected classes — tenant screening, ad audience targeting, AVM valuation, lending",
        "Standardise one data type (rent rolls or listings) across your portfolio before any AI pilot",
        "Write the AI advertising policy aligned to HUD 2024 guidance before launching any audience-targeted campaign",
      ],
      ctaHint:
        "Foundation work first. Without standardised data and a bias-review policy, no pilot lands safely.",
    },
    2: {
      paragraph:
        "Your operation is automatable, but fair-housing exposure and data fragmentation will block scale-up. A 4-week sprint covering a bias-impact review on screening/advertising, lease/listing data standardisation, and a single scoped pilot (tenant comms or lease abstraction) is the right next move.",
      bullets: [
        "Run a bias-impact review on tenant screening and advertising AI before scaling either",
        "Standardise lease and listing data across markets so AI can actually train on it",
        "Scope one pilot — tenant comms triage, lease abstraction, or maintenance routing — with a measured baseline",
      ],
      ctaHint:
        "A 4-week sprint closes the gap. Book the discovery call.",
    },
    3: {
      paragraph:
        "You can deploy without tripping fair-housing exposure and your data is consistent enough for AI to be useful. The next move is scaling the winning pilot — likely tenant comms (AppFolio-style 90% inquiry deflection) or CRE lease abstraction (3× faster underwriting) — and instrumenting bias monitoring as you scale.",
      bullets: [
        "Scale the winning pilot from one market or property group to the full portfolio",
        "Stand up bias monitoring with Colorado-AI-Act-aligned impact assessments",
        "Build the data pipeline that makes AVM, CMA, or rent-roll AI self-improving over time",
      ],
      ctaHint:
        "You're ready to scale. Let's scope the rollout.",
    },
    4: {
      paragraph:
        "You're operating at the level of large institutional brokerages and REITs on AI maturity. The leverage is in proprietary models — CMA accuracy, AVM precision, predictive maintenance — and in turning your bias-monitoring posture into a competitive moat.",
      bullets: [
        "Train proprietary AVM or CMA models on your own transaction and market data",
        "Automate the maintenance triage and dispatch pipeline end-to-end",
        "Productise your bias-monitoring rigour in marketing — it's increasingly a buyer concern",
      ],
      ctaHint:
        "You're the profile we build for. Book the discovery call.",
    },
  },

  Construction: {
    1: {
      paragraph:
        "Your job sites use different tools, your documents live in paper and email, and your field crews aren't connected. AI can't help here yet — the data doesn't exist in a form any model can use. The blocker is platform standardisation, not tool selection.",
      bullets: [
        "Standardise on Procore (or ACC) across all active job sites — kill the per-superintendent fragmentation",
        "Digitise RFIs, submittals, and daily reports — no AI pilot has data until this is done",
        "Get devices and connectivity to the field crews so any future deployment doesn't stop at the office",
      ],
      ctaHint:
        "Foundation work first. AI needs the data to exist before it can help.",
    },
    2: {
      paragraph:
        "You're past 'no AI' but not yet ready for production. The unblocker is unifying the platform across job sites and digitising one priority document workflow (RFIs or submittals). A 6-week pilot-readiness sprint with takeoff or schedule-risk as the first workflow is the typical engagement at this tier.",
      bullets: [
        "Lock in Procore or ACC as the single platform across all active jobs",
        "Pilot Togal.AI or Beam AI on estimating with a measured baseline (current hours, accuracy)",
        "Establish the RFI/submittal digital workflow before layering AI triage on top",
      ],
      ctaHint:
        "A 6-week pilot-readiness sprint closes the gap. Book the discovery call.",
    },
    3: {
      paragraph:
        "Platform is unified, data is digital, and one pilot workflow has paid back. The next move is sequencing — takeoff/estimating → schedule risk (ALICE-class) → jobsite progress (Buildots/OpenSpace) → safety monitoring. Don't try all four at once; sequence and measure.",
      bullets: [
        "Roll the estimating AI from the pilot project to all active bids with measured win-rate impact",
        "Add schedule-risk AI (ALICE Technologies or equivalent) on the next major project",
        "Pilot jobsite progress capture (Buildots / OpenSpace) on one large project to baseline accuracy",
      ],
      ctaHint:
        "You're ready to sequence the rollout. Let's plan it.",
    },
    4: {
      paragraph:
        "You're operating ahead of most contractors on AI maturity. The compounding leverage is in cross-project intelligence — what your fleet of jobs collectively knows — and in automated safety monitoring that hardens insurance and EMR rates.",
      bullets: [
        "Build the cross-project intelligence layer — what your portfolio of jobs learns over time",
        "Automate safety monitoring (PPE, exclusion zones) across job sites with measurable incident-rate impact",
        "Compress the next bid cycle: takeoff → estimate → risk → schedule, all integrated and AI-assisted",
      ],
      ctaHint:
        "You're the profile we build for. Book the discovery call.",
    },
  },

  "Other / Cross-Industry": {
    1: {
      paragraph:
        "You're running everything manually. AI systems could reclaim 10–20 hours per week and remove you as the bottleneck — but only after foundational process work. Map the highest-friction workflows before scoping any tool.",
      bullets: [
        "Document and systematise your top 3 recurring tasks before any AI pilot",
        "Automate client onboarding — eliminate 5+ manual touchpoints",
        "Build a reporting pipeline so data flows without you needing to be in the loop",
      ],
      ctaHint:
        "Foundation work first. Map the processes, then talk tools.",
    },
    2: {
      paragraph:
        "You have some structure, but key processes still depend on you. Targeted automation could cut manual effort by 40–60%. The leverage is in connecting your existing tools and automating the most frequent delegation loop.",
      bullets: [
        "Connect your tool stack — eliminate copy-paste between platforms",
        "Automate your most frequent delegation loop with a measured baseline",
        "Create a self-serve client portal to reduce inbound questions",
      ],
      ctaHint:
        "A scoped automation sprint closes the gap. Book the discovery call.",
    },
    3: {
      paragraph:
        "Your systems are working, but there are clear opportunities to automate further and scale without adding headcount. Layer AI on top of the workflows that already run cleanly, and turn exception handling into a measurable, automated process.",
      bullets: [
        "Layer AI decision support on top of your existing workflows",
        "Automate exception handling so the team escalates less and resolves faster",
        "Build monitoring dashboards so issues surface without you having to check",
      ],
      ctaHint:
        "You're ready to scope an implementation. Let's design it.",
    },
    4: {
      paragraph:
        "You're well-systematised. AI optimisation can drive compounding efficiency gains and unlock growth without proportional cost. The work shifts to AI agents for multi-step workflows and continuous-improvement instrumentation.",
      bullets: [
        "Explore AI agents for complex multi-step workflows that span systems",
        "Optimise your automation stack for reliability and cost",
        "Instrument your systems for continuous improvement with measured baselines",
      ],
      ctaHint:
        "You're the profile we build for. Book the discovery call.",
    },
  },
};

export function getSectorRecommendation(
  sector: Sector,
  tier: TierLevel,
): SectorRecommendation {
  return SECTOR_RECOMMENDATIONS[sector][tier];
}
