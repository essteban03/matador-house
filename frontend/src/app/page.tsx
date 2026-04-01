"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PaymentTicker } from "../components/PaymentTicker";
import { ConfettiBurst } from "../components/ConfettiBurst";
import { GameCard } from "../components/GameCard";
import { ImmersiveLanding } from "../components/ImmersiveLanding";
import { SectionMorphDivider } from "../components/SectionMorphDivider";
import {
  CatalogToolbar,
  type CategoryTab,
} from "../components/CatalogToolbar";
import { usePressRipple } from "../components/ui/usePressRipple";

type Videojuego = {
  id: number;
  titulo: string;
  consola: string;
  genero?: string | null;
  categoria?: string | null;
  precioPrincipal: number;
  precioSecundaria: number;
  precioOfertaPrincipal?: number | null;
  precioOfertaSecundaria?: number | null;
  ofertaDesde?: string | null;
  ofertaHasta?: string | null;
  pesoGb?: number | null;
  enStock: boolean;
  imagenUrl?: string | null;
};

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

function parseLocalDate(value?: string | null, endOfDay = false): Date | null {
  if (!value) return null;
  const [yearRaw, monthRaw, dayRaw] = value.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (!year || !month || !day) return null;

  if (endOfDay) {
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }
  return new Date(year, month - 1, day, 0, 0, 0, 0);
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
  const reducedMotion = useReducedMotion() ?? false;
  const triggerRipple = usePressRipple();
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
      }),
    []
  );
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryTab>("todos");

  const sectionReveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10% 0px -8% 0px" },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      };
  const getCardReveal = (index: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 50, x: index % 2 === 0 ? -24 : 24 },
          whileInView: { opacity: 1, y: 0, x: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: {
            duration: 0.5,
            // Diagonal cascade: wave moves across columns then rows
            delay:
              ((index % 3) * 0.065 + Math.floor(index / 3) * 0.035) % 0.42,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };
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

  const scrollToCatalog = () => {
    const el = document.getElementById("catalogo");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ofertasMarzo = useMemo(() => {
    const ahora = Date.now();
    return videojuegos
      .filter((game) => {
        if (!game.ofertaDesde || !game.ofertaHasta) return false;

        const start = parseLocalDate(game.ofertaDesde, false);
        const end = parseLocalDate(game.ofertaHasta, true);
        if (
          start == null ||
          end == null ||
          Number.isNaN(start.getTime()) ||
          Number.isNaN(end.getTime())
        )
          return false;

        const hasOferta =
          (game.precioOfertaPrincipal ?? 0) > 0 ||
          (game.precioOfertaSecundaria ?? 0) > 0;

        return hasOferta && ahora >= start.getTime() && ahora <= end.getTime();
      })
      .sort((a, b) => {
        const aSpecial =
          (a.precioOfertaPrincipal ?? 0) > 0
            ? (a.precioOfertaPrincipal ?? 0)
            : (a.precioOfertaSecundaria ?? 0);
        const bSpecial =
          (b.precioOfertaPrincipal ?? 0) > 0
            ? (b.precioOfertaPrincipal ?? 0)
            : (b.precioOfertaSecundaria ?? 0);
        return aSpecial - bSpecial;
      });
  }, [videojuegos]);
  const ofertasMarzoRef = useRef<HTMLElement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const el = ofertasMarzoRef.current;
    if (!el) return;
    if (showConfetti) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setShowConfetti(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ofertasMarzo.length, showConfetti]);

  useEffect(() => {
    const focusSearch = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const id = isDesktop
        ? "catalog-search-input-desktop"
        : "catalog-search-input";
      requestAnimationFrame(() => document.getElementById(id)?.focus());
    };
    window.addEventListener("matador:focus-catalog-search", focusSearch);
    return () =>
      window.removeEventListener("matador:focus-catalog-search", focusSearch);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--mh-canvas)] text-[var(--mh-text)]">
      <ImmersiveLanding onEnterCatalog={scrollToCatalog} />

      <SectionMorphDivider />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <motion.section
          {...sectionReveal}
          className="relative mb-7 grid grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[110px]"
        >
          <motion.div
            whileHover={reducedMotion ? undefined : { scale: 1.1 }}
            className="mh-organic-card mh-glass mh-glow-cyan lg:col-span-5 lg:row-span-2 lg:translate-y-8"
            data-shape="b"
          >
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/80">
                Entrega instantanea
              </p>
              <p className="mt-2 text-xl font-semibold text-zinc-100 sm:text-2xl">5-20 min</p>
              <p className="text-xs text-zinc-400">activacion guiada por WhatsApp</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={reducedMotion ? undefined : { scale: 1.1 }}
            className="mh-organic-card mh-glass lg:col-span-4 lg:row-span-2 lg:-translate-y-5"
            data-shape="d"
          >
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-100/80">
                Compra segura
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                Cuentas verificadas, reposiciones bajo garantia tecnica y soporte premium.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={reducedMotion ? undefined : { scale: 1.1 }}
            className="mh-organic-card mh-glow-magenta border border-fuchsia-300/20 bg-black/35 backdrop-blur-lg lg:col-span-3 lg:row-span-3 lg:translate-y-10"
            data-shape="c"
          >
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Catalogo</p>
              <p className="mh-gradient-text mt-2 text-5xl font-semibold leading-none">
                {videojuegos.length}
              </p>
              <p className="mt-2 text-xs text-zinc-300">titulos activos</p>
              <Link
                href="/guia"
                onPointerDown={(event) => triggerRipple(event)}
                className="mh-pressable mt-4 inline-flex rounded-lg border border-fuchsia-300/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-fuchsia-100 transition hover:bg-fuchsia-400/20"
              >
                Ir a la guia
              </Link>
            </div>
          </motion.div>

          <div className="lg:col-span-12 lg:-mt-5">
            <PaymentTicker />
          </div>
        </motion.section>

        {!loading && !error && videojuegos.length > 0 && (
          <div id="catalogo-top" className="md:hidden sticky top-[3.75rem] z-20 -mx-4 mb-3 border-y border-white/10 bg-[#060b14]/88 px-4 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Catálogo
            </p>
            <CatalogToolbar
              tabs={CATEGORY_TABS}
              search={search}
              onSearchChange={setSearch}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              filteredCount={filteredGames.length}
              totalCount={videojuegos.length}
              layoutIdSuffix="mobile"
              searchInputId="catalog-search-input"
            />
          </div>
        )}


        {/* Ofertas de Marzo */}
        {!loading && !error && ofertasMarzo.length > 0 && (
          <motion.section
            {...sectionReveal}
            ref={ofertasMarzoRef}
            id="ofertas-marzo"
            className="relative mb-12 overflow-visible px-1 py-4 sm:px-2"
          >
            <ConfettiBurst active={showConfetti} />
            {!reducedMotion && (
              <>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -left-10 top-16 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl"
                  animate={{ y: [0, -16, 0], opacity: [0.26, 0.45, 0.26] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 bottom-0 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl"
                  animate={{ y: [0, 20, 0], opacity: [0.2, 0.35, 0.2] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Ofertas de marzo
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                  Precios especiales de tiempo limitado
                </h2>
              </div>
              <div className="rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
                Activas ahora
              </div>
            </div>

            <div className="relative z-10 mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ofertasMarzo.map((game, index) => {
                const usaPrincipal = (game.precioOfertaPrincipal ?? 0) > 0;
                const precioEspecial = usaPrincipal
                  ? game.precioOfertaPrincipal ?? 0
                  : game.precioOfertaSecundaria ?? 0;
                const precioAntes = usaPrincipal
                  ? game.precioPrincipal
                  : game.precioSecundaria;

                return (
                  <motion.div
                    key={game.id}
                    {...getCardReveal(index)}
                    className="min-w-0"
                  >
                    <div className="aspect-[3/4] w-full">
                      <GameCard
                        href={`/juego/${game.id}`}
                        onPointerDown={(e) => triggerRipple(e)}
                        titulo={game.titulo}
                        imagenUrl={game.imagenUrl}
                        consola={game.consola}
                        categoria={game.categoria}
                        genero={game.genero}
                        enStock={game.enStock}
                        index={index}
                        variant="offer"
                        precioAntesFormatted={currencyFormatter.format(
                          precioAntes
                        )}
                        precioFormatted={currencyFormatter.format(precioEspecial)}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        <motion.div
          {...sectionReveal}
          aria-hidden
          className="pointer-events-none relative mb-4 h-8 overflow-visible"
        >
          <div className="absolute inset-x-0 top-1/2 h-px -skew-y-2 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          <div className="absolute inset-x-8 top-1/2 h-px skew-y-2 bg-gradient-to-r from-transparent via-fuchsia-300/55 to-transparent" />
        </motion.div>

        {/* Catálogo: filtros escritorio */}
        {!loading && !error && videojuegos.length > 0 && (
          <motion.section
            {...sectionReveal}
            id="ofertas"
            className="mb-10 hidden space-y-4 md:block"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Catálogo
            </p>
            <div className="max-w-2xl">
              <CatalogToolbar
                tabs={CATEGORY_TABS}
                search={search}
                onSearchChange={setSearch}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                filteredCount={filteredGames.length}
                totalCount={videojuegos.length}
                layoutIdSuffix="desktop"
                searchInputId="catalog-search-input-desktop"
              />
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
                  className="mh-panel flex flex-1 flex-col items-center justify-center rounded-2xl py-20 text-center"
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
                    id="catalogo"
                    key="grid-results"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="scroll-mt-36 relative grid flex-1 grid-cols-1 gap-6 pb-10 sm:grid-cols-2 sm:scroll-mt-28 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {!reducedMotion && (
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
                        animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.34, 0.18] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                    <AnimatePresence mode="popLayout">
                      {filteredGames.map((game, index) => (
                        <motion.div
                          key={game.id}
                          layout
                          {...getCardReveal(index)}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                            layout: { type: "spring", stiffness: 180, damping: 24 },
                          }}
                          className="min-w-0"
                        >
                          <div className="aspect-[3/4] w-full">
                            <GameCard
                              href={`/juego/${game.id}`}
                              onPointerDown={(e) => triggerRipple(e)}
                              titulo={game.titulo}
                              imagenUrl={game.imagenUrl}
                              consola={game.consola}
                              categoria={game.categoria}
                              genero={game.genero}
                              enStock={game.enStock}
                              index={index}
                              variant="catalog"
                              precioFormatted={currencyFormatter.format(
                                game.precioPrincipal > 0
                                  ? game.precioPrincipal
                                  : game.precioSecundaria
                              )}
                            />
                          </div>
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

