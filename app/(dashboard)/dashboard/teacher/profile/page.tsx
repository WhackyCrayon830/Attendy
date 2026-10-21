import { redirect } from "next/navigation";

import ProfileForm from "@/components/dashboard/ProfileForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export const instant = false;

export default async function TeacherProfilePage() {
  const user = await getCurrentUser("/dashboard/teacher/profile");
  if (user.role !== "teacher") redirect("/dashboard");
  if (user.profileCompletedAt) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">Teacher onboarding</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Set up your teacher profile</h1>
      </header>
      <ProfileForm role="teacher" initialName={user.displayName} />
    </div>
  );
}
