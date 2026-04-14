import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel group relative isolate overflow-hidden rounded-[28px] p-5 transition duration-500 hover:-translate-y-1 hover:border-cyan-300/25 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-200/55 before:to-transparent after:absolute after:-right-12 after:top-0 after:h-32 after:w-32 after:rounded-full after:bg-cyan-300/10 after:blur-3xl",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
