"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCartStore } from "../store/cartStore";
import { usePressRipple } from "./ui/usePressRipple";

export function CartHeader() {
  const pathname = usePathname();
  const { items, openCart } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const triggerRipple = usePressRipple();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070a13]/70 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="mh-focus inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 transition"
        >
          <span className="h-5 w-5 rounded-md bg-gradient-to-br from-cyan-300 via-cyan-400 to-fuchsia-500 shadow-[0_0_24px_rgba(34,211,238,0.35)] ring-1 ring-white/15" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-100">
            Matador House
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-3">
          {pathname === "/" && (
            <button
              type="button"
              onClick={() => {
                if (typeof window === "undefined") return;
                const target =
                  document.getElementById("catalogo") ??
                  document.getElementById("catalogo-top");
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
                window.setTimeout(() => {
                  window.dispatchEvent(
                    new Event("matador:focus-catalog-search")
                  );
                }, 320);
              }}
              onPointerDown={(e) => {
                triggerRipple(e);
              }}
              className="mh-pressable mh-focus inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] p-2 text-zinc-300 transition hover:text-white md:hidden"
              aria-label="Buscar en el catálogo"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}
          <Link
            href="/guia"
            className="mh-focus inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-300 transition hover:text-zinc-100 sm:px-3 sm:text-[11px]"
          >
            <span className="text-xs leading-none text-zinc-500" aria-hidden>
              ?
            </span>
            <span>Guía</span>
          </Link>

          <Link
            href="/ps-plus"
            className="mh-focus inline-flex items-center gap-1.5 rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-fuchsia-100 transition hover:border-fuchsia-300/50 hover:text-fuchsia-50 sm:px-3 sm:text-[11px]"
          >
            <span className="text-xs leading-none sm:text-sm" aria-hidden>
              ⭐
            </span>
            <span>PS Plus</span>
          </Link>

          <motion.button
            type="button"
            onClick={openCart}
            onPointerDown={(e) => triggerRipple(e)}
            className="mh-pressable mh-focus relative inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] text-cyan-50 transition hover:border-cyan-200/60 hover:text-white sm:px-3"
            whileHover={reducedMotion ? undefined : { y: -0.5 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-[11px] text-black">
              🛒
            </span>
            <span>Carrito</span>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.6, opacity: 0, y: -4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="min-w-[1.35rem] rounded-md bg-[#0e1f33] px-1.5 text-center text-[10px] font-semibold text-cyan-200"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {!reducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none h-0.5 origin-left bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400"
          style={{ scaleX: progressScale }}
        />
      )}
    </header>
  );
}
