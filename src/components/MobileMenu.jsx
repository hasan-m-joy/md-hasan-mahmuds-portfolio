export function MobileMenu({ menuOpen, onClose }) {
  return (
    <div
      className={`mobile-menu${menuOpen ? " show" : ""}`}
      aria-hidden={!menuOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mobile-card">
        <div className="mobile-head">
          <div style={{ fontWeight: 650 }}>Menu</div>
          <button className="close-btn" aria-label="Close menu" type="button" onClick={onClose}>
            x
          </button>
        </div>

        <div className="mobile-links">
          <a href="#work" onClick={onClose}>
            Work
          </a>
          <a href="#services" onClick={onClose}>
            Services
          </a>
          <a href="#about" onClick={onClose}>
            About
          </a>
          <a href="#contact" onClick={onClose}>
            Contact
          </a>
        </div>

        <div className="mobile-cta">
          <a className="btn" href="#contact" onClick={onClose}>
            <span className="pill">Available</span> Book a Call
          </a>
          <a className="btn primary" href="#work" onClick={onClose}>
            View Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
