"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ⚠️ IMPORTANTE: cambia esta llave en producción o muévela a variables de entorno.
const SECRET_KEY = "Matador2026";
const SESSION_KEY = "matador_vault_authenticated";

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

type FormState = {
  titulo: string;
  consola: string;
  genero: string;
  categoria: string;
  descripcion: string;
  precioPrincipal: string;
  precioSecundaria: string;
  precioOfertaPrincipal: string;
  precioOfertaSecundaria: string;
  ofertaDesde: string;
  ofertaHasta: string;
  pesoGb: string;
  imagenUrl: string;
};

const initialFormState: FormState = {
  titulo: "",
  consola: "PS5",
  genero: "",
  categoria: "",
  descripcion: "",
  precioPrincipal: "",
  precioSecundaria: "",
  precioOfertaPrincipal: "",
  precioOfertaSecundaria: "",
  ofertaDesde: "",
  ofertaHasta: "",
  pesoGb: "",
  imagenUrl: "",
};

type StockFormState = {
  email: string;
  password: string;
  tipoCuenta: "PRINCIPAL" | "SECUNDARIA";
};

const initialStockForm: StockFormState = {
  email: "",
  password: "",
  tipoCuenta: "PRINCIPAL",
};

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const API_BASE = `${API_ORIGIN.replace(/\/$/, "")}/api/videojuegos`;

// Demanda principal: ocultar herramientas de carga de stock en el admin.
// Se mantiene la lógica/modal para uso futuro.
const SHOW_STOCK_TOOLS = false;

