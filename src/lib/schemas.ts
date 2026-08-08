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
