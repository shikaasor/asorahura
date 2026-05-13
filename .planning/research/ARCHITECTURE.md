# Site Architecture & Information Architecture Research

**Project:** asorahura.com - Single Expert Brand  
**Date:** May 2026  
**Objective:** Establish high-conversion site architecture for expert/service website with three entry states (cold/warm/hot)

---

## 1. Page Hierarchy & Recommended Structure

### Overall Site Map (Build Order Priority)

```
PHASE 1 - FOUNDATION (Critical Path)
├── Homepage (entry point for all three states)
├── Assessment (captures cold leads, determines routing)
└── Checkout/Services (fulfillment, final conversion)

PHASE 2 - CONVERSION SCAFFOLDING
├── Navigation/Header (routes between phases 1 items)
├── Blog (nurture cold leads, build authority)
└── Case Studies/Work (social proof for all entry states)

PHASE 3 - ENGAGEMENT & SECONDARY
├── Engage/Strategy Call Form (warm → hot routing)
├── Services Page (detailed offering details, pricing anchor)
└── Footer/Navigation refinement

PHASE 4 - OPTIMIZATION
├── Email automation sequences
├── CRM/lead scoring integration
├── Analytics & tracking
```

**Why This Order?** Assessment form must exist before checkout—it qualifies leads and routes them. Homepage must exist first to host navigation. Blog and case studies are confidence-builders, not blocking conversion paths.

---

## 2. Page-Level Architecture

### 2.1 Homepage Structure

**Primary Objective:** Answer three questions in 5 seconds
1. What problem do you solve?
2. What's your expertise?
3. What should I do next?

**Recommended Structure (Desktop + Mobile):**

```
HERO SECTION (above fold)
├── Headline: Problem statement or specific pain point
├── Subheading: Promise/transformation
├── Visual: Expert photo or contextual imagery (builds trust)
├── Primary CTA: "Start Assessment" (for cold leads) or "Schedule Strategy Call" (for warm)
└── Supporting copy: 1-2 lines showing credibility signal

VALUE PROPOSITION SECTION
├── 2-3 pain points addressed (short, scannable)
├── How expertise solves each (brief, benefit-focused)
└── Quick trust signal: credentials, certifications, media mentions

SOCIAL PROOF SECTION
├── 2-3 quantified results from case studies
│   Example: "Helped 50+ leaders" / "Average 40% improvement"
├── 1-2 short testimonial quotes (with name, title, company)
└── Client logos (if applicable to single-expert brand)

SECONDARY CTA / ENGAGEMENT OPTIONS
├── "Read case studies" (warm leads, confidence building)
├── "Explore approach" → links to Services
├── "Join mailing list" (nurture path for cold)
└── Navigation breadcrumb: "Or, [link to assessment]"

FOOTER
├── Contact info (email, phone if appropriate)
├── Quick links: Assessment, Blog, Services, Work
├── Email signup secondary offer
└── Social proof: "Trusted by [segment]"
```

**Key Principles:**
- Single primary CTA above fold (all other paths are secondary)
- Minimize distractions (no hero carousel, excessive animations)
- Mobile: Single-column, thumb-friendly CTAs, 44×44px minimum touch targets
- Trust signals near primary CTA (badges, credentials, testimonials)

**Mobile-Specific Adjustments:**
- Stack sections vertically
- Full-width buttons (primary CTA spans entire width)
- Reduce hero image size or use background overlay to improve readability
- Simplify testimonials to name + quote (remove company initially, reveal on tap)

---

### 2.2 Assessment Page

**Primary Objective:** Qualify lead, segment by readiness (cold→warm→hot), capture email

**Type:** Single-page or multi-step quiz depending on complexity
- **Single-page:** 5-8 questions, shows results immediately (better for mobile)
- **Multi-step:** 3-5 steps, 3-5 fields per step, progress bar visible

**Recommended: Multi-Step (3-4 steps, 12-15 questions total)**

```
STEP 1: INITIAL QUALIFICATION (3-4 questions)
├── What's your biggest current challenge? (multiple choice)
├── How urgent is this for you? (radio: Now / Next 3 months / Exploring)
├── Have you worked on this before? (Yes/No/Partially)
└── What's your target outcome? (text input)

STEP 2: SPECIFIC PAIN POINTS (4-5 questions)
├── Which areas affect you most? (checkboxes, max 3)
├── Describe your current approach (short text)
├── What's preventing progress? (multiple choice)
└── What resources are available? (budget, time, team size)

STEP 3: READINESS & NEXT STEPS (3-4 questions)
├── Timeline for implementation? (dropdown)
├── Who else needs to be involved? (text)
├── How would you measure success? (text)
└── [Email capture here] "Get personalized assessment"

RESULTS PAGE (immediate, before email capture if possible)
├── Personalized assessment result based on answers
│   Example: "You're at Stage 2 - Ready to Build" (warm lead)
├── 2-3 specific recommendations
├── Next action: "Schedule 15-min consultation" or "Explore case studies"
└── [Email gated optional:] "Get detailed report emailed"
```

**Data Capture & Routing:**

```
ASSESSMENT RESULTS MAPPING:
- Answers to Q1-Q3 → Lead scoring (0-100)
- Score 0-30 → Cold lead path
  └─ Next action: "Read blog series" + nurture sequence
- Score 31-70 → Warm lead path
  └─ Next action: "Schedule strategy call" (Engage form)
- Score 71-100 → Hot lead path
  └─ Next action: "View pricing & get started" (Services/Checkout)

EMAIL CAPTURE TIMING:
- Capture before showing results: Reduces abandonment, ensures email
- OR after results: Increases perceived value, shows relevance first
- BEST PRACTICE: Capture after showing preview of results
  "Get your detailed assessment report emailed"
```

**Mobile Considerations:**
- Progress indicator (%) visible at top
- Single-column layout, full-width inputs
- Large radio buttons/checkboxes (48×48px)
- Save progress automatically (localStorage)
- Allow back navigation without data loss
- Results page scrollable, with floating "Next Step" CTA at bottom

**Technical Integration:**
- Form tool: Jotform, Typeform, Heyflow (assessment/quiz capability)
- Data sync: Assessment responses → email platform (Mailchimp, ActiveCampaign, ConvertKit)
- Lead scoring: Automatic tagging based on score range
- CRM link: Responses also push to CRM if available (HubSpot, Pipedrive)

---

### 2.3 Services Page

**Primary Objective:** Explain offerings in detail, anchor pricing, reduce sales friction for warm leads

**Structure:**

