import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { OrbitGlowTrails } from "@/components/visuals/orbit-glow-trails";
import { SpaceBackground } from "@/components/visuals/space-background";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <OrbitGlowTrails className="z-[1] opacity-60" />
      <div className="relative z-10 mx-auto flex max-w-[1680px] items-start gap-5 px-4 py-4 lg:px-6">
        <Sidebar />
        <div className="min-w-0 flex-1 pb-28 lg:pb-6">
          <Topbar />
          <main className="space-y-7 pt-6">{children}</main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
