"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";

export function CartHeader() {
  const { items, openCart } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-900/80 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500" />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 bg-clip-text text-sm font-semibold uppercase tracking-[0.24em] text-transparent">
            Matador House
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end sm:flex-nowrap">
          <Link
            href="/guia"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-zinc-950/80 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_18px_rgba(34,197,235,0.55)] transition hover:border-cyan-300/80 hover:text-cyan-50 sm:px-3 sm:inline-flex"
          >
            <span className="text-xs leading-none">?</span>
            <span>Guía</span>
          </Link>

          <Link
            href="/ps-plus"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-zinc-950/80 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200 shadow-[0_0_18px_rgba(250,204,21,0.45)] transition hover:border-amber-300/80 hover:text-amber-100 sm:px-3 sm:inline-flex"
          >
            <span className="text-sm leading-none sm:text-base">⭐</span>
            <span>PS Plus</span>
          </Link>

          <motion.button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-xs text-zinc-200 shadow-[0_0_18px_rgba(0,0,0,0.6)] hover:border-emerald-500/60 hover:text-emerald-300"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-[13px] text-black">
              🛒
            </span>
            <span>Carrito</span>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.6, opacity: 0, y: -4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="min-w-[1.5rem] rounded-full bg-emerald-400/10 px-2 text-center text-[11px] font-semibold text-emerald-300"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}

