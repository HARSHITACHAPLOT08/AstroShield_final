import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-cyan-300/15 bg-slate-950/55 px-4 text-sm text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 hover:border-cyan-300/30 hover:bg-slate-950/70 focus:border-cyan-300/50 focus:shadow-[0_0_20px_rgba(34,211,238,0.18)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
