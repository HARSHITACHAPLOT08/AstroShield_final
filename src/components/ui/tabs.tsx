"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex rounded-full border border-cyan-300/15 bg-slate-950/60 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition duration-300 hover:text-white data-[state=active]:bg-cyan-300/90 data-[state=active]:text-slate-950 data-[state=active]:shadow-[0_0_22px_rgba(34,211,238,0.28)]",
        className
      )}
      {...props}
    />
  );
}
