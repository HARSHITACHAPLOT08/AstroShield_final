import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  badge
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[0.04em] text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">{description}</p>
      </div>
      {badge ? <Badge className="self-start lg:self-auto">{badge}</Badge> : null}
    </div>
  );
}
