"use client";

import { useActionState } from "react";

import { createClass } from "@/app/(dashboard)/dashboard/teacher/class-actions";
import type { CreateClassState } from "@/lib/validations/classes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateClassForm() {
  const [state, formAction, pending] = useActionState(createClass, {} satisfies CreateClassState);

  return (
    <Card className="mx-auto w-full max-w-xl border-border/70 shadow-sm">
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Teacher setup</p>
        <CardTitle className="text-xl">Create your first class</CardTitle>
        <CardDescription>Add the subject details. You can add a timetable and students later.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class or subject name</Label>
            <Input id="name" name="name" placeholder="Database Systems" maxLength={100} required disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Class code</Label>
            <Input id="code" name="code" placeholder="CS204" maxLength={24} required disabled={pending} />
            <p className="text-[11px] text-muted-foreground">Class codes are unique across Attendy.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input id="room" name="room" placeholder="Lab 3" maxLength={80} disabled={pending} />
          </div>
          {state.error && <p role="alert" className="text-xs text-destructive">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating class…" : "Create class"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
