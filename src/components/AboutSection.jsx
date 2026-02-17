import profileImage from "../../profile.png";
import ProfileCard from "./ProfileCard";

export function AboutSection({ onVisitProfile }) {
  return (
    <section id="about" className="fade-in">
      <div className="section-head">
        <div>
          <h2>About</h2>
        </div>
      </div>

      <div className="grid">
        <div className="card pad" style={{ gridColumn: "span 12" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.85fr 1.15fr",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
              <div style={{ width: "min(340px, 100%)" }}>
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
                  iconUrl="/j-icons-pattern.svg"
                  grainUrl=""
                  innerGradient="linear-gradient(145deg, hsla(201, 40%, 45%, 0.45) 0%, hsla(11, 60%, 70%, 0.2) 100%)"
                />
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 650, fontSize: 18 }}>Hi, I am MD HASAN MAHMUD.</div>
              <div style={{ color: "var(--muted)", lineHeight: 1.55, marginTop: 8 }}>
                I edit with one goal: make the video feel easy to watch. Clean pacing, clean
                audio, and motion that supports the story. I use AI for speed and ideation, then I
                do the real work in the timeline.
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <span className="chip">Turnaround: 24-72h</span>
                <span className="chip">Formats: 16:9 / 9:16</span>
                <span className="chip">Delivery: Google Drive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
