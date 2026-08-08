import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyPaddleWebhookSignature } from "../src/lib/paddle-webhook";

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
