import { isValidEmbed } from "../utils/validators";

export function WorkSection({ workItems, onOpenWorkItem }) {
  return (
    <section id="work" className="fade-in">
      <div className="section-head">
        <div>
          <h2>Selected Work</h2>
          <p>Each card opens in a preview modal.</p>
        </div>
        <a className="btn" href="#contact">
          Hire Me
        </a>
      </div>

      <div className="grid">
        <div className="work">
          {workItems.map((item) => {
            const hasPreview = isValidEmbed(item.embed || "");

            return (
              <a
                key={item.title}
                className="card work-card"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onOpenWorkItem(item);
                }}
              >
                <div className={`thumb${hasPreview ? " has-preview" : ""}`} aria-hidden="true">
                  {hasPreview && (
                    <>
                      <iframe
                        className="work-preview-frame"
                        title={`${item.title} preview`}
                        src={`${item.embed}?rel=0&modestbranding=1&controls=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        tabIndex={-1}
                      ></iframe>
                      <div className="work-preview-overlay">
                        <span className="work-preview-text">Tap to open fullscreen preview</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="info">
                  <div className="title">
                    <span>{item.title}</span>
                    <span className="chip">{item.type}</span>
                  </div>
                  <p className="desc">{item.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
