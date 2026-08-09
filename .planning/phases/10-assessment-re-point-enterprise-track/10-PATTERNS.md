# Phase 10: Assessment Re-point + Enterprise Track - Pattern Map

**Mapped:** 2026-08-09
**Files analyzed:** 16 new/modified files
**Analogs found:** 14 / 16

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/assessment/RevenueResultsScreen.tsx` | component | request-response | `src/components/assessment/ResultsScreen.tsx` | exact |
| `src/lib/revenueCalculation.ts` | utility | transform | `src/lib/assessment.ts` | role-match |
| `src/components/assessment/AssessmentSectorGate.tsx` | component | request-response | `src/components/assessment/SectorPicker.tsx` | role-match |
| `src/app/enterprise/page.tsx` | page | request-response | `src/app/services/page.tsx` | role-match |
| `src/app/assessment/page.tsx` | page | request-response | `src/app/assessment/page.tsx` (self) | self-modify |
| `src/components/assessment/AssessmentShell.tsx` | component | request-response | `src/components/assessment/AssessmentShell.tsx` (self) | self-modify |
| `src/components/assessment/ResultsScreen.tsx` | component | request-response | `src/components/assessment/ResultsScreen.tsx` (self) | self-modify |
| `src/app/engage/page.tsx` | page | request-response | `src/app/engage/page.tsx` (self) | self-modify |
| `src/components/home/Footer.tsx` | component | request-response | `src/components/home/Footer.tsx` (self) | self-modify |
| `src/components/Navigation.tsx` | component | request-response | `src/components/Navigation.tsx` (self) | self-modify |
| `src/app/checkout/page.tsx` | page | request-response | `src/app/checkout/page.tsx` (self) | self-modify |
| `src/lib/assessment.ts` | utility | transform | `src/lib/assessment.ts` (self) | self-modify |
| `src/components/assessment/DeepAssessmentShell.tsx` | component | request-response | `src/components/assessment/DeepAssessmentShell.tsx` (self) | self-modify |
| `src/components/assessment/DeepResultsScreen.tsx` | component | request-response | `src/components/assessment/DeepResultsScreen.tsx` (self) | self-modify |
| `src/app/services/page.tsx` | page | request-response | `src/app/services/page.tsx` (self) | self-modify |
| `src/lib/email.ts` | utility | request-response | `src/lib/email.ts` (self) | self-modify |

---

## Pattern Assignments

### `src/components/assessment/RevenueResultsScreen.tsx` (component, request-response)

**Analog:** `src/components/assessment/ResultsScreen.tsx`

**Role:** Display assessment results with revenue-framed messaging instead of "AI Opportunity Score". Unified component for both quick (0-100) and deep (0-72) assessment types.

**Imports pattern** (lines 1-6 from ResultsScreen.tsx):
```typescript
import Link from "next/link";
import { getTierDescription, getPreviewBullets, DEFAULT_SECTOR, type Sector } from "@/lib/assessment";
import styles from "./ResultsScreen.module.css"; // reuse or create RevenueResultsScreen.module.css
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import testimonials from "@/content/testimonials.json";
```

**Component signature & interface** (lines 10-17 from ResultsScreen.tsx, adapted):
```typescript
interface Props {
  assessmentType: "quick" | "deep"; // new: track assessment type
  score: number;
  byDimension?: Record<string, number>; // only for deep assessments
  tier: string;
  firstName: string;
  sector?: Sector;
}