```
HEADLINE + INTRO (above fold)
├── "Here's how I help [specific audience]"
├── Brief intro to approach/methodology
└── CTA: "Already know you're ready? Go to checkout"

SERVICE TIER BREAKDOWN (or Service 1 / Service 2 format)
├── Service Card 1: [Type] - [Outcome]
│   ├── Who it's for (specific problem/stage)
│   ├── What's included (3-5 bullet points)
│   ├── Typical outcome/result
│   ├── Pricing: $X or "Custom"
│   ├── Timeline/Duration
│   └── CTA: "Learn more" or "Get started"
│
├── Service Card 2: Similar structure
│
└── Service Card 3: (if applicable)

METHODOLOGY/APPROACH SECTION
├── How you work (process, philosophy)
├── Why this approach works (based on your expertise)
├── What to expect (timeline, deliverables, success metrics)
└── "Not the right fit?" → Redirect to Assessment or Blog

PRICING ANCHOR + FAQ
├── Price comparison table (if multiple services)
├── What's included / what's not (transparency)
├── FAQ: Common questions
│   - How long until I see results?
│   - Can I customize the engagement?
│   - What's the cancellation policy?
│   - How do we communicate?
└── CTA: "Choose your path" → Assessment or Services selection

FINAL CTA + REASSURANCE
├── "Ready to get started?"
├── Clear next steps: 
│   - Not sure? → Assessment
│   - Want to discuss? → Schedule call (Engage form)
│   - Ready to go? → Checkout
└── Trust signal: Money-back guarantee, risk reversal
```

**Mobile-Specific:**
- Card layout: Stack vertically, full width
- Pricing: Prominent, sticky during scroll
- CTAs: Clear hierarchy—one primary per section
- Comparison table: Horizontal scroll or simplified view

---

### 2.4 Work / Case Studies Page

**Primary Objective:** Build confidence for warm leads, prove outcomes for hot leads

**Recommended Count:** 3-5 featured case studies (quality over quantity)

**Case Study Page Structure:**

Each case study follows this format:

```
CASE STUDY HEADER
├── Project/Client name (or anonymized if needed)
├── Industry/Context
├── Client problem (1-2 sentences)
└── Hero image or visual

THE CHALLENGE SECTION
├── Specific problem/pain point
├── Why it mattered to the client
├── What they'd tried before
├── What was at stake

THE SOLUTION SECTION
├── Your approach (briefly)
├── Key actions/interventions
├── Timeline
└── Technologies/methods used

THE RESULTS SECTION (most important)
├── Quantified outcomes:
│   - Revenue increase / Time saved / Efficiency gain
│   - X% improvement / Saved $Y / Now doing Z
├── Qualitative outcomes:
│   - Client quote/testimonial
│   - Changed mindset/capability
│   - New opportunities unlocked
└── Visual: Graph, before/after, metric display

LESSONS LEARNED / INSIGHT
├── Key takeaway for reader
├── How this applies to similar situations
└── CTA: "Is this your situation? Start assessment" or "Schedule call"
```

**Work/Case Studies Index Page:**

```
HEADLINE
├── "Here's what I've helped leaders achieve"

CASE STUDY GRID (3-5 cards)
├── Card: [Client/Project name]
│   ├── Industry/context (small text)
│   ├── Challenge (1 line)
│   ├── Key result (bold, quantified)
│   └── [Read case study link]
└── Repeat for each study

FOOTER CTA
├── Pattern recognition: "Is this you?"
├── "Get personalized assessment" → Assessment page
├── "Let's talk about your situation" → Engage form
└── "Explore all services" → Services page
```

**Mobile Considerations:**
- Case studies on separate pages (not infinite scroll)
- Results metrics large, readable
- Client testimonial highlighted
- Easy nav between studies (prev/next buttons)

---

### 2.5 Engage / Strategy Call Form

**Primary Objective:** Convert warm leads to hot by collecting intent/context, routing to sales

**When Used:** Warm leads who want to discuss before assessing or are post-assessment and want deeper conversation

**Form Structure:**

```
HEADLINE
├── "Let's discuss your situation"
├── Subtext: "15-min call to explore if we're a fit"

CONTACT INFORMATION (3 fields)
├── Name
├── Email
├── Phone

CONTEXT/INTENT SECTION (5-6 fields)
├── What brings you here? (short text)
├── Your title/role
├── Company/organization
├── What's your timeline? (dropdown: This month / Next 2 months / Exploring)
├── What's your biggest challenge right now? (textarea)
└── Any other context I should know? (textarea, optional)

LOGISTICS (2 fields)
├── Preferred time/timezone
├── Any prep questions? (optional)

CTA BUTTON
└── "Schedule call" or "Send availability"
```

**Field Count:** 11 total, grouped into 3 sections (reduce cognitive load)

**Mobile Adjustments:**
- Single-column layout
- Large text inputs (mobile-friendly)
- Date/time picker (not manual entry)
- Submit button: full-width, 44×44px minimum

**Post-Submission:**
```
CONFIRMATION PAGE
├── "Got it! Here's what happens next..."
├── Timeline: "You'll receive a calendar link within 1 hour"
├── Expectations: "I'll review your situation and come prepared"
└── Contact reassurance: "Questions? Reply to confirmation email"
```

**Integration:**
- Form data → CRM (contact record created)
- Email → Engagement email sequence
- Calendar link: Calendly/Cal.com integration for scheduling
- Automatic notification to expert/sales team

---

### 2.6 Blog Page

**Primary Objective:** Build authority, capture cold leads, improve SEO, nurture email list

**Blog Index Structure:**

```
HEADLINE
├── "Insights for [your audience]"

FEATURED POST (if 1st time visitor)
├── Large hero image
├── Post title
├── Category, author, date
├── Excerpt
└── "Read article" CTA

BLOG GRID (5-10 recent posts)
├── Post card: [Title]
│   ├── Category tag
│   ├── Excerpt (2-3 sentences)
│   ├── Date / read time
│   └── [Read more]

SIDEBAR / SECONDARY (desktop only)
├── Email signup CTA: "Get weekly insights"
├── Popular posts / Most read
├── Search bar
└── Category filter

PAGINATION
└── Previous/Next posts or "Load more"
```

**Individual Blog Post Structure:**

```
HEADER
├── Title
├── Category, date, author, read time
├── Featured image
└── Social share buttons

POST BODY
├── Introduction (hook, outline)
├── Sections with subheadings
├── Pull quotes (key insights)
├── Inline CTA (1-2 per post): "Learn more about [service]"
└── Conclusion with key takeaway

POST FOOTER
├── Author bio (small, with CTA)
├── Related posts (3 links)
├── Email signup: "Get future posts"
└── Social share buttons

CONTEXTUAL CTAs (based on topic)
├── If post about pain point → Assessment
├── If post about solution → Services or case study
├── If post about implementation → Strategy call form
└── Generic fallback: Email signup
```

