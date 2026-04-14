"use client";

import { useEffect, useRef } from "react";

export function SpaceBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.0008 + 0.0002
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(2, 6, 23, 0.16)";
      context.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > 1.1) {
          star.y = -0.1;
          star.x = Math.random();
        }

        const x = star.x * width;
        const y = star.y * height;
        const radius = star.z * 1.6;
        context.beginPath();
        context.fillStyle = `rgba(125, 211, 252, ${0.3 + star.z * 0.7})`;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 opacity-70" />
      <div className="starfield fixed inset-0 z-0" />
    </>
  );
}
