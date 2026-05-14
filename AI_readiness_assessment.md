**ASOR AHURA · FLOWMORPH**

**AI READINESS ASSESSMENT**

**SCORECARD**

_Is your organisation actually ready to deploy AI?_

Find out in 10 minutes. Score your readiness across 5 dimensions - 60 points total.

_Purpose-built for Founders, CTOs, and Operations Leaders_

## Five Dimensions. One Clear Score

This scorecard evaluates AI readiness across five core dimensions. Score each section independently for a granular view of strengths and gaps.

| **Code** | **Dimension**               | **Max** | **What It Assesses**                                                               |
| -------- | --------------------------- | ------- | ---------------------------------------------------------------------------------- |
| **A**    | **Process Intelligence**    | **15**  | _Are your workflows documented, measurable, and automation-viable?_                |
| **B**    | **Data & Infrastructure**   | **15**  | _Is your data accessible, clean, and your infrastructure deployment-ready?_        |
| **C**    | **Compliance & Governance** | **12**  | _Can you deploy in a regulated environment without legal or compliance blockers?_  |
| **D**    | **Team & Change Readiness** | **9**   | _Does your organisation have the ownership and capacity to absorb a new system?_   |
| **E**    | **Strategic Alignment**     | **9**   | _Is there a real problem with a measurable outcome that justifies the investment?_ |

**How to score:**

For each question, write the number (0-3) in the Score column that best reflects your current state. Use the anchor descriptions to calibrate. Partial scores are allowed - if between two anchors, take the lower one. Be honest. Inflating scores only misleads your own planning.

**DIMENSION 1 OF 5 · MAX 15 POINTS**

**Section A: Process Intelligence**

_AI amplifies what already works. This section determines whether your operational processes are structured enough to benefit from automation._

**Score Anchors - 0: Not in place | 1: Early / partial | 2: Mostly in place | 3: Fully operational**

| **Question / Criteria**                                                                                                                           | **0 Not in place** | **1 Early** | **2 Mostly** | **3 Fully** | **Score** |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- | ------------ | ----------- | --------- |
| **Process Documentation**<br><br>_Are your highest-friction workflows written down with clear steps, owners, and outputs?_                        |                    |             |              |             |           |
| **Volume & Repetition**<br><br>_Do you handle high volumes of similar tasks daily/weekly (form processing, data entry, report generation, etc.)?_ |                    |             |              |             |           |
| **Output Measurability**<br><br>_Can you define a 'correct' output for the tasks you want to automate? Are success criteria explicit?_            |                    |             |              |             |           |
| **Error / Rework Rate**<br><br>_Do you track failure rates, rework, or manual corrections in your current processes?_                             |                    |             |              |             |           |
| **Process Ownership**<br><br>_Is there a named person - not just a team - responsible for the processes you want to automate?_                    |                    |             |              |             |           |

**Section A Total: \_**\_**\_ / 15**

Transfer this score to the Scorecard Summary.

## Section A - Interpretation

| **0-5**   | Foundational process work is needed before any AI deployment. Map and document your 3 highest-friction workflows first. |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| **6-10**  | Process gaps will slow delivery. A scoped automation-readiness sprint before full deployment is strongly recommended.   |
| **11-15** | Strong process foundation. AI deployment will be faster and ROI will be measurable from day one.                        |

**Notes / observations for Section A:**

**DIMENSION 2 OF 5 · MAX 15 POINTS**

**Section B: Data & Infrastructure**

_Poor data is the #1 reason AI projects fail post-pilot. This section evaluates data accessibility, quality, and infrastructure readiness - including offline and low-bandwidth contexts._

**Score Anchors - 0: Not in place | 1: Early / partial | 2: Mostly in place | 3: Fully operational**

| **Question / Criteria**                                                                                                                                                             | **0 Not in place** | **1 Early** | **2 Mostly** | **3 Fully** | **Score** |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- | ------------ | ----------- | --------- |
| **Data Accessibility**<br><br>_Can relevant operational data be programmatically accessed (API, database, export)? Or is it locked in PDFs, emails, or spreadsheets?_               |                    |             |              |             |           |
| **Data Quality & Consistency**<br><br>_Is your data consistently formatted, labelled, and free of significant corruption or duplication across sources?_                            |                    |             |              |             |           |
| **Historical Data Volume**<br><br>_Do you have at least 6-12 months of historical operational data relevant to the target workflow?_                                                |                    |             |              |             |           |
| **Infrastructure Maturity**<br><br>_Do you have cloud, on-premises, or hybrid infrastructure capable of hosting containerised AI workloads (Docker, VMs, etc.)?_                    |                    |             |              |             |           |
| **Connectivity & Constraints**<br><br>_Does your deployment context require offline-capable or low-bandwidth AI inference? Is this explicitly accounted for in your current stack?_ |                    |             |              |             |           |

