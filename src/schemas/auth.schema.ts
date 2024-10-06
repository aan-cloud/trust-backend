import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(220),
  password: z.string().min(10).max(220),
});

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(255, "Password must not exceed 255 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character (e.g., @, #, $, %)",
  );

export const registerSchema = loginSchema.extend({
  username: z.string().min(3, "name is required").max(220),
  email: z.string().email().min(1).max(40),
  password: passwordSchema,
});
