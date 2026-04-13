import { Navbar } from "@/components/app/navbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userRow } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const isPro = userRow?.plan === "pro" || userRow?.plan === "promax" || userRow?.plan === "basic";

  return (
    <div className="min-h-full">
      <Navbar isPro={isPro} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

