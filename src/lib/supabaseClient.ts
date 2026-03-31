import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Back-compat shim for existing imports.
// Prefer `createSupabaseBrowserClient()` in new code.
export const supabase: SupabaseClient = createSupabaseBrowserClient();