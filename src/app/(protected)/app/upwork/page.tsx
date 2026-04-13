"use client";

import * as React from "react";
import toast from "react-hot-toast";
import type { ToolColor } from "@/lib/tools.config";
import { UpworkStyles } from "@/components/tool/toolStyles";
import { useGenerate } from "@/components/tool/useGenerate";
import { useLocalStorageJsonState } from "@/components/tool/useLocalStorageJson";
import { OutputBox } from "@/components/tool/OutputBox";
import { UpgradeModal } from "@/components/tool/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { gaEvent } from "@/lib/ga";
import { Spinner } from "@/components/ui/spinner";

type State = {
  styleKey: (typeof UpworkStyles)[number]["key"];
  tone: "Professional" | "Warm" | "Direct";
  skills: string;
  history: string[];
};

const zone: ToolColor = "green";

function wordCount(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export default function UpworkPage() {
  const [jobPostText, setJobPostText] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [showUpgrade, setShowUpgrade] = React.useState(false);
  const outputRef = React.useRef<HTMLDivElement | null>(null);

  const [state, setState] = useLocalStorageJsonState<State>("appname.upwork", {
    styleKey: "mirror",
    tone: "Professional",
    skills: "",
    history: [],
  });

  const { generate, loading } = useGenerate();

  async function onGenerate() {
    if (!jobPostText.trim()) {
      toast.error("Job Post Text is required.");
      return;
    }

    gaEvent("generate_click", { tool: "upwork", style: state.styleKey });
    const res = await generate({
      promptKey: state.styleKey,
      inputs: {
        "Job Post Text": jobPostText,
        "Your Skills": state.skills,
        Tone: state.tone,
        "Proposal Style": UpworkStyles.find((s) => s.key === state.styleKey)?.label ?? "",
      },
    });

    if (!res.ok) {
      if (res.error === "insufficient_credits" || res.error === "limit_reached") setShowUpgrade(true);
      else if (res.error === "network_error") toast.error("Network error. Please retry.");
      else toast.error("Generation failed. Please try again.");
      return;
    }

    setOutput(res.output);
    gaEvent("generate_success", { tool: "upwork", style: state.styleKey });
    setState((prev) => ({
      ...prev,
      history: [res.output, ...prev.history].slice(0, 3),
    }));
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function onClear() {
    setJobPostText("");
    setOutput("");
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied!");
      gaEvent("copy_click", { tool: "upwork" });
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <Card className="p-4 sm:p-5">
        <h1 className="text-2xl font-extrabold text-slate-900">Upwork Proposal</h1>
        <p className="mt-1 text-sm text-slate-600">
          Paste the job post. Optional fields are remembered.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Job Post Text <span className="text-red-600">*</span>
            <textarea
              value={jobPostText}
              onChange={(e) => setJobPostText(e.target.value)}
              className="min-h-[180px] w-full rounded-xl border border-slate-200 bg-white p-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#14A800]/20"
              placeholder="Paste the Upwork job post text here..."
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-900">
            Your Skills (optional)
            <textarea
              value={state.skills}
              onChange={(e) => setState((p) => ({ ...p, skills: e.target.value }))}
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4 text-[15px] font-normal text-slate-900 outline-none focus:ring-2 focus:ring-[#14A800]/20"
              placeholder="Your skills/background (remembered after first entry)..."
            />
          </label>

          <div className="grid gap-2">
            <div className="text-sm font-semibold text-slate-900">Proposal Style</div>
            <div className="flex flex-wrap gap-2">
              {UpworkStyles.map((s) => {
                const active = state.styleKey === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, styleKey: s.key }))}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "border-transparent bg-[#14A800] text-white"
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
            <div className="text-sm font-semibold text-slate-900">Tone</div>
            <div className="flex flex-wrap gap-2">
              {(["Professional", "Warm", "Direct"] as const).map((t) => {
                const active = state.tone === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, tone: t }))}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "border-transparent bg-[#14A800] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button zone="green" className="w-full" onClick={onGenerate} disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Writing your proposal...
                </span>
              ) : (
                "Generate"
              )}
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => onGenerate()} disabled={loading}>
              Regenerate
            </Button>
            <Button className="w-full" variant="secondary" onClick={onClear} disabled={loading}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <div ref={outputRef} className="space-y-3">
        <OutputBox value={output} zone={zone} />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Word count: <span className="font-semibold">{wordCount(output)}</span>
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

