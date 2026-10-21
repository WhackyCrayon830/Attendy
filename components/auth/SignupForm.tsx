"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type SignupState } from "@/app/(auth)/signup/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm({ returnTo = "/dashboard" }: { returnTo?: string }) {
  const [state, formAction, pending] = useActionState(signup, {} satisfies SignupState);
  return (
    <Card className="w-full max-w-md border-border/60 shadow-lg">
      <CardHeader className="space-y-2">
        <p className="text-sm font-semibold tracking-widest text-primary">ATTENDY</p>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Use your Thapar email to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="returnTo" value={returnTo} />
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" placeholder="you@thapar.edu" autoComplete="email" maxLength={254} required disabled={pending} aria-invalid={!!state.errors?.email} aria-describedby={state.errors?.email ? "signup-email-error" : undefined} />
            {state.errors?.email?.[0] && <p id="signup-email-error" className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" maxLength={128} required disabled={pending} aria-invalid={!!state.errors?.password} aria-describedby={state.errors?.password ? "signup-password-error" : undefined} />
            {state.errors?.password?.[0] && <p id="signup-password-error" className="text-sm text-destructive">{state.errors.password[0]}</p>}
            <p className="text-xs text-muted-foreground">Use 12–128 characters with uppercase, lowercase, a number, and a symbol.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" maxLength={128} required disabled={pending} aria-invalid={!!state.errors?.confirmPassword} aria-describedby={state.errors?.confirmPassword ? "signup-confirm-error" : undefined} />
            {state.errors?.confirmPassword?.[0] && <p id="signup-confirm-error" className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>}
          </div>
          {state.message && <p role="alert" className="text-sm text-destructive">{state.message}</p>}
          <Button type="submit" className="w-full" disabled={pending}>{pending ? "Creating account..." : "Create account"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
