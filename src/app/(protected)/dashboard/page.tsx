import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TOOLS } from "@/lib/tools.config";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userRow } = await supabase
    .from("users")
    .select("full_name,email,is_pro,usage_count,usage_reset_at")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const isPro = Boolean(userRow?.is_pro);
  const usageCount = userRow?.usage_count ?? 0;
  const activeTools = TOOLS.filter((t) => t.active && t.phase === 1);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 break-all text-sm text-slate-600 font-semibold">Welcome, {userRow?.full_name} 👋</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2 lg:flex">
          {!isPro && (
            <Link href="/upgrade">
              <Button zone="navy" className="w-full">
                Upgrade
              </Button>
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 sm:p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-600">Active Plan</div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">
            {isPro ? "Pro" : "Free"}
          </div>
          <div className="mt-3 text-sm text-slate-700">
            {isPro ? (
              <>
              ~ Unlimited generations. <br />
              ~ DMs & emails. <br />
              ~ No ads. <br />
              ~ Cancel anytime.
              </>
            ) : (
              <>
                {usageCount} / 5 generations used this month.{" "}
                <Link href="/upgrade" className="font-semibold text-slate-900 underline">
                  Upgrade to Pro
                </Link>
                .
              </>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="text-sm font-semibold text-slate-600">Quick links</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {activeTools.map((t) => (
              <Link
                key={t.id}
                href={t.path}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                <span className="mr-2">{t.icon}</span>
                {t.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

