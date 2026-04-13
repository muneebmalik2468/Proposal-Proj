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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [customCategory, setCustomCategory] = React.useState("");

  const categories = [
    "Web, Mobile & Software Development",
    "Data Science & Analytics",
    "AI & Machine Learning",
    "Design & Creative",
    "Writing & Translation",
    "Sales & Marketing",
    "Engineering & Architecture",
    "IT & Networking",
    "Customer Service",
    "Legal",
    "Accounting & Consulting",
    "Admin Support",
    "HR",
    "Other",
  ];

  React.useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    let mounted = true;
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!mounted) return;
      if (data.session) {
        router.replace("/dashboard");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          router.replace("/dashboard");
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Sign up</h1>
        <p className="mt-1 text-sm text-slate-600">Create your account.</p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            
            // Validate category
            if (!category) {
              toast.error("Please select a work category");
              return;
            }
            
            // Validate custom category if "Other" is selected
            if (category === "Other" && !customCategory.trim()) {
              toast.error("Please specify your work category");
              return;
            }

            setLoading(true);
            try {
              const supabase = createSupabaseBrowserClient();
              const finalCategory = category === "Other" ? customCategory.trim() : category;
              
              const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  data: { 
                    full_name: fullName,
                    category: finalCategory,
                  },
                },
              });

              if (error) {
                toast.error(error.message);
                return;
              }

              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData.session) {
                router.push("/dashboard");
                router.refresh();
                return;
              }

              toast.success(
                "Account created. If email confirmation is enabled, check your inbox."
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
              placeholder="Your name"
              required
            />
          </label>

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

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Primary Work Category <span className="text-red-600">*</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value !== "Other") {
                  setCustomCategory("");
                }
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
              required
            >
              <option value="">Select your work category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          {category === "Other" && (
            <label className="grid gap-2 text-sm font-semibold text-slate-900">
              Specify your work category <span className="text-red-600">*</span>
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                type="text"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="Enter your work category..."
                required={category === "Other"}
              />
            </label>
          )}

          <Button zone="navy" type="submit" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </Button>

          <div className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-slate-900 underline">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

