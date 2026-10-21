import ResponsiveDashboardNav from "@/components/dashboard/ResponsiveDashboardNav";
import { getOptionalCurrentUser, getUserDisplayName } from "@/lib/auth/current-user";

export const instant = false;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getOptionalCurrentUser();
  const displayName = user ? getUserDisplayName(user) : "";
  const role = user?.role === "teacher" || user?.role === "admin" ? user.role : "student";

  return (
    <div className="w-full min-w-0 min-h-dvh bg-muted/30 text-foreground lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
      <ResponsiveDashboardNav role={role} displayName={displayName} />
      <main className="min-w-0 w-full px-3 py-5 sm:px-6 sm:py-6 lg:px-9 lg:py-8">{children}</main>
    </div>
  );
}
