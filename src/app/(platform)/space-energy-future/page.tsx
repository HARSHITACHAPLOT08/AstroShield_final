"use client";

import { motion } from "framer-motion";
import { Radar, Rocket, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

type TechCard = {
  id: string;
  title: string;
  subtitle: string;
  stats: string[];
  trl: number;
  timeline: string;
};

function techTone(id: TechCard["id"]) {
  switch (id) {
    case "sbsp":
      return {
        frame: "border-cyan-300/35 from-[#071838]/95 via-[#130e3a]/85 to-[#0a1e45]/85",
        glow: "bg-cyan-300/18",
        accent: "text-cyan-200"
      };
    case "helium3":
      return {
        frame: "border-fuchsia-300/30 from-[#0d1539]/95 via-[#24103d]/85 to-[#171a44]/85",
        glow: "bg-fuchsia-300/18",
        accent: "text-fuchsia-200"
      };
    default:
      return {
        frame: "border-violet-300/30 from-[#0a1536]/95 via-[#1d103c]/85 to-[#0f2142]/85",
        glow: "bg-violet-300/18",
        accent: "text-violet-200"
      };
  }
}

const technologies: TechCard[] = [
  {
    id: "sbsp",
    title: "Space-Based Solar Power (SBSP)",
    subtitle: "Orbital arrays collect sunlight 24/7 and beam microwave power to ground receivers.",
    stats: ["8x more efficient than ground solar", "24/7 collection", "No atmosphere losses"],
    trl: 6,
    timeline: "2030"
  },
  {
    id: "helium3",
    title: "Lunar Helium-3 Mining",
    subtitle: "Lunar regolith extraction targets fusion-grade Helium-3 for long-horizon power systems.",
    stats: ["1 tonne He-3 = 50 million barrels oil equivalent", "Lunar reserves ~1 million tonnes", "Fusion-grade fuel pathway"],
    trl: 3,
    timeline: "2040"
  },
  {
    id: "orbital-wind",
    title: "Orbital Wind Energy",
    subtitle: "High-altitude turbines linked to orbital intelligence capture persistent jetstream energy.",
    stats: ["Jetstream winds 8-10x stronger", "24/7 availability", "Satellite-coordinated dispatch"],
    trl: 4,
    timeline: "2050+"
  }
];

export default function SpaceEnergyFuturePage() {
  return (
    <div className="relative isolate space-y-6">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-75"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(34,211,238,0.12), transparent 28%), radial-gradient(circle at 78% 20%, rgba(191,95,255,0.12), transparent 30%), radial-gradient(circle at 48% 72%, rgba(59,130,246,0.08), transparent 32%)"
        }}
        animate={{
          backgroundPosition: ["0% 0%", "2% 3%", "0% 0%"]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background:radial-gradient(rgba(125,211,252,0.55)_1px,transparent_1.5px)] [background-size:30px_30px]"
        animate={{
          opacity: [0.2, 0.35, 0.2],
          backgroundPosition: ["0px 0px", "18px 10px", "0px 0px"]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[18%] -z-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{ y: [0, -14, 0], x: [0, 8, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[32%] -z-10 h-52 w-52 rounded-full bg-fuchsia-400/10 blur-3xl"
        animate={{ y: [0, 18, 0], x: [0, -10, 0], opacity: [0.28, 0.62, 0.28] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <PageHeader
        eyebrow="Space Energy Future"
        title="Next-Generation Space Energy Technologies"
        description="Explore the frontier stack that can redefine global baseload: orbital solar, lunar fusion feedstock, and high-altitude wind systems."
        badge="ESA · NASA · IEA Tech Outlook"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index, duration: 0.45 }}
            whileHover={{ y: -6 }}
          >
            <GlassCard
              className={cn(
                "group h-full min-h-[560px] overflow-hidden border bg-gradient-to-br transition duration-500 hover:-translate-y-2 hover:border-cyan-200/45 hover:shadow-[0_24px_60px_rgba(8,145,178,0.28)]",
                techTone(tech.id).frame
              )}
            >
              <div className={cn("pointer-events-none absolute -right-10 top-16 h-36 w-36 rounded-full blur-3xl transition duration-700 group-hover:scale-125", techTone(tech.id).glow)} />
              <div className="pointer-events-none absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-sky-300/10 blur-3xl transition duration-700 group-hover:scale-125" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background:linear-gradient(120deg,rgba(56,189,248,0.06),transparent_46%,rgba(217,70,239,0.08))]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_45%)]" />

              <div className="flex items-start justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.2em] text-[#9ed8ff]">{tech.title}</p>
                <Badge className="border-[#bf5fff]/35 bg-[#bf5fff]/15 text-[#f0d4ff]">TRL {tech.trl}/9</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{tech.subtitle}</p>

              <div className="mt-4 flex items-center gap-2">
                <Badge className="border-cyan-300/30 bg-cyan-400/10 text-cyan-100">Mission-critical R&D</Badge>
                <Badge className="border-white/15 bg-white/5 text-slate-200">{tech.timeline}</Badge>
              </div>

              <div className="mt-6 rounded-[22px] border border-[#00d4ff]/20 bg-[#060f26]/75 p-4 transition duration-500 group-hover:border-cyan-300/35 group-hover:shadow-[0_0_26px_rgba(56,189,248,0.16)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#84dfff]">Technical diagram</p>
                  {tech.id === "sbsp" ? <Rocket className={cn("h-4 w-4", techTone(tech.id).accent)} /> : null}
                  {tech.id === "helium3" ? <Zap className={cn("h-4 w-4", techTone(tech.id).accent)} /> : null}
                  {tech.id === "orbital-wind" ? <Radar className={cn("h-4 w-4", techTone(tech.id).accent)} /> : null}
                </div>
                <div className="relative mt-3 h-[190px] overflow-hidden rounded-[16px] border border-[#bf5fff]/20 bg-[#040913] p-4 transition duration-500 group-hover:border-fuchsia-300/35 group-hover:shadow-[0_0_30px_rgba(192,132,252,0.16)]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.08),transparent_45%),radial-gradient(circle_at_78%_78%,rgba(191,95,255,0.08),transparent_42%)]" />
                  <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(rgba(125,211,252,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />
                  {tech.id === "sbsp" ? <SbspDiagram /> : null}
                  {tech.id === "helium3" ? <LunarDiagram /> : null}
                  {tech.id === "orbital-wind" ? <OrbitalWindDiagram /> : null}
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {tech.stats.map((stat) => (
                  <motion.li
                    key={stat}
                    whileHover={{ x: 4, scale: 1.01 }}
                    className="flex items-start gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-200/30 hover:bg-white/[0.06]"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-200/80" />
                    <span>{stat}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 rounded-[18px] border border-[#00d4ff]/20 bg-[#08122f]/85 p-3 transition duration-500 group-hover:border-cyan-200/35 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#9ed8ff]">Readiness Level</span>
                  <span className="font-display text-xl text-white">{tech.trl}/9</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900">
                  <motion.div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#00d4ff_0%,#bf5fff_45%,#7af0ff_100%)] bg-[length:200%_100%] shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                    style={{ width: `${(tech.trl / 9) * 100}%` }}
                    animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="group border-[#00d4ff]/30 bg-gradient-to-r from-[#081334]/90 via-[#170c38]/70 to-[#061835]/90">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(191,95,255,0.08),transparent_36%)]" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#9ed8ff]">Technology Timeline</p>
            <p className="mt-2 text-sm text-slate-300">Projected commercial viability windows for each pathway.</p>
          </div>
          <Badge className="border-[#bf5fff]/30 bg-[#bf5fff]/15 text-[#f0d4ff]">Roadmap 2030-2050+</Badge>
        </div>

        <div className="scrollbar-thin mt-5 overflow-x-auto pb-2">
          <div className="flex min-w-[860px] items-center gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.id}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative min-w-[240px] rounded-[20px] border border-white/10 bg-black/25 p-4 transition duration-300 hover:border-cyan-300/35 hover:bg-black/40 hover:shadow-[0_0_34px_rgba(56,189,248,0.18)]"
              >
                {index < technologies.length - 1 ? (
                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-[2px] w-6 -translate-y-1/2 bg-gradient-to-r from-cyan-300/60 to-fuchsia-300/60 md:block" />
                ) : null}
                <p className="text-xs uppercase tracking-[0.18em] text-[#9ed8ff]">{tech.timeline}</p>
                <p className="mt-2 font-display text-2xl text-white">{tech.title.split("(")[0].trim()}</p>
                <p className="mt-2 text-sm text-slate-300">Commercial threshold projected around {tech.timeline}.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function SbspDiagram() {
  return (
    <svg viewBox="0 0 320 160" className="relative z-10 h-full w-full">
      <rect x="126" y="26" width="68" height="30" rx="4" fill="rgba(125, 211, 252, 0.9)" />
      <rect x="86" y="30" width="34" height="22" rx="3" fill="rgba(0, 212, 255, 0.62)" />
      <rect x="200" y="30" width="34" height="22" rx="3" fill="rgba(0, 212, 255, 0.62)" />
      <path d="M160 56 L160 128" stroke="rgba(191,95,255,0.8)" strokeWidth="3" strokeDasharray="5 5" className="animate-pulse" />
      <ellipse cx="160" cy="136" rx="56" ry="16" fill="rgba(0, 212, 255, 0.22)" />
      <ellipse cx="160" cy="136" rx="38" ry="10" fill="rgba(191,95,255,0.18)" />
    </svg>
  );
}

function LunarDiagram() {
  return (
    <svg viewBox="0 0 320 160" className="relative z-10 h-full w-full">
      <rect x="0" y="112" width="320" height="48" fill="rgba(148, 163, 184, 0.12)" />
      <circle cx="84" cy="82" r="44" fill="rgba(226, 232, 240, 0.18)" />
      <circle cx="88" cy="80" r="24" fill="rgba(191,95,255,0.15)" />
      <rect x="180" y="72" width="62" height="16" rx="3" fill="rgba(0,212,255,0.6)" />
      <rect x="196" y="58" width="28" height="14" rx="2" fill="rgba(191,95,255,0.75)" className="animate-pulse" />
      <path d="M210 88 L210 116" stroke="rgba(0,212,255,0.66)" strokeWidth="3" />
    </svg>
  );
}

function OrbitalWindDiagram() {
  return (
    <svg viewBox="0 0 320 160" className="relative z-10 h-full w-full">
      <path d="M34 46 C 80 20, 136 20, 188 42" stroke="rgba(0,212,255,0.55)" strokeWidth="4" fill="none" />
      <path d="M72 86 C 122 64, 184 64, 246 88" stroke="rgba(191,95,255,0.52)" strokeWidth="4" fill="none" />
      <line x1="146" y1="42" x2="146" y2="124" stroke="rgba(148, 163, 184, 0.55)" strokeWidth="2" />
      <line x1="178" y1="56" x2="178" y2="124" stroke="rgba(148, 163, 184, 0.55)" strokeWidth="2" />
      <circle cx="146" cy="42" r="13" fill="rgba(0,212,255,0.55)" className="animate-pulse" />
      <circle cx="178" cy="56" r="12" fill="rgba(191,95,255,0.55)" className="animate-pulse" />
    </svg>
  );
}
