"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../../store/cartStore";

type Duration = "1" | "3" | "12";
type PlanId = "ESSENTIAL" | "EXTRA" | "DELUXE";

type PlanConfig = {
  id: PlanId;
  name: string;
  monthlyPrices: Record<Duration, number>;
};

const PLANS: PlanConfig[] = [
  {
    id: "ESSENTIAL",
    name: "PlayStation Plus Essential",
    monthlyPrices: { "1": 8.99, "3": 24.99, "12": 71.99 },
  },
  {
    id: "EXTRA",
    name: "PlayStation Plus Extra",
    monthlyPrices: { "1": 13.99, "3": 39.99, "12": 125.99 },
  },
  {
    id: "DELUXE",
    name: "PlayStation Plus Deluxe",
    monthlyPrices: { "1": 16.99, "3": 49.99, "12": 151.99 },
  },
];

const DURATIONS: { id: Duration; label: string; payLabel: string }[] = [
  { id: "1", label: "1 mes", payLabel: "Pago único mensual" },
  { id: "3", label: "3 meses", payLabel: "Pago único trimestral" },
  { id: "12", label: "12 meses", payLabel: "Pago único anual" },
];

const COMPARISON_ROWS: {
  label: string;
  description: string;
  icon: string;
  available: { ESSENTIAL: boolean; EXTRA: boolean; DELUXE: boolean };
}[] = [
  {
    label: "Juegos mensuales",
    description:
      "Descarga juegos seleccionados de PS4 y PS5 para sumarlos a tu colección mientras tu suscripción esté activa.",
    icon: "🎮",
    available: { ESSENTIAL: true, EXTRA: true, DELUXE: true },
  },
  {
    label: "Multijugador online",
    description:
      "Conéctate con amigos y la comunidad de PlayStation en experiencias competitivas y cooperativas online.",
    icon: "🌐",
    available: { ESSENTIAL: true, EXTRA: true, DELUXE: true },
  },
  {
    label: "Catálogo de juegos",
    description:
      "Explora una biblioteca de juegos de PS4 y PS5 en constante renovación, lista para descargar y jugar.",
    icon: "📚",
    available: { ESSENTIAL: false, EXTRA: true, DELUXE: true },
  },
  {
    label: "Ubisoft+ Classics",
    description:
      "Acceso a una colección seleccionada de títulos populares de Ubisoft incluida con tu plan.",
    icon: "🌀",
    available: { ESSENTIAL: false, EXTRA: true, DELUXE: true },
  },
  {
    label: "Catálogo de clásicos",
    description:
      "Redescubre títulos de consolas PlayStation anteriores, algunos con mejoras visuales y funciones adicionales.",
    icon: "🕹️",
    available: { ESSENTIAL: false, EXTRA: false, DELUXE: true },
  },
  {
    label: "Pruebas de juegos",
    description:
      "Prueba juegos completos durante un periodo de tiempo limitado y conserva tu progreso si decides adquirirlos.",
    icon: "⏱️",
    available: { ESSENTIAL: false, EXTRA: false, DELUXE: true },
  },
];

