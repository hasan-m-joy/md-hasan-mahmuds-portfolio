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
              <span className="badge">Content Advisor</span>
              <span className="badge">Short-form + Long-form</span>
            </div>

            <h1>
              MD HASAN MAHMUD
              <br />
              edits and advises content that performs.
            </h1>

            <div className="sub">
              I combine editing craft with content strategy so your videos keep attention and drive
              action. Clear hooks, structured pacing, strong storytelling, and delivery built for
              platform performance.
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
                <div className="small">Typical first delivery window</div>
              </div>
              <div className="stat" role="listitem">
                <div className="big">Retention Focus</div>
                <div className="small">Hook, pacing, and watch-time structure</div>
              </div>
              <div className="stat" role="listitem">
                <div className="big">16:9 + 9:16</div>
                <div className="small">Strategy-driven multi-format exports</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="side-card fade-in">
          <div>
            <div className="mini-title">Editing Stack</div>
            <div className="muted">Production tools used in real client workflows.</div>
          </div>

          <div className="tile-grid" aria-label="Editing tools">
            {editingTools.map((tool) => (
              <ToolTile key={tool.name} tool={tool} />
            ))}
          </div>

          <div style={{ height: 6 }}></div>

          <div>
            <div className="mini-title">AI + Research Assist</div>
            <div className="muted">Used for ideation and speed, then refined manually.</div>
          </div>

          <div className="tile-grid" aria-label="AI tools">
            {aiTools.map((tool) => (
              <ToolTile key={tool.name} tool={tool} />
            ))}
          </div>

          <div className="mini-title" style={{ marginTop: 6 }}>
            Content Advisory Workflow
          </div>
          <ul className="bullets">
            <li>
              <span className="spark"></span>Audit content angle, audience intent, and delivery format first.
            </li>
            <li>
              <span className="spark"></span>Build hook variations and tighten script beats for retention.
            </li>
            <li>
              <span className="spark"></span>Map visual structure, edit cadence, and final CTA placement.
            </li>
          </ul>
        </aside>
      </div>
    </header>
  );
}
