import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createHmac } from "node:crypto";
import {
  isFlutterwaveConfigured,
  isFlutterwaveTestMode,
  isValidWebhookSignature,
  checkPaymentAgainstCatalog,
  verifyTransaction,
  CHECKOUT_CURRENCY,
  type VerifiedPayment,
} from "../src/lib/flutterwave";

const ENV = [
  "FLW_SECRET_KEY",
  "NEXT_PUBLIC_FLW_PUBLIC_KEY",
  "FLW_SECRET_HASH",
];
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = {};
  for (const k of ENV) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of ENV) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  vi.unstubAllGlobals();
});

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

describe("configuration", () => {
  it("is not configured with neither key", () => {
    expect(isFlutterwaveConfigured()).toBe(false);
  });

  it("needs both the public and secret key", () => {
    process.env.FLW_SECRET_KEY = "FLWSECK_TEST-x";
    expect(isFlutterwaveConfigured()).toBe(false);
    process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY = "FLWPUBK_TEST-x";
    expect(isFlutterwaveConfigured()).toBe(true);
  });

  it("reads sandbox vs live off the secret key prefix", () => {
    process.env.FLW_SECRET_KEY = "FLWSECK_TEST-abc";
    expect(isFlutterwaveTestMode()).toBe(true);
    process.env.FLW_SECRET_KEY = "FLWSECK-live-abc";
    expect(isFlutterwaveTestMode()).toBe(false);
  });
});

describe("webhook signature", () => {
  const body = '{"event":"charge.completed","data":{"id":1}}';

  it("rejects everything when no secret hash is configured", () => {
    expect(
      isValidWebhookSignature({ rawBody: body, verifHashHeader: "anything" })
    ).toBe(false);
  });

  it("rejects a request carrying neither header", () => {
    process.env.FLW_SECRET_HASH = "s3cret";
    expect(isValidWebhookSignature({ rawBody: body })).toBe(false);
  });

  it("accepts a correct base64 HMAC in flutterwave-signature", () => {
    process.env.FLW_SECRET_HASH = "s3cret";
    const sig = createHmac("sha256", "s3cret").update(body).digest("base64");
    expect(isValidWebhookSignature({ rawBody: body, signatureHeader: sig })).toBe(true);
  });

  it("rejects an HMAC computed over a different body", () => {
    process.env.FLW_SECRET_HASH = "s3cret";
    const sig = createHmac("sha256", "s3cret").update("tampered").digest("base64");
    expect(isValidWebhookSignature({ rawBody: body, signatureHeader: sig })).toBe(false);
  });

  it("rejects an HMAC computed with the wrong secret", () => {
    process.env.FLW_SECRET_HASH = "s3cret";
    const sig = createHmac("sha256", "not-the-secret").update(body).digest("base64");
    expect(isValidWebhookSignature({ rawBody: body, signatureHeader: sig })).toBe(false);
  });

  it("accepts the legacy verif-hash header when it matches exactly", () => {
    process.env.FLW_SECRET_HASH = "s3cret";
    expect(isValidWebhookSignature({ rawBody: body, verifHashHeader: "s3cret" })).toBe(true);
    expect(isValidWebhookSignature({ rawBody: body, verifHashHeader: "s3cre" })).toBe(false);
    expect(isValidWebhookSignature({ rawBody: body, verifHashHeader: "wrong!" })).toBe(false);
  });
});

