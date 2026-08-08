import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendOnboardingNotification } = vi.hoisted(() => ({
  sendOnboardingNotification: vi.fn(),
}));

vi.mock("../src/lib/email", () => ({
  sendOnboardingNotification,
}));

import { POST } from "../src/app/api/automate/onboarding/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/automate/onboarding", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  sendOnboardingNotification.mockReset();
  sendOnboardingNotification.mockResolvedValue({ success: true });
});

describe("POST /api/automate/onboarding", () => {
  it("returns 200 { ok: true } for a valid dfy submission", async () => {
    const res = await POST(
      makeRequest({
        product: "dfy",
        igHandle: "@creator",
        keyword: "AUTOMATE",
        leadMagnetLink: "https://bit.ly/lead-magnet",
        voiceTone: "Casual and funny, Gen Z audience",
      })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(sendOnboardingNotification).toHaveBeenCalledWith({
      product: "dfy",
      igHandle: "@creator",
      keyword: "AUTOMATE",
      leadMagnetLink: "https://bit.ly/lead-magnet",
      voiceTone: "Casual and funny, Gen Z audience",
    });
  });

  it("returns 400 with a field-level error message when igHandle is empty", async () => {
    const res = await POST(
      makeRequest({
        product: "dfy",
        igHandle: "",
        keyword: "AUTOMATE",
        leadMagnetLink: "https://bit.ly/lead-magnet",
        voiceTone: "Casual and funny, Gen Z audience",
      })
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Instagram handle required");
    expect(sendOnboardingNotification).not.toHaveBeenCalled();
  });

  it("returns 200 { ok: true } for a dwy submission with schedulingConfirmed: true", async () => {
    const res = await POST(
      makeRequest({
        product: "dwy",
        igHandle: "@creator",
        keyword: "AUTOMATE",
        leadMagnetLink: "https://bit.ly/lead-magnet",
        voiceTone: "Casual and funny, Gen Z audience",
        schedulingConfirmed: true,
      })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });
});
