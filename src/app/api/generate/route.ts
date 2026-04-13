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

  // Load user plan + credit state
  const { data: userRow, error: rowErr } = await supabase
    .from("users")
    .select("id,email,plan,credits,credits_limit,usage_count,usage_reset_at,plan_expires")
    .eq("id", user.id)
    .maybeSingle();

  if (rowErr || !userRow) {
    return Response.json({ error: "user_row_missing" }, { status: 500 });
  }

  // Check if plan has expired
  if (userRow.plan_expires && new Date(userRow.plan_expires) < new Date()) {
    // Plan expired, revert to free
    await supabase
      .from("users")
      .update({
        plan: "free",
        credits: 0,
        credits_limit: 0,
        plan_since: new Date().toISOString(),
        plan_expires: null
      })
      .eq("id", user.id);
    
    userRow.plan = "free";
    userRow.credits = 0;
    userRow.credits_limit = 0;
  }

  // Monthly reset for free users (MVP: done inline)
  const monthStart = firstDayOfCurrentMonthISO();
  if (!userRow.usage_reset_at || userRow.usage_reset_at < monthStart) {
    await supabase
      .from("users")
      .update({ usage_count: 0, usage_reset_at: monthStart })
      .eq("id", user.id);
    userRow.usage_count = 0;
    userRow.usage_reset_at = monthStart;
  }

  // Check free tier limit (5 per month with no plan)
  if (userRow.plan === "free" && (userRow.usage_count ?? 0) >= FREE_MONTHLY_LIMIT) {
    return Response.json({ error: "limit_reached" }, { status: 403 });
  }

  // Check credits for paid plans (not promax which is unlimited)
  if ((userRow.plan === "basic" || userRow.plan === "pro") && (userRow.credits ?? 0) <= 0) {
    return Response.json({ error: "insufficient_credits" }, { status: 403 });
  }

  const userPrompt = Object.entries(inputs)
    .filter(([, v]) => typeof v === "string" && v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join("\n");

  if (!userPrompt) {
    return Response.json({ error: "missing_required_inputs" }, { status: 400 });
  }

  let output = "";
  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPTS[promptKey] },
        { role: "user", content: userPrompt },
      ],
      max_output_tokens: 600,
      temperature: 0.8,
    });

    output = response.output_text?.trim() || "";
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);
    return Response.json(
      { error: "openai_failed", details: error.message },
      { status: 502 }
    );
  }

  if (!output) {
    return Response.json({ error: "empty_output" }, { status: 502 });
  }

  // Increment usage and deduct credits (for paid plans, not promax)
  const updateData: any = { usage_count: (userRow.usage_count ?? 0) + 1 };
  
  if (userRow.plan === "basic" || userRow.plan === "pro") {
    updateData.credits = Math.max(0, (userRow.credits ?? 1) - 1);
  }
  
  await supabase
    .from("users")
    .update(updateData)
    .eq("id", user.id);

  // Map promptKey to tool_type and log activity
  const toolTypeMap: Record<PromptKey, string> = {
    // Upwork
    mirror: "upwork",
    proof: "upwork",
    diagnostic: "upwork",
    // LinkedIn InMail
    value_sniper: "linkedin-inmail",
    curiosity_gap: "linkedin-inmail",
    consultant_frame: "linkedin-inmail",
    // LinkedIn Connection
    shared_context: "linkedin-connection",
    value_drop: "linkedin-connection",
    sharp_question: "linkedin-connection",
    // Cold Email
    email_value: "cold-email",
    email_curiosity: "cold-email",
    email_diagnostic: "cold-email",
  };

  const toolType = toolTypeMap[promptKey] || "upwork";

  // Format title based on tool type
  let formattedTitle = "Content";
  if (toolType === "upwork") {
    // Show first 10 words of job post
    const jobPost = inputs["Job Post Text"] || "";
    const words = jobPost.trim().split(/\s+/).slice(0, 10).join(" ");
    formattedTitle = words.length > 0 ? words : "Job Post";
  } else if (toolType === "linkedin-inmail" || toolType === "linkedin-connection") {
    // Format: [Prospect Name] - [My Service]
    const prospectName = inputs["Prospect Name"] || "";
    const myService = inputs["My Service"] || "";
    if (prospectName && myService) {
      formattedTitle = `${prospectName} - ${myService}`;
    } else {
      formattedTitle = prospectName || myService || "Connection";
    }
  } else if (toolType === "cold-email") {
    // Format: [Prospect Name] - [Company]
    const prospectName = inputs["Prospect Name"] || "";
    const company = inputs["Company"] || "";
    if (prospectName && company) {
      formattedTitle = `${prospectName} - ${company}`;
    } else {
      formattedTitle = prospectName || company || "Email";
    }
  }

  // Log activity
  try {
    console.log("Logging activity for user:", user.id, "tool:", toolType, "title:", formattedTitle);
    const { error: insertError } = await supabase
      .from("activity_logs")
      .insert({
        user_id: user.id,
        tool_type: toolType,
        action_type: "generate",
        title: formattedTitle,
        prompt_key: promptKey,
      });
    
    if (insertError) {
      console.error("Activity log insert error:", insertError);
    } else {
      console.log("Activity logged successfully");
    }
  } catch (logError) {
    console.error("Failed to log activity:", logError);
    // Don't fail the request if logging fails
  }

  return Response.json({ 
    output,
    // Include updated credits in response
    credits: updateData.credits ?? userRow.credits
  });
}

