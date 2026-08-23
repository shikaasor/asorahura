import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getInvoiceItem,
  isInvoiceableProduct,
  requiresBillingDetails,
  formatUsd,
  prefersInvoiceFirst,
  BILLING_DETAILS_THRESHOLD_USD,
  INVOICE_DEFAULT_THRESHOLD_USD,
} from "../src/lib/invoicePricing";
import {
  generateInvoiceNumber,
  paymentDueDate,
  formatInvoiceDate,
  getPaymentRails,
  getBusinessIdentity,
  buildInvoice,
} from "../src/lib/invoice";
import { generateInvoicePDF } from "../src/lib/pdf";

const PAYMENT_ENV = [
  "PAYMENT_BANK_BENEFICIARY",
  "PAYMENT_BANK_NAME",
  "PAYMENT_BANK_ACCOUNT_NUMBER",
  "PAYMENT_BANK_ROUTING_NUMBER",
  "PAYMENT_BANK_SWIFT",
  "PAYMENT_BANK_ADDRESS",
  "PAYMENT_PAYPAL",
  "PAYMENT_PAYONEER",
  "INVOICE_DUE_DAYS",
  "INVOICE_BUSINESS_NAME",
  "INVOICE_BUSINESS_EMAIL",
  "INVOICE_BUSINESS_ADDRESS",
  "INVOICE_BUSINESS_TAX_ID",
];

let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = {};
  for (const key of PAYMENT_ENV) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of PAYMENT_ENV) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("invoice pricing", () => {
  it("prices every product that has a live checkout", () => {
    expect(getInvoiceItem("consultation")?.amountUsd).toBe(200);
    expect(getInvoiceItem("dfy")?.amountUsd).toBe(500);
    expect(getInvoiceItem("dwy")?.amountUsd).toBe(800);
    expect(getInvoiceItem("email-triage-tier1")?.amountUsd).toBe(500);
    expect(getInvoiceItem("email-triage-tier2")?.amountUsd).toBe(900);
  });

  it("carries the same human label the order emails use", () => {
    expect(getInvoiceItem("dfy")?.label).toBe("Instagram Comment-to-DM — Done For You");
  });

  it("returns null for a product with no price rather than invoicing zero", () => {
    expect(getInvoiceItem("care-plan")).toBeNull();
    expect(getInvoiceItem("writing-constitution")).toBeNull();
    expect(getInvoiceItem("")).toBeNull();
    expect(isInvoiceableProduct("care-plan")).toBe(false);
  });

  it("asks for billing details only at or above the threshold", () => {
    expect(requiresBillingDetails(BILLING_DETAILS_THRESHOLD_USD - 1)).toBe(false);
    expect(requiresBillingDetails(BILLING_DETAILS_THRESHOLD_USD)).toBe(true);
    expect(requiresBillingDetails(BILLING_DETAILS_THRESHOLD_USD + 1)).toBe(true);
  });

  it("leaves every current product below the threshold, so email alone is enough", () => {
    for (const id of ["consultation", "dfy", "dwy", "email-triage-tier1", "email-triage-tier2"]) {
      expect(requiresBillingDetails(getInvoiceItem(id)!.amountUsd)).toBe(false);
    }
  });

  it("leads with the card under $5k and the invoice at or above it", () => {
    expect(INVOICE_DEFAULT_THRESHOLD_USD).toBe(5000);
    expect(prefersInvoiceFirst(4999)).toBe(false);
    expect(prefersInvoiceFirst(5000)).toBe(true);
    expect(prefersInvoiceFirst(12000)).toBe(true);
  });

  it("puts every current product on the card-first side of that line", () => {
    for (const id of ["consultation", "dfy", "dwy", "email-triage-tier1", "email-triage-tier2"]) {
      expect(prefersInvoiceFirst(getInvoiceItem(id)!.amountUsd)).toBe(false);
    }
  });

  it("keeps the two thresholds independent", () => {
    // A $1k–$5k sale asks for billing details but still leads with the card.
    expect(requiresBillingDetails(2000)).toBe(true);
    expect(prefersInvoiceFirst(2000)).toBe(false);
    expect(BILLING_DETAILS_THRESHOLD_USD).toBeLessThan(INVOICE_DEFAULT_THRESHOLD_USD);
  });

  it("formats dollars with cents", () => {
    expect(formatUsd(500)).toBe("$500.00");
    expect(formatUsd(9.99)).toBe("$9.99");
  });
});