**Mobile Considerations:**
- Single column layout
- Large, readable font (16px minimum body text)
- Easy navigation (prev/next posts)
- Social share buttons: sticky float or end-of-post placement
- No popup overlays (intrusive on mobile)

---

## 3. Navigation Patterns

### 3.1 Primary Navigation (Header)

**Principle:** Minimal, clear, no more than 4-5 items

**Recommended Structure (Desktop):**

```
[LOGO/BRAND]  [Home]  [Services]  [Work]  [Blog]  [CTA Button]
```

**Navigation Items (In Priority Order):**
1. **Home** - Entry point, always available
2. **Services** - What you offer (warm leads exploring details)
3. **Work** - Case studies/proof (social proof)
4. **Blog** - Content/nurture (cold leads building trust)
5. **Assessment** - NOT in nav bar (should be prominent CTA instead)

**Why this order?**
- Services comes before Work because people want to know what you offer before seeing proof
- Assessment is CTA (hero button), not nav item—don't bury it in menu

**Mobile Navigation:**

```
[LOGO]  [Hamburger Menu]  [PRIMARY CTA BUTTON]

EXPANDED MENU:
├── Home
├── Services
├── Work
├── Blog
├── [Sticky "Assessment" button near bottom]
└── Contact / Socials
```

**Key Principle:** Mobile nav should have ONE prominent action—assessment or schedule call—not multiple CTAs.

### 3.2 CTA Button Strategy

**Three-Part Placement Strategy:**

1. **Hero CTA (above fold, primary entry point)**
   - Label: "Start Assessment" or "Schedule 15-min Call"
   - Destination: Assessment page or Engage form
   - Style: High contrast, large (48-56px button height)
   - Mobile: Full-width button

2. **Sticky Header CTA (scrolling pages)**
   - Appears on: Services, Blog, Work pages
   - Label: Primary action for that page (e.g., "Schedule Call" on Services)
   - Style: Smaller than hero CTA, fixed position (top right or sticky nav)
   - Mobile: Sticky floating button (bottom right, not covering content)
   - Remove after form is submitted (via JavaScript)

3. **Section CTAs (mid-content)**
   - Appear after: Pain points section, case study results, feature section
   - Label: Contextual to section ("Ready to improve this?" or "Let's talk about your approach")
   - Style: Secondary button color (less prominent than header CTA)
   - Mobile: Same styling, full-width preferred

**CTA Best Practices:**
- Primary CTA on every page (no dead ends)
- Use action verbs: "Start Assessment", "Schedule Call", "Get Pricing"
- Avoid: "Learn More", "Submit", "Next" (weak conversions)
- Button color: High contrast, consistent across site
- Mobile: Button height 44×44px minimum, full-width on mobile preferred
- Hover state: Clear visual feedback

### 3.3 No-Exit Design Principles

**Goal:** Prevent dead ends, ensure every page offers a next action

**Rules:**

1. **Every page footer includes:**
   - Primary CTA (assessment or call)
   - Navigation to main pages
   - Email signup secondary CTA
   - Social links (optional)

2. **Every page body includes 1-2 contextual CTAs:**
   - Not sure you need help? → Assessment
   - Want to learn more? → Services or Blog
   - Ready to move forward? → Checkout or Engage form

3. **Assessment page always routes to:**
   - Cold lead (score 0-30): Email nurture + blog recommendations
   - Warm lead (score 31-70): Strategy call form (Engage)
   - Hot lead (score 71-100): Services/Checkout

4. **Engagement form → Sales engagement sequence**
   - Confirm call scheduled
   - Pre-call prep info
   - Post-call next steps (proposal, contract, etc.)

---

## 4. Conversion Funnel Architecture

### 4.1 Three Entry Points & Routing

```
COLD LEAD ENTRY POINT:
Homepage → Assessment (low confidence)
     ↓
Assessment Result: Score 0-30
     ↓
└─→ Email nurture sequence (blog, case studies, insights)
     └─→ Engagement trigger: Click through blog + case study
          └─→ Warm lead conversion (move to warm path)

---

WARM LEAD ENTRY POINT:
Homepage → Services Page OR Blog Post (some confidence)
     ↓
Explore offerings, read case studies, build confidence
     ↓
Ready to discuss → Engagement Form (Schedule call)
     ↓
└─→ Email sequence + Calendar link
     └─→ Strategy call (expert-to-lead conversation)
          └─→ Hot lead conversion (proposal/checkout)

---

HOT LEAD ENTRY POINT:
Direct URL (shared by referrer) OR Assessment score 71-100
     ↓
Assessment shows high readiness OR direct link to Services
     ↓
View pricing/options → Ready to commit
     ↓
└─→ Checkout flow
     └─→ Onboarding sequence
          └─→ Payment + delivery
```

### 4.2 Funnel Conversion Rates & Metrics

**Benchmarks (based on research):**

```
COLD LEAD PATH:
Homepage visit: 100 people
├─ Click assessment: 12% = 12 starts
├─ Complete assessment: 85% of starts = ~10 completions
├─ Subscribe to nurture: 80% of completes = ~8 subscribers
├─ Click through nurture email: 25% of subscribers = ~2
└─ Warm lead conversion: 15% of engaged = ~0.3 hot leads

WARM LEAD PATH:
Homepage/Services visit: 100 people
├─ Read case studies/services: 45% = 45 engaged
├─ Schedule call: 20% of engaged = ~9 calls
├─ Call conversion to proposal: 60% = ~5 hot leads
└─ Proposal to paid: 70% = ~3.5 customers

HOT LEAD PATH:
Referral/Direct visit: 100 people
├─ Land on checkout: 100 = 100 people
├─ Pricing/options clear: 70% ready to proceed = 70
├─ Complete checkout: 80% of ready = 56
└─ Customer: ~56% of hot traffic
```

### 4.3 Funnel Flow Diagram (Text-Based)

```
                           COLD LEADS
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        [Assessment Page]           [Blog/Services]
           │                              │
           │ (Score 0-30)                 │
           ▼                              │
      [Email Nurture]                     │
           │                              │
           │ (Click-through →)            │
           └──────────────┬───────────────┘
                          ▼
                     WARM LEADS
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
[Engagement Form]                   [Continue Nurture]
   (Schedule Call)                   (Blog + Case Studies)
        │                                   │
        ├─→ [Calendar Link] ───┐           │
        │                       │           │
        └──→ [Email Sequence]   │           │
                                │           │
                    ┌───────────┘           │
                    │                       │
                    ▼                       │
            [Strategy Call]                │
                    │                       │
            ┌───────┴───────┐              │
            │               │              │
         (Ready)        (Not Ready)        │
            │               │              │
            ▼               ▼              ▼
          HOT      → [More Nurture] → (Back to Warm)
          LEADS
            │
        ┌───┴───┐
        ▼       ▼
   [Proposal] [Services]
        │       │
        └───┬───┘
            ▼
      [CHECKOUT]
            │
            ▼
      [CUSTOMER]
```

