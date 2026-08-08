import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import { NextRequest } from "next/server";
import { verifyPaddleWebhookSignature } from "../src/lib/paddle-webhook";

const { contactsUpdate, sendPurchaseConfirmationEmail, sendOrderNotificationEmail } = vi.hoisted(() => ({
  contactsUpdate: vi.fn(),
  sendPurchaseConfirmationEmail: vi.fn(),
  sendOrderNotificationEmail: vi.fn(),
}));

vi.mock("resend", () => {
  class Resend {
    contacts = {
      update: contactsUpdate,
    };
  }
  return { Resend };
});

vi.mock("../src/lib/email", () => ({
  sendPurchaseConfirmationEmail,
  sendOrderNotificationEmail,
}));

import { POST } from "../src/app/api/paddle/webhook/route";

const SECRET = "whsec_test_secret";

function sign(body: string, secret: string, ts: number = Math.floor(Date.now() / 1000)) {
  const hash = crypto.createHmac("sha256", secret).update(`${ts}:${body}`).digest("hex");
  return `ts=${ts};h1=${hash}`;
}

describe("verifyPaddleWebhookSignature", () => {
  it("returns true when signature matches HMAC-SHA256 of ts:body", () => {
    const body = JSON.stringify({ event_id: "evt_1", event_type: "transaction.completed" });
    const signature = sign(body, SECRET);

    expect(verifyPaddleWebhookSignature(body, signature, SECRET)).toBe(true);
  });

  it("returns false when the hash portion doesn't match", () => {
    const body = JSON.stringify({ event_id: "evt_1" });
    const ts = Math.floor(Date.now() / 1000);
    const signature = `ts=${ts};h1=deadbeef00000000000000000000000000000000000000000000000000000000`;

    expect(verifyPaddleWebhookSignature(body, signature, SECRET)).toBe(false);
  });

  it("returns false when signature is malformed (missing ts= or h1=)", () => {
    const body = JSON.stringify({ event_id: "evt_1" });

    expect(verifyPaddleWebhookSignature(body, "not-a-valid-signature", SECRET)).toBe(false);
    expect(verifyPaddleWebhookSignature(body, "ts=123456", SECRET)).toBe(false);
    expect(verifyPaddleWebhookSignature(body, "", SECRET)).toBe(false);
  });

  it("returns false when the timestamp is older than 5 minutes", () => {
    const body = JSON.stringify({ event_id: "evt_1" });
    const oldTs = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
    const signature = sign(body, SECRET, oldTs);

    expect(verifyPaddleWebhookSignature(body, signature, SECRET)).toBe(false);
  });

  it("never throws on garbage input", () => {
    expect(() => verifyPaddleWebhookSignature("", "", "")).not.toThrow();
    expect(() =>
      verifyPaddleWebhookSignature("body", "ts=abc;h1=xyz", SECRET)
    ).not.toThrow();
  });
});

describe("POST /api/paddle/webhook", () => {
  const originalSecret = process.env.PADDLE_WEBHOOK_SECRET;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.PADDLE_WEBHOOK_SECRET = SECRET;
    process.env.RESEND_AUDIENCE_ID = "aud_123";
    contactsUpdate.mockReset();
    contactsUpdate.mockResolvedValue({ data: { id: "c1" }, error: null });
    sendPurchaseConfirmationEmail.mockReset();
    sendPurchaseConfirmationEmail.mockResolvedValue({ success: true });
    sendOrderNotificationEmail.mockReset();
    sendOrderNotificationEmail.mockResolvedValue({ success: true });
    global.fetch = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.PADDLE_WEBHOOK_SECRET;
    } else {
      process.env.PADDLE_WEBHOOK_SECRET = originalSecret;
    }
    global.fetch = originalFetch;
  });

  function makeRequest(body: string, signature: string | null) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (signature !== null) headers["paddle-signature"] = signature;
    return new NextRequest("http://localhost/api/paddle/webhook", {
      method: "POST",
      body,
      headers,
    });
  }

  it("returns 200 { ok: true } for a valid signature and transaction.completed event", async () => {
    const body = JSON.stringify({
      event_id: "evt_1",
      type: "transaction.completed",
      data: { id: "txn_123" },
    });
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });

  it("returns 401 { error: 'Unauthorized' } when the signature header is missing", async () => {
    const body = JSON.stringify({ type: "transaction.completed", data: { id: "txn_1" } });

    const res = await POST(makeRequest(body, null));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 { error: 'Unauthorized' } when the signature is invalid", async () => {
    const body = JSON.stringify({ type: "transaction.completed", data: { id: "txn_1" } });

    const res = await POST(makeRequest(body, "ts=123;h1=badhash"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
  });

  it("returns 200 { ok: true } for a valid signature but unrecognized event type", async () => {
    const body = JSON.stringify({
      event_id: "evt_2",
      type: "subscription.created",
      data: { id: "sub_123" },
    });
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });

  function makeCompletedBody(overrides: Record<string, unknown> = {}) {
    return JSON.stringify({
      event_id: "evt_dfy",
      type: "transaction.completed",
      data: {
        id: "txn_dfy_1",
        customer_email: "buyer@example.com",
        items: [{ price: { custom_data: { product: "dfy" } } }],
        details: { totals: { total: "50000" } },
        ...overrides,
      },
    });
  }

  it("triggers sendPurchaseConfirmationEmail and sendOrderNotificationEmail with productType dfy", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));

    expect(res.status).toBe(200);
    expect(sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ productType: "dfy", email: "buyer@example.com", transactionId: "txn_dfy_1" })
    );
    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ productType: "dfy", buyerEmail: "buyer@example.com", transactionId: "txn_dfy_1" })
    );
  });

  it("segments the buyer contact as automate-buyer", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));

    expect(contactsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "buyer@example.com",
        properties: { segment: "automate-buyer" },
      })
    );
  });

  it("fires a Purchase analytics event via fetch to plausible.io/api/event", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));

    expect(global.fetch).toHaveBeenCalledWith(
      "https://plausible.io/api/event",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"product_type":"dfy"'),
      })
    );
  });

  it("still returns 200 when sendPurchaseConfirmationEmail rejects", async () => {
    sendPurchaseConfirmationEmail.mockRejectedValue(new Error("resend down"));
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });
});
