import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import { NextRequest } from "next/server";
import { verifyPaddleWebhookSignature } from "../src/lib/paddle-webhook";

const { contactsUpdate, sendPurchaseConfirmationEmail, sendOrderNotificationEmail, customersGet } =
  vi.hoisted(() => ({
    contactsUpdate: vi.fn(),
    sendPurchaseConfirmationEmail: vi.fn(),
    sendOrderNotificationEmail: vi.fn(),
    customersGet: vi.fn(),
  }));

const { afterCallbacks } = vi.hoisted(() => ({ afterCallbacks: [] as Array<() => unknown> }));

// products.ts builds its price-ID map at module load, so these must be set
// before the route module (and its import of products) is evaluated.
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CONSULTATION = "pri_consult_test";
  process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY = "pri_dfy_test";
  process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN = "pri_care_test";
});

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: (cb: () => unknown) => { afterCallbacks.push(cb); } };
});

vi.mock("@paddle/paddle-node-sdk", () => {
  class Paddle {
    customers = { get: customersGet };
  }
  return { Paddle, Environment: { sandbox: "sandbox", production: "production" } };
});

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

// Runs the work the route scheduled via after().
async function flushAfter() {
  for (const cb of afterCallbacks.splice(0)) await cb();
}

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
    contactsUpdate.mockReset();
    contactsUpdate.mockResolvedValue({ data: { id: "c1" }, error: null });
    sendPurchaseConfirmationEmail.mockReset();
    sendPurchaseConfirmationEmail.mockResolvedValue({ success: true });
    sendOrderNotificationEmail.mockReset();
    sendOrderNotificationEmail.mockResolvedValue({ success: true });
    afterCallbacks.length = 0;
    customersGet.mockReset();
    customersGet.mockResolvedValue({ id: "ctm_1", email: "buyer@example.com" });
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
      event_type: "transaction.completed",
      data: { id: "txn_123" },
    });
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    await flushAfter();
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
    await flushAfter();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });

  let eventSeq = 0;

  function makeCompletedBody(overrides: Record<string, unknown> = {}) {
    return JSON.stringify({
      event_id: `evt_dfy_${++eventSeq}`,
      event_type: "transaction.completed",
      data: {
        id: "txn_dfy_1",
        customer_id: "ctm_1",
        items: [{ price: { custom_data: { product: "dfy" } } }],
        details: { totals: { total: "50000" } },
        ...overrides,
      },
    });
  }

  // Regression: the consultation checkout shipped without customData, so every
  // consultation sale reached the owner and the Sheet as "unknown".
  it("falls back to the price ID when the payload carries no custom_data", async () => {
    const body = makeCompletedBody({
      items: [{ price: { id: "pri_consult_test" } }],
      custom_data: undefined,
    });
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ products: ["consultation"] })
    );
  });

  it("still reports unknown when neither custom_data nor a known price ID is present", async () => {
    const body = makeCompletedBody({ items: [{ price: { id: "pri_not_ours" } }] });
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ products: ["unknown"] })
    );
  });

  it("triggers sendPurchaseConfirmationEmail and sendOrderNotificationEmail with productType dfy", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    await flushAfter();

    expect(res.status).toBe(200);
    expect(sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ products: ["dfy"], email: "buyer@example.com", transactionId: "txn_dfy_1" })
    );
    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ products: ["dfy"], buyerEmail: "buyer@example.com", transactionId: "txn_dfy_1" })
    );
  });

  it("sends the emails a formatted amount, not raw minor units", async () => {
    const body = makeCompletedBody({ currency_code: "USD" });
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

    // Fixture total is "50000" minor units.
    expect(sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ amount: "$500.00" })
    );
    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ amount: "$500.00" })
    );
  });

  it("segments the buyer contact as automate-buyer", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

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
    await flushAfter();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://plausible.io/api/event",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"product_type":"dfy"'),
      })
    );
  });

  it("resolves the buyer email from customer_id via the Paddle API", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

    expect(customersGet).toHaveBeenCalledWith("ctm_1");
    expect(sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: "buyer@example.com" })
    );
  });

  it("still notifies the seller and Sheets when the customer lookup fails", async () => {
    customersGet.mockRejectedValue(new Error("paddle down"));
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    await flushAfter();

    expect(res.status).toBe(200);
    // Buyer-facing sends are skipped rather than sent to an empty address.
    expect(sendPurchaseConfirmationEmail).not.toHaveBeenCalled();
    expect(contactsUpdate).not.toHaveBeenCalled();
    // The sale must still reach the seller and the Sheet.
    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ transactionId: "txn_dfy_1", products: ["dfy"] })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://plausible.io/api/event",
      expect.anything()
    );
  });

  it("processes a given event_id once and skips Paddle retries of it", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    const first = await POST(makeRequest(body, signature));
    await flushAfter();
    expect(first.status).toBe(200);
    expect(sendOrderNotificationEmail).toHaveBeenCalledTimes(1);

    // Paddle redelivers the identical payload after a timeout or non-2xx.
    const retry = await POST(makeRequest(body, signature));
    await flushAfter();

    expect(retry.status).toBe(200);
    expect(await retry.json()).toEqual({ ok: true, duplicate: true });
    expect(sendOrderNotificationEmail).toHaveBeenCalledTimes(1);
    expect(sendPurchaseConfirmationEmail).toHaveBeenCalledTimes(1);
  });

  it("responds before the downstream work runs", async () => {
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));

    // Paddle has its 200 while the emails and Sheets row are still pending.
    expect(res.status).toBe(200);
    expect(sendOrderNotificationEmail).not.toHaveBeenCalled();

    await flushAfter();
    expect(sendOrderNotificationEmail).toHaveBeenCalledTimes(1);
  });

  it("ignores an event using the wrong field name for the event type", async () => {
    // Guards the original bug: the handler read event.type, which Paddle never sends.
    const body = JSON.stringify({
      event_id: "evt_wrong",
      type: "transaction.completed",
      data: { id: "txn_wrong", customer_id: "ctm_1" },
    });
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    await flushAfter();

    expect(res.status).toBe(200);
    expect(sendOrderNotificationEmail).not.toHaveBeenCalled();
  });

  // Regression: the Care Plan is a checkbox add-on bundled into the DFY and DWY
  // checkouts, so custom_data says "dfy" whether or not it was ticked. Reading
  // only items[0] made a $509.99 sale indistinguishable from a $500 one, and
  // hid a live monthly subscription.
  it("reports every line when the Care Plan is bundled with a tier", async () => {
    const body = makeCompletedBody({
      custom_data: { product: "dfy" },
      items: [
        { price: { id: "pri_dfy_test" } },
        { price: { id: "pri_care_test" } },
      ],
      details: { totals: { total: "50999" } },
      currency_code: "USD",
    });
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ products: ["dfy", "care-plan"], amount: "$509.99" })
    );
    expect(sendPurchaseConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ products: ["dfy", "care-plan"] })
    );
  });

  it("writes both lines to the Sheet's Product column", async () => {
    const originalScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    process.env.GOOGLE_SCRIPT_URL = "https://script.example/exec";
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, text: async () => '{"status":"ok"}' }) as unknown as typeof fetch;

    const body = makeCompletedBody({
      custom_data: { product: "dwy" },
      items: [
        { price: { custom_data: { product: "dwy" } } },
        { price: { id: "pri_care_test" } },
      ],
    });
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://script.example/exec",
      expect.objectContaining({
        body: expect.stringContaining('"productType":"dwy + care-plan"'),
      })
    );

    if (originalScriptUrl === undefined) {
      delete process.env.GOOGLE_SCRIPT_URL;
    } else {
      process.env.GOOGLE_SCRIPT_URL = originalScriptUrl;
    }
  });

  // A renewal arrives months later as its own transaction.completed with no
  // custom_data at all — only the subscription's price ID identifies it.
  it("labels a Care-Plan-only renewal from its price ID", async () => {
    const body = makeCompletedBody({
      custom_data: undefined,
      items: [{ price: { id: "pri_care_test" } }],
      details: { totals: { total: "999" } },
      currency_code: "USD",
    });
    const signature = sign(body, SECRET);

    await POST(makeRequest(body, signature));
    await flushAfter();

    expect(sendOrderNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ products: ["care-plan"], amount: "$9.99" })
    );
  });

  it("still returns 200 when sendPurchaseConfirmationEmail rejects", async () => {
    sendPurchaseConfirmationEmail.mockRejectedValue(new Error("resend down"));
    const body = makeCompletedBody();
    const signature = sign(body, SECRET);

    const res = await POST(makeRequest(body, signature));
    await flushAfter();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });
});
