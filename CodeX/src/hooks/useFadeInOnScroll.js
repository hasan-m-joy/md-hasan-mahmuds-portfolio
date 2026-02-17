import { useEffect } from "react";

export function useFadeInOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 },
    );

    const targets = document.querySelectorAll(".fade-in");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);
}
