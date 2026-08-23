import { describe, it, expect, vi, beforeEach } from "vitest";
import type { VerifiedPayment } from "../src/lib/flutterwave";

const { verifyTransaction, fulfilOrder } = vi.hoisted(() => ({
  verifyTransaction: vi.fn(),
  fulfilOrder: vi.fn(),
}));

// checkPaymentAgainstCatalog stays real — it is the thing under test. Only the
// network call to Flutterwave is stubbed.
vi.mock("../src/lib/flutterwave", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/lib/flutterwave")>()),
  verifyTransaction,
}));

// Stubbed so importing the real module never constructs a Resend client.
vi.mock("../src/lib/email", () => ({
  sendPurchaseConfirmationEmail: vi.fn(),
  sendOrderNotificationEmail: vi.fn(),
}));

// claimTransaction stays real so the dedupe behaviour is exercised.
vi.mock("../src/lib/fulfilment", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/lib/fulfilment")>()),
  fulfilOrder,
}));

import { POST } from "../src/app/api/flutterwave/verify/route";
import { resetClaimedTransactions } from "../src/lib/fulfilment";
import { NextRequest } from "next/server";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/flutterwave/verify", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function payment(overrides: Partial<VerifiedPayment> = {}): VerifiedPayment {
  return {
    transactionId: 495000,
    txRef: "asa-dfy-1-abc",
    status: "successful",
    amount: 500,
    currency: "USD",
    customerEmail: "buyer@example.com",
    productId: "dfy",
    ...overrides,
  };
}

beforeEach(() => {
  verifyTransaction.mockReset();
  fulfilOrder.mockReset();
  fulfilOrder.mockResolvedValue(undefined);
  resetClaimedTransactions();
});

describe("POST /api/flutterwave/verify", () => {
  it("confirms and fulfils a genuine payment", async () => {
    verifyTransaction.mockResolvedValue(payment());

    const res = await POST(makeRequest({ transactionId: 495000 }));

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      ok: true,
      productId: "dfy",
      amount: "$500.00",
      currency: "USD",
    });
    expect(fulfilOrder).toHaveBeenCalledTimes(1);
    expect(fulfilOrder.mock.calls[0][0]).toMatchObject({
      products: ["dfy"],
      transactionId: "495000",
      buyerEmail: "buyer@example.com",
    });
  });

  it("bills the catalog price, not the amount the browser reported", async () => {
    // Buyer somehow paid more; we still record the catalog price as the sale.
    verifyTransaction.mockResolvedValue(payment({ amount: 750 }));
    await POST(makeRequest({ transactionId: 495000 }));
    expect(fulfilOrder.mock.calls[0][0].amount).toBe("500");
  });

  it("refuses a transaction id Flutterwave does not recognise", async () => {
    verifyTransaction.mockResolvedValue(null);

    const res = await POST(makeRequest({ transactionId: 999 }));

    expect(res.status).toBe(502);
    expect(fulfilOrder).not.toHaveBeenCalled();
  });

  it("refuses a payment that underpays the catalog price", async () => {
    verifyTransaction.mockResolvedValue(payment({ amount: 1 }));

    const res = await POST(makeRequest({ transactionId: 495000 }));

    expect(res.status).toBe(400);
    expect(fulfilOrder).not.toHaveBeenCalled();
  });

  it("refuses a payment that has not completed", async () => {
    verifyTransaction.mockResolvedValue(payment({ status: "pending" }));

    const res = await POST(makeRequest({ transactionId: 495000 }));

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: expect.stringMatching(/hasn't completed/) });
    expect(fulfilOrder).not.toHaveBeenCalled();
  });

  it("refuses a payment in the wrong currency and says the buyer may be charged", async () => {
    verifyTransaction.mockResolvedValue(payment({ currency: "NGN" }));

    const res = await POST(makeRequest({ transactionId: 495000 }));

    expect(res.status).toBe(400);
    expect(fulfilOrder).not.toHaveBeenCalled();
    // Naira cards settle in NGN regardless of presentment currency under
    // Nigeria's anti-dollarisation rules, so this path is reachable in
    // production and must not hide behind a generic "couldn't match" message.
    const { error } = await res.json();
    expect(error).toContain("NGN");
    expect(error).toMatch(/refund/i);
  });

  it("fulfils a given transaction only once", async () => {
    verifyTransaction.mockResolvedValue(payment());

    const first = await POST(makeRequest({ transactionId: 495000 }));
    const second = await POST(makeRequest({ transactionId: 495000 }));

    // Both answer the buyer successfully — the second is a page refresh, not
    // an error — but the emails and the Sheets row happen once.
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(fulfilOrder).toHaveBeenCalledTimes(1);
  });

  it("rejects a body with no transaction id", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(verifyTransaction).not.toHaveBeenCalled();
  });

  it("rejects a non-numeric transaction id", async () => {
    const res = await POST(makeRequest({ transactionId: "not-a-number" }));
    expect(res.status).toBe(400);
    expect(verifyTransaction).not.toHaveBeenCalled();
  });

  it("rejects a malformed body", async () => {
    const req = new NextRequest("http://localhost/api/flutterwave/verify", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    expect((await POST(req)).status).toBe(400);
  });
});
