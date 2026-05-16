export interface ArticleSection {
    heading?: string;
    body: string[];
}

export interface Article {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    metrics: string;
    sections: ArticleSection[];
}

export const articles: Article[] = [
    {
        slug: "cervical-cancer-screening-tool",
        title: "I Built an AI That Screens for Cervical Cancer in Rural Nigeria — Without the Internet",
        subtitle: "What happens when a health system has no specialists, no connectivity, and no margin for error? You build differently.",
        description: "Offline-first YOLOv8 diagnostic system deployed across 39+ health facilities in Kano State. Local inference, blind clinical review, automatic model retraining, and zero patient data leaving the clinic. Built for the nurse 70 miles from the nearest specialist.",
        metrics: "39+ Facilities | Zero Cloud Dependency",
        tags: ["#AIforHealth", "#PrivacyFirst", "#LocalInference", "#DigitalHealth", "#GlobalHealth"],
        sections: [
            {
                body: [
                    "Most AI in healthcare assumes three things: a stable internet connection, a qualified specialist nearby, and patient data you're free to send to the cloud.",
                    "Rural northern Nigeria has none of those.",
                    "That's exactly why I led the engineering team behind the Cervical Cancer Screening and Continuous Improvement System (CXCA) — an offline-first, AI-powered diagnostic tool built for frontline health workers in Kano State, deployed across 39+ facilities, and designed so that zero patient data leaves the clinic without consent and de-identification.",
                ]
            },
            {
                heading: "The Problem Nobody Was Solving",
                body: [
                    "Cervical cancer is one of the most preventable causes of death among women in sub-Saharan Africa. The word \"preventable\" is doing a lot of heavy lifting there — because prevention requires screening, and screening requires specialists who aren't there.",
                    "In rural Kano, the nearest gynecologist or pathologist can be 60-70 miles away. The current method — Visual Inspection with Acetic Acid (VIA) — is manual, subjective, and dependent on the observer's training and experience.",
                    "There were existing AI models for cervical cancer detection. The problem? Every single one was trained on Caucasian patient data. They didn't generalize to African populations. That's not a minor gap — it's a clinical liability.",
                    "We weren't going to adapt a broken tool. We were going to build the right one.",
                ]
            },
            {
                heading: "The Architecture: Local Inference, Human-in-the-Loop, Data Flywheel",
                body: [
                    "→ Local YOLOv8 Inference at the Point of Care: The model runs on-device. No API call. No internet dependency. A community health worker captures a cervical image, clicks analyze, and gets a result in seconds — whether the facility has connectivity or not.",
                    "→ EXIF Stripping Before Anything Leaves the Device: Every image is processed in-memory through Pillow before upload. GPS coordinates, camera serial numbers, device metadata — all stripped. The image that reaches our database carries no PII. Data sovereignty isn't a feature. It's the foundation.",
                    "→ Confidence-Based Escalation: Results below 90% confidence trigger an automatic escalation to a qualified clinician via email — with the image attached. High-confidence results are logged immediately. This protects patients without flooding the clinical review queue.",
                    "→ Blind Review Protocol with Round-Robin Assignment: Clinicians review images without seeing the AI's diagnosis first. This is intentional. Anchoring bias — where a clinician defers to the AI result rather than using their own judgment — would compromise the ground-truth labels we need for retraining.",
                    "→ The Data Flywheel: Every screening, every clinician label, every disagreement between AI and clinician feeds a retraining pipeline. When we accumulate enough locally-sourced Nigerian patient data — with a deliberate 70/30 negative/positive split — the model retrains. A new version is validated, versioned, and deployed. The system gets smarter with every scan.",
                ]
            },
            {
                heading: "The Stack",
                body: [
                    "→ YOLOv8 (Ultralytics) — image classification, local inference",
                    "→ Streamlit — multi-role web interface (Provider, Reviewer, Admin)",
                    "→ Supabase — PostgreSQL + Auth + Object Storage with role-based access control",
                    "→ Python / Pillow — in-memory EXIF de-identification pipeline",
                    "→ Gmail SMTP — async clinical escalation notifications",
                    "→ Offline Queue — JSON-based local queue with exponential backoff retry for intermittent connectivity",
                    "Three distinct roles. Three distinct access levels. One shared goal: earlier detection.",
                ]
            },
            {
                heading: "Why This Matters Beyond Nigeria",
                body: [
                    "The architecture is the real story. We built a system that can be replicated — in any low-resource setting, for any diagnostic task — because the design principles hold regardless of geography:",
                    "→ Local inference removes cloud dependency",
                    "→ Blind review removes AI bias from ground-truth labels",
                    "→ The data flywheel removes demographic bias from the model over time",
                    "→ De-identification removes the legal and ethical barrier to data sharing",
                    "Most AI health tools are built for hospitals in San Francisco. We built this for the nurse 70 miles from the nearest specialist. That's a different problem — and it demands a different kind of engineering.",
                ]
            },
            {
                heading: "What's Next",
                body: [
                    "The system is live. The facilities are configured. The pipeline is running.",
                    "If you need to deploy AI in a low-resource setting — whether for diagnostics, data collection, or operational intelligence — the architecture is replicable. I want to hear about the problem.",
                ]
            },
        ]
    },
    {
        slug: "lloyds-list-ocr-pipeline",
        title: "43,103 Maritime Records. 260 Years of History. One AI Pipeline.",
        subtitle: "How I digitized 7,826 pages of 18th-century shipping documents for a European research institution — with verbatim accuracy at scale.",
        description: "How I digitized 7,826 pages of 18th-century Lloyd's List shipping documents for a European research institution — using Chandra OCR + Gemini, 25KB of precision prompt engineering, and a three-stage verification workflow. Verbatim accuracy at scale.",
        metrics: "43,103 Records | 7,826 Pages | 260 Years of History",
        tags: ["#AIEngineering", "#DocumentIntelligence", "#OCR", "#NLP", "#DataExtraction"],
        sections: [
            {
                body: [
                    "A European research institution came to me with a simple ask and an enormous problem.",
                    "They had 20 bound editions of Lloyd's List — the historic maritime intelligence journal published in London from the 1700s. The editions spanned 1762 to 1826. 260 years of ship movements, maritime casualties, port arrivals, weather records, and the commercial intelligence that underwrote the Age of Sail.",
                    "It was all locked in handwritten 18th-century typography. Multi-column layouts. Archaic fonts. Inconsistent spelling. Ditto marks that cascaded across tables. OCR artifacts baked into every page.",
                    "They needed it structured, searchable, and usable for academic research. 7,826 pages. Delivered in full.",
                ]
            },
            {
                heading: "Why This Couldn't Be Done with Off-the-Shelf OCR",
                body: [
                    "Most people assume OCR is a solved problem. It isn't — not for documents like this.",
                    "The Lloyd's List editions presented every challenge OCR tools struggle with simultaneously:",
                    "→ Pre-modern typography (the long 's' that looks like an 'f')",
                    "→ Multi-column layouts with tables, narratives, and price lists mixed on the same page",
                    "→ Inconsistent abbreviations and archaic spelling across decades of publication",
                    "→ Ditto marks (\"d°\", \"do\") that reference values from previous rows — but only within the same section",
                    "→ No standardized date format across editions",
                    "A single OCR pass would produce garbled text with no structure. Feeding that directly to an LLM would produce hallucinated corrections and fabricated data — the opposite of what a research institution needs.",
                    "We needed verbatim accuracy. That ruled out correction. That required engineering.",
                ]
            },
            {
                heading: "The Architecture: Two Models, Three Extraction Types",
                body: [
                    "We built a two-model pipeline where each tool does what it does best.",
                    "Layer 1: Chandra OCR → Structured Markdown: Chandra specializes in complex document layouts. Rather than outputting raw text, it preserves the spatial structure of the document in Markdown — tables with | notation, section headers with ##, narrative prose as paragraphs. This structured output is critical. It gives the downstream LLM semantic context it couldn't infer from a flat text dump. Every page pair produced a pair_XXXX_ocr.md file. 3,913 pairs across 20 editions.",
                    "Layer 2: Gemini → Structured JSON: Gemini processed each OCR markdown file using tailored extraction prompts and returned strict JSON via response_mime_type=\"application/json\" with enforced schema. No markdown wrappers. No parsing errors. Valid JSON output, every time.",
                    "Three distinct extraction types, each with its own prompt and schema:",
                    "→ Marine List Events — narrative incident reports (ship casualties, captures, wrecks, distress signals)",
                    "→ Arrivals & Departures — structured port movement tables (location, ship, captain, origin, destination, date)",
                    "→ Winds at Deal — meteorological records (day, wind direction, intensity)",
                    "Each extraction type had its own prompt — refined across four versions based on feedback from the research team's review cycle.",
                ]
            },
            {
                heading: "The Prompt Engineering: 25KB of Rules",
                body: [
                    "The prompts.md file is 25KB. That's not bloat — that's precision.",
                    "Every rule exists because a naive approach produced a wrong result:",
                    "→ Date extraction rule: Always use the edition header date, never the narrative preamble date. Because a ship incident logged as \"15th Jan.\" under a February edition header belongs to the February dataset — the preamble is descriptive context, not the record date.",
                    "→ Ditto resolution scope: \"d°\" means \"same as above\" — but only within the same location and same section. Carry it across a section boundary and you corrupt the record. The prompt specifies scope constraints explicitly.",
                    "→ False positive filtering: Price tables, stock listings, and mail schedules appear on the same pages as Marine List narratives. The model must skip them. The prompt enumerates exactly which text types to exclude.",
                    "→ Multi-prompt architecture: A regex detector checks each OCR file for a Marine List header. Files with headers use the targeted scan prompt. Files without use the general V3 prompt. No manual routing. Fully automated.",
                    "The result: Gemini never had to guess. Every ambiguity was resolved by a rule.",
                ]
            },
            {
                heading: "Quality Control: A Three-Stage Verification Workflow",
                body: [
                    "Extraction at this scale without validation is just confident noise. We built a three-skill verification loop:",
                    "→ Extractor: Runs extraction per page pair, appends to CSV, updates extraction_status.json. Skips already-processed pairs. Fully resumable.",
                    "→ Verifier: Cross-references three sources simultaneously — the original PDF image, the OCR markdown, and the extracted CSV row. Flags transcription errors, omissions, and false positives. Outputs a report.md with exact CSV locations and correction text.",
                    "→ Corrector: Applies corrections from report.md using grep-based search and replace. Verbatim compliance enforced — even OCR artifacts are preserved if they appear in the source document.",
                    "The philosophy: We don't modernize. We don't correct. We transcribe exactly what the document says. The researchers decide what to do with archaic spelling — that's their domain expertise, not ours.",
                ]
            },
            {
                heading: "The Output",
                body: [
                    "20 complete edition archives. Each containing:",
                    "→ events.csv — Marine List incidents (up to 3,818 rows per edition)",
                    "→ arrivals_departures.csv — Port movement records",
                    "→ winds.csv — Meteorological data",
                    "→ pair_XXXX_ocr.md — Full-text OCR (enables future search and reprocessing)",
                    "→ pair_XXXX_events.json — Structured per-page extracts",
                    "→ extraction_status.json — Processing audit trail",
                    "43,103 marine incident records. Delivered. Verified. Archived.",
                ]
            },
            {
                heading: "The Broader Lesson",
                body: [
                    "Most organizations sitting on large volumes of unstructured documents — legal archives, historical records, clinical notes, regulatory filings — assume digitization means scanning.",
                    "Scanning is the first 1%. The other 99% is the pipeline that turns images into structured, queryable, research-grade data.",
                    "The decisions that matter are: Which OCR tool preserves structure? How do you enforce verbatim accuracy at scale? How do you resolve ambiguity without hallucination? How do you build a pipeline that can be paused, resumed, and audited at any point?",
                    "Those are engineering decisions. Not configuration decisions.",
                ]
            },
        ]
    },
    {
        slug: "ai-resume-reviewer",
        title: "2,000+ Resumes Reviewed. 3 HR Departments. Zero Vendor Lock-In.",
        subtitle: "Most HR teams are still reading resumes the same way they did in 1995. I built the system that changes that — without locking you into a single AI provider.",
        description: "An open-source AI hiring platform supporting Claude, GPT-4, Gemini, Groq, and local Ollama models — switchable from a sidebar with no code changes. Three domain-specific scorecards, evidence-anchored scoring, and color-coded Excel exports. Run it fully local: zero data leaves the building.",
        metrics: "2,000+ Resumes | 3 HR Departments | 5 AI Providers Supported",
        tags: ["#HRTech", "#AIAutomation", "#PrivacyFirst", "#LocalInference", "#Recruiting"],
        sections: [
            {
                body: [
                    "Here's what resume screening looks like in most organizations:",
                    "A job posting goes live. 150 applications arrive in 48 hours. An HR coordinator opens the first PDF, reads it for 90 seconds, and makes a call based on a gut feeling and whether the formatting is clean.",
                    "By application 40, they're skimming. By application 80, they're fatigued. By application 120, they're copying scores from the person before and hoping for the best.",
                    "That's not a hiring process. That's a coin flip with extra steps.",
                    "I built the AI Resume Reviewer to fix this — a multi-LLM screening platform that has now processed over 2,000 resumes across 3 HR departments, with structured verdicts, evidence-based scoring, and the ability to swap AI providers without touching a line of code.",
                ]
            },
            {
                heading: "The Problem with Every Other AI Resume Tool",
                body: [
                    "Most AI hiring tools have the same fatal flaw: they're built on one provider's API. OpenAI today, price hike tomorrow, scramble to re-architect next quarter.",
                    "Beyond vendor lock-in, they give you a score. Not a verdict. Not a rubric. Not an evidence trail you can defend to a hiring manager or a candidate.",
                    "A number isn't a hiring decision. A structured, evidence-anchored scorecard is.",
                ]
            },
            {
                heading: "How It Works",
                body: [
                    "The system is a Streamlit web application with a multi-provider LLM dispatch layer. Here's the full pipeline:",
                    "→ Input: Job description (optional) + resume files. Supported formats: PDF, DOCX, DOC, PNG, JPG, TIFF, BMP, WebP, or a ZIP archive of hundreds of files at once.",
                    "→ Text Extraction: Selectable text PDFs via PyPDF2. Scanned PDFs and images via Chandra OCR API. Word documents via python-docx. The system handles resumes that most tools reject outright — scanned documents, photographed pages, image-only PDFs.",
                    "→ LLM Dispatch: Select your provider from the sidebar. The same evaluation runs on Claude (Anthropic), Gemini (Google), GPT-4 (OpenAI), Llama/Mixtral (Groq), or Ollama — any local model with zero data leaving the building.",
                    "→ Structured Scorecard Output: The LLM returns a strict JSON scorecard — not free text, not a paragraph, not a hallucinated recommendation. Every field validated before display.",
                ]
            },
            {
                heading: "Three Scorecards. Nine Dimensions. One Verdict.",
                body: [
                    "The system ships with three domain-specific evaluation templates:",
                    "AI Advisor — for AI specialist roles in international development organizations (UN, World Bank, USAID): 9 scored dimensions including AI Knowledge, Donor Experience, Technical Expertise, AI Capacity Building, and Strategic Skills.",
                    "General — universal professional screening for any role: 8 dimensions covering Education, Experience Depth, Technical Skills, Leadership, Sector Fit, Analytical Thinking, Communication, and Completeness.",
                    "STL Consultant — short-term local consultant screening for NGO/INGO roles: 7 dimensions including NGO Experience, Thematic Relevance, and Stakeholder Engagement.",
                    "Every dimension scored 1-5. Every score requires evidence from the resume text — no inflation, no uniform 3s, no hallucinated endorsements. The final output: \"Strongly Recommend\" / \"Recommend\" / \"Consider\" / \"Do Not Recommend\" — with deterministic decision logic, not vibes.",
                ]
            },
            {
                heading: "The Excel Export: Built for Decision-Making",
                body: [
                    "Every batch produces a color-coded Excel file built for the hiring manager who wasn't in the room:",
                    "→ Red scores (1-2) surface critical gaps immediately",
                    "→ Green scores (4-5) highlight standout candidates",
                    "→ Overall % column sorts by suitability in one click",
                    "→ Verdict column color-coded by recommendation tier",
                    "→ Auto-filter on every column for slicing by facility, dimension, or score range",
                    "Three HR departments have used this export as the primary input to their shortlisting process.",
                ]
            },
            {
                heading: "The Results",
                body: [
                    "→ 2,000+ resumes evaluated across production deployments",
                    "→ 3 HR departments using the system for active hiring cycles",
                    "→ 5 AI providers supported — switch in the sidebar, no code change required",
                    "→ Batch processing via ZIP upload — screen 100+ candidates in a single session",
                    "→ Local inference option via Ollama — for organizations that can't send data to public APIs",
                    "The GitHub repository (shikaasor/ai_resume_review) is public and MIT-licensed.",
                ]
            },
            {
                heading: "The Takeaway for Founders and HR Leaders",
                body: [
                    "If your hiring process depends on a person reading 150 PDFs and trusting their instincts — you're not screening candidates. You're introducing randomness into the most consequential decisions your organization makes.",
                    "AI doesn't remove judgment from hiring. It removes exhaustion. The right tool gives your team a structured starting point, an evidence trail, and the time to spend their expertise where it actually matters.",
                ]
            },
        ]
    },
    {
        slug: "chatbotly-nlp-analytics",
        title: "Your Chatbot Doesn't Know What It Doesn't Know — And It's Costing You Customers",
        subtitle: "I ran NLP analysis on thousands of chatbot conversations for a Swiss insurance company. Here's what the data actually revealed.",
        description: "I built an NLP analytics pipeline for a Swiss insurance company — analyzing 16,000+ chatbot conversation logs to surface knowledge gaps, escalation drivers, and engagement patterns. What the data revealed changed how they thought about their entire support strategy.",
        metrics: "16,454 Conversations Analyzed | 15 Topic Categories | 3-Language Support",
        tags: ["#NLP", "#ConversationalAI", "#AIAnalytics", "#ChatbotOptimization", "#CustomerExperience"],
        sections: [
            {
                body: [
                    "Most companies deploy a chatbot and declare the problem solved.",
                    "They look at the dashboard. Conversations handled: ✓. Human escalations reduced: ✓. Support tickets deflected: ✓.",
                    "What they're not looking at is the conversation that ended with: \"I don't have specific information about that. Please contact us at support@company.com.\"",
                    "That sentence — or some variation of it — is the most expensive line in your chatbot's vocabulary. It tells a customer you built a system that can't answer their actual question. Then it asks them to go find a human to do what the chatbot was supposed to do.",
                    "I built an NLP analytics pipeline to find every instance of that failure — and everything it cost.",
                ]
            },
            {
                heading: "The Client and the Problem",
                body: [
                    "A Swiss pet insurance company had deployed an AI chatbot to handle customer service 24/7. The bot was multilingual — German, French, Spanish — and covered a broad set of FAQs around policies, claims, coverage, and account management.",
                    "The product team had a nagging problem they couldn't quantify: customers were escalating to human agents at a higher rate than expected. They didn't know why. They didn't know which topics were failing. They didn't know if the knowledge base was the issue or the model or both.",
                    "They had the data — 16,454 conversation log entries. They didn't have the analysis.",
                ]
            },
            {
                heading: "The Pipeline",
                body: [
                    "→ Data Ingestion and Cleaning: Raw CSV logs with session IDs, roles (user/assistant/system/contact_form), messages, and timestamps. Signal extraction — stripping system noise, normalizing encoding across three languages, and grouping messages into user-assistant conversation pairs by session.",
                    "→ LLM-Based Multi-Dimensional Classification: Each conversation pair was classified across four dimensions simultaneously using GPT-4 and Gemini with an abstracted dispatch layer:",
                    "→ Topic Category — 15 predefined categories (Policy Details, Claims & Reimbursement, Account Management, Technical Support, Billing, and more) with confidence scoring per classification.",
                    "→ Knowledge Gap Detection — Binary flag (DATA_GAP / OK) identifying conversations where the chatbot signaled it couldn't answer. Not keyword matching — semantic understanding of partial answers, redirects, and deflections.",
                    "→ Human Escalation Detection — Binary flag (ESCALATION / OK) capturing both explicit requests and implied frustration, with confidence scores of 0.85-0.95 on high-signal conversations.",
                    "→ Engagement Pattern Analysis — Time-series analysis of conversation volume by day and hour, surfacing peak load periods and anomalous spikes.",
                    "→ Structured Reporting: Output — a color-coded, multi-sheet Excel report with categorized conversations, summary statistics, topic distribution, and escalation analysis — plus three standalone insight documents.",
                ]
            },
            {
                heading: "What the Data Revealed",
                body: [
                    "The findings fell into three categories, and none of them were what the client expected.",
                    "Finding 1: The knowledge base covered FAQs. Not operational reality. The chatbot could explain what the policy covered in general terms. It could not answer whether a specific treatment was covered for a specific breed at a specific age, why a claim was partially paid, how long the current claims queue actually was (answer: 16-30 days), or whether a policy could be modified after activation. These aren't edge cases. They're the questions customers actually have.",
                    "Finding 2: Escalations were almost never random. When we mapped escalation conversations against topic categories, a pattern emerged immediately. The highest escalation rates were in Claims & Reimbursement and Specific Coverage Details — the same topics driving the knowledge gaps. Customers weren't escalating because they preferred humans. They were escalating because the chatbot had already told them it couldn't help.",
                    "Finding 3: Peak load correlated with policy lifecycle events, not time of day. The most significant engagement spike — 53 conversations in a single day — didn't follow a predictable daily pattern. It correlated with a specific external event that drove a batch of customers to the same set of questions simultaneously.",
                ]
            },
            {
                heading: "The Fix Isn't More AI. It's Better Intelligence.",
                body: [
                    "The temptation after an analysis like this is to upgrade the model. Bigger model, better answers. That's the wrong instinct.",
                    "The problem wasn't model capability. The problem was that nobody had systematically mapped what questions customers were actually asking against what the knowledge base actually contained.",
                    "The gap between those two things is operational blindness. And it compounds silently until someone measures it.",
                    "The right fix:",
                    "→ Expand the knowledge base with operational-level policy detail — not just FAQ summaries",
                    "→ Build direct integrations with claims systems so the bot can surface real status, real timelines, real answers",
                    "→ Add a smooth human handoff with conversation history so the agent isn't starting from scratch",
                    "→ Run this analysis quarterly — the gaps change as the product evolves",
                    "A chatbot that knows what it doesn't know is infinitely more valuable than one that deflects confidently.",
                ]
            },
            {
                heading: "What This Looks Like for Your Organization",
                body: [
                    "If you have a deployed chatbot and you're not regularly analyzing where it's failing — you're flying blind. Your customers know exactly where the gaps are. The conversation logs know too. You just haven't looked.",
                    "I build NLP analytics pipelines that turn conversation data into actionable intelligence: knowledge gap maps, escalation drivers, engagement patterns, and structured recommendations your product team can act on immediately.",
                    "No generic dashboards. No vanity metrics. The intelligence your system needs to stop bleeding customers in silence.",
                ]
            },
        ]
    },
    {
        slug: "srdm-vision-model",
        title: "\"We Need Innovation.\" So We Built a 17M-Parameter Vision Model from Scratch.",
        subtitle: "When a client demands real innovation — not fine-tuning — here's what AI engineering actually looks like.",
        description: "A custom multi-stage deep learning architecture combining denoising and 4x super-resolution in a single forward pass. Five-component composite loss. 23 RRDB blocks. Conditional noise estimation. Built when a client explicitly demanded innovation — not fine-tuning.",
        metrics: "17.4M Parameters | 4x Super-Resolution | 5-Component Composite Loss",
        tags: ["#ComputerVision", "#DeepLearning", "#MachineLearning", "#PyTorch", "#AIEngineering"],
        sections: [
            {
                body: [
                    "The brief arrived on Upwork with one line that most AI contractors would quietly ignore:",
                    "\"ANYONE CAN TRAIN THESE PRETRAINED MODELS. WE NEED INNOVATION.\"",
                    "The client was right. Loading a checkpoint and running a training loop on a new dataset isn't engineering. It's configuration. The gap between the two is exactly where most AI freelancers live — and exactly where I don't.",
                    "So we built SRDM: Super-Resolution Denoising with Multi-Stage Refinement — a custom deep learning architecture that solves image denoising and 4x super-resolution simultaneously, in a single forward pass, with a composite loss function that most production vision teams haven't bothered to implement.",
                ]
            },
            {
                heading: "The Problem: Real Images Aren't Clean",
                body: [
                    "Most super-resolution benchmarks use clean images that were artificially downsampled. That's not the real world.",
                    "Real-world images arrive with compound degradations at the same time:",
                    "→ Gaussian noise (from sensors and low light)",
                    "→ Gaussian blur (from motion or focus issues)",
                    "→ JPEG compression artifacts (from storage and transmission)",
                    "→ Low resolution (from capture constraints)",
                    "The standard approach is to tackle these sequentially with separate models. That means multiple inference passes, multiple models in memory, multiple points of failure.",
                    "We combined them into one.",
                ]
            },
            {
                heading: "The Architecture: Three Stages, One Pipeline",
                body: [
                    "SRDM is a sequential three-stage pipeline where each stage is optimized for its specific task — but information flows continuously from input to output.",
                    "Stage 1: Conditional Denoising (ConditionalDnCNN): A modified DnCNN that adapts to the noise level. The estimated noise intensity is concatenated as a fourth input channel, so the network knows how aggressively to clean the image before passing it forward. One model handles noise levels of 15, 25, and 50 standard deviation. ~670K parameters.",
                    "Stage 2: Super-Resolution (ESRGAN Generator): 23 Residual-in-Residual Dense Blocks (RRDBs), each stacking 3 Residual Dense Blocks with progressive channel increases and dense skip connections. Two PixelShuffle layers deliver the 4x upsampling. ~16.7M parameters.",
                    "Stage 3: Refinement (Lightweight CNN): A three-layer residual correction network that predicts and adds a refinement map to the super-resolution output. It removes the SR artifacts that even strong generators produce. ~38K parameters.",
                    "Total: ~17.4M parameters. One forward pass. Clean, high-resolution output.",
                ]
            },
            {
                heading: "The Loss Function: Five Signals, One Objective",
                body: [
                    "Training a model like this on a single loss function produces mediocre results. We designed a composite loss that balances pixel accuracy, structural integrity, and human perceptual quality simultaneously:",
                    "→ L1 Reconstruction Loss (weight: 1.0) — pixel-level accuracy",
                    "→ Denoising L1 Loss (weight: 1.0) — intermediate supervision on the clean low-res output",
                    "→ VGG19 Perceptual Loss (weight: 0.1) — high-level semantic similarity via pre-trained ImageNet features",
                    "→ SSIM Loss (weight: 0.2) — structural similarity across luminance, contrast, and texture",
                    "→ LPIPS Loss (weight: 0.3) — learned perceptual similarity via AlexNet, the metric most correlated with human judgment",
                    "The result is a model that doesn't just optimize for pixel accuracy — it optimizes for what the image actually looks like to a person.",
                ]
            },
            {
                heading: "The Training Strategy",
                body: [
                    "Dataset: Oxford Buildings (OxBuild) — high-resolution architectural imagery.",
                    "Every training pair was generated on-the-fly with randomized degradations:",
                    "→ Noise std sampled from {15, 25, 50}",
                    "→ Blur kernel sampled from {3, 5, 7}",
                    "→ JPEG quality sampled from [40, 75]",
                    "→ 4x bicubic downsampling applied last",
                    "This means the model never sees the same degraded image twice. It learns to handle the full distribution of real-world noise — not a fixed lab scenario.",
                    "Optimizer: Adam with CosineAnnealingLR scheduling. Best model saved by peak validation SSIM.",
                ]
            },
            {
                heading: "What Made This Novel",
                body: [
                    "Most computer vision work looks like: load pretrained weights → fine-tune on client dataset → export. That's a service. What we built is an engineering contribution:",
                    "→ Conditional noise estimation embedded directly in the architecture as an input channel",
                    "→ Multi-stage intermediate supervision — the denoising stage has its own loss signal, not just the final output",
                    "→ Five-component composite loss combining pixel, perceptual, structural, and learned metrics",
                    "→ Dynamic data degradation that trains for robustness across the full degradation space",
                    "→ Residual learning at three scales — RDB, RRDB, and final refinement all use residual connections",
                    "The delivered model: srdm_model_optimized.pth — trained weights ready for inference.",
                ]
            },
            {
                heading: "The Takeaway for Founders and CTOs",
                body: [
                    "If you're building computer vision systems and your vendor is handing you a fine-tuned checkpoint — ask what the loss function looks like. Ask how the training data was generated. Ask what happens at test time when the input doesn't look like the training distribution.",
                    "The difference between a fine-tuned model and an engineered one shows up in production. Not in the demo.",
                ]
            },
        ]
    },
];

export function getArticleBySlug(slug: string): Article | undefined {
    return articles.find(a => a.slug === slug);
}
