import LoginForm from "@/components/auth/LoginForm";
import { getOptionalCurrentUser } from "@/lib/auth/current-user";
import { getSafeReturnTo } from "@/lib/auth/redirect";
import { redirect } from "next/navigation";

export const instant = false;

type LoginPageProps = {
    searchParams: Promise<{ message?: string | string[]; returnTo?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const { message, returnTo: requestedReturnTo } = await searchParams;
    const returnTo = getSafeReturnTo(requestedReturnTo);
    const user = await getOptionalCurrentUser();
    if (user) redirect(returnTo);
    const accountExists = message === "account-exists";

    return (
        <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4 sm:p-6">
            <LoginForm
                initialMessage={accountExists ? "An account with that email already exists. Please sign in." : undefined}
                returnTo={returnTo}
            />
        </main>
    );
}
