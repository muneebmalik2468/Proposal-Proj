import * as React from "react";
import { cn } from "@/components/ui/cn";

type Variant = "primary" | "secondary" | "ghost";
type Zone = "green" | "blue" | "red" | "navy";

const ZONE: Record<Zone, { solid: string; solidHover: string; ring: string }> = {
  green: {
    solid: "bg-[#14A800] text-white",
    solidHover: "hover:bg-[#0D6B00]",
    ring: "focus-visible:ring-[#14A800]/20",
  },
  blue: {
    solid: "bg-[#0A66C2] text-white",
    solidHover: "hover:bg-[#084E94]",
    ring: "focus-visible:ring-[#0A66C2]/20",
  },
  red: {
    solid: "bg-[#DC2626] text-white",
    solidHover: "hover:bg-[#991B1B]",
    ring: "focus-visible:ring-[#DC2626]/20",
  },
  navy: {
    solid: "bg-slate-900 text-white",
    solidHover: "hover:bg-slate-800",
    ring: "focus-visible:ring-slate-900/20",
  },
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  zone?: Zone;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", zone = "navy", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[15px] font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2";

    if (variant === "primary") {
      return (
        <button
          ref={ref}
          className={cn(base, ZONE[zone].solid, ZONE[zone].solidHover, ZONE[zone].ring, className)}
          {...props}
        />
      );
    }

    if (variant === "secondary") {
      return (
        <button
          ref={ref}
          className={cn(
            base,
            "bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50",
            "focus-visible:ring-slate-900/10",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-[15px] font-semibold transition-colors",
          "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

