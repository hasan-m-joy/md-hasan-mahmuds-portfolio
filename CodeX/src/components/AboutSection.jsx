import ProfileCard from "./ProfileCard";
import { siteProfile } from "../data/siteProfile";

export function AboutSection({ onVisitProfile }) {
  const iconPatternUrl = `${import.meta.env.BASE_URL}j-icons-pattern.svg`;

  return (
    <section id="about" className="fade-in">
      <div className="section-head">
        <div>
          <h2>About</h2>
        </div>
      </div>

      <div className="grid">
        <div className="about-profile-shell">
          <div className="about-profile-card">
            <ProfileCard
              name={siteProfile.fullName}
              title={siteProfile.headline}
              handle={siteProfile.handle}
              status={siteProfile.status}
              contactText="Visit Profile"
              avatarUrl={siteProfile.avatarUrl}
              miniAvatarUrl={siteProfile.avatarUrl}
              showUserInfo
              enableTilt
              enableMobileTilt
              onContactClick={onVisitProfile}
              behindGlowColor="hsla(201, 100%, 70%, 0.45)"
              behindGlowEnabled
              iconUrl={iconPatternUrl}
              grainUrl=""
              innerGradient="linear-gradient(145deg, hsla(201, 40%, 45%, 0.45) 0%, hsla(11, 60%, 70%, 0.2) 100%)"
            />
          </div>
        </div>

        <div className="card pad about-copy-tile">
          <div className="about-copy">
            <div className="about-copy-title">{siteProfile.aboutHeading}</div>
            <div className="about-copy-text">
              I help brands and creators turn rough ideas into publish-ready content that performs.
              My work combines edit execution with content advising: better hooks, clearer narrative
              flow, tighter pacing, and cleaner finishing for long-form and short-form.
            </div>

            <div className="about-copy-chips">
              <span className="chip">Strategy + Editing</span>
              <span className="chip">Formats: 16:9 / 9:16</span>
              <span className="chip">Delivery: 24-72h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
