"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";

export type ProfileState = { error?: string };

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Enter at least 2 characters.").max(80, "Name must be 80 characters or fewer."),
});

export async function completeProfile(_previous: ProfileState, formData: FormData): Promise<ProfileState> {
  const { auth } = await import("@/auth");
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login?returnTo=%2Fdashboard");

  const parsed = profileSchema.safeParse({ displayName: formData.get("displayName") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your name and try again." };

  const [user] = await db
    .select({ id: users.id, role: users.role, profileCompletedAt: users.profileCompletedAt })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || (user.role !== "student" && user.role !== "teacher")) {
    redirect("/dashboard");
  }

  await db
    .update(users)
    .set({ displayName: parsed.data.displayName, profileCompletedAt: new Date() })
    .where(eq(users.id, user.id));

  redirect("/dashboard");
}
