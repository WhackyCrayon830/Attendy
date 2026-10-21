"use client";

import { signIn } from "next-auth/react";

import type { LoginInput } from "@/lib/validations/auth";
import { getSafeReturnTo } from "@/lib/auth/redirect";

export async function login(input: LoginInput, returnTo?: string) {
  const redirectTo = getSafeReturnTo(returnTo);
  const result = await signIn("credentials", {
    ...input,
    redirect: false,
    redirectTo,
  });

  if (!result?.ok || result.error) {
    return { success: false as const };
  }

  return {
    success: true as const,
    redirectTo: result.url || redirectTo,
  };
}
