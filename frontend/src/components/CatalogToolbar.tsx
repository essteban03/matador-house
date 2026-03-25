"use client";

import { motion } from "framer-motion";

export type CategoryTab =
  | "todos"
  | "ps5"
  | "ps4"
  | "psn_plus"
  | "accion"
  | "deportes";

type CatalogToolbarProps = {
  tabs: { id: CategoryTab; label: string }[];
  search: string;
  onSearchChange: (value: string) => void;
  activeTab: CategoryTab;
  onTabChange: (tab: CategoryTab) => void;
  filteredCount: number;
  totalCount: number;
  layoutIdSuffix: "mobile" | "desktop";
  searchInputId?: string;
  className?: string;
};

export function CatalogToolbar({
  tabs,
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  filteredCount,
  totalCount,
  layoutIdSuffix,
  searchInputId = "catalog-search-input",
  className = "",
}: CatalogToolbarProps) {
  const layoutId = `category-tab-active-${layoutIdSuffix}`;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <label htmlFor={searchInputId} className="sr-only">
          Buscar videojuego por título
        </label>
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          id={searchInputId}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar juego…"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/90 py-3 pl-10 pr-3 text-[15px] text-zinc-100 shadow-inner outline-none ring-emerald-500/15 transition placeholder:text-zinc-600 focus:border-emerald-500/45 focus:ring-2 md:rounded-2xl md:py-3.5 md:pl-12 md:text-sm"
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500">
        <span className="truncate tabular-nums">
          <span className="font-medium text-zinc-400">{filteredCount}</span>
          {filteredCount === 1 ? " juego" : " juegos"}
          {totalCount > 0 && filteredCount !== totalCount && (
            <span className="text-zinc-600"> · {totalCount} en catálogo</span>
          )}
        </span>
        {search.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="shrink-0 rounded-lg border border-zinc-800/90 bg-zinc-900/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full snap-x snap-mandatory gap-2 pb-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.97 }}
                className={`relative snap-start overflow-hidden rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-wide transition sm:px-4 sm:text-xs ${
                  active
                    ? "text-black"
                    : "shrink-0 border border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
