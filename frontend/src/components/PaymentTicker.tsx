"use client";

import { motion } from "framer-motion";

const BANKS = ["BANCO PICHINCHA", "BANCO GUAYAQUIL", "PRODUBANCO", "DEUNA"] as const;

function BankRow() {
  return (
    <div className="flex min-w-max items-center gap-x-12 px-10">
      {BANKS.map((name, idx) => (
        <div key={name} className="flex items-center gap-x-12">
          <span className="text-xs font-semibold tracking-[0.16em] text-cyan-300 antialiased">
            {name}
          </span>
          {idx !== BANKS.length - 1 && (
            <span className="text-cyan-400/70 antialiased">•</span>
          )}
        </div>
      ))}
      <span className="text-cyan-400/70 antialiased">•</span>
    </div>
  );
}

export function PaymentTicker() {
  return (
    <section className="mb-10 overflow-hidden rounded-2xl border-y border-cyan-800/30 bg-zinc-950/90">
      <div className="relative">
        {/* Fades laterales tipo “ticker” */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-zinc-950/95 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-zinc-950/95 to-transparent" />

        <div className="overflow-hidden py-2">
          <motion.div
            className="flex items-center whitespace-nowrap will-change-transform text-cyan-300"
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            <div className="flex w-1/2 items-center">
              <BankRow />
            </div>
            <div className="flex w-1/2 items-center">
              <BankRow />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

