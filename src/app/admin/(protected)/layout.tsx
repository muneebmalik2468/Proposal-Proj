import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: userRow } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = Boolean(userRow?.is_admin);

  // Redirect non-admin users to the user dashboard instead of login
  // since they're already authenticated
  if (!isAdmin) redirect("/dashboard");

  return <>{children}</>;
}
