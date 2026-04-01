"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type WavyBackgroundProps = {
  className?: string;
};

export function WavyBackground({ className }: WavyBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute -bottom-px left-1/2 h-[min(45vh,380px)] w-[200%] min-w-[1200px] -translate-x-1/2 opacity-[0.35]"
        preserveAspectRatio="none"
        viewBox="0 0 1200 320"
        aria-hidden
      >
        <defs>
          <linearGradient id="mhWaveFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.15)" />
            <stop offset="50%" stopColor="rgba(217,70,239,0.12)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.1)" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#mhWaveFill)"
          initial={{ d: "M0,200 L1200,200 L1200,320 L0,320 Z" }}
          animate={{
            d: [
              "M0,120 Q300,60 600,110 T1200,95 L1200,320 L0,320 Z",
              "M0,140 Q300,100 600,130 T1200,115 L1200,320 L0,320 Z",
              "M0,120 Q300,60 600,110 T1200,95 L1200,320 L0,320 Z",
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
        animate={{ opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
