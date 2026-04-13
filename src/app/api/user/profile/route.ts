import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { full_name, category } = await req.json();

    // Build update object
    const updateData: any = {};
    
    if (full_name && typeof full_name === "string") {
      updateData.full_name = full_name.trim();
    }
    
    if (category && typeof category === "string") {
      updateData.category = category.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // Update user's profile
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select("id, email, full_name, category, plan, credits, credits_limit")
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in PATCH /api/user/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
