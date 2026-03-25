"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCartStore } from "../store/cartStore";

export function CartHeader() {
  const pathname = usePathname();
  const { items, openCart } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100">
          <span className="h-5 w-5 rounded-md bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-500 ring-1 ring-white/10" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200">
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
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700/90 bg-zinc-900/50 p-2 text-zinc-300 transition hover:border-emerald-500/50 hover:text-white md:hidden"
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/90 bg-zinc-900/50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100 sm:px-3 sm:text-[11px]"
          >
            <span className="text-xs leading-none text-zinc-500" aria-hidden>
              ?
            </span>
            <span>Guía</span>
          </Link>

          <Link
            href="/ps-plus"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-zinc-900/50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100/95 transition hover:border-amber-400/50 hover:text-amber-50 sm:px-3 sm:text-[11px]"
          >
            <span className="text-xs leading-none sm:text-sm" aria-hidden>
              ⭐
            </span>
            <span>PS Plus</span>
          </Link>

          <motion.button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-2 rounded-lg border border-zinc-700/90 bg-zinc-900/50 px-2.5 py-1.5 text-[11px] text-zinc-200 transition hover:border-zinc-500 hover:text-white sm:px-3"
            whileHover={reducedMotion ? undefined : { y: -0.5 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-cyan-500 text-[11px] text-black">
              🛒
            </span>
            <span>Carrito</span>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.6, opacity: 0, y: -4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="min-w-[1.35rem] rounded-md bg-zinc-800 px-1.5 text-center text-[10px] font-semibold text-emerald-300"
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
          className="pointer-events-none h-0.5 origin-left bg-gradient-to-r from-emerald-500 via-cyan-400 to-teal-500"
          style={{ scaleX: progressScale }}
        />
      )}
    </header>
  );
}
