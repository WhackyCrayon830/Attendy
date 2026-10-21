import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function getOptionalCurrentUser() {
  await connection();
  const { auth } = await import("@/auth");
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      displayName: users.displayName,
      profileCompletedAt: users.profileCompletedAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function getCurrentUser(returnTo = "/dashboard") {
  const user = await getOptionalCurrentUser();
  if (!user) {
    const destination = encodeURIComponent(returnTo);
    redirect(`/login?returnTo=${destination}`);
  }
  return user;
}

export function getUserDisplayName(user: { displayName: string | null; email: string }) {
  return user.displayName?.trim() || getDisplayName(user.email);
}

export function getDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? "Student";
  const name = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return name || "Student";
}
