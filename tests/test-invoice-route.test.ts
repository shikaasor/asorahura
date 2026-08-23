import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendInvoiceEmail, sendInvoiceNotification } = vi.hoisted(() => ({
  sendInvoiceEmail: vi.fn(),
  sendInvoiceNotification: vi.fn(),
}));

vi.mock("../src/lib/email", () => ({
  sendInvoiceEmail,
  sendInvoiceNotification,
}));

import { POST } from "../src/app/api/invoice/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/invoice", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  sendInvoiceEmail.mockReset();
  sendInvoiceNotification.mockReset();
  sendInvoiceEmail.mockResolvedValue({ success: true });
  sendInvoiceNotification.mockResolvedValue({ success: true });
  // Keep the route from firing a real Sheets write during tests.
  delete process.env.GOOGLE_SCRIPT_URL;
});

describe("POST /api/invoice", () => {
  it("issues an invoice and returns its number", async () => {
    const res = await POST(makeRequest({ productId: "dfy", email: "Buyer@Example.com " }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.invoiceNumber).toMatch(/^ASA-\d{6}-[0-9A-F]{6}$/);

    expect(sendInvoiceEmail).toHaveBeenCalledTimes(1);
    const invoice = sendInvoiceEmail.mock.calls[0][0];
    expect(invoice.billTo.email).toBe("buyer@example.com");
    expect(invoice.totalUsd).toBe(500);
  });

  it("notifies the owner as well as the buyer", async () => {
    await POST(makeRequest({ productId: "consultation", email: "buyer@example.com" }));
    expect(sendInvoiceNotification).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid email without sending anything", async () => {
    const res = await POST(makeRequest({ productId: "dfy", email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(sendInvoiceEmail).not.toHaveBeenCalled();
  });

  it("rejects a product that has no price", async () => {
    const res = await POST(makeRequest({ productId: "care-plan", email: "buyer@example.com" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/isn't available/i);
    expect(sendInvoiceEmail).not.toHaveBeenCalled();
  });

  it("ignores an amount supplied by the client", async () => {
    await POST(
      makeRequest({ productId: "dfy", email: "buyer@example.com", amountUsd: 1, totalUsd: 1 })
    );
    expect(sendInvoiceEmail.mock.calls[0][0].totalUsd).toBe(500);
  });

  it("rejects a malformed body", async () => {
    const req = new NextRequest("http://localhost/api/invoice", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("reports a 502 when the buyer's email cannot be sent", async () => {
    sendInvoiceEmail.mockResolvedValue({ success: false, error: "resend down" });

    const res = await POST(makeRequest({ productId: "dfy", email: "buyer@example.com" }));

    expect(res.status).toBe(502);
    // Nothing was logged as owed, since the buyer never got payment details.
    expect(sendInvoiceNotification).not.toHaveBeenCalled();
  });

  it("trims a name and company onto the Bill To block", async () => {
    await POST(
      makeRequest({
        productId: "dwy",
        email: "buyer@example.com",
        name: "  Ada Lovelace  ",
        company: "  Analytical Engines  ",
      })
    );
    const invoice = sendInvoiceEmail.mock.calls[0][0];
    expect(invoice.billTo.name).toBe("Ada Lovelace");
    expect(invoice.billTo.company).toBe("Analytical Engines");
  });

  it("treats a whitespace-only name as absent rather than printing a blank line", async () => {
    await POST(makeRequest({ productId: "dwy", email: "buyer@example.com", name: "   " }));
    expect(sendInvoiceEmail.mock.calls[0][0].billTo.name).toBeUndefined();
  });
});
