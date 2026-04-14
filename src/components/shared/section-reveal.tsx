"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionReveal({
  className,
  children,
  delay = 0
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
}
