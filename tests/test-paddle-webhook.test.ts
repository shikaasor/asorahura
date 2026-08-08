import { describe, it, expect, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import { NextRequest } from "next/server";
import { verifyPaddleWebhookSignature } from "../src/lib/paddle-webhook";
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

  beforeEach(() => {
    process.env.PADDLE_WEBHOOK_SECRET = SECRET;
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.PADDLE_WEBHOOK_SECRET;
    } else {
      process.env.PADDLE_WEBHOOK_SECRET = originalSecret;
    }
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
      event_type: "transaction.completed",
      data: { id: "txn_123" },
    });
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });

  it("returns 401 { error: 'Unauthorized' } when the signature header is missing", async () => {
    const body = JSON.stringify({ event_type: "transaction.completed", data: { id: "txn_1" } });

    const res = await POST(makeRequest(body, null));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 { error: 'Unauthorized' } when the signature is invalid", async () => {
    const body = JSON.stringify({ event_type: "transaction.completed", data: { id: "txn_1" } });

    const res = await POST(makeRequest(body, "ts=123;h1=badhash"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
  });

  it("returns 200 { ok: true } for a valid signature but unrecognized event type", async () => {
    const body = JSON.stringify({
      event_id: "evt_2",
      event_type: "subscription.created",
      data: { id: "sub_123" },
    });
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });
});
