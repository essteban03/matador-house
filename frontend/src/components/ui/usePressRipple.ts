"use client";

import { useCallback } from "react";

type RippleEvent = {
  clientX: number;
  clientY: number;
  target: EventTarget | null;
};

export function usePressRipple() {
  return useCallback((event: RippleEvent) => {
    if (typeof window === "undefined") return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const host = target.closest(".mh-pressable");
    if (!(host instanceof HTMLElement)) return;

    const rect = host.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    const ripple = document.createElement("span");
    ripple.className = "mh-ripple";
    ripple.style.setProperty("--x", `${x - rect.left}px`);
    ripple.style.setProperty("--y", `${y - rect.top}px`);
    host.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 580);
  }, []);
}

