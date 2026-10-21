import { redirect } from "next/navigation";

import ProfileForm from "@/components/dashboard/ProfileForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export const instant = false;

export default async function StudentProfilePage() {
  const user = await getCurrentUser("/dashboard/student/profile");
  if (user.role !== "student") redirect("/dashboard");
  if (user.profileCompletedAt) redirect("/dashboard/student");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">Student onboarding</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">One quick step before your dashboard</h1>
      </header>
      <ProfileForm role="student" initialName={user.displayName} />
    </div>
  );
}
