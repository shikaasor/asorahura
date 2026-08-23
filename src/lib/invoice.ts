import { randomBytes } from "node:crypto";
import { type InvoiceLineItem } from "@/lib/invoicePricing";

/**
 * Manual-invoice checkout, server side. Paddle declined the account (the
 * catalog reads as consulting under their AUP), so until there is a payment
 * rail again the site takes an email, emails an invoice, and the buyer
 * transfers the money themselves.
 *
 * Nothing here talks to a payment processor, and nothing here may imply money
 * has moved. What this module produces is a request for payment.
 *
 * This file reads payment-account env vars — do not import it from a client
 * component. Prices and the billing-details threshold live in
 * lib/invoicePricing.ts, which is safe to import anywhere.
 */

// Re-exported so server callers (pdf.ts, email.ts, the route) have one import.
export {
  getInvoiceItem,
  isInvoiceableProduct,
  requiresBillingDetails,
  formatUsd,
  BILLING_DETAILS_THRESHOLD_USD,
  type InvoiceLineItem,
} from "@/lib/invoicePricing";

/** ASA-202608-A1B2C3. Sequential numbering would need a counter this app has
 *  no store for, so the random suffix carries uniqueness and the year-month
 *  keeps a sorted inbox readable. */
export function generateInvoiceNumber(now: Date = new Date()): string {
  const yyyymm = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return `ASA-${yyyymm}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function paymentDueDate(issued: Date = new Date()): Date {
  const days = Number(process.env.INVOICE_DUE_DAYS ?? 7);
  const due = new Date(issued);
  due.setUTCDate(due.getUTCDate() + (Number.isFinite(days) ? days : 7));
  return due;
}

export function formatInvoiceDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export interface PaymentRail {
  /** Heading on the invoice, e.g. "Bank transfer (ACH / wire)". */
  name: string;
  /** Label/value pairs printed under the heading. */
  fields: Array<[string, string]>;
}

/** Only rails whose env vars are actually set. An unconfigured rail is omitted
 *  entirely rather than printed with blank or "undefined" values — a wrong
 *  account number on an invoice is worse than a missing payment option. */
export function getPaymentRails(): PaymentRail[] {
  const rails: PaymentRail[] = [];

  const bankFields = (
    [
      ["Account holder", process.env.PAYMENT_BANK_BENEFICIARY],
      ["Bank", process.env.PAYMENT_BANK_NAME],
      ["Account number", process.env.PAYMENT_BANK_ACCOUNT_NUMBER],
      ["Routing number (ACH)", process.env.PAYMENT_BANK_ROUTING_NUMBER],
      // US ACH transfer forms ask checking-vs-savings; omitting it stalls the
      // payment while the buyer emails to ask.
      ["Account type", process.env.PAYMENT_BANK_ACCOUNT_TYPE],
      ["SWIFT / BIC", process.env.PAYMENT_BANK_SWIFT],
      ["Bank address", process.env.PAYMENT_BANK_ADDRESS],
    ] as Array<[string, string | undefined]>
  ).filter((pair): pair is [string, string] => Boolean(pair[1]));

  // An account number with no bank name is not payable. Require both before
  // printing the rail at all.
  if (process.env.PAYMENT_BANK_ACCOUNT_NUMBER && process.env.PAYMENT_BANK_NAME) {
    rails.push({ name: "Bank transfer (ACH / wire)", fields: bankFields });
  }

  // No PayPal rail. PayPal accounts registered in Nigeria are send-only —
  // they cannot receive, and there is no withdrawal path to a Nigerian bank.
  // Printing one would strand the buyer's money, so the option is absent
  // rather than configurable.

  if (process.env.PAYMENT_PAYONEER) {
    rails.push({ name: "Payoneer", fields: [["Send to", process.env.PAYMENT_PAYONEER]] });
  }

  return rails;
}

export interface BusinessIdentity {
  name: string;
  email: string;
  address?: string;
  taxId?: string;
}

export function getBusinessIdentity(): BusinessIdentity {
  return {
    name: process.env.INVOICE_BUSINESS_NAME ?? "Asor Ahura",
    email: process.env.INVOICE_BUSINESS_EMAIL ?? "support@asorahura.com",
    address: process.env.INVOICE_BUSINESS_ADDRESS,
    taxId: process.env.INVOICE_BUSINESS_TAX_ID,
  };
}

export interface Invoice {
  number: string;
  issuedAt: Date;
  dueAt: Date;
  item: InvoiceLineItem;
  totalUsd: number;
  billTo: { email: string; name?: string; company?: string };
  rails: PaymentRail[];
  business: BusinessIdentity;
}

export function buildInvoice(params: {
  item: InvoiceLineItem;
  email: string;
  name?: string;
  company?: string;
  now?: Date;
}): Invoice {
  const issuedAt = params.now ?? new Date();
  return {
    number: generateInvoiceNumber(issuedAt),
    issuedAt,
    dueAt: paymentDueDate(issuedAt),
    item: params.item,
    totalUsd: params.item.amountUsd,
    billTo: { email: params.email, name: params.name, company: params.company },
    rails: getPaymentRails(),
    business: getBusinessIdentity(),
  };
}