export function RevenueResultsScreen({ 
  assessmentType, 
  score, 
  byDimension, 
  tier, 
  firstName, 
  sector = DEFAULT_SECTOR 
}: Props) {
```

**Core pattern: Revenue-framed display** (new, adapted from ResultsScreen structure):
```typescript
// Instead of:
// <span className={styles.scoreLabel}>Your AI Opportunity Score</span>
// <div className={styles.scoreNumber}>{score}<span>/100</span></div>

// Use revenue framing:
<div className={styles.scoreBlock}>
  <span className={styles.scoreLabel}>Your Revenue Opportunities</span>
  <div className={styles.revenueAmount}>
    ~${totalMonthly}<span className={styles.revenueFreq}>/month</span>
  </div>
  <div className={styles.tier}>{tier}</div>
</div>

// Automation breakdown (replacing "Your Top Opportunities" bullets):
<div className={styles.opportunities}>
  <p className={styles.oppTitle}>Your Top Automations</p>
  {opportunities.map((opp, i) => (
    <div key={i} className={styles.automation}>
      <span className={styles.automationName}>{opp.name}</span>
      <span className={styles.automationValue}>~${opp.monthlyValue}/mo</span>
      <span className={styles.automationJustification}>({opp.hoursPerWeek} hrs/wk at ${opp.hourlyRate}/hr)</span>
    </div>
  ))}
</div>
```

**CTA pattern** (modified from ResultsScreen lines 55-63):
```typescript
// OLD:
// <Link href={`/engage?score=${score}`} className={styles.ctaBtn}>
//   Tell Me About Your Problem →
// </Link>
// <a href="https://calendly.com/asorahura" ...>Book a discovery call →</a>

// NEW (primary path routes to /checkout, not /engage):
<div className={styles.cta}>
  <p className={styles.ctaHint}>Ready to act on your results?</p>
  <Link href="/checkout" className={styles.ctaBtn}>
    See Your Purchase Options →
  </Link>
  {/* No Calendly link in primary assessment path */}
</div>
```

**Email confirmation pattern** (lines 45-53, unchanged):
```typescript
<div className={styles.emailBanner}>
  <span className={styles.emailCheck}>✓</span>
  <div>
    <p className={styles.emailBannerTitle}>Your Full Report Is On Its Way</p>
    <p className={styles.emailBannerSub}>
      Your personalized PDF with the full breakdown has been sent to {firstName}&apos;s inbox.
    </p>
  </div>
</div>
```

**Conditional rendering for deep assessment** (new logic):
```typescript
if (assessmentType === "deep" && byDimension) {
  // Show section breakdown cards (adapted from DeepResultsScreen.tsx lines 28-51)
  return (
    <div>
      {/* existing revenue block above */}
      <div>
        <p className={styles.sectionTitle}>Section Breakdown</p>
        <div className={styles.dimensions}>
          {/* Render dimension cards — reuse DeepResultsScreen logic */}
        </div>
      </div>
    </div>
  );
}
```

---

### `src/lib/revenueCalculation.ts` (utility, transform)

**Analog:** `src/lib/assessment.ts`

**Role:** Transform score + sector into revenue opportunity objects with monthly value estimates.

**Import pattern** (lines 1-4 from assessment.ts):
```typescript
import { type Sector } from "./assessment";
import { quickScoreToTierLevel } from "./sectorRecommendations";
```

**Interface definitions** (new, inspired by assessment.ts Question structure):
```typescript
export interface AutomationOpportunity {
  name: string;
  description: string;
  hoursPerWeek: number;
  internalHourlyRate: number;
  monthlyValue: number; // derived: (hours/week × hourly_rate × 4.33 weeks/month)
}

export interface RevenueOpportunitiesResult {
  totalMonthlyValue: number;
  opportunities: AutomationOpportunity[];
  sector: Sector;
  tier: TierLevel;
  lowEstimate: number;  // range lower bound
  highEstimate: number; // range upper bound
}
```

**Core calculation pattern** (modeled after calculateScore pattern from assessment.ts lines 392-408):
```typescript
export function getRevenueOpportunities(
  score: number,
  sector: Sector = DEFAULT_SECTOR
): RevenueOpportunitiesResult {
  const tier = quickScoreToTierLevel(score);
  
  // Lookup opportunities matrix by sector + tier
  const opportunities = SECTOR_OPPORTUNITIES[sector][tier] || [];
  
  // Derive monthly values
  const calculated = opportunities.map(opp => ({
    ...opp,
    monthlyValue: Math.round(opp.hoursPerWeek * opp.internalHourlyRate * 4.33)
  }));
  
  const totalMonthlyValue = calculated.reduce((sum, o) => sum + o.monthlyValue, 0);
  
  return {
    totalMonthlyValue,
    opportunities: calculated,
    sector,
    tier,
    lowEstimate: totalMonthlyValue * 0.8,  // ±20% confidence band
    highEstimate: totalMonthlyValue * 1.2,
  };
}
```

**Sector-specific opportunities matrix** (conceptual—planner refines values):
```typescript
const SECTOR_OPPORTUNITIES: Record<Sector, Record<TierLevel, AutomationOpportunity[]>> = {
  "Other / Cross-Industry": {
    1: [
      { name: "Email triage automation", hoursPerWeek: 5, internalHourlyRate: 20, description: "..." },
      { name: "Client intake system", hoursPerWeek: 10, internalHourlyRate: 15, description: "..." },
      { name: "Reporting pipeline", hoursPerWeek: 4, internalHourlyRate: 20, description: "..." },
    ],
    2: [ /* tier 2 opportunities */ ],
    3: [ /* tier 3 opportunities */ ],
    4: [ /* tier 4 opportunities */ ],
  },
  Law: {
    1: [
      { name: "Client intake + conflicts check", hoursPerWeek: 8, internalHourlyRate: 300, description: "..." },
      { name: "Document review triage", hoursPerWeek: 6, internalHourlyRate: 350, description: "..." },
      { name: "Billing reconciliation", hoursPerWeek: 4, internalHourlyRate: 250, description: "..." },
    ],
    // ... tiers 2-4
  },
  Finance: {
    1: [
      { name: "KYC/AML automation", hoursPerWeek: 10, internalHourlyRate: 200, description: "..." },
      { name: "Portfolio reporting", hoursPerWeek: 12, internalHourlyRate: 300, description: "..." },
      { name: "Comms surveillance", hoursPerWeek: 5, internalHourlyRate: 400, description: "..." },
    ],
    // ... tiers 2-4
  },
  // Real Estate & Property, Construction follow same pattern
};
```

**Export for ResultsScreen usage**:
```typescript
export { getRevenueOpportunities, type AutomationOpportunity, type RevenueOpportunitiesResult };
```

---

### `src/components/assessment/AssessmentSectorGate.tsx` (component, request-response)

**Analog:** `src/components/assessment/SectorPicker.tsx`

**Role:** Present user with choice between "Small Business (SMB)" path and "Enterprise (regulated verticals)" path before assessment or at entry. Gate is informational, not gatekeeping.

**Component structure** (modeled after SectorPicker pattern):
```typescript
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./AssessmentSectorGate.module.css"; // new or adapt SectorPicker.module.css

interface Props {
  onSelect?: (path: "smb" | "enterprise") => void;
}

export function AssessmentSectorGate({ onSelect }: Props) {
  const router = useRouter();

  function handleSMBSelect() {
    onSelect?.("smb");
    router.push("/assessment"); // proceed to SMB assessment
  }

  function handleEnterpriseSelect() {
    onSelect?.("enterprise");
    router.push("/enterprise"); // go to enterprise track page
  }

  return (
    <div className={styles.gateContainer}>
      <div className={styles.gateContent}>
        <h2 className={styles.gateHeading}>Which path describes you best?</h2>
        <p className={styles.gateSubheading}>
          Both paths are equally valid. Choose the one that fits your situation.
        </p>

        <div className={styles.choicesGrid}>
          {/* SMB Choice */}
          <button className={styles.choice} onClick={handleSMBSelect}>
            <h3 className={styles.choiceName}>Small Business</h3>
            <p className={styles.choiceExamples}>
              Creators, Coaches, Local Services, E-commerce
            </p>
            <p className={styles.choiceDescription}>
              Fast self-serve assessment, low-ticket products, straight to automation
            </p>
            <span className={styles.choiceCTA}>Continue to Assessment →</span>
          </button>

          {/* Enterprise Choice */}
          <button className={styles.choice} onClick={handleEnterpriseSelect}>
            <h3 className={styles.choiceName}>Enterprise</h3>
            <p className={styles.choiceExamples}>
              Law, Finance, Real Estate, Construction
            </p>
            <p className={styles.choiceDescription}>
              Compliance-aware scoping, custom solutions, discovery call included
            </p>
            <span className={styles.choiceCTA}>Explore Enterprise Path →</span>
          </button>
        </div>

        <p className={styles.optionalNote}>
          Not sure? <Link href="/enterprise">See differences →</Link>
        </p>
      </div>
    </div>
  );
}
```

---

### `src/app/enterprise/page.tsx` (page, request-response)

**Analog:** `src/app/services/page.tsx`

**Role:** Consolidate enterprise vertical cards, case studies, services tiers, and enterprise engagement form. Positioned as premium/specialized path.

**Page structure** (modeled after services/page.tsx pattern):
```typescript
import Link from "next/link";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { ServiceCard } from "@/components/services/ServiceCard"; // reuse from services
import styles from "./enterprise.module.css"; // new

export const metadata = {
  title: "Enterprise AI Solutions | Asor Ahura",
  description: "Custom scoping for regulated industries with compliance-aware implementation.",
};

const ENTERPRISE_VERTICALS = [
  {
    id: "law",
    name: "Law",
    regulation: "ABA Rule 1.6 Compliance",
    description: "AI-assisted legal workflows with privilege protection and malpractice safeguards.",
    cta: { text: "Discuss Your Challenges", href: "/engage?sector=law" },
  },
  {
    id: "finance",
    name: "Finance",
    regulation: "SR 11-7 / EU AI Act",
    description: "Model risk management, governance-first AI integration, regulatory-ready deployment.",
    cta: { text: "Discuss Your Challenges", href: "/engage?sector=finance" },
  },
  {
    id: "realestate",
    name: "Real Estate & Property",
    regulation: "Fair Housing / HUD 2024",
    description: "Bias-aware automation, tenant compliance, protected-class safeguards.",
    cta: { text: "Discuss Your Challenges", href: "/engage?sector=realestate" },
  },
  {
    id: "construction",
    name: "Construction",
    regulation: "Industry Standards (Procore/ACC)",
    description: "Project automation, compliance-aware reporting, crew coordination.",
    cta: { text: "Discuss Your Challenges", href: "/engage?sector=construction" },
  },
];

export default function EnterprisePage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Enterprise AI Automation Solutions</h1>
          <p className={styles.heroTagline}>
            Custom scoping for regulated industries with compliance-aware implementation
          </p>
        </div>
      </section>

      {/* Verticals Section */}
      <section className={styles.verticals}>
        <h2 className={styles.sectionHeading}>Industry Expertise</h2>
        <div className={styles.verticalGrid}>
          {ENTERPRISE_VERTICALS.map((vertical) => (
            <div key={vertical.id} className={styles.verticalCard}>
              <h3 className={styles.verticalName}>
                {vertical.name} <span className={styles.regulation}>({vertical.regulation})</span>
              </h3>
              <p className={styles.verticalDescription}>{vertical.description}</p>
              <Link href={vertical.cta.href} className={styles.verticalCta}>
                {vertical.cta.text} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies Section — reuse from /work */}
      <section className={styles.caseStudies}>
        <h2 className={styles.sectionHeading}>What We've Built</h2>
        <div className={styles.caseStudiesGrid}>
          {/* Import case study data from /work and render TestimonialCard */}
        </div>
      </section>

      {/* Services Tiers — reuse /services tiers */}
      <section className={styles.services}>
        <h2 className={styles.sectionHeading}>Our Enterprise Tiers</h2>
        <div className={styles.tiersGrid}>
          {/* Reuse serviceTiers from /services but mark as enterprise */}
        </div>
      </section>

      {/* Engagement CTA */}
      <section className={styles.engagement}>
        <h2 className={styles.engagementHeading}>Schedule a Compliance-Aware Discovery Call</h2>
        <p className={styles.engagementSubtext}>
          Tell us about your challenges. We'll map out a custom scoping and timeline.
        </p>
        <Link href="/engage?enterprise=true" className={styles.engagementCta}>
          Discuss Your Needs →
        </Link>
      </section>
    </main>
  );
}
```

---

### `src/components/home/Footer.tsx` (component, request-response)

**Analog:** `src/components/home/Footer.tsx` (self, lines 1-60)

**Modification pattern:** Add "Enterprise" link to navigation column

**Current pattern** (lines 18-27):
```typescript
<nav className={styles.nav} aria-label="Footer navigation">
  <p className={styles.navLabel}>Navigation</p>
  <ul className={styles.navList}>
    <li><Link href="/" className={styles.navLink}>Home</Link></li>
    <li><Link href="/assessment" className={styles.navLink}>Discovery</Link></li>
    <li><Link href="/engage" className={styles.navLink}>Engage</Link></li>
    <li><Link href="/work" className={styles.navLink}>Work</Link></li>
  </ul>
</nav>
```

**Updated pattern** (add Enterprise link):
```typescript
<nav className={styles.nav} aria-label="Footer navigation">
  <p className={styles.navLabel}>Navigation</p>
  <ul className={styles.navList}>
    <li><Link href="/" className={styles.navLink}>Home</Link></li>
    <li><Link href="/assessment" className={styles.navLink}>Discovery</Link></li>
    <li><Link href="/enterprise" className={styles.navLink}>Enterprise</Link></li>
    <li><Link href="/engage" className={styles.navLink}>Engage</Link></li>
    <li><Link href="/work" className={styles.navLink}>Work</Link></li>
  </ul>
</nav>
```

---

### `src/components/assessment/ResultsScreen.tsx` (component, request-response)

**Analog:** `src/components/assessment/ResultsScreen.tsx` (self, lines 1-69)

**Role:** Replace/deprecate in favor of RevenueResultsScreen, OR modify to route assessment context to RevenueResultsScreen component.

**Deprecation strategy:** Keep ResultsScreen for backward compatibility, but replace calls in AssessmentShell with RevenueResultsScreen.

**OR modify to route correctly:**
```typescript
// Option: Add revenue framing to existing component
import { getRevenueOpportunities } from "@/lib/revenueCalculation";

interface Props {
  score: number;
  tier: string;
  firstName: string;
  sector?: Sector;
  assessmentType?: "quick" | "deep"; // optional: track type for future
}

export function ResultsScreen({ score, tier, firstName, sector = DEFAULT_SECTOR, assessmentType = "quick" }: Props) {
  const description = getTierDescription(score, sector);
  const bullets = getPreviewBullets(score, sector);
  
  // NEW: Calculate revenue opportunities
  const revenueData = getRevenueOpportunities(score, sector);
  
  return (
    <div className={styles.wrap}>
      {/* Revenue-framed score block */}
      <div className={styles.scoreBlock}>
        <span className={styles.scoreLabel}>Your Revenue Opportunities</span>
        <div className={styles.revenueAmount}>
          ~${revenueData.totalMonthlyValue}/month
        </div>
        <div className={styles.tier}>{tier}</div>
      </div>

      {/* ... rest of component ...*/}
      
      {/* UPDATE CTA: Route to /checkout */}
      <div className={styles.cta}>
        <p className={styles.ctaHint}>Ready to act on your results?</p>
        <Link href="/checkout" className={styles.ctaBtn}>
          See Your Purchase Options →
        </Link>
        {/* REMOVED: Calendly secondary CTA */}
      </div>
      
      <TestimonialCard {...RESULTS_TESTIMONIAL} />
    </div>
  );
}
```

**CTA routing change** (lines 57-62, before):
```typescript
<Link href={`/engage?score=${score}`} className={styles.ctaBtn}>
  Tell Me About Your Problem →
</Link>
<a href="https://calendly.com/asorahura" target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>
  Book a discovery call →
</a>
```

**After:**
```typescript
<Link href="/checkout" className={styles.ctaBtn}>
  See Your Purchase Options →
</Link>
{/* No secondary CTA */}
```

---

### `src/lib/assessment.ts` (utility, transform)

**Analog:** `src/lib/assessment.ts` (self, lines 1-448)

**Modifications:**

**1. Update DEFAULT_SECTOR** (line 21, before):
```typescript
export const DEFAULT_SECTOR: Sector = "Other / Cross-Industry";
```

**After:** Keep as-is OR change to "Other / Cross-Industry" to reflect SMB primary path (no change needed—already correct).

**2. Add helper to check if sector is regulated** (new function):
```typescript
const REGULATED_SECTORS: readonly Sector[] = [
  "Law",
  "Finance",
  "Real Estate & Property",
  "Construction",
] as const;

export function isRegulatedSector(sector: Sector): boolean {
  return REGULATED_SECTORS.includes(sector);
}

export function getRegulatedSectors(): readonly Sector[] {
  return REGULATED_SECTORS;
}
```

**3. No changes to calculateScore, getTierName, or other scoring logic** — existing logic is sufficient for both paths.

---

### `src/components/assessment/DeepResultsScreen.tsx` (component, request-response)

**Analog:** `src/components/assessment/DeepResultsScreen.tsx` (self, lines 1-75)

**Role:** Update to remove Calendly CTA, route to /checkout instead.

**Current CTA pattern** (lines 66-71):
```typescript
<div className={styles.cta}>
  <p className={styles.ctaHint}>{tier.action}</p>
  <a href="https://calendly.com/asorahura" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
    Book a Discovery Call
  </a>
</div>
```

**Updated pattern:**
```typescript
<div className={styles.cta}>
  <p className={styles.ctaHint}>Ready to act on your results?</p>
  <Link href="/checkout?assessment=deep" className={styles.ctaBtn}>
    View Your Roadmap →
  </Link>
</div>
```

**OR integrate revenue framing:**
```typescript
import { getRevenueOpportunities } from "@/lib/revenueCalculation";

// After calculating tier (line 14), add:
const revenueData = getRevenueOpportunities(total, sector);

// Add revenue block above dimension breakdown:
<div className={styles.revenueBlock}>
  <span className={styles.revenueLabel}>Estimated Monthly Value</span>
  <div className={styles.revenueAmount}>~${revenueData.totalMonthlyValue}/month</div>
</div>
```

---

### `src/app/engage/page.tsx` (page, request-response)

**Analog:** `src/app/engage/page.tsx` (self, lines 1-80+)

**Role:** Keep 10-field form, detect enterprise=true URL param and potentially adjust UX or routing.

**Detection pattern** (modeled after tier param detection, line 9):
```typescript
"use client";

import { useSearchParams } from "next/navigation";

function EngageFormInner() {
  const score = useSearchParams().get("score");
  const tierParam = useSearchParams().get("tier");
  const sector = useSearchParams().get("sector");
  const isEnterprise = useSearchParams().get("enterprise") === "true"; // NEW

  // Form submission: if enterprise=true, could route differently post-submission
  // Or just pass enterprise flag in formData to backend for email routing
```

**Form modification** (optional: adjust CTA or heading if enterprise):
```typescript
<div className={styles.header}>
  <p className={styles.eyebrow}>
    {isEnterprise ? "Enterprise Discovery Brief" : "Discovery Brief"}
  </p>
  <h1 className={styles.headline}>
    {isEnterprise ? "Discuss Your Enterprise Challenges" : "Tell Me About Your Problem"}
  </h1>
  {/* ... rest unchanged ... */}
</div>
```

---

### `src/app/checkout/page.tsx` (page, request-response)

**Analog:** `src/app/checkout/page.tsx` (self, lines 1-80+)

**Role:** No modifications needed for Phase 10. Assessment already routes to /checkout as primary CTA. Planner may add `?assessment=deep` support for deep assessment variant.

**Optional enhancement** (line 20):
```typescript
const tierParam = useSearchParams().get("tier") as TierId | null;
const assessmentParam = useSearchParams().get("assessment"); // NEW: track if from deep assessment
```

---

### `src/app/services/page.tsx` (page, request-response)

**Analog:** `src/app/services/page.tsx` (self, lines 1-100+)

**Role:** Update all Calendly CTAs to route to /engage instead. Plan removes Calendly from primary path.

**Current pattern** (lines 24, 40, 56, 72):
```typescript
cta: { text: "Book Strategy Session", href: "https://calendly.com/asorahura" },
```

**Updated pattern** (route to enterprise engage form):
```typescript
cta: { text: "Schedule a Call", href: "/engage?enterprise=true" },
```

**Alternative (per research):** Route /services CTAs to enterprise intake depending on planner's decision. Keep services as generic but mark enterprise tier differently.

---

### `src/app/assessment/page.tsx` (page, request-response)

**Analog:** `src/app/assessment/page.tsx` (self, lines 1-37)

**Role:** Update to include sector gating before assessment, or add gating component as first step in AssessmentShell.

**Option A: Add gate at page level** (replace AssessmentShell with gate):
```typescript
import { AssessmentSectorGate } from "@/components/assessment/AssessmentSectorGate";
import { AssessmentShell } from "@/components/assessment/AssessmentShell";

export default function AssessmentPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {/* hero stays same or updated for gate messaging */}
      </section>

      <section className={styles.shell}>
        <AssessmentSectorGate /> {/* Gate first, then Shell */}
      </section>
    </main>
  );
}
```

**Option B: Add gate inside AssessmentShell** (modeled on SectorPicker, which is step 2 in current flow):
```typescript
// In AssessmentShell, before `step === "sector"`:
if (step === "intro" && !sectorgateShown) {
  return <AssessmentSectorGate onSelect={() => setSectorGateShown(true)} />;
}
```

---

### `src/components/assessment/AssessmentShell.tsx` (component, request-response)

**Analog:** `src/components/assessment/AssessmentShell.tsx` (self, lines 1-193)

**Role:** Update to use RevenueResultsScreen instead of ResultsScreen, or conditionally render based on results type.

**Current import & usage** (lines 7, 183-188):
```typescript
import { ResultsScreen } from "./ResultsScreen";

