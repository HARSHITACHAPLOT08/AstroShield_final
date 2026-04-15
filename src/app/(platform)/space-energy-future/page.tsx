"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";

type TechCard = {
  id: string;
  title: string;
  subtitle: string;
  stats: string[];
  trl: number;
  timeline: string;
};

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
    <div className="space-y-6">
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
          >
            <GlassCard className="group h-full min-h-[560px] border-[#00d4ff]/30 bg-gradient-to-br from-[#0b1238]/90 via-[#170a36]/75 to-[#0b163f]/85">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.2em] text-[#9ed8ff]">{tech.title}</p>
                <Badge className="border-[#bf5fff]/35 bg-[#bf5fff]/15 text-[#f0d4ff]">TRL {tech.trl}/9</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{tech.subtitle}</p>

              <div className="mt-6 rounded-[22px] border border-[#00d4ff]/20 bg-[#060f26]/75 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#84dfff]">Technical diagram</p>
                <div className="mt-3 h-[190px] overflow-hidden rounded-[16px] border border-[#bf5fff]/20 bg-[#040913] p-4">
                  {tech.id === "sbsp" ? <SbspDiagram /> : null}
                  {tech.id === "helium3" ? <LunarDiagram /> : null}
                  {tech.id === "orbital-wind" ? <OrbitalWindDiagram /> : null}
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {tech.stats.map((stat) => (
                  <li key={stat} className="rounded-[14px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
                    {stat}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-[18px] border border-[#00d4ff]/20 bg-[#08122f]/85 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#9ed8ff]">Readiness Level</span>
                  <span className="font-display text-xl text-white">{tech.trl}/9</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full animate-shimmer rounded-full bg-[linear-gradient(90deg,#00d4ff_0%,#bf5fff_45%,#7af0ff_100%)] bg-[length:200%_100%]"
                    style={{ width: `${(tech.trl / 9) * 100}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="border-[#00d4ff]/30 bg-gradient-to-r from-[#081334]/90 via-[#170c38]/70 to-[#061835]/90">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#9ed8ff]">Technology Timeline</p>
            <p className="mt-2 text-sm text-slate-300">Projected commercial viability windows for each pathway.</p>
          </div>
          <Badge className="border-[#bf5fff]/30 bg-[#bf5fff]/15 text-[#f0d4ff]">Roadmap 2030-2050+</Badge>
        </div>

        <div className="scrollbar-thin mt-5 overflow-x-auto pb-2">
          <div className="flex min-w-[860px] items-center gap-4">
            {technologies.map((tech) => (
              <div key={tech.id} className="min-w-[240px] rounded-[20px] border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#9ed8ff]">{tech.timeline}</p>
                <p className="mt-2 font-display text-2xl text-white">{tech.title.split("(")[0].trim()}</p>
                <p className="mt-2 text-sm text-slate-300">Commercial threshold projected around {tech.timeline}.</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function SbspDiagram() {
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full">
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
    <svg viewBox="0 0 320 160" className="h-full w-full">
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
    <svg viewBox="0 0 320 160" className="h-full w-full">
      <path d="M34 46 C 80 20, 136 20, 188 42" stroke="rgba(0,212,255,0.55)" strokeWidth="4" fill="none" />
      <path d="M72 86 C 122 64, 184 64, 246 88" stroke="rgba(191,95,255,0.52)" strokeWidth="4" fill="none" />
      <line x1="146" y1="42" x2="146" y2="124" stroke="rgba(148, 163, 184, 0.55)" strokeWidth="2" />
      <line x1="178" y1="56" x2="178" y2="124" stroke="rgba(148, 163, 184, 0.55)" strokeWidth="2" />
      <circle cx="146" cy="42" r="13" fill="rgba(0,212,255,0.55)" className="animate-pulse" />
      <circle cx="178" cy="56" r="12" fill="rgba(191,95,255,0.55)" className="animate-pulse" />
    </svg>
  );
}
