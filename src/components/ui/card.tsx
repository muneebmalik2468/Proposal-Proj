import * as React from "react";
import { cn } from "@/components/ui/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow",
        "hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}