---

## 5. Email Flow Integration

### 5.1 Email Capture Points

```
LOCATION 1: Assessment Completion
├─ When: After assessment results shown
├─ Ask for: Email (required), first name (optional)
├─ Copy: "Get your detailed assessment report + personalized insights"
├─ Next: Automated response with results PDF + nurture sequence

LOCATION 2: Blog Post Signup
├─ When: In blog sidebar or post footer
├─ Ask for: Email only
├─ Copy: "Get future posts in your inbox" or "[Specific topic] insights weekly"
├─ Next: Welcome email + last 3 posts + nurture sequence

LOCATION 3: Engagement Form
├─ When: Schedule call form submission
├─ Ask for: Email (required for calendar link)
├─ Copy: Already captured; send calendar link to email
├─ Next: Confirmation email + pre-call prep sequence

LOCATION 4: Footer Signup (Optional, on all pages)
├─ When: Page footer (sticky or fixed)
├─ Ask for: Email only
├─ Copy: "Join [#] leaders learning about [topic]"
├─ Next: Welcome email + nurture sequence
```

### 5.2 Assessment Completion → Email Automation

```
FLOW:
User completes assessment
     ↓
Score calculated instantly
     ↓
Results shown (personalized based on score)
     ↓
Email capture: "Get detailed report"
     ↓
Email/CRM record created with:
├─ Name, email, phone
├─ All assessment answers
├─ Lead score (0-100)
├─ Lead segment (cold/warm/hot)
└─ Source tag: "Assessment"

TRIGGERED SEQUENCES:

IF Score 0-30 (Cold Lead):
├─ Day 0: Welcome email + assessment report PDF
├─ Day 1: Case study 1 (relevant to challenges mentioned)
├─ Day 4: Blog article (problem-focused)
├─ Day 8: Case study 2 (different approach)
├─ Day 15: "Ready to talk?" → CTA to Schedule Call
├─ Day 30: Checkpoint email (re-engagement)
└─ Then: Ongoing newsletter (2x/month)

IF Score 31-70 (Warm Lead):
├─ Day 0: Welcome email + assessment report PDF + "Next Steps"
├─ Day 1: "Let's talk about your situation" → Schedule Call CTA (primary)
├─ Day 3: Auto-follow-up if no call scheduled (reminder)
├─ Day 7: Relevant case study
├─ Day 14: Still interested? → Alternative CTA (Blog or Services)
└─ Post-call: Sales sequence

IF Score 71-100 (Hot Lead):
├─ Day 0: Welcome email + assessment report + "You're ready for implementation"
├─ Day 1: Services/Pricing page link + "Let's discuss next steps"
├─ Day 1 (Sales Alert): Expert/sales team notified → outbound call
├─ Day 3: If no contact → "Interested in [Service A]?" → Checkout link
└─ Post-purchase: Onboarding sequence
```

### 5.3 Lead Scoring & Nurture Routing

```
LEAD SCORE CALCULATION:

Base from Assessment (0-100):
├─ Question 1 response: 0-20 pts
├─ Question 2 response: 0-20 pts
├─ Question 3 response: 0-20 pts
├─ Question 4 response: 0-20 pts
└─ Question 5 response: 0-20 pts

Behavioral Scoring (added over time):
├─ Email open: +1 point (max 5 per email)
├─ Link click: +3 points (max 5 per link)
├─ Case study page view: +5 points
├─ Services page view: +5 points
├─ Blog page view: +2 points
└─ Engagement form start: +10 points

AUTO-ROUTING RULES:

IF score reaches 70+ → Assign to sales team (notify expert)
IF score 31-69 and opened 5+ emails → Nurture + opportunity to move up
IF score 0-30 and no engagement for 30 days → Check-in email or pause
IF completed call (Engage form) → Move to "Sales Engaged" tag
IF purchased → Move to "Customer" tag + onboarding sequence
```

### 5.4 Email Sequences by Lead Type

**Cold Lead Nurture Sequence (Email 1-6):**

```
Email 1: Welcome + Report
- Subject: "Your [Assessment Name] Results - [Name]"
- Content: Personalized assessment summary
- Attachments: Full report PDF
- CTA: "View case study related to your challenge"

Email 3 (day 4): Case Study
- Subject: "How [Similar Company] Solved [Challenge] in [Timeline]"
- Content: Case study teaser + results
- CTA: "Read full case study"

Email 5 (day 8): Educational
- Subject: "The #1 Reason Most [Audience] Struggle With [Problem]"
- Content: Blog excerpt or insight article
- CTA: "Read full article"

Email 7 (day 15): Call-to-Action
- Subject: "Ready to move forward? Let's talk strategy"
- Content: Soft pitch + social proof
- CTA: "Schedule a 15-minute call"

Email 9 (day 30): Re-engagement
- Subject: "Still thinking about [Goal]?"
- Content: Success story + reminder of offer
- CTA: "Let me know if you have questions"

Then: Newsletter/ongoing content (2x month)
```

**Warm Lead Engagement Sequence (Email 1-3):**

```
Email 1: Welcome + Next Steps
- Subject: "Your Assessment + Next Steps - [Name]"
- Content: Personalized assessment insights + clear next action
- CTA: "Schedule 15-min call to discuss"

Email 2 (day 3, if no action): Follow-Up
- Subject: "[Name], let's discuss your situation"
- Content: Reminder + social proof (case study teaser)
- CTA: "Pick a time to talk"

Then: Sales sequence (expert/sales team takes over)
```

**Post-Call Sequence (Sales Takes Over):**

```
Email 1: Post-Call
- Subject: "Great talking with you - Here's what we discussed"
- Content: Call summary + agreed next steps
- Attachments: Proposal, service agreement, pricing (if ready)
- CTA: "Reply to confirm next step" or "Let's move forward"

Email 2 (day 7, if no action): Gentle Nudge
- Subject: "Questions about [Service/Proposal]?"
- Content: FAQ or offer to clarify
- CTA: "Schedule a quick clarification call" or "Confirm and let's go"

Email 3 (day 14): Final Touch
- Subject: "[Name], I want to make sure this works for you"
- Content: Risk reversal / guarantee info
- CTA: "Let's get you started" or "I'm not the right fit (unsubscribe)"
```

---

## 6. Data Flow & Lead Routing

### 6.1 Assessment Data → CRM/Email Platform