describe("checkPaymentAgainstCatalog", () => {
  it("accepts a correct, successful payment", () => {
    const check = checkPaymentAgainstCatalog(payment());
    expect(check.ok).toBe(true);
    expect(check.item?.productId).toBe("dfy");
  });

  it("rejects a payment that did not succeed", () => {
    expect(checkPaymentAgainstCatalog(payment({ status: "failed" })).reason).toBe(
      "not-successful"
    );
    expect(checkPaymentAgainstCatalog(payment({ status: "pending" })).reason).toBe(
      "not-successful"
    );
  });

  it("rejects a product id that is not in the catalog", () => {
    expect(checkPaymentAgainstCatalog(payment({ productId: "care-plan" })).reason).toBe(
      "unknown-product"
    );
    expect(checkPaymentAgainstCatalog(payment({ productId: undefined })).reason).toBe(
      "unknown-product"
    );
  });

  it("rejects a payment made in the wrong currency", () => {
    expect(checkPaymentAgainstCatalog(payment({ currency: "NGN" })).reason).toBe(
      "wrong-currency"
    );
  });

  it("rejects a tampered checkout that underpays", () => {
    expect(checkPaymentAgainstCatalog(payment({ amount: 1 })).reason).toBe("underpaid");
    expect(checkPaymentAgainstCatalog(payment({ amount: 499 })).reason).toBe("underpaid");
  });

  it("accepts an overpayment", () => {
    expect(checkPaymentAgainstCatalog(payment({ amount: 600 })).ok).toBe(true);
  });

  it("prices each product independently, so a cheap product cannot buy a dear one", () => {
    // Paid $500 (the DFY price) but claimed the $900 tier.
    const check = checkPaymentAgainstCatalog(
      payment({ productId: "email-triage-tier2", amount: 500 })
    );
    expect(check.ok).toBe(false);
    expect(check.reason).toBe("underpaid");
  });

  it("is case-insensitive about status and currency", () => {
    expect(checkPaymentAgainstCatalog(payment({ status: "SUCCESSFUL", currency: "usd" })).ok).toBe(
      true
    );
  });

  it("charges in the currency the checkout advertises", () => {
    expect(CHECKOUT_CURRENCY).toBe("USD");
  });
});

describe("verifyTransaction", () => {
  it("returns null when no secret key is set rather than calling out", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    return verifyTransaction(1).then((result) => {
      expect(result).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  it("returns null on a non-200 from Flutterwave", async () => {
    process.env.FLW_SECRET_KEY = "FLWSECK_TEST-x";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    expect(await verifyTransaction(1)).toBeNull();
  });

  it("returns null when the response body reports failure", async () => {
    process.env.FLW_SECRET_KEY = "FLWSECK_TEST-x";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "error", message: "No transaction" }),
      })
    );
    expect(await verifyTransaction(1)).toBeNull();
  });

  it("maps a successful verify response and sends the secret as a bearer token", async () => {
    process.env.FLW_SECRET_KEY = "FLWSECK_TEST-abc";
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "success",
        data: {
          id: 495000,
          tx_ref: "asa-dfy-1-abc",
          status: "successful",
          amount: 500,
          charged_amount: 500,
          currency: "USD",
          customer: { email: "buyer@example.com", name: "Ada" },
          meta: { product: "dfy" },
        },
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

    const result = await verifyTransaction(495000);

    expect(result).toMatchObject({
      transactionId: 495000,
      txRef: "asa-dfy-1-abc",
      status: "successful",
      amount: 500,
      currency: "USD",
      customerEmail: "buyer@example.com",
      productId: "dfy",
    });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.flutterwave.com/v3/transactions/495000/verify");
    expect(init.headers.Authorization).toBe("Bearer FLWSECK_TEST-abc");
  });

  it("verifies against amount, ignoring charged_amount in the card's own currency", async () => {
    process.env.FLW_SECRET_KEY = "FLWSECK_TEST-x";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "success",
          data: {
            id: 1,
            tx_ref: "asa-dfy-1-abc",
            status: "successful",
            amount: 500,
            charged_amount: 395,
            currency: "USD",
            customer: { email: "buyer@example.com" },
            meta: { product: "dfy" },
          },
        }),
      })
    );

    // charged_amount here stands in for a converted international card, where
    // the debited figure is in the buyer's currency and is not comparable to
    // our USD price. The USD `amount` is what counts, so this must pass.
    const result = await verifyTransaction(1);
    expect(result?.amount).toBe(500);
    expect(checkPaymentAgainstCatalog(result!).ok).toBe(true);
  });

  it("returns null instead of throwing when the network fails", async () => {
    process.env.FLW_SECRET_KEY = "FLWSECK_TEST-x";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
    expect(await verifyTransaction(1)).toBeNull();
  });
});
