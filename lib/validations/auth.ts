import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"))
  .refine((email) => email.endsWith("@thapar.edu"), {
    message: "Only @thapar.edu email addresses are allowed",
  });

export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password cannot exceed 128 characters")
  .refine((password) => /[a-z]/.test(password), {
    message: "Include at least one lowercase letter",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Include at least one uppercase letter",
  })
  .refine((password) => /\d/.test(password), {
    message: "Include at least one number",
  })
  .refine((password) => /[^A-Za-z0-9]/.test(password), {
    message: "Include at least one special character",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password cannot exceed 128 characters"),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
