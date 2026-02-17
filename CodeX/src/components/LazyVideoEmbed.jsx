import { useEffect, useMemo, useRef, useState } from "react";

function getYouTubeThumbnail(embedUrl) {
  const match = embedUrl.match(/\/embed\/([^?&/]+)/);
  if (!match) {
    return "";
  }
  return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
}

export function LazyVideoEmbed({ className, title, src, allow, allowFullScreen = false }) {
  const mountRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const thumbnail = useMemo(() => getYouTubeThumbnail(src), [src]);

  useEffect(() => {
    const element = mountRef.current;
    if (!element) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={mountRef} className={className} aria-hidden="true">
      {isVisible ? (
        <iframe
          className={className}
          title={title}
          src={src}
          loading="lazy"
          allow={allow}
          allowFullScreen={allowFullScreen}
          tabIndex={-1}
        ></iframe>
      ) : thumbnail ? (
        <img
          className={`${className} lazy-video-thumb`}
          src={thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </div>
  );
}
