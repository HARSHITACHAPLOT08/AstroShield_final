"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Rocket, UserCircle2 } from "lucide-react";
import { EarthScene } from "@/components/visuals/earth-scene";
import { SpaceBackground } from "@/components/visuals/space-background";
import { GlowButton } from "@/components/shared/glow-button";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AuthTab = "login" | "register" | "forgot";

const authRouteMap: Record<AuthTab, Route> = {
  login: "/login",
  register: "/register",
  forgot: "/forgot-password"
};

const authMessages: Record<AuthTab, string> = {
  login: "Authenticate into the AstroShield mission-control environment.",
  register: "Provision new operator credentials and assign mission roles.",
  forgot: "Request a secure recovery link and restore command access."
};

const authSuccessMessages: Record<AuthTab, string> = {
  login: "Mission handshake complete. Demo credentials accepted.",
  register: "Operator profile created. Routing you into mission control.",
  forgot: "Recovery uplink sent. Check your work inbox for the secure link."
};

export function AuthConsole({ initialTab = "login" }: { initialTab?: AuthTab }) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState<AuthTab | null>(null);
  const router = useRouter();

  useEffect(() => {
    setTab(initialTab);
    setSubmitted(null);
  }, [initialTab]);

  const helperText = useMemo(() => authMessages[tab], [tab]);

  const handleTabChange = (value: string) => {
    const nextTab = value as AuthTab;
    setTab(nextTab);
    setSubmitted(null);
    router.push(authRouteMap[nextTab]);
  };

  const handleAuthSuccess = (nextTab: AuthTab) => {
    setSubmitted(nextTab);

    if (nextTab === "forgot") {
      return;
    }

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1600px] gap-10 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,1.02fr)_540px] lg:py-8">
        <div className="flex min-h-full flex-col">
          <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[30px] px-5 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-300 to-blue-600 text-slate-950 shadow-glow">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl tracking-[0.08em] text-white">AstroShield</p>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Secure Mission Access</p>
              </div>
            </Link>

            <div className="flex flex-wrap gap-3">
              <GlowButton variant="secondary" onClick={() => router.push("/dashboard")}>
                Live Demo
              </GlowButton>
              <GlowButton onClick={() => router.push("/profile")}>
                Operator Profile
                <ArrowRight className="h-4 w-4" />
              </GlowButton>
            </div>
          </header>

          <div className="flex flex-1 items-center">
            <div className="w-full py-8 lg:py-10">
              <Badge className="border-cyan-300/20 bg-cyan-400/10 text-cyan-200">Immersive Operator Access</Badge>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.94] text-white md:text-6xl">
                Command the storm before it commands you.
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
                AstroShield brings orbital telemetry, AI forecasts, and operational playbooks into one aligned command surface.
              </p>
              <div className="mt-10 grid max-w-3xl gap-4 md:grid-cols-3">
                {[
                  ["642 km/s", "Solar wind"],
                  ["94%", "Model accuracy"],
                  ["07", "Active alerts"]
                ].map(([value, label]) => (
                  <GlassCard key={label} className="bg-gradient-to-br from-cyan-400/10 via-slate-950/45 to-blue-500/10">
                    <p className="font-display text-3xl text-white">{value}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.22em] text-slate-400">{label}</p>
                  </GlassCard>
                ))}
              </div>
              <div className="mt-10">
                <EarthScene compact />
              </div>
            </div>
          </div>
        </div>

        <GlassCard className="mx-auto my-auto w-full max-w-[540px] bg-gradient-to-br from-slate-950/80 via-slate-950/55 to-cyan-500/10 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl text-white">AstroShield</p>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Operator Clearance Console</p>
            </div>
          </div>

          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Recover</TabsTrigger>
            </TabsList>

            <motion.p
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-sm text-slate-300"
            >
              {helperText}
            </motion.p>

            <TabsContent value="login" className="mt-6 space-y-4">
              <Input placeholder="Email" type="email" />
              <div className="relative">
                <Input placeholder="Password" type={showPassword ? "text" : "password"} className="pr-12" />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Demo access available</span>
                <Link href="/forgot-password" className="text-cyan-300 transition hover:text-cyan-200">
                  Forgot password?
                </Link>
              </div>
              <GlowButton size="lg" className="w-full" onClick={() => handleAuthSuccess("login")}>
                <Lock className="h-4 w-4" />
                Login to Mission Control
              </GlowButton>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-4">
              <Input placeholder="Name" />
              <Input placeholder="Email" type="email" />
              <div className="relative">
                <Input placeholder="Password" type={showPassword ? "text" : "password"} className="pr-12" />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Input placeholder="Confirm password" type={showPassword ? "text" : "password"} />
              <Select defaultValue="Analyst">
                <SelectTrigger>
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <GlowButton size="lg" className="w-full" onClick={() => handleAuthSuccess("register")}>
                <UserCircle2 className="h-4 w-4" />
                Create Secure Access
              </GlowButton>
            </TabsContent>

            <TabsContent value="forgot" className="mt-6 space-y-4">
              <Input placeholder="Work email" type="email" />
              <GlowButton size="lg" className="w-full" onClick={() => handleAuthSuccess("forgot")}>
                <Mail className="h-4 w-4" />
                Send Recovery Link
              </GlowButton>
              <p className="text-sm text-slate-400">
                Need a new operator account?{" "}
                <Link href="/register" className="text-cyan-300 transition hover:text-cyan-200">
                  Register here
                </Link>
                .
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <button className="rounded-2xl border border-cyan-300/15 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-950/70">
              Continue with Google
            </button>
            <button className="rounded-2xl border border-cyan-300/15 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-950/70">
              Continue with Microsoft
            </button>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100"
            >
              {authSuccessMessages[submitted]}
            </motion.div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <span>Choose a route that fits your mission access.</span>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="transition hover:text-cyan-300">
                Login
              </Link>
              <Link href="/register" className="transition hover:text-cyan-300">
                Register
              </Link>
              <Link href="/forgot-password" className="transition hover:text-cyan-300">
                Recover
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
