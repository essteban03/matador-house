"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Hero } from "../components/Hero";
import { PaymentTicker } from "../components/PaymentTicker";

type Videojuego = {
  id: number;
  titulo: string;
  consola: string;
  genero?: string | null;
  categoria?: string | null;
  precioPrincipal: number;
  precioSecundaria: number;
  pesoGb?: number | null;
  enStock: boolean;
  imagenUrl?: string | null;
};

type CategoryTab =
  | "todos"
  | "ps5"
  | "ps4"
  | "psn_plus"
  | "accion"
  | "deportes";

const CATEGORY_TABS: { id: CategoryTab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "ps5", label: "PS5" },
  { id: "ps4", label: "PS4" },
  { id: "psn_plus", label: "PSN Plus" },
  { id: "accion", label: "Acción" },
  { id: "deportes", label: "Deportes" },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function matchesCategoryTab(game: Videojuego, tab: CategoryTab): boolean {
  const cat = normalize(game.categoria ?? "");
  const gen = normalize(game.genero ?? "");
  switch (tab) {
    case "todos":
      return true;
    case "ps5":
      return game.consola === "PS5";
    case "ps4":
      return game.consola === "PS4";
    case "psn_plus":
      return cat.includes("psn") || gen.includes("psn");
    case "accion":
      return cat.includes("accion") || gen.includes("accion");
    case "deportes":
      return cat.includes("deporte") || gen.includes("deporte");
    default:
      return true;
  }
}

