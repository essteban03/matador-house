"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#34d399", "#22d3ee", "#fbbf24", "#a78bfa", "#fb7185"];

function deterministicUnit(index: number, salt: number): number {
  const x = Math.sin((index + 1) * (salt + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function ConfettiBurst({ active }: { active: boolean }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 46 }).map((_, i) => {
      const driftX = (deterministicUnit(i, 1) * 2 - 1) * 180;
      const fallY = 260 + deterministicUnit(i, 2) * 220;
      const rotate = deterministicUnit(i, 3) * 360;
      const delay = deterministicUnit(i, 4) * 0.2;
      const duration = 0.95 + deterministicUnit(i, 5) * 0.6;
      const color = COLORS[i % COLORS.length];
      const width = 6 + Math.floor(deterministicUnit(i, 6) * 8);
      const height = 6 + Math.floor(deterministicUnit(i, 7) * 10);
      return { id: i, driftX, fallY, rotate, delay, duration, color, width, height };
    });
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-[2px]"
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
          }}
          initial={{ y: -24, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: p.fallY,
            x: p.driftX,
            opacity: [0, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