```
USER SUBMITS ASSESSMENT
    │
    ▼
[Form Submission]
    │
    ├──→ [Form Tool] (Jotform/Typeform)
    │      └─→ Stores response data
    │
    ├──→ [Assessment Results] (Real-time calculation)
    │      ├──→ Score 0-100
    │      ├──→ Segment: cold/warm/hot
    │      └──→ Personalized results display
    │
    ├──→ [Webhook/Integration]
    │      │
    │      ├──→ [Email Platform] (Mailchimp/ActiveCampaign/ConvertKit)
    │      │      ├─ Create contact record
    │      │      ├─ Add assessment answers as custom fields
    │      │      ├─ Tag: "Assessment_Complete" + "Lead_Score_[0-30]"
    │      │      └─ Trigger automation: Nurture sequence based on score
    │      │
    │      └──→ [CRM] (if using HubSpot/Pipedrive)
    │             ├─ Create contact/deal record
    │             ├─ Add custom properties (assessment score, answers)
    │             ├─ Set lead status based on score
    │             └─ Assign to sales queue if hot (score 71+)
    │
    └──→ [User Receives]
           ├─ Personalized results page
           ├─ Instant next-step suggestion
           └─ Email: "Detailed assessment + next steps"
```

### 6.2 Lead Scoring & Qualification

```
ASSESSMENT QUESTIONS → SCORING RULES

Q1: Urgency Level
├─ Now (20 pts) → High urgency
├─ Next 3 months (10 pts) → Medium urgency
└─ Exploring (0 pts) → Low urgency

Q2: Have you worked on this?
├─ No / Never tried (20 pts) → New opportunity
├─ Partially / Inconsistent (10 pts) → Experienced but challenged
└─ Yes / Actively working (5 pts) → Already investing

Q3: Budget/Resources Available
├─ Yes, significant (20 pts) → Well-resourced
├─ Some (10 pts) → Moderate resources
└─ No (0 pts) → Resource-constrained

Q4: Challenge Description
├─ Specific, measurable (15 pts) → Clear problem
├─ Vague or multiple (10 pts) → Broader needs
└─ Not provided (0 pts) → Unclear need

Q5: Timeline to Implement
├─ This month (15 pts) → Urgent implementation
├─ Next 2-3 months (8 pts) → Near-term
└─ Later/TBD (0 pts) → Distant/uncertain

FINAL SCORE: Sum of all = 0-100 points

SEGMENTATION:
├─ 0-30: Cold (needs nurture, build awareness)
├─ 31-70: Warm (ready for conversation, build confidence)
└─ 71-100: Hot (ready to buy, expedite to sales)

BEHAVIORAL SCORING (additional):
├─ Email open: +1/2 points
├─ Link click: +3 points
├─ Case study view: +5 points
├─ Services page view: +5 points
└─ Engagement form started: +10 points → triggers sales outreach
```

### 6.3 Full Data Journey Map

```
STAGE 1: DISCOVERY
├─ User lands on Homepage
├─ Views social proof, pain points
├─ Decides to take assessment
└─ Assessment page loads

STAGE 2: QUALIFICATION (Assessment)
├─ User answers 12-15 questions
├─ Responses captured in form tool
├─ Score calculated (0-100)
├─ Results displayed with personalized recommendations
└─ Email capture: "Get detailed assessment report"

STAGE 3: DATA SYNC
├─ Assessment tool sends webhook to email platform
├─ Contact record created with:
│  ├─ Name, email, phone, company
│  ├─ Assessment date
│  ├─ All question responses
│  ├─ Lead score (0-100)
│  ├─ Segment (cold/warm/hot)
│  └─ Source: "Assessment"
│
├─ Tags applied:
│  ├─ "Assessment_Complete"
│  ├─ "Lead_Score_0-30" OR "31-70" OR "71-100"
│  └─ "Source_Assessment"
│
└─ (Optional) Sync to CRM if integrated:
    ├─ Contact created in CRM
    ├─ Custom field: "Assessment_Score"
    ├─ Custom field: "Assessment_Answers"
    ├─ Deal status: "Assessment_Complete"
    └─ If hot (71+): Alert sales team

STAGE 4: AUTOMATION TRIGGERED
├─ IF Cold (0-30):
│  └─→ Nurture sequence starts
│       ├─ Email 1: Welcome + assessment report
│       ├─ Email 3: Case study 1
│       ├─ Email 5: Educational content
│       └─ Email 7: "Ready to talk?"
│
├─ IF Warm (31-70):
│  └─→ Engagement sequence starts
│       ├─ Email 1: Welcome + "Schedule call" CTA
│       ├─ Email 3: Reminder to schedule
│       └─ Email 7: Case study + re-engagement
│
└─ IF Hot (71-100):
    └─→ Hot lead sequence starts
         ├─ Email 1: Welcome + services/pricing
         ├─ Email 1 (parallel): Sales team alert
         └─ Sales team outbound call/email

STAGE 5: ENGAGEMENT TOUCHPOINTS
├─ User reads nurture emails
├─ Email platform tracks:
│  ├─ Open (flagged in CRM)
│  ├─ Link click (behavioral score +3)
│  └─ Click event triggers: Check if new score threshold
│
├─ Behavioral triggers:
│  ├─ Visits blog post: Score +2
│  ├─ Visits case study: Score +5
│  ├─ Visits services page: Score +5
│  ├─ If new score 70+: Move to warm/hot, alert sales
│  └─ Each action re-evaluated for routing
│
└─ (Optional) Analytics tracking:
    ├─ UTM tags on email links (source: nurture email)
    ├─ Page view tracking
    └─ Behavior updates in CRM as custom properties

STAGE 6: NEXT CONVERSION POINT
├─ IF User clicks "Schedule Call" link:
│  └─→ Engagement form loads with email pre-filled
│       └─→ Form submission triggers calendar/sales flow
│
├─ IF User clicks "Checkout" or "Get Started":
│  └─→ Services page or checkout flow
│       └─→ Purchase triggers onboarding sequence
│
└─ IF User continues nurture:
    └─→ Track engagement, adjust score, wait for next trigger

STAGE 7: FINAL CONVERSION
├─ Schedule call form submitted:
│  ├─ Create calendar event in expert's calendar
│  ├─ Send calendar link to user
│  ├─ Tag in CRM: "Call_Scheduled"
│  └─ Sales engagement sequence begins
│
└─ Checkout form submitted:
    ├─ Create customer record
    ├─ Tag: "Customer_Active"
    ├─ Trigger onboarding sequence
    └─ Begin service delivery
```

---

## 7. Mobile-First Considerations

### 7.1 Assessment Quiz on Mobile

