"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type TabId = "PS5" | "PS4";

const TABS: { id: TabId; label: string; subtitle: string }[] = [
  { id: "PS5", label: "Guía PS5", subtitle: "Instrucciones para PlayStation 5" },
  { id: "PS4", label: "Guía PS4", subtitle: "Instrucciones para PlayStation 4" },
];

export default function GuiaPage() {
  const [activeTab, setActiveTab] = useState<TabId>("PS5");

  const whatsappUrl =
    "https://wa.me/593962545689?text=Hola%20Matador%20House,%20tengo%20dudas%20sobre%20la%20gu%C3%ADa%20de%20activaci%C3%B3n.";

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
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Guía técnica
          </p>
          <h1 className="mh-gradient-text text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cómo activar tus juegos digitales de Matador House
          </h1>
          <p className="max-w-2xl text-sm text-zinc-300">
            Sigue estos pasos exactamente como se indican. Esta guía está basada
            en los flujos oficiales de PlayStation para garantizar la máxima
            estabilidad y seguridad de tu cuenta.
          </p>
        </header>

        {/* Tabs */}
        <section className="mb-8">
          <div className="inline-flex rounded-2xl border border-white/10 bg-zinc-950/60 p-1 text-xs backdrop-blur-xl">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 rounded-xl px-5 py-3 text-left transition-colors ${
                    active
                      ? "text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                  whileTap={{ scale: 0.97 }}
                  layout
                >
                  {active && (
                    <motion.span
                      layoutId="guia-tab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 shadow-[0_0_24px_rgba(34,211,238,0.5)]"
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    />
                  )}
                  <span className="relative z-10 flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                      {tab.label}
                    </span>
                    <span className="mt-0.5 text-[11px] text-zinc-400">
                      {tab.subtitle}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Content */}
        <main className="flex-1 space-y-10">
          {activeTab === "PS5" ? <Ps5Guide /> : <Ps4Guide />}

          {/* Reglas de oro */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
              Reglas de oro de seguridad
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                "Prohibido cambiar el correo o contraseña de la cuenta (garantía anulada).",
                "No borres el usuario de la consola o perderás el acceso al juego.",
                "No intentes activar una cuenta secundaria como principal.",
              ].map((rule) => (
                <div
                  key={rule}
                  className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent px-4 py-3 text-xs text-amber-100 shadow-[0_0_28px_rgba(250,204,21,0.25)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(250,204,21,0.35),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(248,113,113,0.25),transparent_55%)] opacity-50" />
                  <div className="relative flex items-start gap-2">
                    <span className="mt-0.5 text-lg leading-none text-amber-300">
                      ⚠️
                    </span>
                    <p>{rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Soporte */}
          <section className="mt-4 flex flex-col items-start gap-3 border-t border-zinc-900 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
              ¿Sigues teniendo dudas o ves un mensaje de error diferente al de
              esta guía? Nuestro equipo te ayuda a completar la activación.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-5 py-2 text-xs font-semibold text-black shadow-[0_0_26px_rgba(34,197,94,0.6)] hover:from-emerald-400 hover:via-cyan-400 hover:to-sky-400"
            >
              <span className="text-lg leading-none">💬</span>
              <span>¿Aún tienes dudas? Escríbenos al soporte</span>
            </a>
          </section>
        </main>
      </div>
    </div>
  );
}

