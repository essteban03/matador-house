"use client";

import type { MouseEvent, PointerEvent } from "react";
import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type GameCardVariant = "catalog" | "offer";

type GameCardProps = {
  href: string;
  titulo: string;
  imagenUrl?: string | null;
  consola: string;
  categoria?: string | null;
  genero?: string | null;
  precioFormatted: string;
  precioAntesFormatted?: string;
  variant?: GameCardVariant;
  index?: number;
  enStock?: boolean;
  pesoGb?: number | null;
  onPointerDown?: (event: PointerEvent<HTMLAnchorElement>) => void;
};

export function GameCard({
  href,
  titulo,
  imagenUrl,
  consola,
  categoria,
  genero,
  precioFormatted,
  precioAntesFormatted,
  variant = "catalog",
  index = 0,
  enStock = true,
  onPointerDown,
}: GameCardProps) {
  const isOffer = variant === "offer";
  const reducedMotion = useReducedMotion() ?? false;
  const shellRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: shellRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 26 : 12, index % 2 === 0 ? -18 : -34]
  );
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 240, damping: 26, mass: 0.2 });
  const smy = useSpring(my, { stiffness: 240, damping: 26, mass: 0.2 });
  const rotateY = useTransform(smx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(smy, [-0.5, 0.5], [6, -6]);
  const imageShiftX = useTransform(smx, [-0.5, 0.5], [-8, 8]);
  const imageShiftY = useTransform(smy, [-0.5, 0.5], [-6, 6]);
  const textShiftX = useTransform(smx, [-0.5, 0.5], [-4, 4]);
  const textShiftY = useTransform(smy, [-0.5, 0.5], [-3, 3]);
  const priceShiftX = useTransform(smx, [-0.5, 0.5], [-6, 6]);
  const priceShiftY = useTransform(smy, [-0.5, 0.5], [-5, 5]);
  const shape = ["a", "b", "c", "d"][index % 4];
  const titleSize = "text-lg sm:text-xl";

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const yAxis = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(x);
    my.set(yAxis);
    event.currentTarget.style.setProperty("--cursor-x", `${((x + 0.5) * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--cursor-y", `${((yAxis + 0.5) * 100).toFixed(2)}%`);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    shellRef.current?.style.setProperty("--cursor-x", "50%");
    shellRef.current?.style.setProperty("--cursor-y", "50%");
  };

  return (
    <motion.div
      ref={shellRef}
      style={reducedMotion ? { y } : { y, rotateX, rotateY, transformPerspective: 1000 }}
      className="relative h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        onPointerDown={onPointerDown}
        className="mh-organic-card mh-game-card mh-pressable group relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.8rem] p-0 outline-none ring-offset-2 ring-offset-[var(--mh-canvas)] transition-transform duration-150 ease-out hover:z-20 hover:scale-[1.1] focus-visible:ring-2 focus-visible:ring-cyan-400/50"
        data-shape={shape}
      >
        <motion.div
          className="absolute inset-0"
          style={reducedMotion ? undefined : { x: imageShiftX, y: imageShiftY }}
        >
          {imagenUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagenUrl}
              alt={titulo}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-600">
              Sin imagen
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(103,232,249,0.25),transparent_38%),radial-gradient(circle_at_86%_8%,rgba(217,70,239,0.28),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.72)_85%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute -inset-x-8 top-1/3 h-[2px] rotate-[8deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 blur-[1px] transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-6" />
        </motion.div>

        <div className="relative z-10 flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                consola === "PS5"
                  ? "bg-cyan-400/85 text-black"
                  : "bg-fuchsia-400/85 text-black"
              }`}
            >
              {consola}
            </span>
            {isOffer && (
              <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-200/95 backdrop-blur-sm">
                Oferta
              </span>
            )}
          </div>

          <motion.div
            className="space-y-2"
            style={reducedMotion ? undefined : { x: textShiftX, y: textShiftY }}
          >
            <h3
              className={`mh-organic-title max-w-[88%] leading-[1.05] font-semibold tracking-tight text-white/95 [text-shadow:0_2px_18px_rgba(0,0,0,0.9)] ${titleSize}`}
            >
              {titulo}
            </h3>
            <div className="flex items-end justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-300/80">
                {categoria && <span>{categoria}</span>}
                {genero && <span className="normal-case tracking-normal">{genero}</span>}
                <span className={enStock ? "text-cyan-300/90" : "text-fuchsia-300/90"}>
                  {enStock ? "Disponible" : "Agotado"}
                </span>
              </div>
              <motion.div
                className="text-right"
                style={reducedMotion ? undefined : { x: priceShiftX, y: priceShiftY }}
              >
                {isOffer && precioAntesFormatted ? (
                  <p className="text-[11px] font-medium text-zinc-300/70 line-through tabular-nums">
                    {precioAntesFormatted}
                  </p>
                ) : (
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Desde
                  </p>
                )}
                <p className="mh-organic-price mh-gradient-text text-3xl font-semibold leading-none tracking-tight tabular-nums sm:text-4xl">
                  {precioFormatted}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
