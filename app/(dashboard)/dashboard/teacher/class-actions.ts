"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { subjects, users } from "@/db/schema";
import { createClassSchema, type CreateClassState } from "@/lib/validations/classes";

function isUniqueViolation(error: unknown) {
  const seen = new Set<object>();
  let current = error;
  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    if ("code" in current && current.code === "23505") return true;
    current = "cause" in current ? current.cause : undefined;
  }
  return false;
}

export async function createClass(_previous: CreateClassState, formData: FormData): Promise<CreateClassState> {
  const { auth } = await import("@/auth");
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login?returnTo=%2Fdashboard%2Fteacher%2Fclasses%2Fnew");

  const [teacher] = await db
    .select({ id: users.id, role: users.role, profileCompletedAt: users.profileCompletedAt })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!teacher || teacher.role !== "teacher" || !teacher.profileCompletedAt) redirect("/dashboard");

  const parsed = createClassSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    room: formData.get("room") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Review the class details." };

  try {
    await db.insert(subjects).values({
      name: parsed.data.name,
      code: parsed.data.code,
      room: parsed.data.room || null,
      teacherId: teacher.id,
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "That class code is already in use. Choose another code." };
    throw error;
  }

  redirect("/dashboard/teacher");
}
