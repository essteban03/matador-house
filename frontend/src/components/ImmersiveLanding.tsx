"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { SparklesCore } from "./ui/sparkles-core";
import { Vortex } from "./ui/vortex";
import { WavyBackground } from "./ui/wavy-background";
import { usePressRipple } from "./ui/usePressRipple";

type ImmersiveLandingProps = {
  onEnterCatalog: () => void;
};

export function ImmersiveLanding({ onEnterCatalog }: ImmersiveLandingProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const triggerRipple = usePressRipple();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgParallax = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : 120]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : -80]
  );
  const titleBlur = useTransform(
    scrollYProgress,
    [0, 0.65],
    reducedMotion ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(10px)"]
  );
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 0.85, 0]);
  const beamRotate = useTransform(scrollYProgress, [0, 1], ["-6deg", "4deg"]);
  const beamRotate2 = useTransform(scrollYProgress, [0, 1], ["8deg", "-5deg"]);

  const letters = "MATADOR HOUSE".split("");

  return (
    <section
      ref={ref}
      className="relative mb-6 min-h-[100dvh] w-screen max-w-[100vw] overflow-hidden"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
    >
      <motion.div style={{ y: bgParallax }} className="absolute inset-0 z-0">
        <Vortex className="h-[120%]" />
        <WavyBackground />
        <SparklesCore className="h-full opacity-60" count={36} />
        <div className="absolute inset-0 mh-grain opacity-[0.14] mix-blend-overlay" />
        <motion.div
          aria-hidden
          style={{ rotate: beamRotate }}
          className="pointer-events-none absolute -left-1/4 top-1/4 h-[140%] w-[90%] bg-[linear-gradient(105deg,transparent_35%,rgba(103,232,249,0.07)_48%,rgba(217,70,239,0.06)_52%,transparent_65%)]"
        />
        <motion.div
          aria-hidden
          style={{ rotate: beamRotate2 }}
          className="pointer-events-none absolute -right-1/3 bottom-0 h-[100%] w-[70%] bg-[linear-gradient(-75deg,transparent_40%,rgba(217,70,239,0.08)_50%,transparent_60%)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,211,238,0.08),transparent_50%),radial-gradient(ellipse_70%_45%_at_80%_80%,rgba(217,70,239,0.1),transparent_55%)]" />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-[var(--mh-canvas)] via-[var(--mh-canvas)]/55 to-transparent"
        style={{
          maskImage:
            "linear-gradient(to top, black 0%, black 72%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-center px-6 pb-36 pt-24 sm:px-10 md:px-16 lg:px-20">
        <motion.div
          initial={{ opacity: 0, filter: reducedMotion ? "blur(0px)" : "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-cyan-200/65 sm:text-[11px]"
          >
            Tienda online · Juegos digitales PS4 y PS5
          </motion.p>

          <motion.h1
            style={{ y: titleY, opacity: titleOpacity, filter: titleBlur }}
            className="font-[family-name:var(--font-display)] leading-[0.82] tracking-[-0.02em]"
          >
            {letters.map((letter, idx) => (
              <motion.span
                key={`${letter}-${idx}`}
                className={`inline-block ${letter === " " ? "mr-[0.12em]" : ""} text-6xl font-semibold sm:text-7xl md:text-8xl lg:text-9xl`}
                initial={{
                  opacity: 0,
                  y: reducedMotion ? 0 : 48,
                  scale: reducedMotion ? 1 : 0.92,
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: reducedMotion ? 0 : 0.12 + idx * 0.028,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter === " " ? (
                  "\u00A0"
                ) : (
                  <span
                    className="mh-gradient-text inline-block [text-shadow:0_0_60px_rgba(103,232,249,0.25),0_0_80px_rgba(217,70,239,0.18)]"
                  >
                    {letter}
                  </span>
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base font-light leading-relaxed text-zinc-300 sm:text-lg"
          >
            Compra en la web con el catálogo al día: eliges, pagas con tranquilidad
            y te contactamos al instante por WhatsApp con tu entrega. Activación
            guiada y soporte humano en Ecuador, con contacto directo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
          >
            <motion.button
              type="button"
              onClick={() => {
                onEnterCatalog();
              }}
              onPointerDown={(event) => triggerRipple(event)}
              className="mh-pressable group relative overflow-hidden rounded-full border border-cyan-300/50 bg-gradient-to-r from-cyan-400/90 via-cyan-300 to-fuchsia-400/90 px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_40px_rgba(34,211,238,0.35),0_0_60px_rgba(217,70,239,0.2)] transition-shadow duration-300 hover:shadow-[0_0_48px_rgba(217,70,239,0.45),0_0_32px_rgba(34,211,238,0.4)]"
              whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            >
              <span className="relative z-10">Entrar al catálogo</span>
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-white/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
            </motion.button>

            <Link
              href="/guia"
              aria-label="Guía de instalación"
              onPointerDown={(event) => triggerRipple(event)}
              className="group relative -ml-1 inline-flex items-center"
            >
              <svg
                width={140}
                height={44}
                viewBox="0 0 140 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-cyan-400/45 transition-colors duration-300 group-hover:text-fuchsia-300/70"
                aria-hidden
              >
                <motion.path
                  d="M4 28 Q 70 6, 126 20"
                  stroke="currentColor"
                  strokeWidth={1.1}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.5 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.95, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <motion.span
                className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors duration-300 group-hover:text-fuchsia-200"
                whileHover={reducedMotion ? undefined : { scale: 1.08 }}
                whileTap={reducedMotion ? undefined : { scale: 0.96 }}
              >
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                  aria-hidden
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M8 7h8M8 11h6" />
                </svg>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Desliza
          </span>
          <motion.div
            className="h-12 w-px bg-gradient-to-b from-cyan-400/50 to-fuchsia-400/30"
            animate={reducedMotion ? undefined : { scaleY: [1, 0.6, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