**Section B Total: \_**\_**\_ / 15**

Transfer this score to the Scorecard Summary.

**Field Note:**

Organisations operating in low-connectivity environments (NGOs, rural health facilities, field operations): score question 5 based on whether your infrastructure planning has explicitly addressed offline inference, not whether you currently have it. If your primary data sources are unstructured PDFs, email threads, or WhatsApp messages, score questions 1 and 2 conservatively - extraction pipelines add 30-60% to delivery timelines.

**Notes / observations for Section B:**

**DIMENSION 3 OF 5 · MAX 12 POINTS**

**Section C: Compliance & Governance**

_For healthcare, legal, finance, and government operators: this is often the difference between a deployed system and a shelved prototype. Score this section honestly._

**Score Anchors - 0: Not in place | 1: Early / partial | 2: Mostly in place | 3: Fully operational**

| **Question / Criteria**                                                                                                                                            | **0 Not in place** | **1 Early** | **2 Mostly** | **3 Fully** | **Score** |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ----------- | ------------ | ----------- | --------- |
| **Regulatory Awareness**<br><br>_Does your team know which frameworks apply (GDPR, HIPAA, NDPR, SOC2, ISO 27001)? Has legal reviewed AI tool usage policies?_      |                    |             |              |             |           |
| **Data Sovereignty**<br><br>_Do you have explicit requirements on where patient/client data can be stored or processed? Are you enforcing these today?_            |                    |             |              |             |           |
| **Audit & Explainability**<br><br>_Can your current systems produce audit logs? Is there a plan for AI decision explainability when regulators or clients ask?_    |                    |             |              |             |           |
| **Vendor Risk Assessment**<br><br>_Have you assessed the data-handling practices of AI tools in use (ChatGPT, Gemini, Copilot, etc.)? Is shadow AI usage tracked?_ |                    |             |              |             |           |

**Section C Total: \_**\_**\_ / 12**

Transfer this score to the Scorecard Summary.

## Why Section C Matters More Than You Think

| **Healthcare & NGOs** | HIPAA/NDPR violations can result in facility shutdowns and loss of grant funding. Any AI system that processes patient identifiers requires a data processing agreement and a privacy impact assessment before deployment. |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Legal & Finance**   | Client privilege and fiduciary obligations mean that sending unredacted documents to third-party LLM APIs may constitute a breach. Self-hosted or private-cloud AI is increasingly required.                               |
| **Enterprise & Gov**  | Procurement teams will ask for your AI governance policy before signing. Having a written policy - even a one-pager - accelerates approvals significantly.                                                                 |

**Notes / observations for Section C:**

**DIMENSION 4 OF 5 · MAX 9 POINTS**

**Section D: Team & Change Readiness**

_The most common reason AI systems fail post-deployment isn't technical - it's human. Resistance, unclear ownership, and lack of training kill more projects than bad data._

**Score Anchors - 0: Not in place | 1: Early / partial | 2: Mostly in place | 3: Fully operational**

| **Question / Criteria**                                                                                                                                     | **0 Not in place** | **1 Early** | **2 Mostly** | **3 Fully** | **Score** |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- | ------------ | ----------- | --------- |
| **Executive Sponsorship**<br><br>_Is there a C-level or VP-level owner actively championing this AI initiative with budget and political capital?_          |                    |             |              |             |           |
| **Technical Ownership**<br><br>_Is there a named technical lead (engineer, IT manager, or ops analyst) who will own the system after deployment?_           |                    |             |              |             |           |
| **Staff Adoption Readiness**<br><br>_Have staff who will interact with the system been consulted? Is there a training and change management plan in place?_ |                    |             |              |             |           |

**Section D Total: \_**\_**\_ / 9**

Transfer this score to the Scorecard Summary.

**DIMENSION 5 OF 5 · MAX 9 POINTS**

**Section E: Strategic Alignment**

_AI for its own sake delivers nothing. This section ensures there is a real, measurable business problem behind the initiative - and that the outcome maps to something your organisation actually cares about._

**Score Anchors - 0: Not in place | 1: Early / partial | 2: Mostly in place | 3: Fully operational**

| **Question / Criteria**                                                                                                                                                       | **0 Not in place** | **1 Early** | **2 Mostly** | **3 Fully** | **Score** |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- | ------------ | ----------- | --------- |
| **Problem Clarity**<br><br>_Can you state the specific operational problem you're solving in one sentence? Does it have a measurable current cost in time, money, or errors?_ |                    |             |              |             |           |
| **Success Metrics**<br><br>_Are there defined KPIs or success criteria for this initiative that exist independently of the AI system?_                                        |                    |             |              |             |           |
| **Stakeholder Alignment**<br><br>_Do all key stakeholders (Operations, Finance, IT, Legal) agree this problem is worth solving at this investment level?_                     |                    |             |              |             |           |

**Section E Total: \_**\_**\_ / 9**

