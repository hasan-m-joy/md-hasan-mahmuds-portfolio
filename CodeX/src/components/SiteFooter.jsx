export function SiteFooter({ currentYear }) {
  return (
    <footer className="container">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>(c) {currentYear} MD HASAN MAHMUD - Video Editor & Content Advisor.</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
