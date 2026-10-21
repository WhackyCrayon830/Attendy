"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/validations/auth";
import { getSafeReturnTo } from "@/lib/auth/redirect";

export type SignupState = {
  errors?: { email?: string[]; password?: string[]; confirmPassword?: string[] };
  message?: string;
};

function isUniqueViolation(error: unknown): boolean {
  const seen = new Set<object>();
  let current = error;

  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    if ("code" in current && current.code === "23505") return true;
    current = "cause" in current ? current.cause : undefined;
  }

  return false;
}

export async function signup(_previousState: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { email, password } = parsed.data;
  const returnTo = getSafeReturnTo(formData.get("returnTo"));
  const { signIn } = await import("@/auth");
  try {
    const passwordHash = await hashPassword(password);
    await db.insert(users).values({ email, passwordHash });
  } catch (error) {
    if (isUniqueViolation(error)) {
      const params = new URLSearchParams({ message: "account-exists", returnTo });
      redirect(`/login?${params.toString()}`);
    }
    throw error;
  }

  try {
    await signIn("credentials", { email, password, redirectTo: returnTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Your account was created, but sign-in failed. Please sign in." };
    }
    throw error;
  }
  return {};
}
