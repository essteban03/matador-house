"use client";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,11,20,0.92),rgba(8,10,18,0.96))] py-8 text-xs text-zinc-400 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-8 lg:px-12">
        {/* Redes */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Síguenos
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="mh-focus inline-flex items-center gap-1 rounded-lg border border-cyan-300/25 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-medium text-cyan-100 transition hover:scale-105"
            >
              <span className="text-base leading-none">🎵</span>
              <span>TikTok</span>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="mh-focus inline-flex items-center gap-1 rounded-lg border border-fuchsia-300/25 bg-fuchsia-500/10 px-3 py-1.5 text-[11px] font-medium text-fuchsia-100 transition hover:scale-105"
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

