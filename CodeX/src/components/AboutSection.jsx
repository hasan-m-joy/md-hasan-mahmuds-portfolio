import profileImage from "../../profile.png";
import ProfileCard from "./ProfileCard";

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
              name="MD Hasan Mahmud"
              title="Video Editor"
              handle="hasan_m_joy.446__"
              status="Available"
              contactText="Visit Profile"
              avatarUrl={profileImage}
              miniAvatarUrl={profileImage}
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
            <div className="about-copy-title">Hi, I am MD HASAN MAHMUD.</div>
            <div className="about-copy-text">
              I edit with one goal: make the video feel easy to watch. Clean pacing, clean audio,
              and motion that supports the story. I use AI for speed and ideation, then I do the
              real work in the timeline.
            </div>

            <div className="about-copy-chips">
              <span className="chip">Turnaround: 24-72h</span>
              <span className="chip">Formats: 16:9 / 9:16</span>
              <span className="chip">Delivery: Google Drive</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