describe("invoice numbering and dates", () => {
  it("stamps the issue year-month into the number", () => {
    const number = generateInvoiceNumber(new Date("2026-08-22T00:00:00Z"));
    expect(number).toMatch(/^ASA-202608-[0-9A-F]{6}$/);
  });

  it("pads single-digit months", () => {
    expect(generateInvoiceNumber(new Date("2026-01-05T00:00:00Z"))).toMatch(/^ASA-202601-/);
  });

  it("does not collide across calls in the same month", () => {
    const now = new Date("2026-08-22T00:00:00Z");
    const numbers = new Set(Array.from({ length: 200 }, () => generateInvoiceNumber(now)));
    expect(numbers.size).toBeGreaterThan(190);
  });

  it("defaults to net 7", () => {
    const issued = new Date("2026-08-22T00:00:00Z");
    expect(paymentDueDate(issued).toISOString().slice(0, 10)).toBe("2026-08-29");
  });

  it("honours INVOICE_DUE_DAYS", () => {
    process.env.INVOICE_DUE_DAYS = "14";
    const issued = new Date("2026-08-22T00:00:00Z");
    expect(paymentDueDate(issued).toISOString().slice(0, 10)).toBe("2026-09-05");
  });

  it("falls back to net 7 when INVOICE_DUE_DAYS is not a number", () => {
    process.env.INVOICE_DUE_DAYS = "soon";
    const issued = new Date("2026-08-22T00:00:00Z");
    expect(paymentDueDate(issued).toISOString().slice(0, 10)).toBe("2026-08-29");
  });

  it("formats dates in UTC so the printed day matches the due date", () => {
    expect(formatInvoiceDate(new Date("2026-08-22T23:30:00Z"))).toBe("August 22, 2026");
  });
});

describe("payment rails", () => {
  it("returns nothing when no rail is configured", () => {
    expect(getPaymentRails()).toEqual([]);
  });

  it("omits the bank rail when the account number has no bank name", () => {
    process.env.PAYMENT_BANK_ACCOUNT_NUMBER = "12345678";
    expect(getPaymentRails()).toEqual([]);
  });

  it("prints only the bank fields that are set", () => {
    process.env.PAYMENT_BANK_NAME = "Example Bank";
    process.env.PAYMENT_BANK_ACCOUNT_NUMBER = "12345678";
    process.env.PAYMENT_BANK_ROUTING_NUMBER = "021000021";

    const [bank] = getPaymentRails();
    expect(bank.name).toBe("Bank transfer (ACH / wire)");
    expect(bank.fields).toEqual([
      ["Bank", "Example Bank"],
      ["Account number", "12345678"],
      ["Routing number (ACH)", "021000021"],
    ]);
    // No blank SWIFT / beneficiary rows leaked in.
    expect(bank.fields.every(([, value]) => value.length > 0)).toBe(true);
  });

  it("adds Payoneer independently of the bank rail", () => {
    process.env.PAYMENT_PAYONEER = "payoneer@asorahura.com";
    expect(getPaymentRails().map((r) => r.name)).toEqual(["Payoneer"]);
  });

  // PayPal accounts registered in Nigeria are send-only: they cannot receive,
  // and there is no withdrawal path to a Nigerian bank. Printing the rail would
  // strand the buyer's money, so setting the variable must do nothing at all.
  it("never emits a PayPal rail, even with PAYMENT_PAYPAL set", () => {
    process.env.PAYMENT_PAYPAL = "pay@asorahura.com";
    process.env.PAYMENT_PAYONEER = "payoneer@asorahura.com";

    const names = getPaymentRails().map((r) => r.name);
    expect(names).not.toContain("PayPal");
    expect(names).toEqual(["Payoneer"]);
  });
});

