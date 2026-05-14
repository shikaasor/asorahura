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