// ...
if (step === "results" && result) {
  return (
    <ResultsScreen
      score={result.score}
      tier={result.tier}
      firstName={result.firstName}
      sector={sector}
    />
  );
}
```

**Updated pattern** (route to RevenueResultsScreen):
```typescript
import { RevenueResultsScreen } from "./RevenueResultsScreen";

// ...
if (step === "results" && result) {
  return (
    <RevenueResultsScreen
      assessmentType="quick"
      score={result.score}
      tier={result.tier}
      firstName={result.firstName}
      sector={sector}
    />
  );
}
```

---

### `src/components/assessment/DeepAssessmentShell.tsx` (component, request-response)

**Analog:** `src/components/assessment/DeepAssessmentShell.tsx` (existing — not fully read, but pattern mirrors AssessmentShell)

**Role:** Update results rendering to route to RevenueResultsScreen or updated DeepResultsScreen with /checkout CTA.

**Estimated pattern** (adapting AssessmentShell structure):
```typescript
// Import updated component:
import { DeepResultsScreen } from "./DeepResultsScreen"; // OR RevenueResultsScreen

// On results render:
if (step === "results" && result) {
  return (
    <DeepResultsScreen
      assessmentType="deep"
      total={result.total}
      byDimension={result.byDimension}
      firstName={result.firstName}
      sector={sector}
    />
  );
}
```

---

### `src/lib/email.ts` (utility, request-response)

**Analog:** `src/lib/email.ts` (self, lines 1-80+)

**Role:** Update email templates and segmentation logic to remove Calendly CTAs from primary assessment emails; retain Calendly only in enterprise/cold/warm segment emails.

**Current Calendly constant** (line 11):
```typescript
export const CALENDLY_URL = "https://calendly.com/asorahura";
```

**No removal needed:** Constant can remain for enterprise emails. Instead, update email template logic.

**Segmentation pattern** (inferred from RESEARCH.md; not fully visible in excerpt):

**Before:** Cold/warm segments from assessment route to Calendly in email.

**After:** Cold/warm from assessment route to enterprise intake form (`/engage`). Only cold/warm from _enterprise_ intake (`/engage?enterprise=true`) route to Calendly.

**Implementation placeholder** (in email send function, around line 37):
```typescript
// When building email body for assessment segment:
if (segment === "cold" || segment === "warm") {
  // OLD: include CALENDLY_URL
  // NEW: route to /engage instead
  const engageLink = `${BASE_URL}/engage?segment=${segment}&score=${score}`;
  // Use engageLink in email CTA, not CALENDLY_URL
}

