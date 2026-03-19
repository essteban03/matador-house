"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "../../../store/cartStore";

type Videojuego = {
  id: number;
  titulo: string;
  consola: string;
  genero?: string | null;
  categoria?: string | null;
  descripcion?: string | null;
  precioPrincipal: number;
  precioSecundaria: number;
  pesoGb?: number | null;
  enStock: boolean;
  imagenUrl?: string | null;
  stockPrincipal?: number;
  stockSecundaria?: number;
};

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

  const precioActual =
    selectedTipoCuenta === "PRINCIPAL"
      ? juego?.precioPrincipal ?? MOCK_JUEGO.precioPrincipal
      : juego?.precioSecundaria ?? MOCK_JUEGO.precioSecundaria;

  const hasPrecioPrincipal = (juego?.precioPrincipal ?? 0) > 0;
  const hasPrecioSecundaria = (juego?.precioSecundaria ?? 0) > 0;
  const isPrecioSeleccionadoDisponible =
    selectedTipoCuenta === "PRINCIPAL"
      ? hasPrecioPrincipal
      : hasPrecioSecundaria;

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
    const precioSeleccionado =
      selectedTipoCuenta === "PRINCIPAL"
        ? juego.precioPrincipal
        : juego.precioSecundaria;
    if (precioSeleccionado <= 0) return;
    addToCart({
      gameId: juego.id,
      titulo: juego.titulo,
      consola: selectedConsola,
      tipoCuenta: selectedTipoCuenta,
      precio: precioActual,
    });
    openCart();
  };

  if (loading || !juego) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-zinc-100">
        <p className="animate-pulse text-sm text-zinc-400">Cargando juego...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-8 lg:px-12">
        <header className="mb-8 flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <span className="h-px w-6 bg-zinc-700" />
              <span>Detalle del juego</span>
            </div>
            <h1 className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              {juego.titulo}
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-[11px] text-zinc-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            <span>Entrega digital instantánea</span>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-8 pb-10 lg:grid-cols-2 lg:gap-10">
          <div className="relative flex items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950/60 px-4 py-6 sm:px-6 lg:px-8">
            <div className="relative z-10 aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-0.5 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
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
              <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-950/60 p-1 text-xs">
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
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500"
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
                  className={`rounded-2xl border px-4 py-4 text-left text-xs transition ${
                    !hasPrecioPrincipal
                      ? "cursor-not-allowed border-zinc-800 bg-zinc-950/40 opacity-50"
                      : selectedTipoCuenta === "PRINCIPAL"
                      ? "border-emerald-400/80 bg-emerald-400/10"
                      : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
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
                  className={`rounded-2xl border px-4 py-4 text-left text-xs transition ${
                    !hasPrecioSecundaria
                      ? "cursor-not-allowed border-zinc-800 bg-zinc-950/40 opacity-50"
                      : selectedTipoCuenta === "SECUNDARIA"
                      ? "border-sky-400/80 bg-sky-400/10"
                      : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
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
                    className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-3xl font-extrabold text-transparent"
                  >
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "USD",
                    }).format(precioActual)}
                  </motion.span>
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                onClick={handleAddToCart}
                disabled={!isPrecioSeleccionadoDisponible}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-6 py-4 text-sm font-semibold tracking-wide text-black shadow-[0_0_32px_rgba(34,197,94,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={isPrecioSeleccionadoDisponible ? { scale: 1.02 } : {}}
                whileTap={isPrecioSeleccionadoDisponible ? { scale: 0.97 } : {}}
              >
                <span className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-emerald-400/40 via-cyan-400/40 to-sky-400/40 opacity-60 blur-xl" />
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
