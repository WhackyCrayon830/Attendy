import { redirect } from "next/navigation";

import CreateClassForm from "@/components/dashboard/CreateClassForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export const instant = false;

export default async function CreateTeacherClassPage() {
  const user = await getCurrentUser("/dashboard/teacher/classes/new");
  if (user.role !== "teacher") redirect("/dashboard");
  if (!user.profileCompletedAt) redirect("/dashboard/teacher/profile");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">Teacher workspace</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Add a class</h1>
      </header>
      <CreateClassForm />
    </div>
  );
}
