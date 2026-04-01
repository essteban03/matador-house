"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type VortexProps = {
  className?: string;
};

export function Vortex({ className }: VortexProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl"
        animate={{ x: [0, 34, 0], y: [0, -20, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-7rem] top-16 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 16, 0], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[42%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-400/12 blur-3xl"
        animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.2),transparent_32%),linear-gradient(180deg,#04050b_0%,#070a14_52%,#06070c_100%)]" />
    </div>
  );
}
