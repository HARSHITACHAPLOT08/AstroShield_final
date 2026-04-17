"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Radar, SatelliteDish, Zap } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

type SolarPayload = {
  timestamp: string;
  kpIndex: number;
  solarWindSpeed: number;
  flareActivity: string;
};

type LogEntry = SolarPayload & { id: string };

type AlertLevel = "green" | "yellow" | "red" | "black";
type ConnectionState = "connected" | "delayed" | "reconnecting";

const POLL_MS = 5000;
const MAX_LOG = 80;
const MAX_POINTS = 24;

function alertFromKp(kpIndex: number): { level: AlertLevel; label: string; message: string } {
  if (kpIndex >= 9) {
    return {
      level: "black",
      label: "Extreme Emergency",
      message: "Global shielding protocols recommended. Immediate mitigation required."
    };
  }

  if (kpIndex >= 7) {
    return {
      level: "red",
      label: "Storm Warning",
      message: "High geomagnetic storm potential. Mission assets may be impacted."
    };
  }

  if (kpIndex >= 5) {
    return {
      level: "yellow",
      label: "Minor Disturbance",
      message: "Elevated activity observed. Continue close monitoring."
    };
  }

  return {
    level: "green",
    label: "Stable",
    message: "Solar conditions are stable across monitored sectors."
  };
}

function alertStyles(level: AlertLevel) {
  switch (level) {
    case "black":
      return {
        card: "border-fuchsia-300/60 bg-gradient-to-br from-[#2c0311] via-[#14020f] to-black text-fuchsia-100 shadow-[0_0_42px_rgba(217,70,239,0.35)]",
        dot: "bg-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.95)]",
        label: "text-fuchsia-200"
      };
    case "red":
      return {
        card: "border-rose-300/60 bg-gradient-to-br from-[#3a0914] via-[#210611] to-[#06080f] text-rose-100 shadow-[0_0_36px_rgba(244,63,94,0.28)]",
        dot: "bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.9)]",
        label: "text-rose-200"
      };
    case "yellow":
      return {
        card: "border-amber-300/45 bg-gradient-to-br from-[#2f1d05] via-[#101119] to-[#04060d] text-amber-100",
        dot: "bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.85)]",
        label: "text-amber-200"
      };
    default:
      return {
        card: "border-emerald-300/40 bg-gradient-to-br from-[#07261e] via-[#05141d] to-[#050914] text-emerald-100",
        dot: "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]",
        label: "text-emerald-200"
      };
  }
}

function formatClock(value: string) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function connectionTone(state: ConnectionState) {
  switch (state) {
    case "connected":
      return {
        card: "border-emerald-300/35 bg-emerald-500/10",
        dot: "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]",
        text: "text-emerald-200",
        label: "Connected"
      };
    case "delayed":
      return {
        card: "border-amber-300/40 bg-amber-500/10",
        dot: "bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)]",
        text: "text-amber-200",
        label: "Delayed"
      };
    default:
      return {
        card: "border-rose-300/45 bg-rose-500/12",
        dot: "bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.95)]",
        text: "text-rose-200",
        label: "Reconnecting"
      };
  }
}

