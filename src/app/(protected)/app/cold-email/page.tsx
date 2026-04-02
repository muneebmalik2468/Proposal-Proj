"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/tool/OutputBox";
import { UpgradeModal } from "@/components/tool/UpgradeModal";
import { useGenerate } from "@/components/tool/useGenerate";
import { useLocalStorageJsonState } from "@/components/tool/useLocalStorageJson";
import { ColdEmailStyles } from "@/components/tool/toolStyles";
import type { ToolColor } from "@/lib/tools.config";
import { gaEvent } from "@/lib/ga";
import { Spinner } from "@/components/ui/spinner";

type State = {
  styleKey: (typeof ColdEmailStyles)[number]["key"];
  goal: "Get a Reply" | "Book a Call" | "Start a Conversation";
  history: string[];
};

const zone: ToolColor = "red";

export default function ColdEmailPage() {
  const [showUpgrade, setShowUpgrade] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const outputRef = React.useRef<HTMLDivElement | null>(null);

  const [state, setState] = useLocalStorageJsonState<State>("appname.cold_email", {
    styleKey: "email_value",
    goal: "Get a Reply",
    history: [],
  });

  const [form, setForm] = React.useState({
    prospectName: "",
    company: "",
    myService: "",
    industry: "",
  });

  const { generate, loading } = useGenerate();

  async function onGenerate() {
    if (!form.prospectName.trim() || !form.company.trim() || !form.myService.trim()) {
      toast.error("Prospect Name, Company, and My Service are required.");
      return;
    }

    gaEvent("generate_click", { tool: "cold_email", style: state.styleKey });
    const res = await generate({
      promptKey: state.styleKey,
      inputs: {
        "Prospect Name": form.prospectName,
        Company: form.company,
        "My Service": form.myService,
        Industry: form.industry,
        Goal: state.goal,
        "Email Style": ColdEmailStyles.find((s) => s.key === state.styleKey)?.label ?? "",
      },
    });

    if (!res.ok) {
      if (res.error === "limit_reached") setShowUpgrade(true);
      else if (res.error === "network_error") toast.error("Network error. Please retry.");
      else toast.error("Generation failed. Please try again.");
      return;
    }

    setOutput(res.output);
    gaEvent("generate_success", { tool: "cold_email", style: state.styleKey });
    setState((prev) => ({ ...prev, history: [res.output, ...prev.history].slice(0, 3) }));
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied!");
      gaEvent("copy_click", { tool: "cold_email" });
    } catch {
      toast.error("Copy failed");
    }
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <Card className="p-4 sm:p-5">
        <h1 className="text-2xl font-extrabold text-slate-900">Cold Email</h1>
        <p className="mt-1 text-sm text-slate-600">
          Output includes 3 subject lines + email body + PS (plain text only).
        </p>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-semibold text-slate-900">Email Style</div>
            <div className="flex flex-wrap gap-2">
              {ColdEmailStyles.map((s) => {
                const active = state.styleKey === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, styleKey: s.key }))}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "border-transparent bg-[#DC2626] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-semibold text-slate-900">Goal</div>
            <div className="flex flex-wrap gap-2">
              {(["Get a Reply", "Book a Call", "Start a Conversation"] as const).map((g) => {
                const active = state.goal === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, goal: g }))}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "border-transparent bg-[#DC2626] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Prospect Name <span className="text-red-600">*</span>
            <input
              value={form.prospectName}
              onChange={(e) => set("prospectName", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Company <span className="text-red-600">*</span>
            <input
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            My Service <span className="text-red-600">*</span>
            <input
              value={form.myService}
              onChange={(e) => set("myService", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Industry (optional)
            <input
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button className="w-full" zone="red" onClick={onGenerate} disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Writing your email...
                </span>
              ) : (
                "Generate"
              )}
            </Button>
            <Button className="w-full" variant="secondary" onClick={onGenerate} disabled={loading}>
              Regenerate
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                setOutput("");
                setForm({ prospectName: "", company: "", myService: "", industry: "" });
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <div ref={outputRef} className="space-y-3">
        <OutputBox value={output} zone={zone} />
        <div className="flex justify-end">
          <Button className="w-full sm:w-auto" variant="secondary" onClick={onCopy} disabled={!output}>
            Copy
          </Button>
        </div>

        {output && (
          <Card className="p-4">
            <div className="text-sm font-bold text-slate-900">
              Deliverability checklist
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Use a custom domain email (not Gmail/Yahoo/Outlook free accounts)</li>
              <li>Set up SPF record on your domain before sending</li>
              <li>Set up DKIM record on your domain before sending</li>
              <li>Set up DMARC record on your domain before sending</li>
              <li>Do not send more than 20 cold emails per day from a new domain</li>
              <li>Test your email spam score at mail-tester.com before your first send</li>
              <li>Never BCC or CC multiple people in a cold email — send one by one</li>
              <li>Use a sending tool (Instantly.ai, Lemlist) for volume sends — not Gmail Compose</li>
            </ul>
          </Card>
        )}

        {state.history.length > 0 && (
          <Card className="p-4">
            <div className="text-sm font-bold text-slate-900">Last 3 outputs</div>
            <div className="mt-3 grid gap-2">
              {state.history.map((h, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white p-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOutput(h)}
                >
                  {h.slice(0, 140)}
                  {h.length > 140 ? "…" : ""}
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