describe("business identity", () => {
  it("falls back to the site defaults", () => {
    const identity = getBusinessIdentity();
    expect(identity.name).toBe("Asor Ahura");
    expect(identity.email).toBe("support@asorahura.com");
    expect(identity.address).toBeUndefined();
    expect(identity.taxId).toBeUndefined();
  });

  it("treats a set-but-empty variable as unset", () => {
    // Importing `INVOICE_BUSINESS_NAME=` into Vercel yields "", which is not
    // nullish — without the guard it would blank the invoice header.
    process.env.INVOICE_BUSINESS_NAME = "";
    process.env.INVOICE_BUSINESS_EMAIL = "   ";
    process.env.INVOICE_BUSINESS_ADDRESS = "";

    const identity = getBusinessIdentity();
    expect(identity.name).toBe("Asor Ahura");
    expect(identity.email).toBe("support@asorahura.com");
    expect(identity.address).toBeUndefined();
  });

  it("uses configured values when present", () => {
    process.env.INVOICE_BUSINESS_NAME = "Asor Ahura Ltd";
    process.env.INVOICE_BUSINESS_TAX_ID = "TX-1";
    const identity = getBusinessIdentity();
    expect(identity.name).toBe("Asor Ahura Ltd");
    expect(identity.taxId).toBe("TX-1");
  });
});

describe("buildInvoice", () => {
  it("takes the amount from the price table, never from the caller", () => {
    const invoice = buildInvoice({
      item: getInvoiceItem("dfy")!,
      email: "buyer@example.com",
      now: new Date("2026-08-22T00:00:00Z"),
    });

    expect(invoice.totalUsd).toBe(500);
    expect(invoice.item.productId).toBe("dfy");
    expect(invoice.billTo).toEqual({
      email: "buyer@example.com",
      name: undefined,
      company: undefined,
    });
    expect(invoice.number).toMatch(/^ASA-202608-/);
    expect(invoice.dueAt.toISOString().slice(0, 10)).toBe("2026-08-29");
  });

  it("carries name and company onto the Bill To block when given", () => {
    const invoice = buildInvoice({
      item: getInvoiceItem("dwy")!,
      email: "buyer@example.com",
      name: "Ada Lovelace",
      company: "Analytical Engines",
    });
    expect(invoice.billTo.name).toBe("Ada Lovelace");
    expect(invoice.billTo.company).toBe("Analytical Engines");
  });
});

describe("invoice PDF", () => {
  it("renders a PDF even with no payment rails configured", async () => {
    const invoice = buildInvoice({
      item: getInvoiceItem("consultation")!,
      email: "buyer@example.com",
    });
    const pdf = await generateInvoicePDF(invoice);

    expect(pdf.length).toBeGreaterThan(500);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("renders a PDF with every rail and a full Bill To block", async () => {
    process.env.PAYMENT_BANK_BENEFICIARY = "Asor Ahura";
    process.env.PAYMENT_BANK_NAME = "Example Bank";
    process.env.PAYMENT_BANK_ACCOUNT_NUMBER = "12345678";
    process.env.PAYMENT_BANK_ROUTING_NUMBER = "021000021";
    process.env.PAYMENT_BANK_SWIFT = "EXMPUS33";
    process.env.PAYMENT_PAYONEER = "payoneer@asorahura.com";

    const invoice = buildInvoice({
      item: getInvoiceItem("email-triage-tier2")!,
      email: "buyer@example.com",
      name: "Ada Lovelace",
      company: "Analytical Engines",
    });
    const pdf = await generateInvoicePDF(invoice);

    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(500);
  });
});
