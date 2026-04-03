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
    const { full_name, is_pro, is_admin, usage_count, pro_expires } = body;

    // Build update object
    const updateData: any = {
      ...(full_name !== undefined && { full_name }),
      ...(is_admin !== undefined && { is_admin }),
      ...(usage_count !== undefined && { usage_count }),
      ...(pro_expires !== undefined && { pro_expires }),
    };

    // Handle is_pro status change
    if (is_pro !== undefined) {
      updateData.is_pro = is_pro;

      if (is_pro === true) {
        // Set pro_since to now if converting to pro (only if not already set)
        updateData.pro_since = new Date().toISOString();
        // Set pro_expires to 1 year from now if not provided
        if (!pro_expires) {
          const expiresDate = new Date();
          expiresDate.setMonth(expiresDate.getMonth() + 1);
        //   expiresDate.setFullYear(expiresDate.getFullYear() + 1);
          updateData.pro_expires = expiresDate.toISOString();
        }
      } else {
        // Clear pro dates if converting to free
        updateData.pro_since = null;
        updateData.pro_expires = null;
      }
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
