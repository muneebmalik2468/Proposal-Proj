import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createSupabaseServerClient();

    // Verify admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminRow } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!adminRow?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { 
      full_name,
      category,
      plan, 
      credits, 
      credits_limit, 
      is_admin, 
      usage_count, 
      plan_expires 
    } = body;

    // Build update object
    const updateData: any = {
      ...(full_name !== undefined && { full_name }),
      ...(category !== undefined && { category }),
      ...(is_admin !== undefined && { is_admin }),
      ...(usage_count !== undefined && { usage_count }),
      ...(plan_expires !== undefined && { plan_expires }),
    };

    // Handle plan change
    if (plan !== undefined) {
      updateData.plan = plan;

      // Set plan_since to now when changing plans
      updateData.plan_since = new Date().toISOString();

      // Set plan_expires based on plan type
      if (!plan_expires) {
        const expiresDate = new Date();
        if (plan === "pro" || plan === "promax") {
          expiresDate.setFullYear(expiresDate.getFullYear() + 1);
        } else if (plan === "basic") {
          expiresDate.setMonth(expiresDate.getMonth() + 1);
        } else if (plan === "free") {
          updateData.plan_since = null;
          updateData.plan_expires = null;
        }
        if (plan !== "free") {
          updateData.plan_expires = expiresDate.toISOString();
        }
      }
    }

    // Handle credits updates
    if (credits !== undefined) {
      updateData.credits = credits;
    }
    if (credits_limit !== undefined) {
      updateData.credits_limit = credits_limit;
    }

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
