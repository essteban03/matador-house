"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart } = useCartStore();

  const total = items.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) return;

    const lineas = items.map((item, index) => {
      const subtotal = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(item.precio * item.quantity);

      return `${index + 1}. ${item.titulo} - ${item.consola} - ${item.tipoCuenta} x${item.quantity} - ${subtotal}`;
    });

    const totalFormatted = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(total);

    const mensaje = `Hola, quiero completar mi pedido en Matador House:%0A%0A${lineas.join(
      "%0A"
    )}%0A%0ATotal: ${totalFormatted}`;

    const url = `https://wa.me/593962545689?text=${mensaje}`;

    window.open(url, "_blank");
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-cyan-300/15 bg-[linear-gradient(160deg,rgba(10,16,30,0.95),rgba(8,12,24,0.9))] backdrop-blur-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  Carrito
                </p>
                <p className="text-sm font-medium text-zinc-100">
                  {items.length}{" "}
                  {items.length === 1 ? "artículo" : "artículos"} seleccionados
                </p>
              </div>
              <button
                onClick={closeCart}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700/80 text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-100"
                aria-label="Cerrar carrito"
              >
                <span className="text-sm">×</span>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-zinc-500">
                  <p>Tu carrito está vacío.</p>
                  <p className="text-xs text-zinc-600">
                    Explora el catálogo y añade tus juegos favoritos.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/45 p-3 text-xs backdrop-blur-lg"
                    >
                      {/* Mini indicador visual */}
                      <div className="mt-1 h-10 w-10 flex-none rounded-xl bg-gradient-to-br from-cyan-500/40 via-fuchsia-500/25 to-zinc-900" />

                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="line-clamp-2 text-xs font-medium text-zinc-100">
                              {item.titulo}
                            </p>
                            <div className="flex flex-wrap items-center gap-1 text-[10px] text-zinc-400">
                              <span className="rounded-full bg-zinc-900/90 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-300">
                                {item.consola}
                              </span>
                              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
                                {item.tipoCuenta}
                              </span>
                              <span className="text-zinc-500">
                                x{item.quantity}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border border-zinc-800 text-[11px] text-zinc-500 transition hover:border-red-500/70 hover:bg-red-500/10 hover:text-red-400"
                            aria-label="Eliminar del carrito"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                          <span>Subtotal</span>
                          <span className="font-semibold text-zinc-100">
                            {new Intl.NumberFormat("es-ES", {
                              style: "currency",
                              currency: "EUR",
                            }).format(item.precio * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-gradient-to-t from-black/50 to-zinc-950/80 px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Total a pagar</span>
                <span className="mh-gradient-text text-lg font-extrabold">
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(total)}
                </span>
              </div>

              <motion.button
                type="button"
                disabled={items.length === 0}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-6 py-3 text-sm font-semibold tracking-wide text-black shadow-[0_0_28px_rgba(34,197,94,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={items.length > 0 ? { scale: 1.02 } : {}}
                whileTap={items.length > 0 ? { scale: 0.97 } : {}}
                onClick={handleCheckout}
              >
                <span className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-emerald-400/40 via-cyan-400/40 to-sky-400/40 opacity-60 blur-xl" />
                <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.7),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.6),transparent_55%)] opacity-80" />
                <span>Proceder al pago</span>
              </motion.button>

              <p className="mt-2 text-[10px] text-zinc-500">
                No se realizará ningún cobro todavía. En el siguiente paso podrás
                revisar tus datos y método de pago.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