// When building email for enterprise intake (separate flow):
if (isEnterpriseIntake) {
  // KEEP: Calendly link allowed here
  const cta = CALENDLY_URL;
}
```

---

## Shared Patterns

### Assessment Scoring & Tier Calculation
**Source:** `src/lib/assessment.ts` (lines 392-431)
**Apply to:** All assessment-related files, especially RevenueResultsScreen and revenueCalculation.ts

Pattern ensures consistent score-to-tier mapping across quick (0-100) and deep (0-72) assessments.

```typescript
// Reuse existing functions:
import { calculateScore, getTierName, getTierDescription, getPreviewBullets, getSegment } from "@/lib/assessment";
```

### Sector-Specific Customization
**Source:** `src/lib/assessment.ts` (lines 27-447: sectorSpecific question overrides)
**Apply to:** All sector-aware components

Pattern ensures question text, options, and descriptions adapt per sector. Extend with revenue-specific per-sector data in revenueCalculation.ts.

```typescript
const override = question.sectorSpecific?.[sector];
const adaptedText = override?.text ?? question.text;
const adaptedOptions = override?.options ?? question.options;
```

### URL Parameter Routing
**Source:** `src/app/engage/page.tsx` (line 8-9: useSearchParams for score, tier)
**Apply to:** All pages that branch on context (enterprise vs. SMB, segment, sector)

Pattern standardizes query param detection and routing logic.

```typescript
const score = useSearchParams().get("score");
const enterprise = useSearchParams().get("enterprise") === "true";
const sector = useSearchParams().get("sector");
```

### Responsive Layout & CSS Modules
**Source:** `src/app/assessment/assessment.module.css` (schema: page, hero, heroInner, etc.)
**Apply to:** All new pages and components (enterprise, results screen variants)

Existing module.css files follow consistent naming. Extend patterns:
- `.page` = container
- `.hero` = hero section
- `.heroInner` = hero content wrapper
- `.section*` = major sections
- `.cta` = call-to-action blocks

### Testimonial & Case Study Reuse
**Source:** `src/components/shared/TestimonialCard.tsx` (imported in ResultsScreen, services, work pages)
**Apply to:** Enterprise track page

Import testimonials from `@/content/testimonials.json` and render with TestimonialCard for consistency.

```typescript
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import testimonials from "@/content/testimonials.json";

