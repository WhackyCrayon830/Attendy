"use client";

import { useActionState } from "react";

import { completeProfile, type ProfileState } from "@/app/(dashboard)/dashboard/profile-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileForm({
  role,
  initialName,
}: {
  role: "student" | "teacher";
  initialName?: string | null;
}) {
  const [state, formAction, pending] = useActionState(completeProfile, {} satisfies ProfileState);
  const title = role === "student" ? "Complete your student profile" : "Complete your teacher profile";

  return (
    <Card className="mx-auto w-full max-w-lg border-border/70 shadow-sm">
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{role} setup</p>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>Add your name so your classes and attendance are connected to the right profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Full name</Label>
            <Input
              id="displayName"
              name="displayName"
              autoComplete="name"
              maxLength={80}
              defaultValue={initialName ?? ""}
              required
              disabled={pending}
              aria-invalid={!!state.error}
              aria-describedby={state.error ? "profile-name-error" : undefined}
            />
            {state.error && <p id="profile-name-error" role="alert" className="text-xs text-destructive">{state.error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving profile…" : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
