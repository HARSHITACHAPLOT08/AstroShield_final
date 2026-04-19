"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { warmPlatformData } from "@/lib/api/platform-client";

export function RoutePrefetcher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const runPrefetch = () => {
      const targets = appRoutes
        .map((route) => route.href)
        .filter((href) => href !== "/login" && href !== pathname);

      for (const href of targets) {
        if (cancelled) break;
        router.prefetch(href);
      }

      void warmPlatformData();
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(runPrefetch, { timeout: 1000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(runPrefetch, 200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, [pathname, router]);

  return null;
}
