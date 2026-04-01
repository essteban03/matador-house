"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "../../../store/cartStore";
import { usePressRipple } from "../../../components/ui/usePressRipple";
import { useUiSound } from "../../../components/ui/useUiSound";

type Videojuego = {
  id: number;
  titulo: string;
  consola: string;
  genero?: string | null;
  categoria?: string | null;
  descripcion?: string | null;
  precioPrincipal: number;
  precioSecundaria: number;
  precioOfertaPrincipal?: number | null;
  precioOfertaSecundaria?: number | null;
  ofertaDesde?: string | null;
  ofertaHasta?: string | null;
  pesoGb?: number | null;
  enStock: boolean;
  imagenUrl?: string | null;
  stockPrincipal?: number;
  stockSecundaria?: number;
};

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

const MOCK_JUEGO: Videojuego = {
  id: 1,
  titulo: "EA Sports FC 24 Ultimate Edition",
  consola: "PS5",
  genero: "Deportes, Fútbol, Online",
  categoria: "Deportes",
  precioPrincipal: 79.99,
  precioSecundaria: 59.99,
  pesoGb: 52,
  enStock: true,
  imagenUrl: "",
  descripcion:
    "Vive la experiencia más auténtica del fútbol con tecnologías de última generación y modos competitivos.",
  stockPrincipal: 0,
  stockSecundaria: 0,
};

