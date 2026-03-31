import OpenAI from "openai";
import { SYSTEM_PROMPTS, type PromptKey } from "@/lib/server/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateBody = {
  promptKey: PromptKey;
  inputs: Record<string, string>;
};

const FREE_MONTHLY_LIMIT = 5;

function firstDayOfCurrentMonthISO() {
  const d = new Date();
  const first = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  return first.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "server_misconfigured" },
      { status: 500 }
    );
  }

  let body: GenerateBody;
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { promptKey, inputs } = body ?? {};
  if (!promptKey || !(promptKey in SYSTEM_PROMPTS)) {
    return Response.json({ error: "invalid_prompt_key" }, { status: 400 });
  }
  if (!inputs || typeof inputs !== "object") {
    return Response.json({ error: "invalid_inputs" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // Load user usage + plan state
  const { data: userRow, error: rowErr } = await supabase
    .from("users")
    .select("id,email,is_pro,usage_count,usage_reset_at")
    .eq("id", user.id)
    .maybeSingle();

  if (rowErr || !userRow) {
    return Response.json({ error: "user_row_missing" }, { status: 500 });
  }

  // Monthly reset (MVP: done inline)
  const monthStart = firstDayOfCurrentMonthISO();
  if (userRow.usage_reset_at && userRow.usage_reset_at < monthStart) {
    await supabase
      .from("users")
      .update({ usage_count: 0, usage_reset_at: monthStart })
      .eq("id", user.id);
    userRow.usage_count = 0;
    userRow.usage_reset_at = monthStart;
  }

  if (!userRow.is_pro && (userRow.usage_count ?? 0) >= FREE_MONTHLY_LIMIT) {
    return Response.json({ error: "limit_reached" }, { status: 403 });
  }

  const userPrompt = Object.entries(inputs)
    .filter(([, v]) => typeof v === "string" && v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join("\n");

  if (!userPrompt) {
    return Response.json({ error: "missing_required_inputs" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 600,
    temperature: 0.8,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS[promptKey] },
      { role: "user", content: userPrompt },
    ],
  });

  const output = completion.choices?.[0]?.message?.content?.trim() ?? "";

  // Increment usage (always; Pro is unlimited)
  await supabase
    .from("users")
    .update({ usage_count: (userRow.usage_count ?? 0) + 1 })
    .eq("id", user.id);

  return Response.json({ output });
}