function Step({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Línea vertical */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 text-xs font-bold text-black shadow-[0_0_18px_rgba(34,197,94,0.8)]">
          {index}
        </div>
        <div className="mt-1 h-full w-px flex-1 bg-gradient-to-b from-emerald-400/40 via-zinc-700/40 to-zinc-900/0" />
      </div>
      <div className="pb-6">
        <h4 className="text-sm font-semibold text-zinc-50">{title}</h4>
        <p className="mt-1 text-xs text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

function Ps5Guide() {
  return (
    <section className="grid gap-8 md:grid-cols-2">
      {/* PS5 Principal */}
      <div className="mh-organic-card mh-glass rounded-3xl border border-white/10 p-5 shadow-[0_0_30px_rgba(10,16,30,0.65)]">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          PS5 · Cuenta principal
        </h2>
        <h3 className="mb-4 text-lg font-bold text-zinc-50">
          Activación como cuenta principal (jugar desde tu usuario)
        </h3>
        <div className="space-y-2">
          <Step
            index={1}
            title="Crea un nuevo usuario en tu PS5"
            description="Desde la pantalla inicial, ve a 'Configuración rápida de usuario' o 'Añadir usuario' y crea un nuevo usuario en la consola."
          />
          <Step
            index={2}
            title="Introduce el correo y contraseña entregados"
            description="En ese usuario nuevo, inicia sesión con el correo y la contraseña que te entregamos desde Matador House."
          />
          <Step
            index={3}
            title="Activa compartir consola y juego fuera de línea"
            description="Ve a 'Ajustes' > 'Usuarios y cuentas' > 'Otros' > 'Compartir consola y juego fuera de línea' y selecciona 'Activar'."
          />
          <Step
            index={4}
            title="Descarga el juego desde la Biblioteca"
            description="Desde el usuario que te entregamos, entra en 'Biblioteca de juegos', localiza el título comprado y ponlo a descargar en tu PS5."
          />
          <Step
            index={5}
            title="Juega desde tu usuario personal"
            description="Una vez que el juego esté descargado, cambia a tu usuario personal de siempre. Podrás jugar con tu propio perfil y trofeos."
          />
        </div>
      </div>

      {/* PS5 Secundaria */}
      <div className="mh-organic-card mh-glass rounded-3xl border border-white/10 p-5 shadow-[0_0_30px_rgba(10,16,30,0.65)]">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          PS5 · Cuenta secundaria
        </h2>
        <h3 className="mb-4 text-lg font-bold text-zinc-50">
          Activación como cuenta secundaria (jugar desde el usuario entregado)
        </h3>
        <div className="space-y-2">
          <Step
            index={1}
            title="Crea el usuario con los datos entregados"
            description="Añade un nuevo usuario en tu PS5 e inicia sesión con el correo y contraseña que te enviamos."
          />
          <Step
            index={2}
            title="No actives compartir consola y juego fuera de línea"
            description="Ve a 'Ajustes' > 'Usuarios y cuentas' > 'Otros' > 'Compartir consola y juego fuera de línea' y asegúrate de que esté en 'No activar' o 'Desactivar'."
          />
          <Step
            index={3}
            title="Descarga el juego desde la Biblioteca"
            description="En ese mismo usuario, ve a la 'Biblioteca de juegos' y pon a descargar el título."
          />
          <Step
            index={4}
            title="Juega siempre desde el usuario entregado"
            description="Para jugar, deberás iniciar sesión y permanecer conectado con el usuario que te entregamos. Es obligatorio tener conexión a internet."
          />
        </div>
      </div>
    </section>
  );
}

function Ps4Guide() {
  return (
    <section className="grid gap-8 md:grid-cols-2">
      {/* PS4 Principal */}
      <div className="mh-organic-card mh-glass rounded-3xl border border-white/10 p-5 shadow-[0_0_30px_rgba(10,16,30,0.65)]">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          PS4 · Cuenta principal
        </h2>
        <h3 className="mb-4 text-lg font-bold text-zinc-50">
          Activación como PS4 principal
        </h3>
        <div className="space-y-2">
          <Step
            index={1}
            title="Crea un nuevo usuario en tu PS4"
            description="Desde la pantalla inicial, selecciona 'Nuevo usuario' > 'Crear un usuario' y acepta los términos."
          />
          <Step
            index={2}
            title="Inicia sesión con la cuenta entregada"
            description="Introduce el correo electrónico y la contraseña que te proporcionamos para iniciar sesión en PlayStation Network."
          />
          <Step
            index={3}
            title="Activa esta PS4 como principal"
            description="Ve a 'Ajustes' > 'Gestión de cuentas' > 'Activar como tu PS4 principal' y selecciona 'Activar'."
          />
          <Step
            index={4}
            title="Descarga el juego desde la Biblioteca"
            description="En 'Biblioteca' > 'Comprado', localiza el juego y selecciona 'Descargar' para instalarlo en tu consola."
          />
          <Step
            index={5}
            title="Juega desde tu usuario habitual"
            description="Tras la descarga, puedes cambiar a tu usuario personal y jugar con tu propio perfil, siempre que esta PS4 siga activada como principal."
          />
        </div>
      </div>

      {/* PS4 Secundaria */}
      <div className="mh-organic-card mh-glass rounded-3xl border border-white/10 p-5 shadow-[0_0_30px_rgba(10,16,30,0.65)]">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          PS4 · Cuenta secundaria
        </h2>
        <h3 className="mb-4 text-lg font-bold text-zinc-50">
          Uso como cuenta secundaria (sin activar como principal)
        </h3>
        <div className="space-y-2">
          <Step
            index={1}
            title="Crear usuario con los datos entregados"
            description="En tu PS4, selecciona 'Nuevo usuario' e inicia sesión con el correo y contraseña que recibiste de Matador House."
          />
          <Step
            index={2}
            title="No activar como PS4 principal"
            description="Cuando entres en 'Ajustes' > 'Gestión de cuentas', asegúrate de que NO activas esta PS4 como principal para esta cuenta."
          />
          <Step
            index={3}
            title="Descargar el juego"
            description="Desde ese mismo usuario, ve a 'Biblioteca' > 'Comprado' y descarga el juego correspondiente."
          />
          <Step
            index={4}
            title="Jugar siempre desde el usuario entregado"
            description="Para poder lanzar el juego tendrás que iniciar sesión con este usuario y permanecer conectado a PlayStation Network."
          />
        </div>
      </div>
    </section>
  );
}