export default function LiveSpacePulsePage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [extremeMode, setExtremeMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState<ConnectionState>("reconnecting");
  const [lastSuccessAt, setLastSuccessAt] = useState<number | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    const appendPayload = (payload: SolarPayload) => {
      const entry: LogEntry = {
        ...payload,
        id: `${payload.timestamp}-${Math.random().toString(36).slice(2, 9)}`
      };

      setLogs((current) => [...current.slice(-MAX_LOG + 1), entry]);
      setLoading(false);
    };

    const fetchLiveSolar = async () => {
      if (!active || extremeMode) return;

      try {
        const response = await fetch("/live-solar", { cache: "no-store" });
        if (!response.ok) throw new Error("Telemetry request failed.");
        const data = (await response.json()) as SolarPayload;
        appendPayload(data);
        setLastSuccessAt(Date.now());
        setConsecutiveFailures(0);
        setConnectionState("connected");
      } catch {
        setConsecutiveFailures((currentFailures) => {
          const nextFailures = currentFailures + 1;
          setConnectionState(nextFailures >= 2 ? "reconnecting" : "delayed");
          return nextFailures;
        });
      }
    };

    void fetchLiveSolar();
    const interval = window.setInterval(fetchLiveSolar, POLL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [extremeMode]);

  useEffect(() => {
    if (!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (extremeMode) return;

    const watchdog = window.setInterval(() => {
      if (!lastSuccessAt) return;
      if (Date.now() - lastSuccessAt > POLL_MS * 2.4 && connectionState === "connected") {
        setConnectionState("delayed");
      }
    }, 1000);

    return () => window.clearInterval(watchdog);
  }, [connectionState, extremeMode, lastSuccessAt]);

  const current = logs[logs.length - 1] ?? null;

  const currentAlert = useMemo(() => {
    if (!current) {
      return {
        level: "green" as AlertLevel,
        label: "Stable",
        message: "Awaiting first telemetry packet from Live Solar stream."
      };
    }

    return alertFromKp(current.kpIndex);
  }, [current]);

  const styles = alertStyles(currentAlert.level);

  const chartData = useMemo(
    () => logs.slice(-MAX_POINTS).map((entry) => ({
      time: formatClock(entry.timestamp),
      kp: entry.kpIndex,
      wind: entry.solarWindSpeed
    })),
    [logs]
  );

  const triggerExtremeEvent = () => {
    const now = new Date().toISOString();
    const emergencyPacket: SolarPayload = {
      timestamp: now,
      kpIndex: 9,
      solarWindSpeed: 1200,
      flareActivity: "X-class flare"
    };

    setExtremeMode(true);
    setLogs((currentLogs) => [
      ...currentLogs.slice(-MAX_LOG + 1),
      { ...emergencyPacket, id: `${now}-extreme` }
    ]);

    window.setTimeout(() => setExtremeMode(false), 10000);
  };

  const isActiveAlert = currentAlert.level === "red" || currentAlert.level === "black";
  const connection = connectionTone(connectionState);

  const connectionDetail = useMemo(() => {
    if (!lastSuccessAt) return "Waiting for first telemetry packet";
    const secondsAgo = Math.max(0, Math.floor((Date.now() - lastSuccessAt) / 1000));
    return `Last packet ${secondsAgo}s ago`;
  }, [lastSuccessAt, logs.length]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Live Operations"
        title="Live Space Pulse"
        description="Real-time mission telemetry stream for Kp index, solar wind, and flare evolution across active monitoring corridors."
        badge="Telemetry updates every 5s"
      />

      <GlassCard className={cn("rounded-3xl border px-4 py-3", connection.card)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              className={cn("h-3 w-3 rounded-full", connection.dot)}
              animate={{ opacity: [1, 0.28, 1], scale: [1, 1.22, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <p className={cn("text-xs uppercase tracking-[0.24em]", connection.text)}>Live Link Status</p>
              <p className="text-space-heading mt-1 font-display text-lg">{connection.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-space-section text-[11px] uppercase tracking-[0.2em] text-slate-400">Heartbeat</p>
            <p className="mt-1 text-sm text-slate-200">{connectionDetail}</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="overflow-hidden">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-space-section text-xs uppercase tracking-[0.24em]">Live Solar Activity Stream</p>
              <h2 className="text-space-heading mt-2 font-display text-3xl">Terminal Telemetry Feed</h2>
            </div>
            <SatelliteDish className="h-6 w-6 text-cyan-300" />
          </div>

          <div
            ref={terminalRef}
            className="scrollbar-thin h-[360px] overflow-y-auto rounded-2xl border border-cyan-300/15 bg-[#020914]/90 p-3 font-mono text-xs leading-6 text-cyan-100"
          >
            {loading ? (
              <p className="animate-pulse text-cyan-200/80">Booting live stream...</p>
            ) : null}

            {logs.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn(
                  "group rounded-xl border border-cyan-300/10 px-3 py-2 transition hover:border-cyan-300/25 hover:bg-cyan-500/5",
                  entry.kpIndex >= 7 && "border-rose-300/35 hover:border-rose-300/55 hover:bg-rose-500/8"
                )}
              >
                <span className="text-cyan-300">[{formatClock(entry.timestamp)}]</span>
                <span className="ml-2 text-slate-100">KP:</span>
                <span className={cn("ml-1 font-semibold", entry.kpIndex >= 7 ? "text-rose-200" : "text-cyan-100")}>{entry.kpIndex.toFixed(1)}</span>
                <span className="ml-3 text-slate-100">WIND:</span>
                <span className="ml-1 text-cyan-100">{entry.solarWindSpeed} km/s</span>
                <span className="ml-3 text-slate-100">FLARE:</span>
                <span className={cn("ml-1", entry.flareActivity.includes("X-class") ? "text-rose-200" : "text-cyan-100")}>{entry.flareActivity}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <motion.div
            animate={isActiveAlert ? { boxShadow: ["0 0 0 rgba(244,63,94,0)", "0 0 34px rgba(244,63,94,0.35)", "0 0 0 rgba(244,63,94,0)"] } : {}}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className={cn("rounded-[26px] border p-5", styles.card)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Live Alert System</p>
                <h3 className={cn("mt-2 font-display text-2xl", styles.label)}>{currentAlert.label}</h3>
              </div>
              <div className="flex items-center gap-2">
                <motion.span
                  className={cn("h-3 w-3 rounded-full", styles.dot)}
                  animate={isActiveAlert ? { opacity: [1, 0.2, 1], scale: [1, 1.22, 1] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <AlertTriangle className={cn("h-5 w-5", styles.label)} />
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-200/90">{currentAlert.message}</p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.16em] text-slate-300">
              <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                <p className="text-slate-400">Kp Index</p>
                <p className="mt-1 text-sm font-semibold text-white">{current?.kpIndex.toFixed(1) ?? "--"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                <p className="text-slate-400">Wind</p>
                <p className="mt-1 text-sm font-semibold text-white">{current?.solarWindSpeed ?? "--"} km/s</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                <p className="text-slate-400">Flare</p>
                <p className="mt-1 text-sm font-semibold text-white">{current?.flareActivity ?? "--"}</p>
              </div>
            </div>
          </motion.div>

          <GlassCard className={cn("overflow-hidden", extremeMode && "border-rose-300/45 shadow-[0_0_40px_rgba(244,63,94,0.35)]")}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-space-section text-xs uppercase tracking-[0.24em]">Storm Dynamics</p>
                <h3 className="text-space-heading mt-2 font-display text-2xl">Kp Spike Graph</h3>
              </div>
              <Radar className={cn("h-6 w-6 text-cyan-300", extremeMode && "text-rose-300")} />
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" minTickGap={18} />
                  <YAxis stroke="#94a3b8" domain={[0, 9]} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(34,211,238,0.2)" }} />
                  <Line type="monotone" dataKey="kp" stroke={extremeMode ? "#fb7185" : "#22d3ee"} strokeWidth={2.6} dot={false} />
                  <Line type="monotone" dataKey="wind" stroke={extremeMode ? "#f472b6" : "#a78bfa"} strokeWidth={1.9} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={triggerExtremeEvent}
              className={cn(
                "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition",
                extremeMode
                  ? "border-rose-300/60 bg-rose-500/25 text-rose-100 shadow-[0_0_26px_rgba(244,63,94,0.35)]"
                  : "border-cyan-300/30 bg-cyan-400/12 text-cyan-100 hover:border-cyan-200/55 hover:shadow-[0_0_18px_rgba(34,211,238,0.25)]"
              )}
            >
              <Zap className="h-4 w-4" />
              Simulate Extreme Event
            </motion.button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
