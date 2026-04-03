"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Check if we have a valid token
    const token = searchParams.get("code");
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      toast.success("Password reset successfully!");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Invalid reset link</h1>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <div className="mt-6">
            <Button
              className="w-full"
              zone="navy"
              onClick={() => router.push("/forgot-password")}
            >
              Request new reset link
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Reset password</h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter your new password below.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            New password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="At least 8 characters"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Confirm password
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Re-enter your password"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
              required
            />
          </label>

          <Button zone="navy" type="submit" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Resetting...
              </span>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
