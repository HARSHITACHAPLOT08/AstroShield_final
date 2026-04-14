import { cn } from "@/lib/utils";

export function Badge({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-300/20 bg-slate-950/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100",
        className
      )}
    >
      {children}
    </span>
  );
}
