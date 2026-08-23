import { z } from "zod";

export const buildMapSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const automateSuccessSchema = z.object({
  igHandle: z
    .string()
    .min(1, "Instagram handle required")
    .regex(/^@?[\w.]+$/, "Invalid Instagram handle format")
    .max(30, "Handle too long"),
  keyword: z.string().min(1, "Keyword required").max(50, "Keyword too long"),
  leadMagnetLink: z.string().url("Must be a valid URL"),
  voiceTone: z
    .string()
    .min(10, "Provide voice/tone guidance")
    .max(200, "Keep it concise"),
});

export type BuildMapFormData = z.infer<typeof buildMapSchema>;
export type AutomateSuccessFormData = z.infer<typeof automateSuccessSchema>;

/** Shape only. Whether `name` is actually required depends on the product's
 *  price, which the client does not get to assert — the route resolves the
 *  amount server-side and enforces the threshold there. */
export const invoiceRequestSchema = z.object({
  productId: z.string().min(1, "Product required"),
  // Trimmed before validating: an address pasted from another app routinely
  // carries a trailing space, and rejecting that reads to the buyer as "my
  // email is invalid".
  email: z.string().trim().email("Invalid email address"),
  name: z.string().trim().max(100, "Name too long").optional(),
  company: z.string().trim().max(100, "Company name too long").optional(),
});

export type InvoiceRequestData = z.infer<typeof invoiceRequestSchema>;
