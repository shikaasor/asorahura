import { z } from "zod";

export const emailGateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5)
    .max(255),
});

export type EmailGateInput = z.infer<typeof emailGateSchema>;

export const inquirySchema = z.object({
  name: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Invalid email address").min(5).max(255),
  company: z.string().min(1, "Company / organization is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  companySize: z.string().min(1, "Company size is required").max(50),
  operationalVolume: z.string().min(1, "Operational volume is required").max(50),
  challenge: z.string().min(1, "Primary operational challenge is required").max(5000),
  timeline: z.string().min(1, "Engagement timeline is required").max(50),
  budget: z.string().min(1, "Budget alignment is required").max(50),
  serviceInterest: z.string().max(50).optional().default(""),
  context: z.string().max(5000).optional().default(""),
  score: z.string().max(50).optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
