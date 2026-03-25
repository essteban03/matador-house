"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MatadorScrollMark } from "./MatadorScrollMark";

type HeroProps = {
  onViewOffersClick?: () => void;
};

export function Hero({ onViewOffersClick }: HeroProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const gridY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 36]
  );
  const orbY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 56]
  );
  const orbSlowY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 32]
  );
  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    reducedMotion ? [0.55, 0.55] : [0.62, 0.22]
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 18]
  );
  const contentScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [1, 0.992]
  );
  const markScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [1, 1.04]
  );

  return (
    <section
      ref={containerRef}
      className="relative mx-auto mb-8 w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-800/70 bg-[#060708]"
    >
      {/* Capa base */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(700px 420px at 14% 12%, rgba(16,185,129,0.11), transparent 52%), radial-gradient(560px 380px at 92% 22%, rgba(6,182,212,0.09), transparent 48%), radial-gradient(480px 320px at 50% 100%, rgba(245,158,11,0.05), transparent 46%), linear-gradient(180deg, #050506 0%, #0b0c0f 45%, #08090b 100%)",
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.18]"
        style={{ y: gridY }}
      >
        <div
          className="absolute inset-0 bg-[length:40px_40px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 1px)",
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-6 z-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl sm:h-56 sm:w-56 sm:blur-3xl"
        style={{ y: orbSlowY }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-10 z-0 h-52 w-52 rounded-full bg-cyan-500/18 blur-2xl sm:h-64 sm:w-64 sm:blur-3xl"
        style={{ y: orbY }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-1/2 z-0 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-400/8 blur-2xl sm:blur-3xl"
        style={{ y: orbY }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 mh-grain opacity-[0.12] mix-blend-overlay"
        aria-hidden
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/45 to-zinc-950/25"
        style={{ opacity: vignetteOpacity }}
      />

      <motion.div
        initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reducedMotion ? 0.2 : 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 grid min-h-[260px] grid-cols-1 items-center gap-6 px-5 py-7 sm:min-h-[280px] sm:px-8 sm:py-8 lg:grid-cols-[1fr_minmax(200px,280px)] lg:gap-10 lg:py-7"
        style={{ y: contentY, scale: contentScale }}
      >
        <div className="order-2 flex flex-col text-center lg:order-1 lg:text-left">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500 sm:text-[11px]">
            Tienda digital para PlayStation
          </p>
          <h1 className="font-[family-name:var(--font-display)] max-w-xl text-3xl font-normal uppercase leading-[0.96] tracking-[0.02em] text-zinc-50 sm:text-4xl lg:mx-0 lg:max-w-none lg:text-[2.75rem]">
            <span className="block text-zinc-100">Matador House</span>
            <span className="mt-1.5 block bg-gradient-to-r from-emerald-300 via-cyan-200 to-amber-200 bg-clip-text text-[0.56em] font-[family-name:var(--font-geist-sans)] font-semibold normal-case tracking-tight text-transparent sm:text-[0.54em]">
              El paraíso del gamer
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-[15px] lg:mx-0">
            Cuentas principales y secundarias con entrega inmediata en todo
            Ecuador. Activación técnica guiada, soporte 24/7 y un catálogo
            pensado para jugadores exigentes.
          </p>

          <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:mx-0 lg:max-w-lg">
            <motion.button
              type="button"
              onClick={onViewOffersClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_4px_24px_rgba(16,185,129,0.35)] transition-colors hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400"
              whileHover={reducedMotion ? undefined : { scale: 1.02, y: -1 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            >
              <span>Ver ofertas</span>
              <span className="text-base leading-none" aria-hidden>
                ↓
              </span>
            </motion.button>
            <p className="text-center text-[11px] leading-snug text-zinc-500 sm:flex-1 sm:text-left lg:text-left">
              Catálogo actualizado a diario. Sigue bajando para explorar.
            </p>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <motion.div
            className="w-[min(200px,48vw)] opacity-95 sm:w-[220px] lg:w-[min(280px,100%)]"
            style={{ scale: markScale }}
          >
            <MatadorScrollMark
              scrollYProgress={scrollYProgress}
              reducedMotion={reducedMotion}
              className="h-auto w-full drop-shadow-[0_0_28px_rgba(45,212,191,0.18)]"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
