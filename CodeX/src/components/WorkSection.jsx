import { isValidEmbed } from "../utils/validators";
import { LazyVideoEmbed } from "./LazyVideoEmbed";

export function WorkSection({ workItems, onOpenWorkItem }) {
  return (
    <section
      id="work"
      className="fade-in parallax-float"
      data-parallax="26"
      data-parallax-scale="0.012"
      data-parallax-fade="0.12"
    >
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
          {workItems.map((item, index) => {
            const hasPreview = isValidEmbed(item.embed || "");
            const depth = 10 + (index % 3) * 6;

            return (
              <a
                key={item.title}
                className="card work-card parallax-float"
                data-parallax={String(depth)}
                data-parallax-scale="0.010"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onOpenWorkItem(item);
                }}
              >
                <div className={`thumb${hasPreview ? " has-preview" : ""}`} aria-hidden="true">
                  {hasPreview && (
                    <>
                      <LazyVideoEmbed
                        className="work-preview-frame"
                        title={`${item.title} preview`}
                        src={`${item.embed}?rel=0&modestbranding=1&controls=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
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
