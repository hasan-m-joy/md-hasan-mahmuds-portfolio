import { useEffect, useRef } from "react";

const PARALLAX_SELECTOR = "[data-parallax]";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function useCinematicParallax({ enabled = true, paused = false } = {}) {
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const root = document.documentElement;
    let viewportHeight = window.innerHeight;
    let maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
    let isMobile = window.matchMedia("(max-width: 960px)").matches;
    let targets = Array.from(document.querySelectorAll(PARALLAX_SELECTOR));
    let rafId = 0;

    const refreshTargets = () => {
      targets = Array.from(document.querySelectorAll(PARALLAX_SELECTOR));
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      isMobile = window.matchMedia("(max-width: 960px)").matches;
    };

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const progress = clamp(scrollY / maxScroll, 0, 1);
      const mobileFactor = isMobile ? 0.45 : 1;
      const viewportCenter = viewportHeight * 0.5;

      root.style.setProperty("--cinematic-progress", progress.toFixed(5));
      root.style.setProperty("--cinematic-scroll-y", `${scrollY.toFixed(2)}px`);

      targets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const normalized = (viewportCenter - center) / viewportHeight;

        const yStrength = Number(element.dataset.parallax || 20) * mobileFactor;
        const xStrength = Number(element.dataset.parallaxX || 0) * mobileFactor;
        const scaleRange = Number(element.dataset.parallaxScale || 0);
        const fadeRange = Number(element.dataset.parallaxFade || 0);

        const yOffset = clamp(-normalized * yStrength, -Math.abs(yStrength), Math.abs(yStrength));
        const xOffset = clamp(normalized * xStrength, -Math.abs(xStrength), Math.abs(xStrength));
        const centerVisibility = 1 - clamp(Math.abs(normalized) * 1.2, 0, 1);
        const scale = 1 + centerVisibility * scaleRange;
        const opacity =
          fadeRange > 0 ? clamp(1 - (1 - centerVisibility) * fadeRange, 0.55, 1) : 1;

        element.style.setProperty("--parallax-x", `${xOffset.toFixed(2)}px`);
        element.style.setProperty("--parallax-y", `${yOffset.toFixed(2)}px`);
        element.style.setProperty("--parallax-scale", scale.toFixed(4));
        element.style.setProperty("--parallax-opacity", opacity.toFixed(3));
      });
    };

    const frame = () => {
      if (!pausedRef.current) {
        update();
      }
      rafId = window.requestAnimationFrame(frame);
    };

    refreshTargets();
    frame();

    window.addEventListener("resize", refreshTargets);
    window.addEventListener("load", refreshTargets);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", refreshTargets);
      window.removeEventListener("load", refreshTargets);
    };
  }, [enabled]);
}
