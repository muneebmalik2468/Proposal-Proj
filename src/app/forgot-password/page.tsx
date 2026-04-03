"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Check your email</h1>
          <p className="mt-2 text-sm text-slate-600">
            We've sent a password reset link to <span className="font-semibold">{email}</span>. Click the link in the email to set a new password.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/login">
              <Button className="w-full" zone="navy">
                Back to login
              </Button>
            </Link>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Try another email
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Forgot password?</h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
              required
            />
          </label>

          <Button zone="navy" type="submit" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Sending...
              </span>
            ) : (
              "Send reset link"
            )}
          </Button>

          <div className="text-sm text-slate-600">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-slate-900 underline">
              Back to login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