export default function Home() {
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryTab>("todos");

  useEffect(() => {
    const fetchVideojuegos = async () => {
      try {
        const apiOrigin =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(
          `${apiOrigin.replace(/\/$/, "")}/api/videojuegos`
        );
        if (!res.ok) throw new Error("Error al cargar los videojuegos");
        const data: Videojuego[] = await res.json();
        setVideojuegos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchVideojuegos();
  }, []);

  const filteredGames = useMemo(() => {
    const q = normalize(search.trim());
    return videojuegos.filter((game) => {
      if (!matchesCategoryTab(game, activeTab)) return false;
      if (!q) return true;
      return normalize(game.titulo).includes(q);
    });
  }, [videojuegos, search, activeTab]);

  const scrollToOffers = () => {
    const el = document.getElementById("ofertas");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <Hero onViewOffersClick={scrollToOffers} />

        <PaymentTicker />

        {/* Trust bar */}
        <section className="mb-6 grid gap-4 text-xs text-zinc-300 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 shadow-[0_0_24px_rgba(34,197,94,0.25)]">
            <span className="mt-0.5 text-xl leading-none text-emerald-400">
              ⚡
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Entrega instantánea
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">
                Recibe los datos de tu cuenta y la guía de activación en
                minutos, directamente en tu WhatsApp.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 shadow-[0_0_24px_rgba(37,99,235,0.3)]">
            <span className="mt-0.5 text-xl leading-none text-emerald-300">
              🛡️
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Compra segura
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">
                Cuentas verificadas, reglas claras y reemplazos sujetos a
                nuestra garantía técnica.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 shadow-[0_0_24px_rgba(147,197,253,0.3)]">
            <span className="mt-0.5 text-xl leading-none text-cyan-300">
              🎧
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Soporte premium
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">
                Te acompañamos durante la activación y resolvemos dudas
                avanzadas sobre PS4 y PS5.
              </p>
            </div>
          </div>
        </section>

        {/* Centro de Soporte */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-zinc-950/70 px-5 py-4 shadow-[0_0_35px_rgba(8,47,73,0.8)] backdrop-blur-xl sm:px-7 sm:py-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,197,235,0.4),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(8,47,73,0.7),transparent_60%)] opacity-60" />
            <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-500/15 text-lg text-cyan-300 shadow-[0_0_22px_rgba(34,197,235,0.7)]">
                  📘
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                    Centro de soporte
                  </p>
                  <p className="mt-1 text-[13px] text-zinc-100 sm:text-sm">
                    ¿Soporte técnico? Consulta nuestra Guía de Instalación 100% segura
                    para PS4 y PS5.
                  </p>
                </div>
              </div>
              <Link href="/guia" className="relative mt-1 inline-flex">
                <motion.button
                  type="button"
                  className="relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black shadow-[0_0_26px_rgba(56,189,248,0.9)]"
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(248,250,252,0.85),transparent)]"
                    initial={{ x: "-120%" }}
                    animate={{ x: ["-120%", "130%"] }}
                    transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6 }}
                  />
                  <span className="relative z-10">Ir a la guía</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filtros */}
        {!loading && !error && videojuegos.length > 0 && (
          <motion.section
            id="ofertas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10 space-y-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Filtros
            </p>

            <div className="relative max-w-xl">
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                aria-hidden
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título..."
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 py-3.5 pl-12 pr-4 text-sm text-zinc-100 shadow-inner outline-none ring-emerald-500/20 transition placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-2"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORY_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition ${
                      active
                        ? "text-black"
                        : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="category-tab-active"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 shadow-[0_0_24px_rgba(34,197,94,0.45)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        )}

        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="animate-pulse text-sm text-zinc-400">
              Cargando videojuegos...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-red-400">
              {error} — verifica que el backend esté corriendo y que{" "}
              <span className="font-mono">NEXT_PUBLIC_API_URL</span> esté
              configurada correctamente.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {videojuegos.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-zinc-400">
                  Aún no hay videojuegos cargados. Agrega algunos desde el panel
                  admin.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredGames.length === 0 ? (
                  <motion.div
                    key="empty-results"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/40 py-20 text-center"
                  >
                    <p className="max-w-md text-lg font-medium text-zinc-300">
                      No encontramos lo que buscas, ¡prueba con otro nombre!
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                      Ajusta la búsqueda o elige otra categoría.
                    </p>
                  </motion.div>
                ) : (
                  <motion.main
                    key="grid-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid flex-1 grid-cols-1 gap-6 pb-10 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredGames.map((game) => (
                        <motion.div
                          key={game.id}
                          layout
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href={`/juego/${game.id}`}
                            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-4 shadow-[0_0_25px_rgba(0,0,0,0.65)] transition-colors"
                          >
                            <div className="pointer-events-none absolute inset-px rounded-[18px] border border-emerald-400/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative mb-3 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-zinc-900/80">
                              {game.imagenUrl ? (
                                <img
                                  src={game.imagenUrl}
                                  alt={game.titulo}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                                  Sin imagen
                                </div>
                              )}
                            </div>

                            <div className="mb-3 flex items-center justify-between gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                  game.consola === "PS5"
                                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                                    : "bg-gradient-to-r from-sky-500 to-emerald-400 text-black"
                                }`}
                              >
                                {game.consola}
                              </span>
                              {game.categoria && (
                                <span className="truncate text-[10px] uppercase tracking-wider text-zinc-500">
                                  {game.categoria}
                                </span>
                              )}
                            </div>

                            <div className="mb-3 min-h-0 flex-1">
                              <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-zinc-50">
                                {game.titulo}
                              </h2>
                              {game.genero && (
                                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                                  {game.genero}
                                </p>
                              )}
                            </div>

                            <div className="mt-auto flex items-end justify-between gap-3 border-t border-zinc-800/60 pt-3">
                              <div className="space-y-1 text-xs text-zinc-500">
                                {typeof game.pesoGb === "number" && (
                                  <p>
                                    <span className="text-zinc-400">
                                      Tamaño:
                                    </span>{" "}
                                    {game.pesoGb} GB
                                  </p>
                                )}
                                <p>
                                  <span className="text-zinc-400">Stock:</span>{" "}
                                  <span
                                    className={
                                      game.enStock
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                    }
                                  >
                                    {game.enStock ? "Disponible" : "Agotado"}
                                  </span>
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-medium text-zinc-400">
                                  Desde
                                </p>
                                <p className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-2xl font-extrabold text-transparent">
                                  {new Intl.NumberFormat("es-ES", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(
                                    game.precioPrincipal > 0
                                      ? game.precioPrincipal
                                      : game.precioSecundaria
                                  )}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.main>
                )}
              </AnimatePresence>
            )}
          </>
        )}
      </div>
    </div>
  );
}

