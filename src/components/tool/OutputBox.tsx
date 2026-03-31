"use client";

import * as React from "react";
import { cn } from "@/components/ui/cn";
import type { ToolColor } from "@/lib/tools.config";

const ZONE: Record<ToolColor, { stripe: string; pale: string }> = {
  green: { stripe: "border-l-[#14A800]", pale: "bg-[#F0FDF4]" },
  blue: { stripe: "border-l-[#0A66C2]", pale: "bg-[#EBF5FF]" },
  red: { stripe: "border-l-[#DC2626]", pale: "bg-[#FEF2F2]" },
};

export function OutputBox({
  value,
  zone,
  className,
}: {
  value: string;
  zone: ToolColor;
  className?: string;
}) {
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-slate-50",
        "border-l-4",
        ZONE[zone].stripe,
        className
      )}
    >
      <textarea
        ref={ref}
        readOnly
        value={value}
        onClick={() => ref.current?.select()}
        className={cn(
          "h-64 w-full resize-none rounded-xl bg-transparent p-4 text-sm text-slate-900 outline-none",
          "placeholder:text-slate-400"
        )}
        placeholder="Your output will appear here..."
      />
    </div>
  );
}

