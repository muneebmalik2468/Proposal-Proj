"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/tool/OutputBox";
import { UpgradeModal } from "@/components/tool/UpgradeModal";
import { useGenerate } from "@/components/tool/useGenerate";
import { useLocalStorageJsonState } from "@/components/tool/useLocalStorageJson";
import { ConnectionNoteStyles } from "@/components/tool/toolStyles";
import type { ToolColor } from "@/lib/tools.config";
import { gaEvent } from "@/lib/ga";
import { Spinner } from "@/components/ui/spinner";

type State = {
  styleKey: (typeof ConnectionNoteStyles)[number]["key"];
  history: string[];
};

const zone: ToolColor = "blue";
const HARD_LIMIT = 300;

function counterColor(chars: number) {
  if (chars <= 260) return "text-[#14A800]";
  if (chars <= 290) return "text-[#D97706]";
  if (chars <= 300) return "text-[#DC2626]";
  return "text-[#DC2626]";
}

export default function LinkedInConnectionNotePage() {
  const [showUpgrade, setShowUpgrade] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const outputRef = React.useRef<HTMLDivElement | null>(null);

  const [state, setState] = useLocalStorageJsonState<State>(
    "appname.linkedin_connection",
    {
      styleKey: "shared_context",
      history: [],
    }
  );

  const [form, setForm] = React.useState({
    prospectName: "",
    myService: "",
    jobTitle: "",
    company: "",
    industry: "",
    sharedContext: "",
  });

  const { generate, loading } = useGenerate();

  const chars = output.length;

  async function onGenerate() {
    if (!form.prospectName.trim() || !form.myService.trim()) {
      toast.error("Prospect Name and My Service are required.");
      return;
    }

    gaEvent("generate_click", { tool: "linkedin_connection", style: state.styleKey });
    const res = await generate({
      promptKey: state.styleKey,
      inputs: {
        "Prospect Name": form.prospectName,
        "My Service": form.myService,
        "Job Title": form.jobTitle,
        Company: form.company,
        Industry: form.industry,
        "Shared Context": form.sharedContext,
        "Note Style":
          ConnectionNoteStyles.find((s) => s.key === state.styleKey)?.label ?? "",
      },
    });

    if (!res.ok) {
      if (res.error === "limit_reached") setShowUpgrade(true);
      else if (res.error === "network_error") toast.error("Network error. Please retry.");
      else toast.error("Generation failed. Please try again.");
      return;
    }

    const next = res.output ?? "";
    setOutput(next);
    gaEvent("generate_success", { tool: "linkedin_connection", style: state.styleKey });
    setState((prev) => ({ ...prev, history: [next, ...prev.history].slice(0, 3) }));
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  React.useEffect(() => {
    if (output.length > HARD_LIMIT && !loading) {
      toast.error("TOO LONG — click Regenerate");
    }
  }, [output, loading]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied!");
      gaEvent("copy_click", { tool: "linkedin_connection" });
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
        <h1 className="text-2xl font-extrabold text-slate-900">
          LinkedIn Connection Note
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Hard limit: 300 characters.
        </p>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-semibold text-slate-900">Note Style</div>
            <div className="flex flex-wrap gap-2">
              {ConnectionNoteStyles.map((s) => {
                const active = state.styleKey === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, styleKey: s.key }))}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "border-transparent bg-[#0A66C2] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {s.label}
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
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
              placeholder="e.g., Ayesha"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            My Service <span className="text-red-600">*</span>
            <input
              value={form.myService}
              onChange={(e) => set("myService", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
              placeholder="What you do (one line)"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-900">
              Job Title (optional)
              <input
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-900">
              Company (optional)
              <input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Industry (optional)
            <input
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Shared Context (optional)
            <textarea
              value={form.sharedContext}
              onChange={(e) => set("sharedContext", e.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
              placeholder="e.g., Saw your post on..."
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button className="w-full" zone="blue" onClick={onGenerate} disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Writing your note...
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
                setForm({
                  prospectName: "",
                  myService: "",
                  jobTitle: "",
                  company: "",
                  industry: "",
                  sharedContext: "",
                });
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className={["text-sm font-semibold", counterColor(chars)].join(" ")}>
            {chars <= HARD_LIMIT ? `${chars} / 300 characters` : "TOO LONG — click Regenerate"}
          </div>
          <Button className="w-full sm:w-auto" variant="secondary" onClick={onCopy} disabled={!output}>
            Copy
          </Button>
        </div>

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

