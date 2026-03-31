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
    .select("email,is_pro,usage_count,usage_reset_at")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const isPro = Boolean(userRow?.is_pro);
  const usageCount = userRow?.usage_count ?? 0;
  const activeTools = TOOLS.filter((t) => t.active && t.phase === 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">{userRow?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {!isPro && (
            <Link href="/upgrade">
              <Button zone="navy">Upgrade</Button>
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 md:col-span-2">
          <div className="text-sm font-semibold text-slate-600">Plan</div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">
            {isPro ? "Pro" : "Free"}
          </div>
          <div className="mt-3 text-sm text-slate-700">
            {isPro ? (
              <>Unlimited generations.</>
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

        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-600">Quick links</div>
          <div className="mt-3 grid gap-2">
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

