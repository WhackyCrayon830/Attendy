import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { subjects } from "@/db/schema";
import { getCurrentUser, getUserDisplayName } from "@/lib/auth/current-user";

export const instant = false;

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser("/dashboard/teacher");
  if (user.role !== "teacher") redirect("/dashboard");
  if (!user.profileCompletedAt) redirect("/dashboard/teacher/profile");

  const classes = await db
    .select({ id: subjects.id, name: subjects.name, code: subjects.code, room: subjects.room })
    .from(subjects)
    .where(eq(subjects.teacherId, user.id))
    .orderBy(asc(subjects.name));

  if (classes.length === 0) redirect("/dashboard/teacher/classes/new");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">Teacher workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome, {getUserDisplayName(user)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the classes you teach.</p>
        </div>
        <Link href="/dashboard/teacher/classes/new" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          Create a class
        </Link>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Your classes">
        {classes.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-primary">{item.code}</p>
            <h2 className="mt-2 text-base font-semibold">{item.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{item.room || "Room not set"}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
