import { isValidEmbed } from "../utils/validators";
import { LazyVideoEmbed } from "./LazyVideoEmbed";

export function ShowreelSection({ showreel, onOpenShowreel }) {
  const hasPreview = isValidEmbed(showreel?.embed || "");

  return (
    <section
      id="showreel"
      className="fade-in parallax-float"
      data-parallax="24"
      data-parallax-scale="0.012"
      data-parallax-fade="0.12"
    >
      <div className="section-head">
        <div>
          <h2>Showreel</h2>
          <p>Tap to open preview.</p>
        </div>
      </div>

      <div className="grid">
        <div className="card video-box parallax-float" data-parallax="16">
          <div
            className={`video${hasPreview ? " has-preview" : ""}`}
            role="button"
            tabIndex={0}
            onClick={onOpenShowreel}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenShowreel();
              }
            }}
          >
            {hasPreview ? (
              <>
                <LazyVideoEmbed
                  className="video-preview-frame"
                  title="Showreel preview"
                  src={`${showreel.embed}?rel=0&modestbranding=1&controls=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="video-overlay">
                  <span className="video-overlay-text">Tap to open fullscreen preview</span>
                </div>
              </>
            ) : (
              <>
                Tap to open Showreel preview.
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                  (Set your YouTube embed in code: VIDEO_ID)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
