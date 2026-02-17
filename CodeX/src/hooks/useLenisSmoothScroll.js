import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenisSmoothScroll(paused = false) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 0.95,
      anchors: true,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      return;
    }

    if (paused) {
      lenis.stop();
      return;
    }

    lenis.start();
  }, [paused]);
}
