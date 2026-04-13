import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/app/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  try {
    const { data: userRow, error } = await supabase
      .from("users")
      .select("full_name,email,category,plan,credits,credits_limit,usage_count,usage_reset_at,plan_expires")
      .eq("id", user.id)
      .single();

    // If user row doesn't exist, try to create one
    if (!userRow && error?.code === "PGRST116") {
      // No data returned - user record might not exist yet
      // Create it manually
      const { data: newUser } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            category: user.user_metadata?.category || "Other",
            plan: "free",
            credits: 5,
            credits_limit: 5,
          },
        ])
        .select("full_name,email,category,plan,credits,credits_limit,usage_count,usage_reset_at,plan_expires")
        .single();

      return <DashboardClient user={user} userRow={newUser} />;
    }

    return <DashboardClient user={user} userRow={userRow} />;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Return dashboard with minimal user info
    return <DashboardClient user={user} userRow={null} />;
  }
}

