"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.4,
      lerp: prefersReducedMotion ? 1 : 0.06,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaExponent: 1.8,
      wheelMultiplier: 0.84,
      touchMultiplier: 1.05,
      gestureOrientation: "vertical",
      anchors: true
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
