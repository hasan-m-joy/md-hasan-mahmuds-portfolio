export function ContactSection({
  formData,
  emailFeedback,
  formIsValid,
  isSubmitting,
  formMessage,
  onUpdateField,
  onTrimField,
  onSubmit,
}) {
  const nonWhitespacePattern = String.raw`.*\S.*`;
  const emailPattern = String.raw`^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$`;

  return (
    <section id="contact" className="fade-in">
      <div className="section-head">
        <div>
          <h2>Contact</h2>
        </div>
      </div>

      <div className="grid">
        <div className="card pad" style={{ gridColumn: "span 12" }}>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <div className="contact-grid">
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Name</span>
                <input
                  required
                  minLength={1}
                  pattern={nonWhitespacePattern}
                  title="Please enter your name."
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(event) => onUpdateField("name", event.target.value)}
                  onBlur={() => onTrimField("name")}
                  style={{
                    padding: "12px 12px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--text)",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  pattern={emailPattern}
                  title="Please enter a valid email like name@domain.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(event) => onUpdateField("email", event.target.value)}
                  onBlur={() => onTrimField("email")}
                  style={{
                    padding: "12px 12px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--text)",
                    outline: "none",
                  }}
                />
                <div style={{ marginTop: 6, color: emailFeedback.color, fontSize: 12 }}>
                  {emailFeedback.text}
                </div>
              </label>
            </div>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>Project details</span>
              <textarea
                required
                minLength={1}
                title="Please enter your project details."
                name="details"
                rows={5}
                placeholder="Length, style, deadline, references..."
                value={formData.details}
                onChange={(event) => onUpdateField("details", event.target.value)}
                onBlur={() => onTrimField("details")}
                style={{
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text)",
                  outline: "none",
                  resize: "vertical",
                }}
              ></textarea>
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button className="btn primary" type="submit" disabled={!formIsValid || isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>{formMessage}</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
