import {
  Activity,
  BarChart3,
  BrainCircuit,
  Grid2X2,
  Home,
  Radar,
  Satellite,
  Sparkles,
  SunMedium,
  Leaf,
  Settings,
  Shield,
  UserCircle2
} from "lucide-react";

export const appRoutes = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/live-space-pulse", label: "Live Space Pulse", icon: Radar },
  { href: "/solar-monitor", label: "Solar Monitor", icon: Activity },
  { href: "/solar-optimizer", label: "Solar Optimizer", icon: SunMedium },
  { href: "/energy-access", label: "Energy Access", icon: Leaf },
  { href: "/space-energy-future", label: "Space Energy Future", icon: Sparkles },
  { href: "/impact-dashboard", label: "Impact Dashboard", icon: BarChart3 },
  { href: "/ai-predictions", label: "AI Predictions", icon: BrainCircuit },
  { href: "/grid-risk", label: "Grid Risk", icon: Grid2X2 },
  { href: "/satellites", label: "Satellites", icon: Satellite },
  { href: "/aviation", label: "Aviation", icon: Radar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
  { href: "/login", label: "Login", icon: Settings }
] as const;
