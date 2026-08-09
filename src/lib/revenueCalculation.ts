import { type Sector } from "./assessment";
import { type TierLevel } from "./sectorRecommendations";

export interface AutomationOpportunity {
  name: string;
  lowMonthly: number;
  highMonthly: number;
  justification: string;
}

export interface RevenueOpportunitiesResult {
  sector: Sector;
  tier: TierLevel;
  opportunities: AutomationOpportunity[];
  totalLow: number;
  totalHigh: number;
}

const TIER_MULTIPLIER: Record<TierLevel, number> = {
  1: 0.6,
  2: 0.85,
  3: 1.15,
  4: 1.5,
};

interface BaseOpportunity {
  name: string;
  low: number;
  high: number;
  justification: string;
}

const SECTOR_OPPORTUNITY_BASE: Record<Sector, BaseOpportunity[]> = {
  "Other / Cross-Industry": [
    { name: "Email triage automation", low: 40, high: 100, justification: "5 hrs/wk at $20/hr" },
    { name: "Client intake system", low: 40, high: 120, justification: "6 hrs/wk at $20/hr" },
    { name: "Reporting pipeline", low: 20, high: 80, justification: "3 hrs/wk at $20/hr" },
  ],
  Law: [
    { name: "Client intake & conflicts check automation", low: 150, high: 600, justification: "at $300/hr partner time" },
    { name: "Document review triage", low: 200, high: 800, justification: "at $350/hr associate time" },
    { name: "Billing reconciliation automation", low: 150, high: 600, justification: "at $250/hr billing admin time" },
  ],
  Finance: [
    { name: "KYC/AML automation", low: 300, high: 1000, justification: "at $200/hr ops time" },
    { name: "Portfolio reporting automation", low: 300, high: 1200, justification: "at $300/hr advisor time" },
    { name: "Comms surveillance automation", low: 200, high: 800, justification: "at $400/hr compliance time" },
  ],
  "Real Estate & Property": [
    { name: "Lease abstraction automation", low: 100, high: 500, justification: "at agent/PM hourly rate" },
    { name: "Tenant triage automation", low: 100, high: 500, justification: "at agent/PM hourly rate" },
    { name: "Listing generation automation", low: 100, high: 500, justification: "at agent/PM hourly rate" },
  ],
  Construction: [
    { name: "Daily report automation", low: 150, high: 700, justification: "at PM/super hourly rate" },
    { name: "RFI triage automation", low: 150, high: 700, justification: "at PM/super hourly rate" },
    { name: "Estimating AI assist", low: 100, high: 600, justification: "at estimator hourly rate" },
  ],
};

function roundToTen(value: number): number {
  return Math.round(value / 10) * 10;
}

export function getRevenueOpportunities(
  sector: Sector,
  tier: TierLevel
): RevenueOpportunitiesResult {
  const multiplier = TIER_MULTIPLIER[tier];
  const opportunities: AutomationOpportunity[] = SECTOR_OPPORTUNITY_BASE[sector].map((base) => ({
    name: base.name,
    lowMonthly: roundToTen(base.low * multiplier),
    highMonthly: roundToTen(base.high * multiplier),
    justification: base.justification,
  }));

  const totalLow = opportunities.reduce((sum, opp) => sum + opp.lowMonthly, 0);
  const totalHigh = opportunities.reduce((sum, opp) => sum + opp.highMonthly, 0);

  return { sector, tier, opportunities, totalLow, totalHigh };
}
