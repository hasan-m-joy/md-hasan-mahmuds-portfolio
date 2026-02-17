import MagicBento from "./MagicBento";

export function MagicBentoSection() {
  return (
    <section id="capabilities" className="fade-in">
      <div className="section-head">
        <div>
          <h2>Capabilities</h2>
          <p>What clients get when they hire me as editor plus content advisor.</p>
        </div>
      </div>

      <div className="grid">
        <div className="card magic-bento-shell" style={{ gridColumn: "span 12" }}>
          <MagicBento
            textAutoHide
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
            clickEffect
            spotlightRadius={800}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
          />
        </div>
      </div>
    </section>
  );
}
