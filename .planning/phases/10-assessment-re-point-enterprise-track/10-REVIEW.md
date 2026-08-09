---
phase: 10-assessment-re-point-enterprise-track
reviewed: 2026-08-09T00:00:00Z
depth: standard
files_reviewed: 28
files_reviewed_list:
  - src/app/assessment/deep/actions.ts
  - src/app/assessment/deep/page.tsx
  - src/app/assessment/page.tsx
  - src/app/checkout/page.tsx
  - src/app/engage/actions.ts
  - src/app/engage/page.tsx
  - src/app/enterprise/enterprise.module.css
  - src/app/enterprise/page.tsx
  - src/app/services/page.tsx
  - src/components/Navigation.tsx
  - src/components/assessment/AssessmentSectorGate.module.css
  - src/components/assessment/AssessmentSectorGate.tsx
  - src/components/assessment/AssessmentShell.tsx
  - src/components/assessment/DeepAssessmentShell.tsx
  - src/components/assessment/RevenueResultsScreen.module.css
  - src/components/assessment/RevenueResultsScreen.tsx
  - src/components/home/Footer.tsx
  - src/emails/AssessmentReport.tsx
  - src/lib/email.ts
  - src/lib/pdf.ts
  - src/lib/prompts.ts
  - src/lib/revenueCalculation.ts
  - tests/test-assessment-gate-wiring.test.ts
  - tests/test-assessment-route-consolidation.test.ts
  - tests/test-assessment-sector-gate.test.ts
  - tests/test-calendly-removal-emails.test.ts
  - tests/test-calendly-removal-pages.test.ts
  - tests/test-engage-enterprise-routing.test.ts
  - tests/test-enterprise-page.test.ts
  - tests/test-enterprise-reachability.test.ts
  - tests/test-revenue-calculation.test.ts
  - tests/test-revenue-results-screen.test.ts
findings:
  critical: 1
  warning: 6
  info: 1
  total: 8
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-08-09
**Depth:** standard
**Files Reviewed:** 28 (some libraries pulled in for cross-reference: `src/lib/assessment.ts`, `src/lib/deepAssessment.ts`, `src/lib/checkout.ts`)
**Status:** issues_found

## Summary

The phase re-points the assessment flow to a sector gate (`AssessmentSectorGate`) that routes self-serve users through a default-sector quick/deep assessment and routes "Enterprise" clicks to `/enterprise`. Route consolidation (`/assessment/deep` → `/assessment?depth=deep`), Calendly removal from the self-serve funnel, and revenue-opportunity display all work as advertised by the accompanying test suite. However, tracing the actual runtime behavior (not just the string-matching tests) surfaces one real correctness bug in the deep-assessment email path, plus several dead/unreachable code paths left over from the pivot that should be cleaned up or explained, and a couple of quality/robustness gaps.

## Critical Issues

### CR-01: Deep assessment email always reports success, even on failure

**File:** `src/app/assessment/deep/actions.ts:82-93`
**Issue:** `submitDeepAssessmentForEmail` sends the scorecard email like this:
```ts
try {
  await resend.emails.send({ from: "...", to: email, subject: `...`, html });
} catch (err) {
  console.error("Deep assessment email failed:", err);
}

return { success: true };
```
Two problems compound here:
1. The Resend SDK resolves with `{ data, error }` rather than throwing on API-level failures (invalid recipient, rate limit, etc.) — the code never inspects `error`, so those failures are invisible.
2. Even for a thrown/rejected promise (network failure), the `catch` block only logs and falls through to the unconditional `return { success: true }` on line 93 — there is no `return` inside the catch, and no `success: false` path exists anywhere in this function.

The caller (`DeepAssessmentShell.handleEmailSubmit`) treats `res.success` as the signal to persist identity to `localStorage` and render `RevenueResultsScreen`, which shows `"Full Scorecard Sent to {firstName}"` (see `RevenueResultsScreen.tsx:112-118`). Because this function can never return `success:false` for an email-send failure, a paying prospect can be told their report was emailed when it was not, with no retry path and no visibility into the failure (the `GOOGLE_SCRIPT_URL` CRM log is also fire-and-forget, so the lead may not be captured anywhere).

