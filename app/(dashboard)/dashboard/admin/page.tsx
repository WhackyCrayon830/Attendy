import { getCurrentUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser("/dashboard/admin");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Attendy administration</p>
      <h1 className="mt-3 text-xl font-semibold sm:text-2xl">Admin dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Admin tools, including role management, are not implemented yet.</p>
    </section>
  );
}
