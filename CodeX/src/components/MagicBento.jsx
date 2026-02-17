import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;
const CAPABILITY_ICON_BASE = `${import.meta.env.BASE_URL}capabilities`;

const cardData = [
  {
    color: '#060010',
    title: 'Hook Strategy',
    description: 'Audience-first hooks for stronger first 3 seconds.',
    label: 'Advisory',
    image: `${CAPABILITY_ICON_BASE}/analytics.svg`
  },
  {
    color: '#060010',
    title: 'Narrative Structure',
    description: 'Scene order and pacing logic that keeps viewers engaged.',
    label: 'Story',
    image: `${CAPABILITY_ICON_BASE}/dashboard.svg`
  },
  {
    color: '#060010',
    title: 'Creator Collaboration',
    description: 'Fast feedback loops and clear revision decisions.',
    label: 'Workflow',
    image: `${CAPABILITY_ICON_BASE}/collaboration.svg`
  },
  {
    color: '#060010',
    title: 'Edit Systems',
    description: 'Reusable templates and process for faster consistent output.',
    label: 'Efficiency',
    image: `${CAPABILITY_ICON_BASE}/automation.svg`
  },
  {
    color: '#060010',
    title: 'Platform Fit',
    description: 'Tailored delivery for Shorts, Reels, TikTok, and YouTube.',
    label: 'Multi-format',
    image: `${CAPABILITY_ICON_BASE}/integration.svg`
  },
  {
    color: '#060010',
    title: 'Quality Control',
    description: 'Final pass for audio, motion, text, and export accuracy.',
    label: 'Final QA',
    image: `${CAPABILITY_ICON_BASE}/security.svg`
  }
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius, rect) => {
  const box = rect || card.getBoundingClientRect();
  const relativeX = ((mouseX - box.left) / box.width) * 100;
  const relativeY = ((mouseY - box.top) / box.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;
    const rotateXTo = enableTilt
      ? gsap.quickTo(element, 'rotateX', { duration: 0.16, ease: 'power2.out' })
      : null;
    const rotateYTo = enableTilt
      ? gsap.quickTo(element, 'rotateY', { duration: 0.16, ease: 'power2.out' })
      : null;
    const xTo = enableMagnetism
      ? gsap.quickTo(element, 'x', { duration: 0.2, ease: 'power2.out' })
      : null;
    const yTo = enableMagnetism
      ? gsap.quickTo(element, 'y', { duration: 0.2, ease: 'power2.out' })
      : null;
    let cachedRect = null;
    let moveRafId = 0;
    let pendingEvent = null;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      cachedRect = element.getBoundingClientRect();

      if (enableTilt) {
        element.style.transformPerspective = '1000px';
        rotateXTo?.(5);
        rotateYTo?.(5);
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      cachedRect = null;
      pendingEvent = null;
      if (moveRafId) {
        cancelAnimationFrame(moveRafId);
        moveRafId = 0;
      }

      if (enableTilt) {
        rotateXTo?.(0);
        rotateYTo?.(0);
      }

      if (enableMagnetism) {
        xTo?.(0);
        yTo?.(0);
        magnetismAnimationRef.current = null;
      }
    };

    const applyMouseMotion = () => {
      moveRafId = 0;
      const evt = pendingEvent;
      pendingEvent = null;
      if (!evt) return;

      const rect = cachedRect || element.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        rotateXTo?.(rotateX);
        rotateYTo?.(rotateY);
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        xTo?.(magnetX);
        yTo?.(magnetY);
      }
    };

    const handleMouseMove = e => {
      if (!enableTilt && !enableMagnetism) return;
      pendingEvent = e;
      if (!moveRafId) {
        moveRafId = requestAnimationFrame(applyMouseMotion);
      }
    };

    const handleClick = e => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      pendingEvent = null;
      cachedRect = null;
      if (moveRafId) cancelAnimationFrame(moveRafId);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;
    const cardsData = [];
    const sectionBox = { left: 0, top: 0, right: 0, bottom: 0 };
    const pointer = { pageX: 0, pageY: 0, clientX: 0, clientY: 0 };
    let pointerRafId = 0;
    let metricsRafId = 0;

    const cacheMetrics = () => {
      if (!gridRef.current) return;
      const sx = window.scrollX;
      const sy = window.scrollY;
      const section = gridRef.current.closest('.bento-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      sectionBox.left = rect.left + sx;
      sectionBox.right = rect.right + sx;
      sectionBox.top = rect.top + sy;
      sectionBox.bottom = rect.bottom + sy;

      cardsData.length = 0;
      gridRef.current.querySelectorAll('.magic-bento-card').forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const absRect = {
          left: cardRect.left + sx,
          top: cardRect.top + sy,
          width: cardRect.width || 1,
          height: cardRect.height || 1
        };
        cardsData.push({
          card,
          rect: absRect,
          centerX: absRect.left + absRect.width / 2,
          centerY: absRect.top + absRect.height / 2,
          halfMaxSize: Math.max(absRect.width, absRect.height) / 2
        });
      });
    };

    const scheduleMetricsRefresh = () => {
      if (metricsRafId) return;
      metricsRafId = requestAnimationFrame(() => {
        metricsRafId = 0;
        cacheMetrics();
      });
    };

    const hideSpotlight = () => {
      isInsideSection.current = false;
      cardsData.forEach(({ card }) => {
        card.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const paintFromPointer = () => {
      pointerRafId = 0;
      if (!spotlightRef.current || cardsData.length === 0) return;

      const mouseInside =
        pointer.pageX >= sectionBox.left &&
        pointer.pageX <= sectionBox.right &&
        pointer.pageY >= sectionBox.top &&
        pointer.pageY <= sectionBox.bottom;

      isInsideSection.current = mouseInside;
      if (!mouseInside) {
        hideSpotlight();
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cardsData.forEach(({ card, rect, centerX, centerY, halfMaxSize }) => {
        const distance = Math.hypot(pointer.pageX - centerX, pointer.pageY - centerY) - halfMaxSize;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(card, pointer.pageX, pointer.pageY, glowIntensity, spotlightRadius, rect);
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        left: pointer.clientX,
        top: pointer.clientY,
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handlePointerMove = e => {
      pointer.pageX = e.clientX + window.scrollX;
      pointer.pageY = e.clientY + window.scrollY;
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;

      if (!pointerRafId) {
        pointerRafId = requestAnimationFrame(paintFromPointer);
      }
    };

    cacheMetrics();
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', hideSpotlight);
    window.addEventListener('resize', scheduleMetricsRefresh, { passive: true });
    window.addEventListener('scroll', scheduleMetricsRefresh, { passive: true });
    window.addEventListener('load', scheduleMetricsRefresh);

    return () => {
      if (pointerRafId) cancelAnimationFrame(pointerRafId);
      if (metricsRafId) cancelAnimationFrame(metricsRafId);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', hideSpotlight);
      window.removeEventListener('resize', scheduleMetricsRefresh);
      window.removeEventListener('scroll', scheduleMetricsRefresh);
      window.removeEventListener('load', scheduleMetricsRefresh);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div className="card-grid bento-section" ref={gridRef}>
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {cardData.map((card, index) => {
          const baseClassName = `magic-bento-card ${textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`;
          const cardProps = {
            className: baseClassName,
            style: {
              backgroundColor: card.color,
              '--glow-color': glowColor
            }
          };

          if (enableStars) {
            return (
              <ParticleCard
                key={index}
                {...cardProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <div className="magic-bento-card__header">
                  <div className="magic-bento-card__label">{card.label}</div>
                </div>
                <div className="magic-bento-card__visual">
                  <img
                    className="magic-bento-card__image"
                    src={card.image}
                    alt={`${card.title} icon`}
                    loading="lazy"
                  />
                </div>
                <div className="magic-bento-card__content">
                  <h2 className="magic-bento-card__title">{card.title}</h2>
                  <p className="magic-bento-card__description">{card.description}</p>
                </div>
              </ParticleCard>
            );
          }

          return (
            <div
              key={index}
              {...cardProps}
              ref={el => {
                if (!el) return;

                const handleMouseMove = e => {
                  if (shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  if (enableTilt) {
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;
                    gsap.to(el, {
                      rotateX,
                      rotateY,
                      duration: 0.1,
                      ease: 'power2.out',
                      transformPerspective: 1000
                    });
                  }

                  if (enableMagnetism) {
                    const magnetX = (x - centerX) * 0.05;
                    const magnetY = (y - centerY) * 0.05;
                    gsap.to(el, {
                      x: magnetX,
                      y: magnetY,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleMouseLeave = () => {
                  if (shouldDisableAnimations) return;

                  if (enableTilt) {
                    gsap.to(el, {
                      rotateX: 0,
                      rotateY: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }

                  if (enableMagnetism) {
                    gsap.to(el, {
                      x: 0,
                      y: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleClick = e => {
                  if (!clickEffect || shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const maxDistance = Math.max(
                    Math.hypot(x, y),
                    Math.hypot(x - rect.width, y),
                    Math.hypot(x, y - rect.height),
                    Math.hypot(x - rect.width, y - rect.height)
                  );

                  const ripple = document.createElement('div');
                  ripple.style.cssText = `
                    position: absolute;
                    width: ${maxDistance * 2}px;
                    height: ${maxDistance * 2}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                    left: ${x - maxDistance}px;
                    top: ${y - maxDistance}px;
                    pointer-events: none;
                    z-index: 1000;
                  `;

                  el.appendChild(ripple);

                  gsap.fromTo(
                    ripple,
                    {
                      scale: 0,
                      opacity: 1
                    },
                    {
                      scale: 1,
                      opacity: 0,
                      duration: 0.8,
                      ease: 'power2.out',
                      onComplete: () => ripple.remove()
                    }
                  );
                };

                el.addEventListener('mousemove', handleMouseMove);
                el.addEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('click', handleClick);
              }}
            >
              <div className="magic-bento-card__header">
                <div className="magic-bento-card__label">{card.label}</div>
              </div>
              <div className="magic-bento-card__visual">
                <img
                  className="magic-bento-card__image"
                  src={card.image}
                  alt={`${card.title} icon`}
                  loading="lazy"
                />
              </div>
              <div className="magic-bento-card__content">
                <h2 className="magic-bento-card__title">{card.title}</h2>
                <p className="magic-bento-card__description">{card.description}</p>
              </div>
            </div>
          );
        })}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
