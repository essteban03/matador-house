"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SparklesCoreProps = {
  className?: string;
  count?: number;
};

export function SparklesCore({ className, count = 28 }: SparklesCoreProps) {
  const sparkles = Array.from({ length: count }, (_, idx) => ({
    id: idx,
    left: `${(idx * 37) % 100}%`,
    top: `${(idx * 53) % 100}%`,
    delay: (idx % 9) * 0.23,
    duration: 2.6 + (idx % 7) * 0.45,
    size: 1 + (idx % 3),
  }));

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute rounded-full bg-cyan-200/80"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            boxShadow: "0 0 10px rgba(103,232,249,0.75), 0 0 16px rgba(217,70,239,0.45)",
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.6, 1.2, 0.6],
            y: [0, -14, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
