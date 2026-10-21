
"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const credentials = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        console.log(credentials);

        // Authentication will be connected in Step 5.
        setLoading(false);
    }

    return (
        <Card className="w-full max-w-md border-border/60 shadow-lg">
            <CardHeader className="space-y-2">
                <p className="text-sm font-semibold tracking-widest text-primary">
                    ATTENDY
                </p>

                <CardTitle className="text-2xl">
                    Welcome back
                </CardTitle>

                <CardDescription>
                    Sign in to manage your classes and attendance.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>

                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="font-medium text-primary hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