**Design Principles:**

```
SPACING & TOUCH TARGETS:
├─ Minimum button height: 44×44px (iOS), 48×48px (Android)
├─ Padding between elements: 16px minimum
├─ Input field height: 44-48px (large enough for touch)
├─ All clickable elements at least 44×44px

LAYOUT:
├─ Single-column always (no side-by-side elements)
├─ Full-width inputs (except date/time pickers)
├─ Questions stack vertically
├─ Progress bar at top (sticky or fixed) for multi-step
└─ No horizontal scrolling

KEYBOARD CONSIDERATIONS:
├─ Email field: type="email" → Shows @ keyboard
├─ Phone field: type="tel" → Shows phone keyboard
├─ Number field: type="number" → Shows numeric keyboard
├─ Text field: type="text" → Shows standard keyboard
└─ Radio/checkbox: Use large touch targets, not tiny circles

PROGRESS INDICATION:
├─ Step progress visible at all times
├─ Show: "Step 2 of 4" (not just percentage)
├─ Progress bar fills as user completes steps
├─ Allow back navigation (previous button)
└─ Auto-save on each question

VIEWPORT OPTIMIZATION:
├─ Font size minimum 16px (no auto-zoom trigger)
├─ Viewport meta tag: width=device-width, initial-scale=1
├─ Avoid fixed headers that cover content
├─ No landscape-only experiences
└─ Test at 320px width (small phones)
```

**Multi-Step Form on Mobile:**

```
OPTIMAL FORMAT: 3-5 STEPS, 3-5 FIELDS PER STEP

Example 4-step assessment:
├─ Step 1: 3 questions (basic qualification)
├─ Step 2: 4 questions (pain points)
├─ Step 3: 4 questions (readiness + context)
└─ Step 4: Email capture + consent

Each step fits on single screen (no scrolling if possible)
─────────────────────────────────────────────────
[Progress: 25% ████░░░░░░]

Q1: Your biggest challenge?
[Dropdown] ▼

Q2: How urgent?
( ) Now  ( ) 3 months  ( ) Exploring

Q3: Budget available?
[Text input field________________]

[← Back] [Continue →]
─────────────────────────────────────────────────

Ideal result: 1 question visible at a time OR grouped logically
No need to scroll to see next question
All inputs clearly labeled
```

### 7.2 Form Usability on Phone

**Best Practices:**

```
LABELS & HINTS:
├─ Always visible (not placeholder-only)
├─ Placed above input field (not inside)
├─ Font size: 14-16px
├─ Color: High contrast with background
├─ Include helper text if unclear: "(e.g., john@example.com)"

ERROR MESSAGES:
├─ Display inline, below field
├─ Color: Red or error color (not just text)
├─ Icon: Error indicator (X or !) adjacent to field
├─ Message: Clear, actionable ("Email format: name@domain.com")
├─ Example: "✗ Please enter a valid email address"

INPUT FIELDS:
├─ Full width on mobile (no side-by-side)
├─ Height: 44px minimum
├─ Padding inside: 12px (text is readable)
├─ Border: Clear 1-2px border, not subtle
├─ Focus state: Blue outline or highlight (WCAG requirement)

CHECKBOXES & RADIO BUTTONS:
├─ Size: 24×24px (not 16px, too small on mobile)
├─ Label clickable (not just the box)
├─ Grouped with 8px spacing between items
├─ Visual feedback on tap (color change or highlight)

SELECT DROPDOWNS:
├─ Avoid if possible (open native picker instead)
├─ If used: Full width, clear label
├─ Native behavior: Mobile opens native picker
├─ Desktop: Standard dropdown interface

DATE/TIME FIELDS:
├─ Use native HTML5 <input type="date">
├─ Shows calendar picker on mobile automatically
├─ Shows month/year dropdown on desktop
├─ Avoid text input for dates (user errors)

TEXTAREA FIELDS:
├─ Full width, minimum 100px height
├─ Allow multiline input
├─ Placeholder text with example (if needed)
└─ Growing textarea (expand as user types) recommended
```

### 7.3 CTA Thumb-Reachability

