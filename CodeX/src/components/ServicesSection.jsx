export function ServicesSection() {
  return (
    <section id="services" className="fade-in">
      <div className="section-head">
        <div>
          <h2>Services</h2>
          <p>Simple offers that clients understand in 5 seconds.</p>
        </div>
      </div>

      <div className="grid">
        <div className="card pad services-tile" style={{ gridColumn: "span 6" }}>
          <div className="mini-title">Editing</div>
          <ul className="bullets" style={{ marginTop: 10 }}>
            <li>
              <span className="spark"></span>YouTube long-form edits (8-25 min)
            </li>
            <li>
              <span className="spark"></span>Shorts/Reels/TikTok repurposing
            </li>
            <li>
              <span className="spark"></span>Podcast to narrative retention-focused cut
            </li>
          </ul>
        </div>

        <div className="card pad services-tile" style={{ gridColumn: "span 6" }}>
          <div className="mini-title">Motion + Polish</div>
          <ul className="bullets" style={{ marginTop: 10 }}>
            <li>
              <span className="spark"></span>Minimal titles + lower thirds
            </li>
            <li>
              <span className="spark"></span>Subtitles that look premium
            </li>
            <li>
              <span className="spark"></span>Audio cleanup + leveling + SFX
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
