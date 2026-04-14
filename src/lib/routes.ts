import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Grid2X2,
  Home,
  Radar,
  Satellite,
  Settings,
  Shield,
  UserCircle2
} from "lucide-react";

export const appRoutes = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/solar-monitor", label: "Solar Monitor", icon: Activity },
  { href: "/ai-predictions", label: "AI Predictions", icon: BrainCircuit },
  { href: "/grid-risk", label: "Grid Risk", icon: Grid2X2 },
  { href: "/satellites", label: "Satellites", icon: Satellite },
  { href: "/aviation", label: "Aviation", icon: Radar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
  { href: "/login", label: "Login", icon: Settings }
] as const;