testimonials.assessmentResults.map(t => <TestimonialCard {...t} />)
```

### Server Actions & Form Submission
**Source:** `src/app/assessment/actions.ts` (submitAssessmentForEmail pattern, lines 15-59)
**Apply to:** All form submissions (engage, enterprise intake)

Pattern validates input server-side, fires off async side-effects (email, analytics), returns success/error response to client.

```typescript
"use server";

export async function submitForm(data: FormData): Promise<{ success: boolean; error?: string }> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "..." };
  
  // Fire-and-forget side effects:
  void sendEmail(...);
  void trackAnalytics(...);
  
  return { success: true };
}
```

---

## No Analog Found

Files with no close match in the codebase (planner should reference RESEARCH.md patterns or create from scratch):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| None | — | — | All Phase 10 files have existing analogs or are self-modifications. |

---

## Metadata

**Analog search scope:** `src/app/`, `src/components/`, `src/lib/`
**Files scanned:** 30+
**Pattern extraction date:** 2026-08-09

### Files with Exact Analogs (Highest confidence)
- ResultsScreen.tsx → existing ResultsScreen (role + data flow match)
- Footer.tsx → existing Footer (self-modify)
- Navigation.tsx → existing Navigation (self-modify)
- Assessment.ts → existing assessment.ts (self-modify)
- Email.ts → existing email.ts (self-modify)

### Files with Role-Match Analogs (Good confidence)
- RevenueResultsScreen.tsx → ResultsScreen (component, request-response)
- RevenueCalculation.ts → assessment.ts (utility, transform)
- AssessmentSectorGate.tsx → SectorPicker (component, request-response)
- Enterprise/page.tsx → services/page.tsx (page, request-response)

### Files with No New Code (Self-modifications only)
- Engage/page.tsx, Checkout/page.tsx, Services/page.tsx, DeepResultsScreen.tsx, DeepAssessmentShell.tsx, AssessmentShell.tsx, Assessment/page.tsx

---

## Pattern Coverage Summary

### Request-Response (Page & Component Routing)
- **Primary pattern:** Link/useRouter navigation with URL params
- **Found in:** Assessment/page.tsx, ResultsScreen.tsx, engage/page.tsx, Footer.tsx, Navigation.tsx
- **Reuse for:** Enterprise/page.tsx, AssessmentSectorGate.tsx, RevenueResultsScreen.tsx

### Data Transform (Utility Calculation)
- **Primary pattern:** Pure functions that map input → output with no side effects
- **Found in:** assessment.ts (calculateScore, getTierName, etc.), sectorRecommendations.ts
- **Reuse for:** revenueCalculation.ts (getRevenueOpportunities)

### Server Actions (Form & Email)
- **Primary pattern:** "use server" functions that validate, side-effect, return response
- **Found in:** assessment/actions.ts (submitAssessmentForEmail)
- **Reuse for:** engage/actions.ts (existing), potential enterprise intake actions

### Styling & Layout
- **Primary pattern:** CSS modules with responsive breakpoints, semantic class naming
- **Found in:** assessment.module.css, ResultsScreen.module.css, services.module.css
- **Reuse for:** RevenueResultsScreen.module.css, enterprise.module.css, AssessmentSectorGate.module.css

---

