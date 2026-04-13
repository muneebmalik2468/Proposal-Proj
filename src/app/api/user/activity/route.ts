import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month start and end
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

    // Fetch monthly statistics
    const { data: monthlyStats } = await supabase
      .from("activity_logs")
      .select("tool_type, action_type")
      .eq("user_id", user.id)
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd);

    // Calculate monthly counts by tool
    const toolCounts = {
      upwork: 0,
      "linkedin-inmail": 0,
      "linkedin-connection": 0,
      "cold-email": 0,
      total: 0,
    };

    monthlyStats?.forEach((log: any) => {
      if (log.tool_type in toolCounts) {
        toolCounts[log.tool_type as keyof typeof toolCounts]++;
      }
      toolCounts.total++;
    });

    // Fetch recent activity (last 10)
    const { data: recentActivity } = await supabase
      .from("activity_logs")
      .select("id, tool_type, action_type, title, prompt_key, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Fetch all historical activity
    const { data: historyActivity } = await supabase
      .from("activity_logs")
      .select("id, tool_type, action_type, title, prompt_key, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      monthlyStats: {
        proposals: toolCounts.upwork,
        linkedInInMails: toolCounts["linkedin-inmail"],
        connectionNotes: toolCounts["linkedin-connection"],
        coldEmails: toolCounts["cold-email"],
        total: toolCounts.total,
      },
      recentActivity: recentActivity || [],
      history: historyActivity || [],
    });
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}
