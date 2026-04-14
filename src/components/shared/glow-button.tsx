"use client";

import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GlowButton({ className, children, ...props }: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className={cn("relative inline-flex")}>
      <span className="pointer-events-none absolute inset-0 rounded-full bg-cyan-300/30 blur-xl" />
      <Button className={cn("relative", className)} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