export default function PsPlusPage() {
  const { addToCart, openCart } = useCartStore();
  const [selectedDuration, setSelectedDuration] = useState<Duration>("12");

  const handleAdd = (plan: PlanConfig) => {
    const precio = plan.monthlyPrices[selectedDuration];
    addToCart({
      gameId: plan.id === "ESSENTIAL" ? 1001 : plan.id === "EXTRA" ? 1002 : 1003,
      titulo: `${plan.name} (${selectedDuration} meses)`,
      consola: "PSN",
      tipoCuenta: plan.id,
      precio,
    });
    openCart();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#0b1220,_#020617_45%,_#000_80%)] text-zinc-50">
      {/* Fondo atmosférico vivo */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          className="absolute -top-32 left-10 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl"
          animate={{ y: [0, 20, -10, 0], opacity: [0.5, 0.8, 0.4, 0.5] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-10 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ y: [0, -25, 10, 0], opacity: [0.4, 0.7, 0.3, 0.4] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-6rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/16 blur-3xl"
          animate={{ y: [0, -12, 6, 0], opacity: [0.35, 0.6, 0.3, 0.35] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        <header className="mb-10 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-blue-200/80">
            <span className="h-1 w-1 rounded-full bg-blue-300" />
            <span>PlayStation Plus</span>
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl bg-[linear-gradient(120deg,#60a5fa_0%,#e5e7eb_40%,#fbbf24_80%)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl"
            style={{ backgroundSize: "200% 200%" }}
          >
            <motion.span
              animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              DOMINA TU CONSOLA CON PS PLUS
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-2xl text-sm text-zinc-300 sm:text-[15px]"
          >
            Accede a cientos de juegos y beneficios exclusivos en Matador House.
          </motion.p>
        </header>

        {/* Selector */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-400">
            Selecciona duración (afecta a todos los precios).
          </p>
          <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-950/70 p-1 text-[11px]">
            {DURATIONS.map((d) => {
              const active = selectedDuration === d.id;
              return (
                <motion.button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDuration(d.id)}
                  className={`relative flex-1 rounded-full px-3 py-1.5 font-semibold transition-colors ${
                    active
                      ? "text-zinc-50"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                  layout
                >
                  {active && (
                    <motion.span
                      layoutId="psplus-duration-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 shadow-[0_0_18px_rgba(37,99,235,0.7)]"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 26,
                      }}
                    />
                  )}
                  <span className="relative z-10">{d.label}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Cards de planes */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const precio = plan.monthlyPrices[selectedDuration];
            const commonPrice = (
              <div className="mt-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Desde
                </p>
                <motion.p
                  key={`${plan.id}-card-${selectedDuration}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-r from-blue-200 via-white to-amber-200 bg-clip-text text-2xl font-extrabold text-transparent"
                >
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "USD",
                  }).format(precio)}
                </motion.p>
                <p className="text-[10px] text-zinc-400">
                  {DURATIONS.find((d) => d.id === selectedDuration)?.payLabel}
                </p>
              </div>
            );

            const benefits =
              plan.id === "ESSENTIAL"
                ? [
                    "Juegos mensuales para PS4 y PS5",
                    "Multijugador online",
                    "Descuentos exclusivos",
                    "Almacenamiento en la nube para partidas",
                  ]
                : plan.id === "EXTRA"
                ? [
                    "Incluye todo Essential",
                    "Catálogo de cientos de juegos",
                    "Ubisoft+ Classics incluidos",
                    "Juegos de PS4 y PS5 listos para descargar",
                  ]
                : [
                    "Incluye todo Extra",
                    "Catálogo de clásicos",
                    "Pruebas de juegos con tiempo limitado",
                    "Títulos de generaciones anteriores mejorados",
                  ];

            const baseClasses =
              "relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-4 text-xs shadow-[0_0_35px_rgba(0,0,0,0.65)] origin-center";

            const colorsByPlan: Record<PlanId, string> = {
              ESSENTIAL:
                "border-blue-300/60 bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 text-zinc-900",
              EXTRA:
                "border-amber-400/70 bg-gradient-to-b from-yellow-400 via-amber-400 to-orange-400 text-zinc-950",
              DELUXE:
                "border-amber-500/70 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-amber-50",
            };

            const badgeByPlan: Record<PlanId, string> = {
              ESSENTIAL: "Entrada esencial al online",
              EXTRA: "Catálogo ampliado de juegos",
              DELUXE: "Experiencia completa PlayStation Plus",
            };

            return (
              <motion.article
                key={plan.id}
                className={`${baseClasses} ${colorsByPlan[plan.id]}`}
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  rotateX: -6,
                  rotateY: plan.id === "ESSENTIAL" ? -4 : plan.id === "EXTRA" ? 0 : 4,
                  boxShadow:
                    plan.id === "ESSENTIAL"
                      ? "0 0 40px rgba(59,130,246,0.7)"
                      : plan.id === "EXTRA"
                      ? "0 0 40px rgba(251,191,36,0.8)"
                      : "0 0 45px rgba(251,191,36,0.95)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {plan.id === "DELUXE" && (
                  <div className="pointer-events-none absolute inset-px rounded-[1.4rem] border border-amber-400/60 shadow-[0_0_35px_rgba(251,191,36,0.7)]" />
                )}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500/80">
                      {plan.id}
                    </p>
                    {plan.id === "DELUXE" && (
                      <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                        Premium
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-bold tracking-tight">
                    {plan.name}
                  </h2>
                  <p
                    className={`text-[11px] ${
                      plan.id === "ESSENTIAL"
                        ? "text-zinc-700"
                        : plan.id === "EXTRA"
                        ? "text-amber-900/90"
                        : "text-amber-100/80"
                    }`}
                  >
                    {badgeByPlan[plan.id]}
                  </p>
                  {commonPrice}
                  <ul className="mt-3 space-y-1.5">
                    {benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-[11px]"
                      >
                        <span
                          className={
                            plan.id === "ESSENTIAL"
                              ? "mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500"
                              : plan.id === "EXTRA"
                              ? "mt-0.5 h-1.5 w-1.5 rounded-full bg-orange-600"
                              : "mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400"
                          }
                        />
                        <span
                          className={
                            plan.id === "ESSENTIAL"
                              ? "text-zinc-700"
                              : plan.id === "EXTRA"
                              ? "text-amber-950"
                              : "text-amber-100/90"
                          }
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative z-10 mt-4">
                  <motion.button
                    type="button"
                    onClick={() => handleAdd(plan)}
                    className={`w-full rounded-2xl px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[0_0_20px_rgba(0,0,0,0.35)] ${
                      plan.id === "ESSENTIAL"
                        ? "bg-blue-600 text-zinc-50 hover:bg-blue-500"
                        : plan.id === "EXTRA"
                        ? "bg-orange-700 text-zinc-50 hover:bg-orange-600"
                        : "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black hover:from-amber-300 hover:via-yellow-200 hover:to-amber-400"
                    }`}
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    animate={{
                      boxShadow: [
                        "0 0 18px rgba(15,23,42,0.8)",
                        "0 0 26px rgba(59,130,246,0.9)",
                        "0 0 18px rgba(15,23,42,0.8)",
                      ],
                    }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Añadir al carrito
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* Tabla horizontal */}
        <section className="mb-10">
          <div className="overflow-x-auto">
            <div className="min-w-[720px] rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-[0_0_45px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <div className="grid grid-cols-[2fr,1fr,1fr,1fr] items-end border-b border-zinc-800 pb-4 text-xs text-zinc-300">
                <div className="text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    CARACTERÍSTICA
                  </p>
                </div>
                {PLANS.map((plan) => {
                  const precio = plan.monthlyPrices[selectedDuration];
                  const planLabel =
                    plan.id === "ESSENTIAL"
                      ? "ESSENTIAL"
                      : plan.id === "EXTRA"
                      ? "EXTRA"
                      : "DELUXE";
                  const payLabel = DURATIONS.find((d) => d.id === selectedDuration)
                    ?.payLabel;
                  return (
                    <div key={plan.id} className="space-y-1 text-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                        {planLabel}
                      </p>
                      <motion.p
                        key={`${plan.id}-${selectedDuration}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-base font-semibold text-zinc-50"
                      >
                        {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "USD",
                        }).format(precio)}
                      </motion.p>
                      <p className="text-[10px] text-zinc-500">{payLabel}</p>
                    </div>
                  );
                })}
              </div>

              <div className="text-xs">
                {COMPARISON_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[2fr,1fr,1fr,1fr] items-stretch border-b border-zinc-800 py-6"
                  >
                    <div className="pr-3 text-left">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/80 text-base">
                          {row.icon}
                        </span>
                        <div>
                          <p className="text-[13px] font-medium text-zinc-100">
                            {row.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-zinc-500">
                            {row.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    {PLANS.map((plan) => {
                      const included = row.available[plan.id];
                      return (
                        <div
                          key={`${row.label}-${plan.id}`}
                          className="flex items-center justify-center text-center"
                        >
                          {included ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)]">
                              ✓
                            </span>
                          ) : (
                            <span className="text-lg text-zinc-600">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-zinc-900 pt-4 text-xs">
                <div className="grid grid-cols-[2fr,1fr,1fr,1fr] items-center gap-2">
                  <p className="pr-3 text-left text-[11px] text-zinc-500">
                    Añade tu plan al carrito para completar el pedido.
                  </p>
                  {PLANS.map((plan) => (
                    <div
                      key={`cta-${plan.id}`}
                      className="flex items-center justify-center"
                    >
                      <motion.button
                        type="button"
                        onClick={() => handleAdd(plan)}
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-50 shadow-[0_0_20px_rgba(37,99,235,0.7)] hover:from-blue-500 hover:via-indigo-400 hover:to-sky-400"
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Añadir al carrito
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