Transfer this score to the Scorecard Summary.

**Notes / observations for Sections D & E:**

**TALLY YOUR RESULTS HERE**

**Scorecard Summary**

_Transfer your five section totals below. Add them up for your overall AI Readiness Score._

| **Section**                        | **Max Score** | **Your Score**  |
| ---------------------------------- | ------------- | --------------- |
| Section A: Process Intelligence    | 15            |                 |
| Section B: Data & Infrastructure   | 15            |                 |
| Section C: Compliance & Governance | 12            |                 |
| Section D: Team & Change Readiness | 9             |                 |
| Section E: Strategic Alignment     | 9             |                 |
| **TOTAL SCORE**                    | **60**        | **\_\_\_ / 60** |

## Readiness Tier Reference

| **Score**   | **Readiness Tier**   | **What It Means**                                                                                                                         | **Recommended Action**                                                    |
| ----------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **0 - 19**  | **Not Ready**        | Foundational gaps across process, data, or governance. AI deployment now will waste resources and erode confidence in the technology.     | Process and data audit first. Build the foundation before any AI scoping. |
| **20 - 34** | **Pre-Deployment**   | Some strong areas but critical gaps exist. A targeted readiness sprint of 4-8 weeks can close the distance before full deployment.        | Engage for a System Architecture Audit to identify and sequence the gaps. |
| **35 - 47** | **Deployment Ready** | Foundational pieces are in place. AI deployment is viable with the right architectural choices and scoped implementation plan.            | Move to solution design. Define scope, timeline, and ROI targets.         |
| **48 - 60** | **High Readiness**   | Strong readiness across all five dimensions. You're positioned to move fast, get early measurable results, and scale from a working base. | Book a discovery call. This is the profile we build for.                  |

**⚠ Important:**

Total score is useful, but section-level gaps matter more than the aggregate. A score of 48/60 with Section C at 2/12 still means you have a compliance blocker. Review each section score independently before drawing conclusions.

**WHAT THE SCORE ACTUALLY MEANS**

**Reading Your Results**

_Your score tells you where you are. This page tells you what to do about it._

| **Process Intel (A)**       | Low scores mean the first investment isn't AI - it's process design. Spend 3-4 weeks mapping, measuring, and documenting before scoping a build.         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data & Infra (B)**        | Score < 8: data cleaning, extraction pipelines, and infrastructure provisioning will add 30-60% to your delivery timeline. Factor this into your budget. |
| **Compliance (C)**          | Any score below 7 in a regulated industry is a deployment blocker. Compliance review must run parallel to design - not after it.                         |
| **Team Readiness (D)**      | Without a named technical owner post-deployment, 60% of AI systems degrade within 6 months. Name the owner before you scope the system.                  |
| **Strategic Alignment (E)** | If you can't state the problem and its cost in one sentence, you're not ready to commission a build. Start with a discovery sprint instead.              |

## Three Common Patterns

**The High-Tech, Low-Process Org**

Strong infrastructure and technical team (B + D high), but processes aren't documented and success metrics don't exist (A + E low). Builds happen. Adoption doesn't. Start by defining the problem before scoping the system.

**The Compliance Blocker**

High readiness everywhere except Section C. Common in healthcare and legal. The build gets done, then legal or IT blocks deployment. Run compliance review parallel to design - not after.

**The Data Desert**

Strong process clarity and strategic intent (A + E), but data is locked in PDFs, emails, or legacy systems with no API access (B low). A 2-4 week data extraction and normalisation sprint is needed before AI scoping.

**What Happens Next?**

If you've scored 20 or above - or if a section revealed a gap you weren't expecting - this is exactly the conversation we're built for.

Flowmorph works with Founders, CTOs, and Operations Leaders who have real operational problems and the mandate to fix them. Every engagement starts with a System Architecture Audit: a scoped, fixed-price session that maps your highest-friction workflows, assesses your data and infrastructure, and produces a deployment blueprint.

**WHO WE WORK WITH**

Healthcare systems · Global NGOs · Legal tech operators · Series A-C SaaS · Government agencies · Regulated-industry enterprises

**WHAT WE BUILD**

Custom AI agents · Document intelligence · Offline-capable inference · GDPR/HIPAA-compliant deployments · n8n workflow automation · EMR/DHIS2 integrations

**Book a Discovery Call**

asorahura.com · flowmorph.io

## About Asor Ahura

Asor Ahura is an AI engineer and health informatics specialist with production deployments spanning 39+ health facilities, 43,000+ documents processed, and 7,200+ support hours automated. He builds privacy-first, infrastructure-independent AI systems for organisations operating in regulated and resource-constrained environments.

_Certified: Oracle Generative AI Professional · ISC² Cybersecurity · OCI Data Science_

_This assessment is provided as a free resource. Reproduction for commercial purposes without permission is prohibited. © 2026 Asor Ahura. All rights reserved._