**Fix:**
```ts
try {
  const { error } = await resend.emails.send({
    from: "Asor Ahura <hello@asorahura.com>",
    to: email,
    subject: `Your Full AI Opportunity Discovery Scorecard — ${total}/${DEEP_MAX_SCORE} · ${tier.name}`,
    html,
  });
  if (error) {
    console.error("Deep assessment email failed:", error.message);
    return { success: false, error: "Could not send your scorecard email. Please try again." };
  }
} catch (err) {
  console.error("Deep assessment email threw:", err);
  return { success: false, error: "Could not send your scorecard email. Please try again." };
}

return { success: true };
```
This matches the `{ error }`-checking pattern already used elsewhere in `src/lib/email.ts` (`sendAssessmentEmail`, `sendPurchaseConfirmationEmail`, etc.).

## Warnings

### WR-01: `checkout/page.tsx` enterprise CTA branch is permanently dead code

**File:** `src/app/checkout/page.tsx:24,115-129`
**Issue:** `const isEnterprise = false;` is a hardcoded literal — it is never derived from `selectedTier`, a query param, or any other state. `TierId` (`src/lib/checkout.ts:1`) only ever contains `"discovery" | "strategy"`, so there is no way for this flag to become `true`. The entire `enterpriseCta` JSX block (lines 115-123), including the `/engage?enterprise=true` link that `tests/test-calendly-removal-pages.test.ts` asserts exists via plain string matching, is unreachable in the running app.
**Fix:** Either remove the dead branch and its CSS (`enterpriseCta`, `enterpriseCtaText`, `enterpriseBtn` in `checkout.module.css`) if enterprise tiers are never sold through `/checkout`, or wire `isEnterprise` to a real condition (e.g. an `enterprise` tier added to `tiers`, or a `?tier=enterprise` redirect from `/services`) if the intent was to support it.

### WR-02: `engage` server action's declared return type is never actually produced — client success/error UI is unreachable

**File:** `src/app/engage/actions.ts:5,40-44`, `src/app/engage/page.tsx:19-27,45-48,146`
**Issue:** `submitInquiry` is typed `Promise<{ success: boolean; message: string } | never>`, but every code path ends in `redirect(...)` (either to Calendly for enterprise or to `/engage/confirmation`). Next.js's `redirect()` inside a Server Action always short-circuits normal return via navigation — the calling client code never receives a plain `{ success, message }` object. As a result, `engage/page.tsx`'s `status === "success"` / `status === "error"` branches (rendering `message`) can never be reached in practice; a submission either navigates away or the CRM webhook silently fails (caught and swallowed at `actions.ts:35-37`) while the user is redirected anyway with no error surfaced.
**Fix:** Remove the dead success/error UI and the misleading return type, or restructure to actually return a result object (skip `redirect()` and let the client navigate via `router.push` after checking a real success/failure result) if inline error feedback is a requirement.

### WR-03: Sector persistence (`asor_user_sector`) is dead code — read but never written

**File:** `src/components/assessment/AssessmentShell.tsx:26,46-53`, `src/components/assessment/DeepAssessmentShell.tsx:25,50-55`
**Issue:** Both shells read `localStorage.getItem("asor_user_sector")` on mount to restore a previously selected sector, but no code anywhere in the repository ever calls `localStorage.setItem("asor_user_sector", ...)`. `AssessmentSectorGate` (the only entry point) does not collect or persist a sector — "Small Business" just calls `onContinue()` and sector stays at `DEFAULT_SECTOR` for the whole flow, per the comment at `AssessmentShell.tsx:28-29`. Combined, this means:
  - The `SECTOR_KEY` restore branches are unreachable dead code.
  - All `sectorSpecific` question overrides for Law/Finance/Real Estate/Construction in `src/lib/assessment.ts` and the sector-specific F-dimension questions (ids 21-36) in `src/lib/deepAssessment.ts` are unreachable from the self-serve assessment shells — only the "Other / Cross-Industry" defaults are ever served.
