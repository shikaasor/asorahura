# Phase 5: Optimization, Tracking & Launch Readiness - Research

**Researched:** 2026-05-16
**Domain:** Analytics instrumentation, performance testing, conversion tracking, launch readiness verification
**Confidence:** HIGH

## Summary

This phase instruments the Next.js 15 / Vercel site with GA4 event tracking (using @next/third-parties), Microsoft Clarity heatmaps, and performance monitoring via Core Web Vitals. It includes email deliverability validation via Resend/Gmail, Paddle sandbox testing with test transactions, and a documented go/no-go launch decision with a launch-readiness checklist. This is a verification and measurement phase, not a feature-building phase — it confirms Phases 1-4 work end-to-end before flipping Paddle to live mode.

**Primary recommendation:** Build instrumentation first (GA4 + Clarity), test critical paths (assessment → email → checkout), benchmark performance on Vercel preview URLs, run email tests, validate Paddle sandbox transactions, then document go/no-go decision in LAUNCH.md with confidence level and explicit sign-off.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Analytics event tracking:** GA4 is primary; Microsoft Clarity for heatmaps only
- **Top-of-funnel priority:** Homepage-to-assessment CTA click is the most critical event
- **Scroll depth:** Track 25%, 50%, 75%, 100% milestones on homepage
- **Clarity scope:** 4 pages only (homepage, assessment, results, checkout) — not site-wide
- **GA4 funnel visualization:** GA4 exploration views only — no Looker Studio dashboard
- **Performance thresholds:** Soft targets (<2s homepage, <1.5s results, <2s checkout) — launch not blocked if missed; fix post-launch
- **Web Vitals measurement:** LCP, CLS, INP plus load time — not just Lighthouse score
- **Performance audit:** Vercel preview deploy only (real CDN conditions), not localhost
- **Testing scope:** Chrome only (desktop + mobile); real device for mobile testing (Asor's phone)
- **Email deliverability:** Gmail inbox only; PDF rendering verified; no Outlook/mobile inbox required
- **Paddle testing:** 4 test transactions (one per tier) in sandbox before live mode activation
- **Go/no-go gate:** Complete end-to-end funnel (visit → assessment → email → results → Paddle checkout) all working
- **Launch decision:** Checklist-driven, no deadline — launch when criteria met
- **Rollback policy:** Any broken critical-path flow is hard blocker; fix before launch, no exceptions
- **Documentation:** LAUNCH.md with checklist, pass/fail, confidence level, and explicit sign-off

### Claude's Discretion
- Exact GA4 event naming convention (snake_case naming, parameter structure)
- Clarity session recording settings and privacy masking configuration
- Structure and format of launch-readiness checklist file
- Which Lighthouse categories to report (Performance, Accessibility, SEO, Best Practices)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CTA tracking | Track all CTAs (assessment click, assessment start, assessment completion, form submission, checkout init) | GA4 event tracking via sendGAEvent; funnel visualization in GA4 Exploration |
| Funnel instrumentation | Funnel visualization showing conversions at each stage (visitor → assessment → email → engage → checkout) | GA4 funnel reports; event setup with view_item → begin_checkout → purchase equivalent pattern |
| GA4 event tracking active | All CTAs tracked with GA4 integration | @next/third-parties GoogleAnalytics component + sendGAEvent function |
| Clarity heatmaps | Heatmaps on 4 pages (homepage, assessment, results, checkout) | @microsoft/clarity NPM integration; 4-page scope limit enforced |
| Email deliverability verified | Test emails to Gmail with PDF rendering verified | Resend sandbox/preview testing; send test email to real Gmail account |
| Paddle production mode activated | 4 test transactions (one per tier) in sandbox before live | Paddle sandbox environment; test card numbers; transaction logging |
| Mobile testing passed | iOS Safari, Chrome mobile, Android Chrome for critical flows | Real device testing on Asor's phone; Chrome mobile + iOS Safari |
| Page speed benchmarked | <2s homepage, <1.5s results, <2s checkout via Lighthouse | Lighthouse CLI on Vercel preview URLs; Core Web Vitals via useReportWebVitals |
| Go/no-go decision documented | LAUNCH.md with checklist, pass/fail, confidence level | Structured checklist; confidence assessment; sign-off date |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @next/third-parties | Latest (Next.js 15 built-in) | GA4 integration via GoogleAnalytics component | Official Next.js solution; handles script loading and page-change tracking automatically |
| @microsoft/clarity | Latest NPM | Heatmaps and session recordings | Free, no vendor lock-in; official MS solution for behavioral analytics |
| next/web-vitals | Built-in (Next.js 13+) | Core Web Vitals collection (LCP, CLS, INP, TTFB, FCP) | Official Next.js hook; no installation needed; Real User Metrics (RUM) tracking |
| lighthouse | Latest (CLI) | Performance audit and benchmarking | Google's official synthetic testing tool; measures Performance, Accessibility, SEO, Best Practices |
| Resend | v6.12.3 (already installed) | Email sending and testing | Already integrated; test emails via sandbox domain |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Paddle (browser SDK) | v2 (cdn.paddle.com/paddle/v2/paddle.js) | Inline checkout testing and live mode | Already integrated; test card numbers in sandbox |
| Cross-tab (window.dispatchEvent) | Native API | Relay Paddle events across component instances | Already in use; no additional library needed |

### Installation
```bash
npm install @microsoft/clarity
# No additional GA4 installation needed — @next/third-parties is built-in to Next.js 15
# Lighthouse CLI install (global, for automated testing):
npm install -g @lhci/cli@latest
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with GA4 <GoogleAnalytics> and <WebVitals> components
│   ├── page.tsx            # Homepage with scroll-depth tracking events
│   └── ...
├── components/
│   ├── Analytics/
│   │   ├── WebVitals.tsx   # useReportWebVitals client component
│   │   ├── ClarityProvider.tsx  # Microsoft Clarity initialization
│   │   └── trackEvent.ts   # Utility: sendGAEvent wrapper with custom naming convention
│   ├── checkout/
│   │   └── PaddleCheckout.tsx  # Paddle inline checkout (already built)
│   └── ...
├── .planning/
│   └── phases/05-.../
│       ├── 05-RESEARCH.md  # This file
│       └── LAUNCH.md       # Go/no-go checklist (template provided below)
```

### Pattern 1: GA4 Event Tracking with @next/third-parties
**What:** Instrument Next.js with Google Analytics using official @next/third-parties component for page views, then sendGAEvent for custom conversions.

**When to use:** All page-level tracking and user actions (CTAs, form submissions, assessment progress, checkout steps).

**Implementation:**

```typescript
// app/layout.tsx (server component)
import { GoogleAnalytics } from '@next/third-parties/google';

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const isProduction = process.env.NODE_ENV === 'production';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {gaId && isProduction && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
```

```typescript
// components/Analytics/trackEvent.ts (utility for consistent naming)
'use client';
import { sendGAEvent } from '@next/third-parties/google';

export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
) {
  if (process.env.NODE_ENV !== 'production') return;
  
  sendGAEvent('event', `${category}_${action}`, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// Usage in client components:
// trackEvent('assessment', 'click', 'homepage_cta', 1);
// trackEvent('engagement', 'form_submit', 'contact_form');
// trackEvent('checkout', 'begin_checkout', 'paddle', 99);
```

**Example: Homepage CTA Click Tracking**

```typescript
// components/HomePage.tsx
'use client';
import { trackEvent } from '@/components/Analytics/trackEvent';

export function HomepageCTA() {
  const handleClick = () => {
    trackEvent('assessment', 'click', 'homepage_cta');
    // Navigate to assessment
  };
  
  return <button onClick={handleClick}>Start Assessment</button>;
}
```

**Source:** [Google Analytics in Next.js 15+ with @next/third-parties - Medium](https://medium.com/@koriigami/google-analytics-in-next-js-15-with-next-third-parties-164be149e7b7)

### Pattern 2: Scroll Depth Tracking
**What:** Fire GA4 events at scroll milestones (25%, 50%, 75%, 100%) on the homepage.

**When to use:** Identify where users drop off before clicking assessment CTA.

**Implementation:**

```typescript
// components/HomePage/ScrollDepthTracker.tsx
'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/components/Analytics/trackEvent';

const SCROLL_THRESHOLDS = [0.25, 0.5, 0.75, 1.0];
const trackedThresholds = new Set<number>();

export function ScrollDepthTracker() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = 
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) || 0;
      
      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (scrollPercentage >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackEvent(
            'engagement',
            'scroll_depth',
            `${Math.round(threshold * 100)}%`,
            Math.round(threshold * 100)
          );
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return null;
}
```

**Add to homepage layout:**
```typescript
<ScrollDepthTracker />
```

### Pattern 3: Microsoft Clarity Initialization
**What:** Load Clarity heatmaps and session recordings on 4 critical pages only.

**When to use:** Capture user behavior for analytics and UX debugging.

**Implementation:**

```typescript
// components/Analytics/ClarityProvider.tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function ClarityProvider() {
  const clarityId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID;
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (!clarityId || isDev) return null;
  
  // Clarity will only initialize if clarity object is undefined
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.clarity) {
      (function(c, l, a, r, i, t, y) {
        c[a] = c[a] || function() {
          (c[a].q = c[a].q || []).push(arguments);
        };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', clarityId);
    }
  }, [clarityId]);
  
  return null;
}
```

**Add to root layout:**
```typescript
// app/layout.tsx
import { ClarityProvider } from '@/components/Analytics/ClarityProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClarityProvider />
        {children}
      </body>
    </html>
  );
}
```

**Scope enforcement:** Initialize only on homepage, assessment, results, checkout routes. Don't initialize globally; wrap conditionally per route if needed.

**Source:** [Microsoft Clarity Setup Documentation](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup), [How to Setup Microsoft Clarity in Next.js](https://www.nextupkit.com/blog/how-to-setup-microsoft-clarity-nextjs)

### Pattern 4: Core Web Vitals Collection with useReportWebVitals
**What:** Isolate web vitals reporting in a small client component to track LCP, CLS, INP, TTFB, FCP.

**When to use:** Real User Monitoring (RUM) — measure actual browser performance, not synthetic tests.

**Implementation:**

```typescript
// components/Analytics/WebVitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackEvent } from './trackEvent';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // metric = { name, value, rating, id }
    // Ratings: 'good', 'needs-improvement', 'poor'
    
    console.log(`${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
    
    // Send to GA4
    trackEvent(
      'web_vitals',
      metric.name.toLowerCase(),
      metric.rating,
      Math.round(metric.value)
    );
    
    // Optional: send to external service via navigator.sendBeacon (survives page nav)
    // navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
  });
  
  return null;
}
```

**Add to root layout:**
```typescript
import { WebVitals } from '@/components/Analytics/WebVitals';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

**Key metrics tracked:**
- **LCP (Largest Contentful Paint):** How fast the largest content element renders (target <2.5s, good)
- **CLS (Cumulative Layout Shift):** Visual stability during load (target <0.1, good)
- **INP (Interaction to Next Paint):** Response time to user input (target <200ms, good)
- **TTFB (Time to First Byte):** Server response time (target <600ms, good)
- **FCP (First Contentful Paint):** Any content visible (target <1.8s, good)

**Source:** [useReportWebVitals - Next.js Docs](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals)

### Pattern 5: GA4 Funnel Events (Conversion Tracking)
**What:** Structure events to match a conversion funnel: visitor → assessment viewed → assessment completed → email captured → results viewed → checkout initiated → purchase completed.

**When to use:** Build funnel exploration reports in GA4 to measure conversion drop-off at each stage.

**Event Structure (snake_case naming):**

```typescript
// Page views (auto-tracked by GA4 with Enhanced Measurement enabled):
// page_view (automatic on route changes)

// Custom funnel events:
trackEvent('assessment', 'view', 'assessment_page');       // User visits /assessment
trackEvent('assessment', 'start', 'assessment_form');      // User clicks "Start Assessment"
trackEvent('assessment', 'submit', 'assessment_form');     // User submits assessment
trackEvent('engagement', 'form_submit', 'contact_form');   // User submits email/contact form (Resend event)
trackEvent('results', 'view', 'results_page');             // User views results after email
trackEvent('checkout', 'begin', 'paddle_checkout');        // User initiates Paddle checkout
trackEvent('purchase', 'complete', 'paddle_purchase', purchaseValue); // Paddle webhook callback

// GA4 Funnel Exploration will align these as:
// Step 1: assessment_view
// Step 2: assessment_submit
// Step 3: engagement_form_submit (email captured)
// Step 4: results_view
// Step 5: checkout_begin
// Step 6: purchase_complete
```

**Source:** [Master GA4 Funnel Analysis (2025) - Conversios](https://www.conversios.io/blog/ga4-funnel-analysis-guide/), [GA4 Ecommerce Funnel Guide - Vijay Bhabhor](https://vijaybhabhor.com/blog/ga4-ecommerce-funnel)

### Anti-Patterns to Avoid
- **Don't initialize Clarity site-wide:** Only on homepage, assessment, results, checkout. Extra sessions are noise.
- **Don't track in development:** Always check NODE_ENV === 'production' before sending GA4/Clarity data.
- **Don't set up Looker Studio dashboard:** User decision: GA4 Exploration views only — no BI tool complexity.
- **Don't use custom code for page-view tracking:** @next/third-parties handles it automatically with Enhanced Measurement.
- **Don't test with real GA4 measurement ID before launch:** Use a dev property in GA4 console for testing.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GA4 script management + page-change tracking | Custom gtag() wrapper | @next/third-parties GoogleAnalytics component | Handles timing, hydration mismatches, page changes; official solution |
| Heatmap/session recording | Custom scroll/click listeners | Microsoft Clarity | Battle-tested, privacy-masking built-in, visual analysis UX is complex |
| Core Web Vitals collection | Manual intersection observers + PerformanceObserver | next/web-vitals hook | Browser APIs are non-trivial; Next.js hook abstracts complexity, integrates with RUM services |
| Performance benchmarking + CI/CD integration | Manual Puppeteer + parsing Lighthouse JSON | Lighthouse CI (@lhci/cli) | LHCI handles report storage, assertion logic, GitHub/Vercel integration; manual setup has pitfalls |
| Email rendering validation | Screenshots in different clients | Resend preview + real Gmail test | Resend sandbox is free; manual testing is error-prone and time-consuming |
| Paddle transaction testing | One test transaction | 4 test transactions (one per tier) | Different pricing tiers may have different payment flows; testing all tier flows catches bugs |

**Key insight:** Analytics, performance, and email are domains with significant edge cases (hydration timing, bot detection, email client rendering). Mature libraries handle these; custom code introduces regressions that surface only in production.

## Common Pitfalls

### Pitfall 1: GA4 Data Delayed by 1 Hour
**What goes wrong:** Deploy GA4, check GA4 console immediately, no data appears; conclude tracking is broken.

**Why it happens:** GA4 has latency; data propagates after ~1 hour.

**How to avoid:** Deploy, wait 60 minutes, then verify. Use browser DevTools → Network tab to see POST requests to www.google-analytics.com/g/collect to confirm data is sending client-side.

**Warning signs:** No events in Real-Time report after 5 minutes of active site interaction.

### Pitfall 2: Clarity Doesn't Work if Initialized Server-Side
**What goes wrong:** Add Clarity tracking code in root layout.tsx without 'use client', no data appears, heatmaps empty.

**Why it happens:** Clarity needs window object; server-side rendering doesn't have it.

**How to avoid:** Isolate Clarity in a separate 'use client' component. Use useEffect to initialize only in browser.

**Warning signs:** Network tab shows no POST to clarity.ms/collect; Clarity dashboard shows 0 sessions after 15 minutes.

### Pitfall 3: Performance Audit on localhost ≠ Vercel Performance
**What goes wrong:** Run Lighthouse on localhost, get <1s load times; deploy to Vercel, users see 2.5s homepage; data mismatch causes false conclusions.

**Why it happens:** Localhost has no CDN, no network latency, no real-world caching. Vercel adds real conditions (edge, DNS, TLS handshake).

**How to avoid:** Always benchmark on Vercel preview deploy URL, not localhost. Use Lighthouse CI with Vercel integration to measure each PR.

**Warning signs:** Local Lighthouse score 95, Vercel preview 72; huge gap indicates environment mismatch.

### Pitfall 4: Email Test Doesn't Reach Gmail Inbox (Lands in Spam)
**What goes wrong:** Send test email via Resend to Gmail, it appears in Spam or Promotions, not Primary inbox. Conclude email is broken.

**Why it happens:** Gmail filters on sender reputation, SPF/DKIM/DMARC, and content signals. Resend sandbox domain may have low reputation for testing.

**How to avoid:** Send from Resend production domain (even in tests), or configure Resend with custom domain + DKIM. Add unsubscribe link to test email. Monitor Gmail Postmaster Tools for sender reputation.

**Warning signs:** Email arrives minutes later; subject line says "Your invitation" (triggering promo filters).

### Pitfall 5: Paddle Sandbox Test Card Works, Live Card Fails (or Vice Versa)
**What goes wrong:** Test 4 transactions in sandbox, all succeed with test card 4242 4242 4242 4242. Switch Paddle to live, real card declines. Conclude integration is broken.

**Why it happens:** Sandbox and live are separate environments. Test cards work only in sandbox; live cards work only in live. Network errors, 3DS flows, or actual payment processor rejections don't surface in sandbox.

**How to avoid:** Test cards in sandbox should succeed. In live, test with small real transaction ($1-2) from Asor's own card to verify processor communication end-to-end before announcing to customers.

**Warning signs:** Sandbox shows successful transaction, but live transaction hangs or returns 402 payment_required.

### Pitfall 6: Funnel Abandonment Doesn't Match Reality
**What goes wrong:** GA4 funnel shows 80% drop between "assessment_view" and "assessment_start"; investigate UI, find CTA is visible. Data is wrong.

**Why it happens:** Event not firing (missing trackEvent call, condition skipped), or events not being sent to GA4 (NODE_ENV check failed, script didn't load).

**How to avoid:** Test trackEvent locally: add console.log in trackEvent function. Verify events fire on all paths (mobile, slow network, SSR edge cases). Use GA4 Real-Time report during testing to see events live.

**Warning signs:** Same events fire in local console but not in GA4 Real-Time; indicates production NODE_ENV check is filtering them.

### Pitfall 7: CLS (Layout Shift) on Results Page During Data Load
**What goes wrong:** Results page loads header, user starts reading, then assessment results load and shift everything down. CLS spikes, Core Web Vitals degrade.

**Why it happens:** Async data loading without reserved space (no skeleton/placeholder dimensions).

**How to avoid:** Reserve space for results section with min-height or skeleton loader before data arrives. Measure CLS on slow 3G in Chrome DevTools to catch this early.

**Warning signs:** CLS < 0.1 in lab (Lighthouse), but > 0.3 in field (useReportWebVitals data in GA4).

### Pitfall 8: Go/No-Go Checklist Ignored, Launch Anyway
**What goes wrong:** Checklist has 2 red items (Clarity not firing, email PDF broken), team says "ship anyway," production has blind spots.

**Why it happens:** Pressure to launch, checklist seen as optional, no buy-in from stakeholders.

**How to avoid:** Make LAUNCH.md a hard gate. Require explicit sign-off by name and date. Define "hard blocker" items clearly (critical path failures). Document why soft failures are acceptable (e.g., performance soft targets, non-critical pages).

**Warning signs:** Checklist discussion is deprioritized; sign-off is informal or skipped.

## Code Examples

Verified patterns from official and tested sources:

### GA4 Event Tracking Utility
```typescript
// components/Analytics/trackEvent.ts
'use client';
import { sendGAEvent } from '@next/third-parties/google';

/**
 * Track a custom GA4 event with consistent naming convention.
 * @param category e.g., 'assessment', 'engagement', 'checkout'
 * @param action e.g., 'click', 'submit', 'view'
 * @param label e.g., 'homepage_cta', 'contact_form'
 * @param value optional numeric value (e.g., price)
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
) {
  // Only track in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[GA4 Event] ${category}_${action} | ${label} | ${value}`);
    return;
  }
  
  const eventName = `${category}_${action}`;
  const eventParams: Record<string, unknown> = {
    event_category: category,
    event_label: label,
  };
  
  if (value !== undefined) {
    eventParams.value = value;
  }
  
  sendGAEvent('event', eventName, eventParams);
}
```

**Source:** [GA4 Event Tracking Best Practices - Medium](https://ospaarmann.medium.com/google-analytics-4-ga4-in-next-js-14-and-react-with-event-tracking-2ceabb00c59a)

### Lighthouse CI Configuration (lighthouserc.js)
```javascript
// lighthouserc.js (at root of repo)
module.exports = {
  ci: {
    collect: {
      // Point to Vercel preview URL (passed as env var in CI)
      url: [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'],
      staticDistDir: './out', // if using static export
      numberOfRuns: 3, // Average 3 runs to reduce variance
    },
    upload: {
      target: 'temporary-public-storage', // For PR comment
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['warn', { minScore: 0.90 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.85 }],
      },
    },
  },
};
```

**Installation:**
```bash
npm install -g @lhci/cli@latest
lhci --version
```

**Usage:**
```bash
# Test current build (requires Vercel preview URL)
VERCEL_URL=my-app-preview.vercel.app lhci autorun