**Thumb Zone on Mobile (6.1" screen as example):**

```
┌──────────────────────┐
│ HARD TO REACH (top)  │  
├──────────────────────┤
│                      │
│ EASY TO REACH        │  ← Natural thumb zone
│ (middle)             │     for right-handed users
│                      │
├──────────────────────┤
│ HARDEST TO REACH     │
│ (very bottom)        │
└──────────────────────┘

OPTIMAL PLACEMENT:
├─ Primary CTA: Middle of screen or slightly lower-middle
├─ Sticky CTA: Bottom of screen (floating button)
│   └─ Position: Bottom-right or bottom-center
│   └─ Margin from bottom: 16px (not at absolute edge)
│   └─ Margin from right: 16px
│
└─ Avoid: Fixed CTA at top (hard to reach naturally)

FLOATING BUTTON (Sticky) EXAMPLE:
    ┌──────────────────────┐
    │ [Content scrolls]     │
    │ [Content scrolls]     │
    │ [Content scrolls]     │
    └──────────────────────┘
    ┌────────────────────────────┐
    │ [Schedule Call]      [  ✕] │ ← Sticky, floating
    └────────────────────────────┘
    16px from bottom, appears when scrolling
    Can be dismissed (✕ button)
```

### 7.4 Viewport & Screen Size Considerations

**Tested Breakpoints:**

```
MOBILE:
├─ 320px (iPhone SE): Test minimum
├─ 375px (iPhone X): Common small phone
├─ 414px (iPhone 12/13): Common larger phone

TABLET:
├─ 768px (iPad): Landscape tablet
├─ 1024px (iPad Pro): Larger tablet

DESKTOP:
├─ 1024px: Minimum (netbooks)
├─ 1280px: Standard desktop
├─ 1920px: Larger desktop
└─ 2560px: Ultra-wide

RESPONSIVE STRATEGY FOR ASSESSMENT:
└─ Mobile-first (design mobile first, add desktop enhancements)
   ├─ 320px: Single column, stacked questions
   ├─ 768px: Could show 2 columns for layout (optional)
   └─ 1024px+: Add sidebar if needed (case studies, help)
```

---

## 8. Build Order & Dependencies

### 8.1 Critical Path (Minimum Viable Site)

```
PHASE 1: FOUNDATION (Week 1-2)
Priority: MUST EXIST BEFORE ANYTHING ELSE WORKS
├─ Homepage (basic, with hero CTA to assessment)
├─ Assessment Page (core qualification engine)
└─ Checkout/Services (fulfillment path)

Why this order?
├─ Assessment must exist before checkout (routes cold→hot)
├─ Homepage must exist before nav works (entry point)
└─ Checkout must exist before capturing hot leads (dead end prevention)

PHASE 2: SCAFFOLD (Week 2-3)
Priority: REQUIRED FOR FULL FUNNEL
├─ Header/Navigation (routes between phase 1 pages)
├─ Email Integration (assessment → mailchimp/email capture)
├─ Case Studies/Work Page (social proof for warm leads)
└─ Services Page (detailed offerings, pricing anchor)

Why this order?
├─ Assessment needs email integration to capture leads
├─ Nav ties pages together (no isolated pages)
├─ Case studies build confidence for warm leads
└─ Services page shows what's included (reduces checkout friction)

PHASE 3: NURTURE (Week 3-4)
Priority: IMPROVES CONVERSIONS, NOT BLOCKING
├─ Blog (content marketing, SEO, cold lead nurture)
├─ Engage Form (warm lead → hot conversation)
└─ Email Automation Sequences (nurture, post-call, post-purchase)

Why this order?
├─ Blog doesn't block conversions (nice-to-have)
├─ Engage form is secondary to assessment path
└─ Email sequences improve retention, not initial conversion

PHASE 4: OPTIMIZATION (Week 4+)
Priority: IMPROVEMENTS, CAN ITERATE LATER
├─ Analytics & Tracking (GA4, conversion funnels)
├─ CRM Integration (if using external CRM)
├─ A/B Testing (optimize CTAs, messaging, form fields)
├─ Landing Pages (if doing paid ads)
└─ Exit-intent popups, form optimization, mobile polish

Dependencies NOT Blocking:
├─ Blog doesn't need navigation to work (can launch later)
├─ Case studies don't need email integration (static content)
├─ Engage form doesn't need CRM (can live in email platform)
└─ Analytics don't need to be perfect (launch with basics)
```

### 8.2 Page Dependencies

```
PAGE: Homepage
├─ Blocks: Everything (it's the entry point)
├─ Needs: Assessment page URL (for CTA link)
└─ Can wait: Blog, all secondary content

PAGE: Assessment
├─ Blocks: Email integration, checkout routing
├─ Needs: Form tool (Jotform), email platform, basic calculation logic
├─ Required for: Cold lead identification, lead scoring
└─ Can wait: CRM integration, sophisticated scoring

PAGE: Checkout / Services (Simple)
├─ Blocks: Hot lead conversion
├─ Needs: Payment processor (Stripe/Paddle), basic form
├─ Must have: Clear pricing, service description
└─ Can wait: Contract/agreement forms, more detailed content

PAGE: Services (Detailed)
├─ Blocks: Nothing (nice-to-have, improves warm conversion)
├─ Needs: Services page copy, pricing, case study links
├─ Helps with: Reducing checkout friction, answering questions
└─ Can launch: 1-2 weeks after MVP (not blocking)

PAGE: Case Studies / Work
├─ Blocks: Nothing (social proof, improves conversion but not required)
├─ Needs: 2-3 complete case studies (detailed)
├─ Helps with: Building confidence for warm leads
├─ Can launch: Week 2 (after MVP)

PAGE: Blog
├─ Blocks: Nothing (long-term nurture)
├─ Needs: Content management system (WordPress, Markdown, Airtable)
├─ Helps with: Cold lead nurture, SEO, authority
├─ Can launch: Week 3+ (not critical)

PAGE: Engage Form
├─ Blocks: Nothing (alternative to assessment for warm leads)
├─ Needs: Form tool, calendar integration (Calendly)
├─ Helps with: Warm lead conversion, qualification
├─ Can launch: Week 2 (after assessment)

NAVIGATION / HEADER
├─ Blocks: User ability to navigate between pages
├─ Needs: All pages that will be linked
├─ Must have: Homepage, Assessment, Services, Checkout
├─ Can add later: Blog, case studies
└─ Can launch: Week 1 (basic nav, then expand)
```

### 8.3 Data Integration Dependencies

```
MUST EXIST BEFORE EMAIL WORKS:
├─ Assessment form + responses captured
├─ Email platform account (Mailchimp, ActiveCampaign, ConvertKit)
├─ Integration API key configured
└─ Email sequences created + tested

MUST EXIST BEFORE CRM WORKS:
├─ CRM account (HubSpot, Pipedrive, Salesforce)
├─ Integration API configured
├─ Custom fields created in CRM:
│  ├─ Assessment_Score
│  ├─ Assessment_Segment (cold/warm/hot)
│  └─ Lead_Source
└─ Webhook or Zapier integration tested

MUST EXIST BEFORE CHECKOUT WORKS:
├─ Payment processor account (Stripe, Paddle)
├─ Service/product created in payment system
├─ API keys configured
└─ Transaction logic in checkout form

OPTIONAL (Can add later):
├─ Advanced lead scoring rules
├─ Multi-touch attribution
├─ Custom behavioral workflows
└─ Webhooks to external systems
```

---

## 9. Summary: Architecture Recommendations

### 9.1 Recommended Tech Stack for Implementation

```
FORM TOOL: Jotform or Typeform
├─ Features: Assessment quiz, multi-step, conditional logic
├─ Cost: $29-99/month (Jotform), $35-99 (Typeform)
└─ Integrations: Pre-built email, Zapier, webhooks

EMAIL PLATFORM: Mailchimp or ActiveCampaign
├─ Features: Automation sequences, lead scoring, segmentation
├─ Mailchimp: Free-generous, good for <1000 subscribers
├─ ActiveCampaign: More automation features, $49+/month
└─ Integration: Forms, email capture, behavioral triggers

LANDING PAGE / SITE:
├─ Option 1: Webflow (visual builder, fast)
├─ Option 2: Next.js / React (custom, developer-friendly)
├─ Option 3: WordPress + landing page builder
├─ Must have: Fast load (mobile), SEO-friendly, conversion-optimized

CALENDAR / SCHEDULING: Calendly
├─ Features: Meeting scheduling, calendar sync
├─ Cost: Free (basic) or $12+/month (Pro)
└─ Integration: Embed form, email, Zapier

CRM (OPTIONAL, Phase 2+): HubSpot Free
├─ Features: Contact management, lead scoring, email
├─ Cost: Free tier for small teams
└─ Integration: Email, forms, APIs

ANALYTICS: Google Analytics 4
├─ Features: Funnel tracking, conversion measurement
├─ Cost: Free
└─ Integrations: Most platforms

INTEGRATION PLATFORM (if needed): Zapier
├─ Purpose: Connect tools that don't have direct integration
├─ Example: Form tool → Email platform → CRM
├─ Cost: Free tier (5 zaps) or $19-49/month
```

### 9.2 Key Success Metrics by Funnel Stage

```
COLD LEAD PATH:
├─ Assessment start rate: 10-15% of visitors
├─ Assessment completion rate: 80%+ of starters
├─ Email capture rate: 80% of completions
├─ Nurture email open rate: 25-35%
├─ Click-through rate to case studies: 8-12%
└─ Conversion to warm lead: 2-5% of cold cohort (after 30 days nurture)

WARM LEAD PATH:
├─ Services page view rate: 30-40% of visitors
├─ Engagement form start rate: 20-25% of services viewers
├─ Engagement form completion rate: 90%+
├─ Call scheduling rate: 60-70% of form completions
├─ Call-to-proposal rate: 50-60% of completed calls
└─ Proposal-to-paid rate: 60-80%

HOT LEAD PATH:
├─ Direct checkout rate: 80-90% conversion
├─ Average order value: [Your baseline]
└─ Time to purchase: < 24 hours (high intent)

OVERALL SITE:
├─ Conversion rate (visitor → lead): 5-10%
├─ Conversion rate (visitor → customer): 0.5-2%
├─ Cost per acquisition: [Compare to lifetime value]
└─ Email subscriber growth rate: 10-20% monthly
```

### 9.3 Implementation Checklist

**Week 1:**
- [ ] Design homepage wireframe (hero, pain, proof, CTA)
- [ ] Create assessment questions (12-15 total)
- [ ] Set up assessment form tool
- [ ] Design assessment results page
- [ ] Create basic checkout flow
- [ ] Set up email platform account
- [ ] Integrate form tool → email platform

**Week 2:**
- [ ] Add 2-3 case studies (detailed format)
- [ ] Design services page with pricing
- [ ] Create services/checkout pages
- [ ] Set up Calendly (for future Engage form)
- [ ] Configure email sequences (cold, warm, hot paths)
- [ ] Add navigation/header to all pages
- [ ] Test mobile responsiveness

**Week 3:**
- [ ] Publish 2-3 blog posts
- [ ] Add Engage form (schedule call)
- [ ] Integrate calendar with email
- [ ] Set up Google Analytics + conversion tracking
- [ ] Test full funnel (cold, warm, hot paths)
- [ ] Optimize mobile assessment experience

**Week 4:**
- [ ] Implement advanced lead scoring (if using CRM)
- [ ] Create email automation for post-call sequence
- [ ] Set up CRM integration (optional)
- [ ] A/B test assessment form (single vs multi-step)
- [ ] Optimize CTA placement (A/B test messaging)
- [ ] Launch blog content calendar (2x/month)

---

## References & Research Sources

### Navigation & Conversion Patterns
- [The Ultimate 2025 Guide to High-Converting Web Design](https://www.identitidesign.com/blog/high-converting-web-design-2025/)
- [Best SaaS Homepage Design Examples (2026): Patterns That Convert](https://www.vezadigital.com/post/best-saas-homepage-design-examples)
- [Best Practices for Designing B2B SaaS Homepages – 2026](https://genesysgrowth.com/blog/designing-b2b-saas-homepages)
- [What's a good SaaS website navigation structure?](https://nerdcow.co.uk/blog/b2b-saas-website-navigation/)

### Case Studies & Social Proof
- [Case Study Website Design Inspiration — 54 Real Examples](https://onepagelove.com/inspiration/case-study)
- [The Most Effective Case Study Layout for Marketing Experts](https://www.newfangled.com/case-study-layout/)
- [How to design an effective case study section for your website](https://www.articulatemarketing.com/blog/how-to-design-an-effective-case-study-section-for-your-website)

### Assessment & Multi-Step Forms
- [Multi-Step Form Best Practices 2026: Design Principles & Completion Rate Data](https://voiceforms.anvevoice.app/blog/multi-step-form-best-practices/)
- [Mobile-First Design: A Practical Guide With Examples and Steps (2026)](https://www.uxpin.com/studio/blog/a-hands-on-guide-to-mobile-first-design/)
- [Multi-Step Forms: Improve Lead Capture & UX](https://www.digioh.com/blog/multi-step-forms)

### Lead Generation & Email Integration
- [Quiz Funnel Builder - Create High-Converting Assessment Funnels](https://rightmessage.com/grow-your-email-list/quiz-assessment-funnels)
- [Best Quiz Funnel Software (2026): We Tested 11 Tools](https://www.perspective.co/article/quiz-funnel-software)
- [How to create a lead magnet quiz](https://www.jotform.com/blog/how-to-create-a-quiz-as-a-lead-magnet/)

### Lead Qualification & Routing
- [Cold, Warm, and Hot Leads: How to Do Lead Classification](https://revnew.com/blog/cold-warm-and-hot-leads)
- [How to Maximize Lead Conversion on Your Consulting Company's Website](https://leadhaste.com/blog/maximizing-lead-conversion-consulting-websites)
- [Cold Vs. Warm Vs. Hot Leads: How To Attract And Close eLearning Leads In 2026](https://elearningindustry.com/advertise/elearning-marketing-resources/blog/cold-vs-warm-and-how-to-attract-and-close-elearning-leads)

### CTA Placement & Design
- [The Best CTA Placement Strategies For 2026 Landing Pages](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- [High Performing CTA Button UX Best Practices & Examples](https://www.designstudiouiux.com/blog/cta-button-design-best-practices/)
- [Perfect CTA Placement: Above-The-Fold vs. Below-The-Fold](https://webdesignerdepot.com/perfect-cta-placement-above-the-fold-vs-below-the-fold/)

### CRM & Data Flow Integration
- [Lead generation automation workflows: delivering results in 2026](https://monday.com/blog/crm-and-sales/lead-generation-automation/)
- [How do lead generation tools integrate with CRM systems?](https://myleadssite.com/how-do-lead-generation-tools-integrate-with-crm-systems/)
- [Understanding AI lead scoring: Definition, benefits, and how to get started](https://www.demandbase.com/blog/ai-lead-scoring/)

### Personal Brand Strategy
- [Personal Brand Website Examples: 7 Standout Sites to Grow Your Audience in 2026](https://feather.so/blog/personal-brand-website-examples)
- [11 Hand-Picked Personal Brand Websites (2026) + How to Build Yours](https://blog.copyfol.io/personal-brand-website)
- [Personal Branding for Founders](https://www.heavybit.com/library/article/personal-branding)

---

## Document Metadata

- **Created:** May 2026
- **Research Scope:** Expert/service website best practices, conversion optimization, multi-step funnel architecture
- **Frameworks Used:** SaaS homepage patterns, assessment quiz design, lead scoring methodology, mobile-first UX
- **Next Steps:** Use this as basis for detailed page designs, form field optimization, email sequence templates, and analytics setup

