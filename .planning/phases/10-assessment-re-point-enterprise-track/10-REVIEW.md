---
phase: 10-assessment-re-point-enterprise-track
reviewed: 2026-08-09T00:00:00Z
depth: standard
files_reviewed: 22
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
findings:
  critical: 2
  warning: 5
  info: 2
  total: 9
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-08-09T00:00:00Z
**Depth:** standard
**Files Reviewed:** 22 source files (+ 10 test files read for context, not separately findable)
**Status:** issues_found

## Summary

Reviewed the assessment/enterprise re-point implementation: the `/assessment` route consolidation, the sector gate, the deep-assessment email pipeline, and the checkout/engage/enterprise routing changes. The route-consolidation and Calendly-removal work matches what the test suite asserts and is internally consistent. Two correctness/security issues were found in `src/app/assessment/deep/actions.ts` (unescaped HTML injection into an email template, and a success response that doesn't reflect actual email delivery outcome), plus several dead-code and validation gaps left over from the checkout/engage refactor.

## Critical Issues

### CR-01: Unescaped user input interpolated into raw HTML email (HTML injection)

**File:** `src/app/assessment/deep/actions.ts:40-58` (specifically line 44)
**Issue:** `submitDeepAssessmentForEmail` builds the deep-assessment scorecard email by interpolating `firstName` directly into a raw HTML template string:
```ts
<p style="color:#6b7280;margin:0 0 24px">Prepared for ${firstName} · ${sector}</p>
```
`firstName` comes from `emailGateSchema`, which only constrains length (`min(1).max(50)`) — it permits any characters, including `<`, `>`, and `"`. Because this string is sent as `html` in `resend.emails.send`, a user can inject arbitrary markup (e.g. `<a href="...">`, `<img onerror=...>`, layout-breaking tags) into the email that is rendered by the recipient's mail client. This is inconsistent with the sibling quick-assessment path, which renders through the `AssessmentReport` React Email component (auto-escaped by JSX).
**Fix:** Either switch this email to a React Email component (JSX auto-escapes text nodes), or manually HTML-escape `firstName` (and any other interpolated user-controlled string) before building the template, e.g.:
```ts
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
// ...
<p ...>Prepared for ${escapeHtml(firstName)} · ${sector}</p>
```

### CR-02: `submitDeepAssessmentForEmail` reports success even when the email send fails

**File:** `src/app/assessment/deep/actions.ts:82-93`
**Issue:** The `resend.emails.send` call is wrapped in try/catch, but the catch only logs — the function still returns `{ success: true }` unconditionally on line 93 regardless of whether the send succeeded:
```ts
try {
  await resend.emails.send({ ... });
} catch (err) {
  console.error("Deep assessment email failed:", err);
}
return { success: true };
```
Callers rely on this signal: `DeepAssessmentShell.handleEmailSubmit` sets `step("results")` and `RevenueResultsScreen` unconditionally renders "Full Scorecard Sent to {firstName}" as soon as `res.success` is true. A transient Resend outage or invalid recipient means the user sees a false confirmation that their report was emailed, with no retry path and no error surfaced. Also note `resend.emails.send` can return `{ error }` without throwing (see the pattern used correctly in `src/lib/email.ts`'s `sendAssessmentEmail`/`sendPurchaseConfirmationEmail`), which this function doesn't check at all.
**Fix:** Check the returned `error` field and propagate failure to the caller:
```ts
const { error } = await resend.emails.send({ ... });
if (error) {
  console.error("Deep assessment email failed:", error.message);
  return { success: false, error: "We couldn't send your scorecard email. Please try again." };
}
return { success: true };
```

## Warnings

### WR-01: `engage` success/error UI is dead code — `submitInquiry` always redirects

**File:** `src/app/engage/actions.ts:5,40-44`, `src/app/engage/page.tsx:19-27,45-48`
**Issue:** `submitInquiry` is typed `Promise<{ success: boolean; message: string } | never>`, but every code path ends in `redirect(...)` (line 41 or 43), which throws internally — the function never actually resolves to the `{ success, message }` object. `EngageFormInner.handleSubmit` (page.tsx:19-27) awaits the result and branches on `result.success` / `result.message`, and the JSX even has a dedicated `status === "success"` render branch (`styles.successMessage`, lines 45-48) that can never be reached in practice. This is misleading: a future maintainer could reasonably assume the success/error UI is live and reachable.
**Fix:** Either make `submitInquiry` genuinely return a result object (validate and return `{success:false, message}` on validation errors instead of redirecting) and drop the `never` union, or remove the now-unreachable success/error state handling from `page.tsx` and document that the action always navigates away.

### WR-02: Checkout page carries dead "enterprise" CTA branch from the pre-refactor flow

**File:** `src/app/checkout/page.tsx:24,115-123`; `src/app/checkout/checkout.module.css:293-321`
**Issue:** `const isEnterprise = false;` is a hardcoded literal that is never reassigned or derived from anything (checkout's `TierId` is now only `"discovery" | "strategy"` per `src/lib/checkout.ts` — there is no enterprise tier left in checkout). This makes the entire `isEnterprise ? ... : ...` branch (lines 115-123) and its CSS classes (`.enterpriseCta`, `.enterpriseCtaText`, `.enterpriseBtn`) permanently unreachable dead code.
**Fix:** Remove the `isEnterprise` flag, the dead JSX branch, and the associated unused CSS rules, since enterprise engagement is now routed exclusively through `/engage?enterprise=true` from `/enterprise` and `/services`.

### WR-03: `engage` inquiry form has no server-side validation

**File:** `src/app/engage/actions.ts:8-25`
**Issue:** Every field is read via `formData.get(x) as string` and forwarded directly to the CRM webhook (`GOOGLE_SCRIPT_URL`). There is no server-side validation of required fields, email format, or string length — validation exists only via the browser's HTML5 `required` attributes on the client (`src/app/engage/page.tsx`), which can trivially be bypassed (disabled JS, direct POST, devtools). Malformed or empty data can reach the CRM record undetected.
**Fix:** Validate `formData` with a zod schema (similar to `emailGateSchema`) before constructing `inquiry`, and return an error result instead of proceeding to `redirect()` when validation fails.

### WR-04: Deep-assessment "returning user" resubmission ignores send failure entirely

**File:** `src/components/assessment/DeepAssessmentShell.tsx:100-109`
**Issue:** When a user has a `savedIdentity` in localStorage, `handleAnswer` calls `submitDeepAssessmentForEmail(...)` but never inspects the returned `{ success, error }` — it unconditionally proceeds to `setStep("results")` and the results screen displays "Full Scorecard Sent to {firstName}". Combined with CR-02, this compounds the risk of users being told their report was sent when it wasn't, with no error path at all for this branch (unlike the `email-gate` branch, which does check `res.success`).
**Fix:** Check the result and, on failure, fall back to the `email-gate` step (or show an inline retry) instead of silently proceeding to "results".

### WR-05: Static "Download Full Scorecard PDF" link is unrelated to the personalized PDF actually generated/attached

**File:** `src/emails/AssessmentReport.tsx:82-96`
**Issue:** The email includes a button linking to a hardcoded static asset (`https://asorahura.com/ai-readiness-scorecard.pdf`), while the actual personalized PDF (generated per-user in `src/lib/pdf.ts::generateAssessmentPDF`) is sent as an email attachment via `sendAssessmentEmail`/`sendAssessmentEmailSequence`. These are two different files with no guarantee the static asset exists or is current, and the button's copy ("Download Full Scorecard PDF") implies it's the user's personalized report when it isn't.
**Fix:** Either remove this button (the attachment already delivers the personalized PDF) or point it at the same generated PDF via a signed/download URL, and clarify the copy if the two are intentionally different documents.

## Info

### IN-01: `FormData.get()` can return `null`, silently mis-typed via `as string`

**File:** `src/app/engage/actions.ts:13-24`
**Issue:** `formData.get("name") as string` etc. type-casts away the `FormDataEntryValue | null` return type. If a field is absent (e.g. a malicious/bypassed request omits it), `null` flows through as if it were a `string`, and gets serialized into the CRM JSON payload as `null` without any TypeScript warning, since the cast suppresses the check.
**Fix:** Use a small helper (`String(formData.get("name") ?? "")`) or validate via zod (see WR-03) rather than blind `as string` casts.

### IN-02: Hardcoded Calendly URL duplicates the exported `CALENDLY_URL` constant

**File:** `src/app/engage/actions.ts:41`; `src/lib/email.ts:11`
**Issue:** `src/lib/email.ts` exports `CALENDLY_URL` and it's already imported/used elsewhere (`src/app/automate/instagram/success/page.tsx`), but `engage/actions.ts` hardcodes the same literal string `"https://calendly.com/asorahura"` instead of importing the constant. If the URL ever changes, this call site is easy to miss.
**Fix:** `import { CALENDLY_URL } from "@/lib/email"; redirect(CALENDLY_URL);`

---

_Reviewed: 2026-08-09T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
