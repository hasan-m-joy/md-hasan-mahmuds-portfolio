import { ToolTile } from "./ToolTile";

export function HeroSection({
  editingTools,
  aiTools,
  onDownloadResume,
}) {
  return (
    <header className="hero">
      <div className="container hero-grid">
        <div className="hero-card fade-in">
          <div className="hero-overlay" aria-hidden="true"></div>

          <div className="hero-content">
            <div className="kicker">
              <span className="badge">Video Editor</span>
              <span className="badge">Motion Graphics</span>
              <span className="badge">Short-form + Long-form</span>
            </div>

            <h1>
              MD HASAN MAHMUD
              <br />
              edits that feel clean, premium, and sharp.
            </h1>

            <div className="sub">
              I turn raw footage into high-retention videos with tight pacing, clear sound, and
              minimal motion that looks expensive. No clutter. No noise. Just results.
            </div>

            <div className="hero-actions">
              <a className="btn primary" href="#contact">
                Start a Project
              </a>
              <a className="btn" href="#showreel">
                Watch Showreel
              </a>
              <a
                className="btn"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onDownloadResume();
                }}
              >
                Download Resume
              </a>
            </div>

            <div className="stats" role="list">
              <div className="stat" role="listitem">
                <div className="big">24-72h</div>
                <div className="small">Typical delivery window</div>
              </div>
              <div className="stat" role="listitem">
                <div className="big">Clean Audio</div>
                <div className="small">Leveling + noise control</div>
              </div>
              <div className="stat" role="listitem">
                <div className="big">16:9 + 9:16</div>
                <div className="small">Multi-format exports</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="side-card fade-in">
          <div>
            <div className="mini-title">Editing Tools</div>
            <div className="muted">Glass tiles with real logos.</div>
          </div>

          <div className="tile-grid" aria-label="Editing tools">
            {editingTools.map((tool) => (
              <ToolTile key={tool.name} tool={tool} />
            ))}
          </div>

          <div style={{ height: 6 }}></div>

          <div>
            <div className="mini-title">AI Assist</div>
            <div className="muted">Used for speed + ideas, not lazy editing.</div>
          </div>

          <div className="tile-grid" aria-label="AI tools">
            {aiTools.map((tool) => (
              <ToolTile key={tool.name} tool={tool} />
            ))}
          </div>

          <div className="mini-title" style={{ marginTop: 6 }}>
            AI Workflow I actually use
          </div>
          <ul className="bullets">
            <li>
              <span className="spark"></span>Generate 10 hook options, then test the best 2.
            </li>
            <li>
              <span className="spark"></span>Rewrite for retention: shorter sentences, clearer
              stakes.
            </li>
            <li>
              <span className="spark"></span>Shot list + b-roll ideas so the edit feels planned.
            </li>
          </ul>
        </aside>
      </div>
    </header>
  );
}
