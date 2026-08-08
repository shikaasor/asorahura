import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { contactsCreate, contactsUpdate, sendBuildMapEmail } = vi.hoisted(() => ({
  contactsCreate: vi.fn(),
  contactsUpdate: vi.fn(),
  sendBuildMapEmail: vi.fn(),
}));

vi.mock("resend", () => {
  class Resend {
    contacts = {
      create: contactsCreate,
      update: contactsUpdate,
    };
  }
  return { Resend };
});

vi.mock("../src/lib/email", () => ({
  sendBuildMapEmail,
}));

import { POST } from "../src/app/api/subscribe/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const originalFetch = global.fetch;

beforeEach(() => {
  process.env.RESEND_AUDIENCE_ID = "aud_123";
  delete process.env.GOOGLE_SCRIPT_URL;
  contactsCreate.mockReset();
  contactsUpdate.mockReset();
  sendBuildMapEmail.mockReset();
  sendBuildMapEmail.mockResolvedValue({ success: true });
  global.fetch = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
  delete process.env.GOOGLE_SCRIPT_URL;
});

describe("POST /api/subscribe with source=build-map", () => {
  it("segments the contact via properties and sends the build map email", async () => {
    contactsCreate.mockResolvedValue({ data: { id: "c1" }, error: null });

    const res = await POST(makeRequest({ email: "lead@example.com", source: "build-map" }));

    expect(res.status).toBe(200);
    expect(contactsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "lead@example.com",
        audienceId: "aud_123",
        properties: { segment: "build-map-downloader" },
      })
    );
    expect(sendBuildMapEmail).toHaveBeenCalledWith("lead@example.com");
  });

  it("falls back to update when the contact already exists, and still segments + emails", async () => {
    contactsCreate.mockResolvedValue({
      data: null,
      error: { message: "Contact already exists in this audience." },
    });
    contactsUpdate.mockResolvedValue({ data: { id: "c1" }, error: null });

    const res = await POST(makeRequest({ email: "returning@example.com", source: "build-map" }));

    expect(res.status).toBe(200);
    expect(contactsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "returning@example.com",
        audienceId: "aud_123",
        properties: { segment: "build-map-downloader" },
      })
    );
    expect(sendBuildMapEmail).toHaveBeenCalledWith("returning@example.com");
  });

  it("mirrors to Google Sheets with formType build-map", async () => {
    process.env.GOOGLE_SCRIPT_URL = "https://script.example.com/exec";
    contactsCreate.mockResolvedValue({ data: { id: "c1" }, error: null });

    await POST(makeRequest({ email: "lead@example.com", source: "build-map" }));

    expect(global.fetch).toHaveBeenCalledWith(
      "https://script.example.com/exec",
      expect.objectContaining({
        body: JSON.stringify({ formType: "build-map", email: "lead@example.com" }),
      })
    );
  });
});

describe("POST /api/subscribe without source (blog widget — must be unaffected)", () => {
  it("preserves pre-existing behavior: no properties field, zero email sends, formType newsletter", async () => {
    process.env.GOOGLE_SCRIPT_URL = "https://script.example.com/exec";
    contactsCreate.mockResolvedValue({ data: { id: "c1" }, error: null });

    const res = await POST(makeRequest({ email: "reader@example.com" }));

    expect(res.status).toBe(200);
    expect(contactsCreate).toHaveBeenCalledWith({
      email: "reader@example.com",
      audienceId: "aud_123",
      unsubscribed: false,
    });
    expect(sendBuildMapEmail).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://script.example.com/exec",
      expect.objectContaining({
        body: JSON.stringify({ formType: "newsletter", email: "reader@example.com" }),
      })
    );
  });
});
