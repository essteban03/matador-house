"use client";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-900 bg-black/80 py-6 text-xs text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-8 lg:px-12">
        {/* Redes */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Síguenos
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-[11px] font-medium text-zinc-200 hover:border-zinc-500"
            >
              <span className="text-base leading-none">🎵</span>
              <span>TikTok</span>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-[11px] font-medium text-zinc-200 hover:border-zinc-500"
            >
              <span className="text-base leading-none">📘</span>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="space-y-2 text-right sm:text-left">
          <p>
            © {new Date().getFullYear()} Matador House — Hecho por gamers para
            gamers.
          </p>
          <p className="text-[11px] text-zinc-500">
            Todos los nombres de productos de PlayStation son marcas
            registradas de Sony Interactive Entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
}

