"use server";

import { emailGateSchema } from "@/lib/validation";
import {
  calculateDeepScore,
  getDeepTier,
  DEEP_MAX_SCORE,
  DIMENSIONS,
  type Dimension,
} from "@/lib/deepAssessment";
import { isValidSector, DEFAULT_SECTOR, type Sector } from "@/lib/assessment";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://asorahura.vercel.app';

export async function submitDeepAssessmentForEmail(
  firstName: string,
  email: string,
  answers: Record<number, number>,
  sectorInput?: string,
): Promise<{ success: boolean; error?: string }> {
  const parsed = emailGateSchema.safeParse({ firstName, email });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const sector: Sector = isValidSector(sectorInput) ? sectorInput : DEFAULT_SECTOR;

  const { total, byDimension } = calculateDeepScore(answers, sector);
  const tier = getDeepTier(total, sector);

  const dimensionRows = (Object.entries(byDimension) as [Dimension, number][])
    .map(([code, score]) => {
      const dim = DIMENSIONS[code];
      return `<tr><td style="padding:6px 0;color:#374151;font-weight:600">${code} — ${dim.name}</td><td style="padding:6px 0;text-align:right;color:#0a0a0a;font-weight:700">${score}/${dim.max}</td></tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:sans-serif;background:#f9fafb;padding:24px">
      <div style="background:#fff;border-radius:8px;padding:32px;max-width:600px;margin:0 auto">
        <h1 style="font-size:22px;color:#0a0a0a;margin:0 0 4px">Your Full AI Opportunity Discovery Scorecard</h1>
        <p style="color:#6b7280;margin:0 0 24px">Prepared for ${firstName} · ${sector}</p>
        <div style="background:#0a0a0a;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
          <div style="font-size:56px;font-weight:900;color:#fff;line-height:1">${total}<span style="font-size:24px;color:#6b7280">/${DEEP_MAX_SCORE}</span></div>
          <div style="font-size:16px;font-weight:600;color:#d1d5db;margin-top:8px">${tier.name}</div>
        </div>
        <p style="color:#374151;font-size:14px;line-height:1.6;margin-bottom:24px">${tier.description}</p>
        <h2 style="font-size:16px;color:#0a0a0a;margin:0 0 12px">Section Scores</h2>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;margin-bottom:24px">
          ${dimensionRows}
        </table>
        <p style="font-size:13px;color:#6b7280;margin-bottom:16px">${tier.action}</p>
        <a href="${BASE_URL}/checkout?assessment=deep" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none">View Your Roadmap</a>
      </div>
    </div>
  `;

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "assessment_deep",
        firstName,
        email,
        sector,
        total,
        dimA: byDimension.A,
        dimB: byDimension.B,
        dimC: byDimension.C,
        dimD: byDimension.D,
        dimE: byDimension.E,
        dimF: byDimension.F,
      }),
      redirect: "follow",
    }).catch(() => {});
  }

  try {
    await resend.emails.send({
      from: "Asor Ahura <hello@asorahura.com>",
      to: email,
      subject: `Your Full AI Opportunity Discovery Scorecard — ${total}/${DEEP_MAX_SCORE} · ${tier.name}`,
      html,
    });
  } catch (err) {
    console.error("Deep assessment email failed:", err);
  }

  return { success: true };
}
