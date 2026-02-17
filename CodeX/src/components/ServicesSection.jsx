export function ServicesSection() {
  return (
    <section
      id="services"
      className="fade-in parallax-float"
      data-parallax="22"
      data-parallax-scale="0.010"
      data-parallax-fade="0.10"
    >
      <div className="section-head">
        <div>
          <h2>Services</h2>
          <p>Editing execution plus content advisory for growth-focused creators and brands.</p>
        </div>
      </div>

      <div className="grid">
        <div className="card pad services-tile parallax-float" data-parallax="14" style={{ gridColumn: "span 4" }}>
          <div className="mini-title">Video Editing</div>
          <ul className="bullets" style={{ marginTop: 10 }}>
            <li>
              <span className="spark"></span>Long-form YouTube edits (8-25 min)
            </li>
            <li>
              <span className="spark"></span>Shorts/Reels/TikTok repurposing
            </li>
            <li>
              <span className="spark"></span>Narrative restructuring for retention
            </li>
          </ul>
        </div>

        <div className="card pad services-tile parallax-float" data-parallax="20" style={{ gridColumn: "span 4" }}>
          <div className="mini-title">Motion + Finishing</div>
          <ul className="bullets" style={{ marginTop: 10 }}>
            <li>
              <span className="spark"></span>Minimal titles + lower thirds
            </li>
            <li>
              <span className="spark"></span>Subtitles that look premium
            </li>
            <li>
              <span className="spark"></span>Audio cleanup, leveling, and polish
            </li>
          </ul>
        </div>

        <div className="card pad services-tile parallax-float" data-parallax="26" style={{ gridColumn: "span 4" }}>
          <div className="mini-title">Content Advisory</div>
          <ul className="bullets" style={{ marginTop: 10 }}>
            <li>
              <span className="spark"></span>Hook and topic angle recommendations
            </li>
            <li>
              <span className="spark"></span>Retention map for script and scene order
            </li>
            <li>
              <span className="spark"></span>Packaging notes: title, thumbnail, CTA timing
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
