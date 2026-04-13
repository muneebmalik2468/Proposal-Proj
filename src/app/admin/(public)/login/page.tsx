"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // React.useEffect(() => {
  //   const supabase = createSupabaseBrowserClient();

  //   let mounted = true;
  //   supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
  //     if (!mounted) return;
  //     if (data.session) {
  //       router.replace("/admin/dashboard");
  //     }
  //   });

  //   const { data: listener } = supabase.auth.onAuthStateChange(
  //     (_event: AuthChangeEvent, session: Session | null) => {
  //     if (session) {
  //       router.replace("/admin/dashboard");
  //     }
  //     }
  //   );

  //   return () => {
  //     mounted = false;
  //     listener.subscription.unsubscribe();
  //   };
  // }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600">Administrators only.</p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const supabase = createSupabaseBrowserClient();
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              if (error) {
                toast.error(error.message);
                return;
              }
              router.push("/admin/dashboard");
              router.refresh();
            } finally {
              setLoading(false);
            }
          }}
        >
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

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
              required
            />
          </label>

          <Button zone="navy" type="submit" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Back to <Link href="/login" className="font-semibold text-slate-900 underline">user login</Link>
        </p>
      </Card>
    </div>
  );
}