# Output: audit report saved, warnings logged if thresholds breached
```

**Source:** [Lighthouse CI Guide - Unlighthouse](https://unlighthouse.dev/learn-lighthouse/lighthouse-ci)

### Paddle Sandbox Test Flow
```typescript
// Test transaction example (Paddle sandbox)
// 1. Ensure env vars are set:
// NEXT_PUBLIC_PADDLE_TOKEN = "sandbox_token_..."
// 2. Component already handles environment toggle in PaddleCheckout.tsx (line 63)

// Test card numbers for sandbox:
const testCards = {
  success: '4242424242424242',      // No 3DS — instant success
  success_3ds: '4000003800000446',   // With 3DS authentication
  declined: '4000000000000002',      // Intentional decline
};

// Test flow:
// 1. Visit checkout page
// 2. Click "Buy" for each tier
// 3. Enter test card (e.g., 4242 4242 4242 4242)
// 4. Any name, future expiry (e.g., 12/25)
// 5. Confirm transaction
// 6. Log response in browser console (already logged by PaddleCheckout.tsx)
// 7. Repeat for all 4 tiers

// Expected: Each transaction shows "checkout.completed" event
// Check: Paddle dashboard sandbox shows 4 transactions, one per tier
```

**Source:** [How to Test Purchases with Paddle - Paddle Help Center](https://www.paddle.com/help/start/set-up-paddle/how-do-i-test-my-checkout-integration)

### Resend Email Test
```typescript
// Test email sending via Resend (from a server action or API route)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestEmail(toEmail: string) {
  try {
    const result = await resend.emails.send({
      from: 'test@yourdomain.resend.dev', // Resend sandbox domain
      to: toEmail, // e.g., your Gmail account
      subject: 'Test Email with PDF',
      html: `<h1>Test Email</h1><p>This is a test with a PDF attachment.</p>`,
      // If attaching PDF:
      // attachments: [{ filename: 'assessment.pdf', content: pdfBuffer }],
    });
    
    console.log('Email sent:', result.id);
    return result;
  } catch (err) {
    console.error('Email failed:', err);
    throw err;
  }
}

