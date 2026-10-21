import SignupForm from "@/components/auth/SignupForm";
import { getOptionalCurrentUser } from "@/lib/auth/current-user";
import { getSafeReturnTo } from "@/lib/auth/redirect";
import { redirect } from "next/navigation";

export const instant = false;

type SignupPageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { returnTo: requestedReturnTo } = await searchParams;
  const returnTo = getSafeReturnTo(requestedReturnTo);
  const user = await getOptionalCurrentUser();
  if (user) redirect(returnTo);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4 sm:p-6">
      <SignupForm returnTo={returnTo} />
    </main>
  );
}
