"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * Full-bleed bridge between cinematic hero and page canvas.
 * Angles tuned to match hero light beams (~105° / soft diagonal).
 */
export function SectionMorphDivider() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const cutAngle = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion
      ? ["polygon(0 0, 100% 0, 100% 100%, 0 100%)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"]
      : [
          "polygon(0 62%, 100% 18%, 100% 100%, 0 100%)",
          "polygon(0 48%, 100% 8%, 100% 100%, 0 100%)",
        ]
  );

  const shearGlow = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion
      ? ["translateX(0%) skewY(0deg)", "translateX(0%) skewY(0deg)"]
      : ["translateX(-8%) skewY(-10deg)", "translateX(6%) skewY(-6deg)"]
  );

  const lineOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.35, 1, 0.4]);

  return (
    <div
      ref={ref}
      className="relative -mt-px h-[4.5rem] w-screen max-w-[100vw] overflow-hidden"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[var(--mh-canvas)]" />

      <motion.div
        className="pointer-events-none absolute inset-0 origin-center"
        style={{ transform: shearGlow }}
      >
        <motion.div
          className="absolute inset-0 opacity-90"
          style={{
            clipPath: cutAngle,
            background:
              "linear-gradient(103deg, transparent 0%, rgba(103,232,249,0.14) 42%, rgba(217,70,239,0.16) 58%, transparent 100%)",
          }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent"
        style={{ opacity: lineOpacity }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-transparent via-[var(--mh-canvas)]/85 to-[var(--mh-canvas)]"
        style={{
          maskImage: "linear-gradient(to top, black 0%, black 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