**Fix:** If self-serve users are intentionally locked to the default sector post-pivot, delete the dead `SECTOR_KEY` read logic (and consider whether the unused sector-specific question data should be removed or documented as reserved for a future/enterprise flow). If sector selection was meant to survive the pivot, wire `AssessmentSectorGate` (or another entry point) to actually persist the chosen sector.

### WR-04: `DeepAssessmentShell` silently discards the email-submission result on the repeat-user fast path

**File:** `src/components/assessment/DeepAssessmentShell.tsx:102-109`
**Issue:** When `savedIdentity` exists, `await submitDeepAssessmentForEmail(...)` is called but its result is never checked — unlike `handleEmailSubmit` just below, which checks `res.success` and sets `emailError`. Given CR-01 (the action can silently fail while still often reporting non-actionable state), a repeat visitor who hits an email failure gets no error feedback at all and is taken straight to the results screen claiming the email was sent.
**Fix:** Check the result the same way `handleEmailSubmit` does, or explicitly document why this path intentionally ignores the outcome.

### WR-05: Engage form fields are forwarded to an external webhook with no schema validation or sanitization

**File:** `src/app/engage/actions.ts:8-25`
**Issue:** All form fields (`name`, `email`, `company`, `role`, `challenge`, `context`, etc.) are read via `formData.get(...) as string` with no server-side validation (no email format check, no length limits) before being JSON-posted to `GOOGLE_SCRIPT_URL`. The only validation is client-side HTML `required`/`type="email"`, which is trivially bypassable. If the receiving Google Apps Script writes these values into a spreadsheet, unsanitized leading characters (e.g. `=`, `+`, `-`, `@`) in `name`/`company`/`challenge`/`context` create a classic CSV/spreadsheet-formula-injection risk when the sheet is later opened in Excel/Sheets by a human.
**Fix:** Validate the inbound fields with a schema (e.g. zod, similar to `emailGateSchema` used elsewhere) before forwarding, and/or prefix values that start with `=`, `+`, `-`, `@` with a `'` (or strip them) before sending to the spreadsheet-backed webhook.

### WR-06: `AssessmentReport.tsx` "Download Full Scorecard PDF" button links to an unrelated static asset, not the generated report

**File:** `src/emails/AssessmentReport.tsx:82-96`
**Issue:** The first CTA button hardcodes `href="https://asorahura.com/ai-readiness-scorecard.pdf"` — a generic, presumably static file — while the actual personalized PDF (built per-recipient in `src/lib/pdf.ts` via `generateAssessmentPDF`) is attached to the email separately (see `email.ts:53-59`, `232-238`). The button text ("Download Full Scorecard PDF") implies it links to the recipient's own report, which it does not; if that static path doesn't exist/isn't maintained, this is a dead link inside every assessment email sent.
**Fix:** Either remove this button (the personalized PDF is already attached) or point it at something that actually resolves for this recipient.

## Info

### IN-01: `deep/actions.ts` GOOGLE_SCRIPT_URL POST is fire-and-forget with no `await`

**File:** `src/app/assessment/deep/actions.ts:60-80`
**Issue:** Unlike `engage/actions.ts`, which `await`s its `GOOGLE_SCRIPT_URL` POST (allowing the request to actually complete before the serverless function may be torn down), this call is not awaited — only `.catch(() => {})` is attached. On some serverless runtimes, an un-awaited fetch can be aborted when the response is returned to the caller, silently dropping the CRM log entry.
**Fix:** `await` the fetch (already wrapped in a `.catch`, so this is low-risk) to ensure the log write completes before the function returns, consistent with `engage/actions.ts`.

---

_Reviewed: 2026-08-09_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
