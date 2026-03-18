"use client";

import { motion } from "framer-motion";

type HeroProps = {
  onViewOffersClick?: () => void;
};

export function Hero({ onViewOffersClick }: HeroProps) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl border border-zinc-800 bg-black">
      {/* Video de fondo */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://static-assets-prod.epicgames.com/vanilla/static/en-US/trailer_assets/gtavi_short_vp9.webm"
          type="video/webm"
        />
      </video>

      {/* Overlay oscuro para legibilidad */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/60" />

      {/* Contenido centrado */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[380px] sm:px-10 lg:min-h-[420px]"
      >
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-300/80">
          Tienda digital para PlayStation
        </p>
        <h1 className="max-w-3xl bg-gradient-to-r from-emerald-200 via-cyan-200 to-amber-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
          MATADOR HOUSE: EL PARAÍSO DEL GAMER
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-zinc-200 sm:text-base">
          Cuentas principales y secundarias con entrega inmediata en todo
          Ecuador. Activación técnica guiada, soporte 24/7 y un catálogo pensado
          para jugadores exigentes.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            type="button"
            onClick={onViewOffersClick}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(34,197,94,0.9)] hover:from-emerald-400 hover:via-cyan-400 hover:to-sky-400"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Ver ofertas</span>
            <span className="text-lg leading-none">↓</span>
          </motion.button>
          <p className="text-[11px] text-zinc-400">
            Catálogo actualizado diariamente con los lanzamientos más esperados.
          </p>
        </div>
      </motion.div>
    </section>
  );
}


