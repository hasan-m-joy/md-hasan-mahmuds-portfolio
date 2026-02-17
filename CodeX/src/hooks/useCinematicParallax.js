import { useEffect } from "react";

const PARALLAX_SELECTOR = "[data-parallax]";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function useCinematicParallax({ enabled = true, paused = false } = {}) {
  useEffect(() => {
    if (!enabled || paused || typeof window === "undefined") {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const root = document.documentElement;
    let viewportHeight = window.innerHeight;
    let maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
    let isMobile = window.matchMedia("(max-width: 960px)").matches;
    let rafId = 0;
    let scheduled = false;
    const targets = [];

    const refreshMetrics = () => {
      targets.length = 0;
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      isMobile = window.matchMedia("(max-width: 960px)").matches;

      const nodes = Array.from(document.querySelectorAll(PARALLAX_SELECTOR));
      nodes.forEach((element) => {
        const rect = element.getBoundingClientRect();
        targets.push({
          element,
          top: rect.top + window.scrollY,
          height: rect.height || 1,
          yStrength: Number(element.dataset.parallax || 20),
          xStrength: Number(element.dataset.parallaxX || 0),
          scaleRange: Number(element.dataset.parallaxScale || 0),
          fadeRange: Number(element.dataset.parallaxFade || 0),
          lastX: null,
          lastY: null,
          lastScale: null,
          lastOpacity: null,
        });
      });
    };

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const progress = clamp(scrollY / maxScroll, 0, 1);
      const mobileFactor = isMobile ? 0.45 : 1;
      const viewportCenter = viewportHeight * 0.5;

      root.style.setProperty("--cinematic-progress", progress.toFixed(5));
      root.style.setProperty("--cinematic-scroll-y", `${scrollY.toFixed(2)}px`);

      targets.forEach((item) => {
        const center = item.top - scrollY + item.height * 0.5;
        const normalized = (viewportCenter - center) / viewportHeight;

        const yStrength = item.yStrength * mobileFactor;
        const xStrength = item.xStrength * mobileFactor;
        const yOffset = clamp(-normalized * yStrength, -Math.abs(yStrength), Math.abs(yStrength));
        const xOffset = clamp(normalized * xStrength, -Math.abs(xStrength), Math.abs(xStrength));
        const centerVisibility = 1 - clamp(Math.abs(normalized) * 1.2, 0, 1);
        const scale = 1 + centerVisibility * item.scaleRange;
        const opacity =
          item.fadeRange > 0 ? clamp(1 - (1 - centerVisibility) * item.fadeRange, 0.55, 1) : 1;

        if (item.lastX !== xOffset) {
          item.element.style.setProperty("--parallax-x", `${xOffset.toFixed(2)}px`);
          item.lastX = xOffset;
        }

        if (item.lastY !== yOffset) {
          item.element.style.setProperty("--parallax-y", `${yOffset.toFixed(2)}px`);
          item.lastY = yOffset;
        }

        if (item.lastScale !== scale) {
          item.element.style.setProperty("--parallax-scale", scale.toFixed(4));
          item.lastScale = scale;
        }

        if (item.lastOpacity !== opacity) {
          item.element.style.setProperty("--parallax-opacity", opacity.toFixed(3));
          item.lastOpacity = opacity;
        }
      });
    };

    const scheduleUpdate = () => {
      if (scheduled) {
        return;
      }

      scheduled = true;
      rafId = window.requestAnimationFrame(() => {
        scheduled = false;
        update();
      });
    };

    const handleResize = () => {
      refreshMetrics();
      scheduleUpdate();
    };

    refreshMetrics();
    update();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("load", handleResize);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, [enabled, paused]);
}
