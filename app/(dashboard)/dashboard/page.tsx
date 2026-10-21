import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";

export const instant = false;

export default async function DashboardIndexPage() {
  const user = await getCurrentUser("/dashboard");
  if (user.role === "student") {
    redirect(user.profileCompletedAt ? "/dashboard/student" : "/dashboard/student/profile");
  }
  if (user.role === "teacher") {
    redirect(user.profileCompletedAt ? "/dashboard/teacher" : "/dashboard/teacher/profile");
  }
  redirect("/dashboard/admin");
}
