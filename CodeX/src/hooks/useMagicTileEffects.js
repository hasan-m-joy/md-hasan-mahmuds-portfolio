import { useEffect } from "react";
import { gsap } from "gsap";

const TARGET_SELECTOR =
  ".tile, .stat, .work-card, .services-tile, .about-copy-tile, .pc-card";

export function useMagicTileEffects({
  enabled = true,
  glowColor = "132, 0, 255",
  particleCount = 8,
} = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const targets = Array.from(document.querySelectorAll(TARGET_SELECTOR));
    const cleanups = [];

    const makeRipple = (el, event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement("span");
      ripple.className = "magic-fx-ripple";
      ripple.style.left = `${x - maxDistance}px`;
      ripple.style.top = `${y - maxDistance}px`;
      ripple.style.width = `${maxDistance * 2}px`;
      ripple.style.height = `${maxDistance * 2}px`;
      ripple.style.setProperty("--magic-glow-color", glowColor);
      el.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    const makeParticles = (el, event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      for (let i = 0; i < particleCount; i += 1) {
        const p = document.createElement("span");
        p.className = "magic-fx-particle";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty("--magic-glow-color", glowColor);
        el.appendChild(p);

        gsap.fromTo(
          p,
          { x: 0, y: 0, scale: 0.2, opacity: 0.95 },
          {
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 80,
            scale: 1,
            opacity: 0,
            duration: 0.7 + Math.random() * 0.35,
            ease: "power2.out",
            onComplete: () => p.remove(),
          },
        );
      }
    };

    targets.forEach((el) => {
      if (el.dataset.magicFxBound === "1") return;
      el.dataset.magicFxBound = "1";
      el.classList.add("magic-fx-target");
      el.style.setProperty("--magic-glow-color", glowColor);
      let hoverRect = null;
      let moveRafId = 0;
      let pendingMoveEvent = null;

      if (!el.querySelector(":scope > .magic-fx-glow")) {
        const glow = document.createElement("span");
        glow.className = "magic-fx-glow";
        glow.setAttribute("aria-hidden", "true");
        el.appendChild(glow);
      }

      const updateGlowPosition = (event, rect) => {
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--magic-glow-x", `${x}%`);
        el.style.setProperty("--magic-glow-y", `${y}%`);
      };

      const onEnter = (event) => {
        hoverRect = el.getBoundingClientRect();
        el.style.setProperty("--magic-glow-intensity", "1");
        updateGlowPosition(event, hoverRect);
        makeParticles(el, event);
      };

      const onMove = (event) => {
        pendingMoveEvent = event;
        if (moveRafId) {
          return;
        }

        moveRafId = window.requestAnimationFrame(() => {
          moveRafId = 0;
          if (!pendingMoveEvent) return;
          updateGlowPosition(pendingMoveEvent, hoverRect || el.getBoundingClientRect());
          pendingMoveEvent = null;
        });
      };

      const onLeave = () => {
        if (moveRafId) {
          window.cancelAnimationFrame(moveRafId);
          moveRafId = 0;
        }
        pendingMoveEvent = null;
        hoverRect = null;
        el.style.setProperty("--magic-glow-intensity", "0");
      };

      const onClick = (event) => {
        makeRipple(el, event);
      };

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("click", onClick);

      cleanups.push(() => {
        if (moveRafId) {
          window.cancelAnimationFrame(moveRafId);
        }
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("click", onClick);
        el.dataset.magicFxBound = "0";
        const glow = el.querySelector(":scope > .magic-fx-glow");
        glow?.remove();
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [enabled, glowColor, particleCount]);
}