export default function JuegoDetallePage() {
  const params = useParams<{ id: string }>();
  const { addToCart, openCart } = useCartStore();
  const triggerRipple = usePressRipple();
  const { playClick } = useUiSound();

  const [juego, setJuego] = useState<Videojuego | null>(null);
  const [listaVideojuegos, setListaVideojuegos] = useState<Videojuego[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsola, setSelectedConsola] = useState<"PS4" | "PS5">("PS5");
  const [selectedTipoCuenta, setSelectedTipoCuenta] = useState<
    "PRINCIPAL" | "SECUNDARIA"
  >("PRINCIPAL");

  useEffect(() => {
    const fetchJuego = async () => {
      try {
        const apiOrigin =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(
          `${apiOrigin.replace(/\/$/, "")}/api/videojuegos`
        );
        if (!res.ok) throw new Error("Error al cargar el videojuego");
        const data: Videojuego[] = await res.json();
        setListaVideojuegos(data);
        const byId = data.find((v) => String(v.id) === String(params?.id));
        setJuego(byId ?? MOCK_JUEGO);
      } catch {
        setListaVideojuegos([]);
        setJuego(MOCK_JUEGO);
      } finally {
        setLoading(false);
      }
    };
    fetchJuego();
  }, [params?.id]);

  const ofertaDesde = parseLocalDate(juego?.ofertaDesde, false);
  const ofertaHasta = parseLocalDate(juego?.ofertaHasta, true);
  const ofertaActiva =
    ofertaDesde != null &&
    ofertaHasta != null &&
    !Number.isNaN(ofertaDesde.getTime()) &&
    !Number.isNaN(ofertaHasta.getTime()) &&
    Date.now() >= ofertaDesde.getTime() &&
    Date.now() <= ofertaHasta.getTime();

  const precioPrincipalNormal = juego?.precioPrincipal ?? MOCK_JUEGO.precioPrincipal;
  const precioSecundariaNormal =
    juego?.precioSecundaria ?? MOCK_JUEGO.precioSecundaria;
  const precioPrincipalOferta = juego?.precioOfertaPrincipal ?? 0;
  const precioSecundariaOferta = juego?.precioOfertaSecundaria ?? 0;

  const precioPrincipalFuente = ofertaActiva
    ? precioPrincipalOferta
    : precioPrincipalNormal;
  const precioSecundariaFuente = ofertaActiva
    ? precioSecundariaOferta
    : precioSecundariaNormal;

  const precioActualOferta =
    selectedTipoCuenta === "PRINCIPAL"
      ? precioPrincipalFuente
      : precioSecundariaFuente;

  const hasPrecioPrincipal = precioPrincipalFuente > 0;
  const hasPrecioSecundaria = precioSecundariaFuente > 0;
  const isPrecioSeleccionadoDisponible =
    selectedTipoCuenta === "PRINCIPAL"
      ? hasPrecioPrincipal
      : hasPrecioSecundaria;

  // Recalcular `precioActual` con fuente (oferta vs normal).
  // (Se sobreescribe para que el botón/guard usen el precio correcto.)
  const precioActualFinal = precioActualOferta;

  useEffect(() => {
    // Si solo existe precio en una cuenta, forzamos que el usuario
    // seleccione únicamente la que tiene valor.
    if (!hasPrecioPrincipal && hasPrecioSecundaria) {
      setSelectedTipoCuenta("SECUNDARIA");
    } else if (!hasPrecioSecundaria && hasPrecioPrincipal) {
      setSelectedTipoCuenta("PRINCIPAL");
    }
  }, [juego?.id, hasPrecioPrincipal, hasPrecioSecundaria]);

  const tituloActual = juego?.titulo ?? "";
  const existsPs4Version = listaVideojuegos.some(
    (v) => v.titulo === tituloActual && v.consola === "PS4"
  );
  const existsPs5Version = listaVideojuegos.some(
    (v) => v.titulo === tituloActual && v.consola === "PS5"
  );
  const ps4Disabled = !existsPs4Version;
  const ps5Disabled = !existsPs5Version;

  const handleAddToCart = () => {
    if (!juego) return;
    if (precioActualFinal <= 0) return;
    playClick();
    addToCart({
      gameId: juego.id,
      titulo: juego.titulo,
      consola: selectedConsola,
      tipoCuenta: selectedTipoCuenta,
      precio: precioActualFinal,
    });
    openCart();
  };

  if (loading || !juego) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(217,70,239,0.16),transparent_36%),linear-gradient(180deg,#05070d_0%,#080c16_54%,#06070d_100%)] text-zinc-100">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 mh-grain opacity-[0.08] mix-blend-overlay" />
          <motion.div
            className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
            animate={{ y: [0, 18, -6, 0], opacity: [0.3, 0.48, 0.3] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-12 top-12 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-3xl"
            animate={{ y: [0, -18, 6, 0], opacity: [0.25, 0.42, 0.25] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <p className="relative z-10 animate-pulse text-sm text-zinc-400">
          Cargando juego...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(217,70,239,0.16),transparent_36%),linear-gradient(180deg,#05070d_0%,#080c16_54%,#06070d_100%)] text-zinc-50">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 mh-grain opacity-[0.08] mix-blend-overlay" />
        <motion.div
          className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
          animate={{ y: [0, 20, -8, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-3xl"
          animate={{ y: [0, -20, 8, 0], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-8 lg:px-12">
        <header className="mb-8 flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <span className="h-px w-6 bg-zinc-700" />
              <span>Detalle del juego</span>
            </div>
            <h1 className="mh-gradient-text text-3xl font-extrabold tracking-tight sm:text-4xl">
              {juego.titulo}
            </h1>
          </div>
          <div className="mh-glass inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] text-zinc-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            <span>Entrega digital instantánea</span>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-8 pb-10 lg:grid-cols-2 lg:gap-10">
          <div className="relative flex items-center justify-center rounded-3xl border border-white/10 px-4 py-6 sm:px-6 lg:px-8 mh-game-card mh-organic-card">
            <div className="relative z-10 aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black/90 p-0.5 shadow-[0_0_48px_rgba(34,211,238,0.12),0_0_40px_rgba(217,70,239,0.08)]">
              <div className="flex h-full flex-col rounded-[1.3rem] bg-gradient-to-b from-slate-900 via-zinc-950 to-black">
                <div className="flex min-h-0 flex-1 basis-0 items-center justify-center bg-zinc-950/80">
                  {juego.imagenUrl ? (
                    <motion.img
                      src={juego.imagenUrl}
                      alt={juego.titulo}
                      className="h-full w-full object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    />
                  ) : (
                    <div className="text-xs text-zinc-600">Sin imagen</div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-3 p-5">
                  {juego.genero && (
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      {juego.genero}
                    </p>
                  )}
                  <div className="space-y-2 text-xs text-zinc-400">
                    {typeof juego.pesoGb === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Tamaño aprox.</span>
                        <span className="font-medium text-zinc-200">
                          {juego.pesoGb} GB
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="max-w-xl text-sm text-zinc-300">
                {juego.descripcion ?? "Sin descripción disponible."}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Elige tu consola
              </h3>
              <div className="inline-flex rounded-full border border-white/10 bg-zinc-950/60 p-1 text-xs backdrop-blur-xl">
                {(["PS4", "PS5"] as const).map((c) => {
                  const active = selectedConsola === c;
                  const disabled = c === "PS4" ? ps4Disabled : ps5Disabled;
                  return (
                    <motion.button
                      key={c}
                      type="button"
                      onClick={() => !disabled && setSelectedConsola(c)}
                      disabled={disabled}
                      className={`relative flex-1 rounded-full px-4 py-2 font-medium transition-colors ${
                        disabled
                          ? "cursor-not-allowed opacity-40 text-zinc-500"
                          : active
                          ? "text-zinc-50"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      layout
                    >
                      {active && !disabled && (
                        <motion.span
                          layoutId="consola-pill"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 shadow-[0_0_20px_rgba(34,211,238,0.45)]"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                          }}
                        />
                      )}
                      <span className="relative z-10">{c}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Tipo de cuenta
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedTipoCuenta("PRINCIPAL")}
                  disabled={!hasPrecioPrincipal}
                  onPointerDown={(e) => triggerRipple(e)}
                  className={`mh-pressable mh-focus rounded-2xl border px-4 py-4 text-left text-xs transition ${
                    !hasPrecioPrincipal
                      ? "cursor-not-allowed border-zinc-800 bg-zinc-950/40 opacity-50"
                      : selectedTipoCuenta === "PRINCIPAL"
                      ? "border-cyan-400/70 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    Principal
                  </p>
                  <p className="mt-1 text-zinc-300">
                    Juega desde tu usuario personal
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTipoCuenta("SECUNDARIA")}
                  disabled={!hasPrecioSecundaria}
                  onPointerDown={(e) => triggerRipple(e)}
                  className={`mh-pressable mh-focus rounded-2xl border px-4 py-4 text-left text-xs transition ${
                    !hasPrecioSecundaria
                      ? "cursor-not-allowed border-zinc-800 bg-zinc-950/40 opacity-50"
                      : selectedTipoCuenta === "SECUNDARIA"
                      ? "border-fuchsia-400/70 bg-fuchsia-400/10 shadow-[0_0_20px_rgba(217,70,239,0.15)]"
                      : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
                    Secundaria
                  </p>
                  <p className="mt-1 text-zinc-300">
                    Juega desde el usuario entregado
                  </p>
                </button>
              </div>
            </div>

            <div className="mt-2 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  Total
                </p>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selectedTipoCuenta}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="mh-gradient-text text-3xl font-extrabold"
                  >
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "USD",
                    }).format(precioActualFinal)}
                  </motion.span>
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                onClick={handleAddToCart}
                onPointerDown={(e) => triggerRipple(e)}
                disabled={!isPrecioSeleccionadoDisponible}
                className="mh-pressable mh-focus group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/40 bg-gradient-to-r from-cyan-300 via-cyan-400 to-fuchsia-400 px-6 py-4 text-sm font-semibold tracking-wide text-black shadow-[0_0_32px_rgba(34,211,238,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={isPrecioSeleccionadoDisponible ? { scale: 1.02 } : {}}
                whileTap={isPrecioSeleccionadoDisponible ? { scale: 0.97 } : {}}
              >
                <span className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-cyan-400/40 via-violet-400/35 to-fuchsia-400/40 opacity-60 blur-xl" />
                <span>
                  {isPrecioSeleccionadoDisponible
                    ? "Añadir al carrito"
                    : "Precio no disponible"}
                </span>
              </motion.button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
