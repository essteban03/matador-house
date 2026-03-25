"use client";

import { useMemo } from "react";
import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ShardDef = {
  id: string;
  d: string;
  fill: string;
  dx: number;
  dy: number;
  rot: number;
  delay: number;
};

const SHARDS: ShardDef[] = [
  {
    id: "s0",
    d: "M120 78 188 22 208 52 152 88 Z",
    fill: "url(#mhShardA)",
    dx: 42,
    dy: -36,
    rot: 22,
    delay: 0,
  },
  {
    id: "s1",
    d: "M120 78 48 26 32 58 96 96 Z",
    fill: "url(#mhShardB)",
    dx: -46,
    dy: -32,
    rot: -18,
    delay: 0.04,
  },
  {
    id: "s2",
    d: "M120 82 200 96 172 128 88 108 Z",
    fill: "url(#mhShardA)",
    dx: 38,
    dy: 28,
    rot: 16,
    delay: 0.08,
  },
  {
    id: "s3",
    d: "M120 82 40 102 68 134 92 110 Z",
    fill: "url(#mhShardB)",
    dx: -40,
    dy: 34,
    rot: -14,
    delay: 0.02,
  },
  {
    id: "s4",
    d: "M120 40 150 12 176 34 138 48 Z",
    fill: "url(#mhShardC)",
    dx: 18,
    dy: -52,
    rot: 10,
    delay: 0.06,
  },
  {
    id: "s5",
    d: "M120 40 90 12 64 34 102 48 Z",
    fill: "url(#mhShardC)",
    dx: -20,
    dy: -50,
    rot: -12,
    delay: 0.1,
  },
  {
    id: "s6",
    d: "M120 118 88 132 104 148 132 128 Z",
    fill: "url(#mhShardA)",
    dx: -8,
    dy: 46,
    rot: -8,
    delay: 0.12,
  },
  {
    id: "s7",
    d: "M120 118 148 132 136 148 108 128 Z",
    fill: "url(#mhShardB)",
    dx: 10,
    dy: 44,
    rot: 9,
    delay: 0.14,
  },
  {
    id: "s8",
    d: "M178 72 220 64 214 96 186 92 Z",
    fill: "url(#mhShardC)",
    dx: 58,
    dy: -6,
    rot: 24,
    delay: 0.03,
  },
  {
    id: "s9",
    d: "M62 72 20 64 26 96 54 92 Z",
    fill: "url(#mhShardC)",
    dx: -58,
    dy: -8,
    rot: -22,
    delay: 0.05,
  },
];

function Shard({
  def,
  progress,
  reducedMotion,
}: {
  def: ShardDef;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const rangeEnd = 1 - def.delay;
  const x = useTransform(
    progress,
    [0, rangeEnd],
    reducedMotion ? [0, 0] : [0, def.dx]
  );
  const y = useTransform(
    progress,
    [0, rangeEnd],
    reducedMotion ? [0, 0] : [0, def.dy]
  );
  const rotate = useTransform(
    progress,
    [0, rangeEnd],
    reducedMotion ? [0, 0] : [0, def.rot]
  );
  const opacity = useTransform(
    progress,
    [0, 0.55, 1],
    reducedMotion ? [1, 1, 1] : [1, 0.55, 0.08]
  );

  return (
    <motion.g
      style={{
        x,
        y,
        rotate,
        opacity,
        transformOrigin: "120px 80px",
      }}
    >
      <path d={def.d} fill={def.fill} />
    </motion.g>
  );
}

type MatadorScrollMarkProps = {
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
  className?: string;
};

export function MatadorScrollMark({
  scrollYProgress,
  reducedMotion,
  className,
}: MatadorScrollMarkProps) {
  const centerOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reducedMotion ? [1, 1, 1] : [1, 0.35, 0]
  );

  const shardMemo = useMemo(() => SHARDS, []);

  return (
    <svg
      className={className}
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="mhShardA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="mhShardB" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="mhShardC" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {shardMemo.map((def) => (
        <Shard
          key={def.id}
          def={def}
          progress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
      ))}
      <motion.g style={{ opacity: centerOpacity }}>
        <path
          fill="url(#mhShardA)"
          d="M86 118V52h14l22 38 22-38h14v66h-14V74l-18 32h-20L100 74v44H86Z"
        />
        <path
          fill="url(#mhShardB)"
          d="M168 52h16v66h-16V52Z"
          opacity={0.92}
        />
      </motion.g>
    </svg>
  );
}
