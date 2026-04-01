"use client";

import { useCallback, useRef } from "react";

export function useUiSound() {
  const lastPlayAtRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClick = useCallback(() => {
    const now = Date.now();
    if (now - lastPlayAtRef.current < 180) return;
    lastPlayAtRef.current = now;

    if (typeof window === "undefined") return;
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const nowTime = ctx.currentTime;
    const master = ctx.createGain();
    const lowpass = ctx.createBiquadFilter();
    const oscFundamental = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gainFundamental = ctx.createGain();
    const gainHarmonic = ctx.createGain();

    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(980, nowTime);
    lowpass.Q.setValueAtTime(0.9, nowTime);

    master.gain.setValueAtTime(0.0001, nowTime);
    master.gain.exponentialRampToValueAtTime(0.11, nowTime + 0.025);
    master.gain.exponentialRampToValueAtTime(0.015, nowTime + 0.2);
    master.gain.exponentialRampToValueAtTime(0.0001, nowTime + 0.42);

    oscFundamental.type = "sine";
    oscFundamental.frequency.setValueAtTime(196, nowTime);
    oscFundamental.frequency.exponentialRampToValueAtTime(164, nowTime + 0.22);

    oscHarmonic.type = "triangle";
    oscHarmonic.frequency.setValueAtTime(330, nowTime);
    oscHarmonic.frequency.exponentialRampToValueAtTime(247, nowTime + 0.18);

    gainFundamental.gain.setValueAtTime(0.0001, nowTime);
    gainFundamental.gain.exponentialRampToValueAtTime(0.9, nowTime + 0.02);
    gainFundamental.gain.exponentialRampToValueAtTime(0.0001, nowTime + 0.32);

    gainHarmonic.gain.setValueAtTime(0.0001, nowTime);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.36, nowTime + 0.03);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, nowTime + 0.26);

    oscFundamental.connect(gainFundamental);
    oscHarmonic.connect(gainHarmonic);
    gainFundamental.connect(lowpass);
    gainHarmonic.connect(lowpass);
    lowpass.connect(master);
    master.connect(ctx.destination);

    oscFundamental.start(nowTime);
    oscHarmonic.start(nowTime);
    oscFundamental.stop(nowTime + 0.43);
    oscHarmonic.stop(nowTime + 0.32);
  }, []);

  return { playClick };
}