// Usage in testing:
// 1. Call sendTestEmail('your-gmail@gmail.com')
// 2. Check Gmail inbox (usually arrives in seconds, or Promotions tab)
// 3. Verify PDF renders correctly if attached
// 4. Check sender reputation in Gmail Postmaster Tools
```

**Source:** [Send Test Emails - Resend Docs](https://resend.com/docs/dashboard/emails/send-test-emails)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| google-analytics (gtag) script manually in HTML | @next/third-parties GoogleAnalytics component | Next.js 13+ (2023) | Automatic page-change tracking, type safety, no hydration issues |
| Custom event tracking with gtag() wrapper | sendGAEvent from @next/third-parties | Next.js 15 (2025) | Cleaner API, framework-aware, no setup required |
| Segment / Mixpanel for funnel tracking | Native GA4 funnel exploration reports | GA4 launch (2020) | GA4 free; eliminates vendor dependency; built-in funnel UI |
| Lighthouse in browser DevTools only | Lighthouse CI in CI/CD + Vercel preview URLs | 2020-2024 | Reproducible metrics, regression detection, Vercel integration via LHCI |
| DMARC/SPF setup for transactional email | Resend production domain with DKIM auto-config | 2024 | Resend manages authentication; no SPF/DKIM manual config needed for tests |
| Heatmaps via Hotjar/FullStory | Microsoft Clarity (free) | 2021+ | Clarity is free, no per-session pricing; privacy-masking built-in |

**Deprecated/outdated:**
- **google-analytics (ga):** Superseded by GA4; old Universal Analytics shut down 2023
- **Manual gtag() in <script> tags:** @next/third-parties handles timing and hydration better
- **Looker Studio dashboards for GA4:** GA4 Exploration views are powerful enough; no third tool needed for this phase

## Open Questions

1. **GA4 Measurement ID creation:**
   - What we know: User will provide measurement ID (e.g., G-XXXXXXXXXX) via GA4 console
   - What's unclear: Is test property vs. production property decided? (Recommend: separate test and prod properties for safety)
   - Recommendation: Create two GA4 properties in GA4 console (test and prod), store test ID in NEXT_PUBLIC_GOOGLE_ANALYTICS_ID during phase, switch to prod ID at launch

2. **Microsoft Clarity Project ID:**
   - What we know: Clarity requires project ID from clarity.microsoft.com
   - What's unclear: Is Clarity account already created?
   - Recommendation: Create free Clarity account before phase starts; generate Project ID and store in NEXT_PUBLIC_MICROSOFT_CLARITY_ID env var

3. **Resend Domain Authentication:**
   - What we know: Resend sandbox domain (resend.dev) works for testing; production emails should use custom domain
   - What's unclear: Should custom domain be set up before launch?
   - Recommendation: Use Resend sandbox domain (resend.dev) for all tests in this phase. Post-launch, configure custom domain (DKIM verified) for production emails

4. **Paddle Live Mode Activation Timing:**
   - What we know: 4 sandbox transactions must succeed before flipping switch
   - What's unclear: Does Paddle live mode switch require Paddle account verification (tax ID, etc.)?
   - Recommendation: Verify Paddle account is "live-ready" before phase starts; may require bank info submission during onboarding

5. **LAUNCH.md Audience and Approval:**
   - What we know: LAUNCH.md documents go/no-go with confidence level and sign-off
   - What's unclear: Who signs off? (Asor only? Dev team + Asor?)
   - Recommendation: Single sign-off by Asor (product owner); date and confidence level (Low/Medium/High) mandatory

## Sources

### Primary (HIGH confidence)
- Next.js 15 official @next/third-parties GoogleAnalytics component — pattern verified
- Next.js official useReportWebVitals hook (next/web-vitals) — built-in, no install needed
- Microsoft Clarity official setup docs (learn.microsoft.com) — implementation pattern verified
- Paddle Sandbox testing docs (paddle.com/help) — test card numbers and sandbox behavior verified
- Resend official send-test-emails docs — sandbox domain and test patterns verified
- Lighthouse CI official GitHub repo (GoogleChrome/lighthouse-ci) — CI/CD configuration verified

### Secondary (MEDIUM confidence)
- [A Developer's Guide to Next JS Google Analytics for 2026](https://swetrix.com/blog/next-js-google-analytics)
- [Google Analytics in Next.js 15+ with @next/third-parties](https://medium.com/@koriigami/google-analytics-in-next-js-15-with-next-third-parties-164be149e7b7)
- [GA4 Event Tracking Best Practices in Next.js](https://ospaarmann.medium.com/google-analytics-4-ga4-in-next-js-14-and-react-with-event-tracking-2ceabb00c59a)
- [How to Setup Microsoft Clarity in Next.js](https://www.nextupkit.com/blog/how-to-setup-microsoft-clarity-nextjs)
- [Master GA4 Funnel Analysis (2025)](https://www.conversios.io/blog/ga4-funnel-analysis-guide/)
- [Automating Web Performance Testing in CI/CD Using Lighthouse](https://blogs.halodoc.io/automating-web-performance-testing-in-ci-cd-lighthouse/)
- [Email Deliverability Testing Guide 2026](https://www.mailreach.co/blog/how-to-test-email-deliverability)
- [SaaS Launch Readiness Checklist Guide](https://designrevision.com/blog/saas-launch-checklist)

### Tertiary (Pattern references)
- Core Web Vitals measurement strategies (Vercel Academy, web.dev)
- Paddle inline checkout display mode (already implemented in codebase)
- GA4 Exploration funnel visualization UI (GA4 console)

## Metadata

**Confidence breakdown:**
- Standard stack (GA4 + Clarity + Core Web Vitals): HIGH — official docs + field-tested patterns
- Architecture (event tracking structure, provider components): HIGH — verified implementations in medium articles
- Pitfalls (common mistakes, timing issues): MEDIUM-HIGH — from ecosystem discussion, one personal validation recommended
- Performance testing (Lighthouse CI + Vercel): MEDIUM-HIGH — CI/CD integration docs complete, not yet implemented in this codebase
- Email + Paddle testing: MEDIUM — official docs clear, but user hasn't attempted flows yet

**Research date:** 2026-05-16
**Valid until:** 2026-05-23 (7 days — GA4/Clarity APIs stable; Lighthouse and Next.js patch updates possible but non-breaking)