function AdminDashboard() {
  const [games, setGames] = useState<Videojuego[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockTarget, setStockTarget] = useState<Videojuego | null>(null);
  const [stockForm, setStockForm] = useState<StockFormState>(initialStockForm);
  const [saving, setSaving] = useState(false);

  const isPsPlus = useMemo(
    () => form.categoria.trim().toLowerCase() === "psn plus",
    [form.categoria]
  );

  const isOfertaActiva = (g: Videojuego) => {
    const now = new Date();
    const start = g.ofertaDesde ? new Date(`${g.ofertaDesde}T00:00:00`) : null;
    const end = g.ofertaHasta ? new Date(`${g.ofertaHasta}T23:59:59`) : null;

    const hasOferta =
      (g.precioOfertaPrincipal ?? 0) > 0 || (g.precioOfertaSecundaria ?? 0) > 0;

    return (
      hasOferta &&
      start != null &&
      end != null &&
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      now >= start &&
      now <= end
    );
  };

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar el catálogo");
      const data: Videojuego[] = await res.json();
      setGames(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: Videojuego) => {
    setEditingId(g.id);
    setForm({
      titulo: g.titulo ?? "",
      consola: g.consola ?? "PS5",
      genero: g.genero ?? "",
      categoria: g.categoria ?? "",
      descripcion: g.descripcion ?? "",
      precioPrincipal: String(g.precioPrincipal ?? ""),
      precioSecundaria: String(g.precioSecundaria ?? ""),
      precioOfertaPrincipal: g.precioOfertaPrincipal == null ? "" : String(g.precioOfertaPrincipal),
      precioOfertaSecundaria: g.precioOfertaSecundaria == null ? "" : String(g.precioOfertaSecundaria),
      ofertaDesde: g.ofertaDesde ?? "",
      ofertaHasta: g.ofertaHasta ?? "",
      pesoGb: g.pesoGb == null ? "" : String(g.pesoGb),
      imagenUrl: g.imagenUrl ?? "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este videojuego?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      await fetchGames();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error eliminando");
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload: Partial<Videojuego> = {
        titulo: form.titulo.trim(),
        consola: form.consola,
        genero: form.genero.trim() || null,
        categoria: form.categoria.trim() || null,
        descripcion: form.descripcion.trim() || null,
        imagenUrl: form.imagenUrl.trim() || null,
        precioPrincipal: Number(form.precioPrincipal),
        precioSecundaria: Number(form.precioSecundaria),
        precioOfertaPrincipal: Number(form.precioOfertaPrincipal),
        precioOfertaSecundaria: Number(form.precioOfertaSecundaria),
        ofertaDesde: form.ofertaDesde === "" ? null : form.ofertaDesde,
        ofertaHasta: form.ofertaHasta === "" ? null : form.ofertaHasta,
        pesoGb: isPsPlus ? null : form.pesoGb === "" ? null : Number(form.pesoGb),
        enStock: true,
      };

      const isEdit = editingId != null;
      const url = isEdit ? `${API_BASE}/${editingId}` : API_BASE;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Error guardando el videojuego");
      }

      await fetchGames();
      closeModal();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  const openStockModal = (g: Videojuego) => {
    setStockTarget(g);
    setStockForm(initialStockForm);
    setIsStockModalOpen(true);
  };

  const closeStockModal = () => {
    setIsStockModalOpen(false);
    setStockTarget(null);
    setStockForm(initialStockForm);
  };

  const handleAddStock = async () => {
    if (!stockTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/${stockTarget.id}/cuentas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: stockForm.email.trim(),
          password: stockForm.password,
          tipoCuenta: stockForm.tipoCuenta,
          estado: "DISPONIBLE",
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "No se pudo cargar la cuenta");
      }
      await fetchGames();
      closeStockModal();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error cargando stock");
    } finally {
      setSaving(false);
    }
  };

  const sortedGames = useMemo(
    () => [...games].sort((a, b) => a.titulo.localeCompare(b.titulo)),
    [games]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-6xl px-4 py-10 sm:px-8 lg:px-12"
    >
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Panel de administración
          </p>
          <h1 className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Matador House Dashboard
          </h1>
          <p className="text-sm text-zinc-300">
            Gestiona catálogo y stock de cuentas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={fetchGames}
            className="rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Refrescar
          </motion.button>
          <motion.button
            type="button"
            onClick={handleOpenNew}
            className="rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.55)]"
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Nuevo juego
          </motion.button>
        </div>
      </header>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 shadow-[0_0_45px_rgba(0,0,0,0.6)] backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-xs">
            <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              <tr>
                <th className="px-5 py-4">Título</th>
                <th className="px-5 py-4">Consola</th>
                <th className="px-5 py-4">Categoría</th>
                <th className="px-5 py-4">Precio P</th>
                <th className="px-5 py-4">Precio S</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {loading ? (
                <tr>
                  <td className="px-5 py-10 text-zinc-400" colSpan={7}>
                    Cargando...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-5 py-10 text-rose-300" colSpan={7}>
                    {error}
                  </td>
                </tr>
              ) : sortedGames.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-zinc-400" colSpan={7}>
                    No hay videojuegos registrados.
                  </td>
                </tr>
              ) : (
                sortedGames.map((g) => (
                  <tr key={g.id} className="hover:bg-zinc-900/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                          {g.imagenUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={g.imagenUrl}
                              alt={g.titulo}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-100">
                            {g.titulo}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {g.genero ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-200">{g.consola}</td>
                    <td className="px-5 py-4 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{g.categoria ?? "—"}</span>
                        {isOfertaActiva(g) && (
                          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                            OFERTA ACTIVA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-200">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "USD",
                      }).format(g.precioPrincipal ?? 0)}
                    </td>
                    <td className="px-5 py-4 text-zinc-200">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "USD",
                      }).format(g.precioSecundaria ?? 0)}
                    </td>
                    <td className="px-5 py-4 text-zinc-200">
                      {(g.stockPrincipal ?? 0) +
                        " P / " +
                        (g.stockSecundaria ?? 0) +
                        " S"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {SHOW_STOCK_TOOLS && (
                          <button
                            type="button"
                            onClick={() => openStockModal(g)}
                            className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-[11px] font-semibold text-zinc-200 hover:border-zinc-700"
                          >
                            Cargar stock
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(g)}
                          className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-[11px] font-semibold text-zinc-200 hover:border-zinc-700"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(g.id)}
                          className="rounded-full border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-[11px] font-semibold text-rose-200 hover:border-rose-700/70 hover:text-rose-100"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Nuevo/Editar */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_60px_rgba(0,0,0,0.7)]"
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    {editingId ? "Editar videojuego" : "Nuevo videojuego"}
                  </p>
                  <h2 className="text-lg font-semibold text-zinc-100">
                    {editingId ? "Actualizar ficha" : "Crear ficha"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300 hover:border-zinc-700"
                >
                  Cerrar
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Título</span>
                  <input
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Consola</span>
                  <select
                    value={form.consola}
                    onChange={(e) => setForm({ ...form, consola: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  >
                    <option value="PS5">PS5</option>
                    <option value="PS4">PS4</option>
                  </select>
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Género</span>
                  <input
                    value={form.genero}
                    onChange={(e) => setForm({ ...form, genero: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Categoría</span>
                  <input
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    placeholder="Ej: Acción, Deportes, PSN Plus"
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Precio Principal (USD)</span>
                  <input
                    value={form.precioPrincipal}
                    onChange={(e) =>
                      setForm({ ...form, precioPrincipal: e.target.value })
                    }
                    inputMode="decimal"
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Precio Secundaria (USD)</span>
                  <input
                    value={form.precioSecundaria}
                    onChange={(e) =>
                      setForm({ ...form, precioSecundaria: e.target.value })
                    }
                    inputMode="decimal"
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>

                {/* Oferta de Marzo */}
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Oferta Desde</span>
                  <input
                    type="date"
                    value={form.ofertaDesde}
                    onChange={(e) =>
                      setForm({ ...form, ofertaDesde: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Oferta Hasta</span>
                  <input
                    type="date"
                    value={form.ofertaHasta}
                    onChange={(e) =>
                      setForm({ ...form, ofertaHasta: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Precio Oferta Principal (USD)</span>
                  <input
                    value={form.precioOfertaPrincipal}
                    onChange={(e) =>
                      setForm({ ...form, precioOfertaPrincipal: e.target.value })
                    }
                    inputMode="decimal"
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Precio Oferta Secundaria (USD)</span>
                  <input
                    value={form.precioOfertaSecundaria}
                    onChange={(e) =>
                      setForm({ ...form, precioOfertaSecundaria: e.target.value })
                    }
                    inputMode="decimal"
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                {!isPsPlus && (
                  <label className="space-y-2 text-xs text-zinc-400">
                    <span>Peso (GB)</span>
                    <input
                      value={form.pesoGb}
                      onChange={(e) => setForm({ ...form, pesoGb: e.target.value })}
                      inputMode="decimal"
                      className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                    />
                  </label>
                )}
                <label className="space-y-2 text-xs text-zinc-400 sm:col-span-2">
                  <span>URL de imagen</span>
                  <input
                    value={form.imagenUrl}
                    onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400 sm:col-span-2">
                  <span>Descripción</span>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-700"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.55)] disabled:opacity-60"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear juego"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Stock */}
      <AnimatePresence>
        {isStockModalOpen && stockTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStockModal}
          >
            <motion.div
              className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_60px_rgba(0,0,0,0.7)]"
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Cargar cuentas
                  </p>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {stockTarget.titulo}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeStockModal}
                  className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300 hover:border-zinc-700"
                >
                  Cerrar
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Email</span>
                  <input
                    value={stockForm.email}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400">
                  <span>Password</span>
                  <input
                    value={stockForm.password}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, password: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                </label>
                <label className="space-y-2 text-xs text-zinc-400 sm:col-span-2">
                  <span>Tipo</span>
                  <select
                    value={stockForm.tipoCuenta}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        tipoCuenta: e.target.value as StockFormState["tipoCuenta"],
                      })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
                  >
                    <option value="PRINCIPAL">Principal</option>
                    <option value="SECUNDARIA">Secundaria</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStockModal}
                  className="rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-700"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <motion.button
                  type="button"
                  onClick={handleAddStock}
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.55)] disabled:opacity-60"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? "Guardando..." : "Guardar cuenta"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MatadorVaultPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  });
  const [accessKey, setAccessKey] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (accessKey === SECRET_KEY) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SESSION_KEY, "true");
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      setAccessKey("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-zinc-50">
      {!isAuthenticated && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: shake ? [-4, 4, -3, 3, 0] : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xs rounded-3xl border border-cyan-500/40 bg-black/60 px-5 py-6 shadow-[0_0_40px_rgba(34,197,235,0.55)]"
          >
            <div className="absolute inset-x-10 -top-8 mx-auto h-10 w-10 rounded-2xl border border-cyan-400/50 bg-gradient-to-br from-cyan-500 via-emerald-400 to-sky-500 text-black shadow-[0_0_30px_rgba(34,197,235,0.8)]" />
            <div className="mb-5 pt-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-300/80">
                Matador Vault
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                Acceso restringido al panel interno.
              </p>
            </div>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Ingrese la llave de la bóveda"
              className="mb-4 w-full rounded-2xl border border-cyan-500/50 bg-black/60 px-4 py-2.5 text-xs text-cyan-100 outline-none ring-cyan-400/10 placeholder:text-cyan-700 focus:border-cyan-300 focus:ring-2"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_24px_rgba(34,197,235,0.85)] hover:from-cyan-400 hover:via-emerald-300 hover:to-sky-400"
            >
              Desbloquear bóveda
            </button>
          </motion.form>
        </div>
      )}

      {isAuthenticated && <AdminDashboard />}
    </div>
  );
}

