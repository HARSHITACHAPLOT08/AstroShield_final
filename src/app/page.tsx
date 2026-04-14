"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BrainCircuit, Globe2, Radar, Rocket, ShieldCheck, Zap } from "lucide-react";
import { GlowButton } from "@/components/shared/glow-button";
import { GlassCard } from "@/components/shared/glass-card";
import { LiveTicker } from "@/components/shared/live-ticker";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { SectionReveal } from "@/components/shared/section-reveal";
import { EarthScene } from "@/components/visuals/earth-scene";
import { SpaceBackground } from "@/components/visuals/space-background";
import { useLandingData } from "@/hooks/use-platform-data";

const whyItems = [
  {
    title: "Predict before impact",
    copy: "AstroShield fuses heliophysics telemetry and infrastructure context so teams can act before voltage, routing, and comms degrade.",
    icon: BrainCircuit
  },
  {
    title: "Coordinate every domain",
    copy: "Power operators, satellite fleets, and aviation dispatchers work from one shared operational picture instead of fragmented feeds.",
    icon: Globe2
  },
  {
    title: "Operationalize response",
    copy: "Confidence scores, live alerts, and action checklists turn beautiful dashboards into decisions that protect critical systems.",
    icon: ShieldCheck
  }
];

const heroStats = [
  ["24/7", "Space weather watch"],
  ["Unified", "Grid, air, orbit"],
  ["AI-led", "Response playbooks"]
] as const;

export default function LandingPage() {
  const { data, loading } = useLandingData();
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10">
        <section className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-6 md:px-8 md:py-8">
          <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[30px] px-5 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-300 to-blue-600 text-slate-950 shadow-glow">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl tracking-[0.08em] text-white">AstroShield</p>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Space Weather Intelligence</p>
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <GlowButton variant="secondary" onClick={() => router.push("/login")}>
                Mission Access
              </GlowButton>
              <GlowButton onClick={() => router.push("/dashboard")}>
                Enter Demo
                <ArrowRight className="h-4 w-4" />
              </GlowButton>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-14 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:py-14">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/15 bg-slate-950/50 px-4 py-2 text-xs uppercase tracking-[0.26em] text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                AI-powered Space Weather Intelligence Platform
              </div>
              <h1 className="mt-8 max-w-5xl font-display text-5xl font-bold leading-[0.92] tracking-[0.04em] text-white md:text-7xl">
                Keep critical systems ahead of the next <span className="gradient-text">solar storm</span>.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                AstroShield turns real-time space weather telemetry into an operational command layer for utilities, aviation, and satellite teams before disruption reaches Earth.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <GlowButton size="lg" onClick={() => router.push("/dashboard")}>
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4" />
                </GlowButton>
                <GlowButton variant="secondary" size="lg" onClick={() => router.push("/login")}>
                  Operator Login
                </GlowButton>
              </div>
              <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
                {heroStats.map(([value, label], index) => (
                  <GlassCard
                    key={label}
                    className="bg-gradient-to-br from-cyan-400/10 via-slate-950/40 to-blue-500/10"
                    style={{ animationDelay: `${index * 0.25}s` } as CSSProperties}
                  >
                    <p className="font-display text-3xl text-white">{value}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.22em] text-slate-400">{label}</p>
                  </GlassCard>
                ))}
              </div>
              <div className="mt-12">
                {loading || !data ? <LoadingSkeleton className="h-14 w-full rounded-full" /> : <LiveTicker items={data.ticker} />}
              </div>
            </div>

            <div className="mask-fade-bottom justify-self-center lg:w-full">
              <EarthScene />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] space-y-24 px-4 pb-24 md:px-8">
          <SectionReveal delay={0.05}>
            <div className="grid gap-6 lg:grid-cols-3">
              {whyItems.map((item) => (
                <GlassCard key={item.title} className="bg-gradient-to-br from-cyan-400/10 to-blue-500/10">
                  <item.icon className="h-8 w-8 text-cyan-300" />
                  <h2 className="mt-6 font-display text-2xl text-white">{item.title}</h2>
                  <p className="mt-3 text-slate-300">{item.copy}</p>
                </GlassCard>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <GlassCard>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Real-time Data Sources</p>
                <h2 className="mt-4 font-display text-4xl text-white">Built on the signals that matter.</h2>
                <p className="mt-4 text-slate-300">
                  Clean ingestion pipelines blend upstream space weather telemetry with downstream infrastructure risk context.
                </p>
              </GlassCard>
              <div className="grid gap-4 md:grid-cols-2">
                {(data?.sources ?? []).map((source, index) => (
                  <GlassCard
                    key={source}
                    className="animate-float bg-gradient-to-br from-sky-400/10 via-slate-950/45 to-fuchsia-500/10"
                    style={{ animationDelay: `${index * 0.35}s`, animationDuration: `${6.8 + index * 0.45}s` } as CSSProperties}
                  >
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Source {index + 1}</p>
                    <p className="mt-3 text-lg font-semibold text-white">{source}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <GlassCard className="bg-gradient-to-br from-blue-500/10 to-fuchsia-500/10">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">AI Prediction Workflow</p>
                <div className="mt-6 space-y-5">
                  {(data?.workflow ?? []).map((step, index) => (
                    <div key={step} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 font-display text-white">
                        0{index + 1}
                      </div>
                      <p className="pt-2 text-slate-200">{step}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Stakeholders</p>
                <div className="mt-6 grid gap-4">
                  {(data?.stakeholders ?? []).map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-cyan-300/10 bg-gradient-to-r from-slate-950/70 to-cyan-500/5 px-4 py-4 text-white transition hover:border-cyan-300/25"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <div className="grid gap-6 lg:grid-cols-4">
              {(data?.modules ?? []).map((module) => (
                <GlassCard key={module.title} className="bg-gradient-to-br from-slate-950/50 via-cyan-500/5 to-blue-500/10">
                  <Zap className="h-6 w-6 text-cyan-300" />
                  <h3 className="mt-5 font-display text-2xl text-white">{module.title}</h3>
                  <p className="mt-3 text-slate-300">{module.summary}</p>
                </GlassCard>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="grid gap-6 lg:grid-cols-3">
              {(data?.testimonials ?? []).map((testimonial) => (
                <GlassCard key={testimonial.name} className="bg-gradient-to-br from-slate-950/70 to-cyan-400/5">
                  <Radar className="h-6 w-6 text-cyan-300" />
                  <p className="mt-5 text-lg text-slate-100">&quot;{testimonial.quote}&quot;</p>
                  <div className="mt-6">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{testimonial.role}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.18}>
            <GlassCard className="overflow-hidden bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-fuchsia-500/10 p-8 md:p-10">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Ready Room</p>
                  <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
                    Stand up a modern command center for space weather resilience.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4">
                  <GlowButton size="lg" onClick={() => router.push("/login")}>
                    Start Free Mission
                  </GlowButton>
                  <GlowButton variant="secondary" size="lg" onClick={() => router.push("/dashboard")}>
                    Enter Demo
                  </GlowButton>
                </div>
              </div>
            </GlassCard>
          </SectionReveal>
        </section>
      </div>
    </div>
  );
}
