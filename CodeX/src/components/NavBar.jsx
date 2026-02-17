import profileImage from "../../profile.png";
import Dock from "./Dock";

function WorkIcon() {
  return (
    <svg className="dock-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 6V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1h2a3 3 0 0 1 3 3v3H2V9a3 3 0 0 1 3-3h2Zm2 0h6V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1Zm13 8v5a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5h8v1a2 2 0 1 0 4 0v-1h8Zm-10 0v1h0v0h0v0a0 0 0 0 0 0 0Z"
      />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg className="dock-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 4a2 2 0 1 1 4 0v1.1a7 7 0 0 1 2.2.9l.8-.8a2 2 0 1 1 2.8 2.8l-.8.8a7 7 0 0 1 .9 2.2H21a2 2 0 1 1 0 4h-1.1a7 7 0 0 1-.9 2.2l.8.8a2 2 0 1 1-2.8 2.8l-.8-.8a7 7 0 0 1-2.2.9V20a2 2 0 1 1-4 0v-1.1a7 7 0 0 1-2.2-.9l-.8.8a2 2 0 0 1-2.8-2.8l.8-.8a7 7 0 0 1-.9-2.2H3a2 2 0 1 1 0-4h1.1a7 7 0 0 1 .9-2.2l-.8-.8a2 2 0 0 1 2.8-2.8l.8.8a7 7 0 0 1 2.2-.9V4Zm2 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8Z"
      />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg className="dock-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2-8 4.5c0 1 .8 1.5 1.8 1.5h12.4c1 0 1.8-.5 1.8-1.5c0-2.5-3.6-4.5-8-4.5Z"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg className="dock-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v.4L12 12L3 6.4V6Zm0 2.8V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.8l-8.4 5.6a1 1 0 0 1-1.2 0L3 8.8Z"
      />
    </svg>
  );
}

export function NavBar({ navVisible, menuOpen, onMenuOpen, brandImageVisible, onBrandImageError }) {
  const dockItems = [
    {
      label: "Work",
      icon: <WorkIcon />,
      onClick: () => {
        window.location.hash = "#work";
      },
    },
    {
      label: "Services",
      icon: <ServicesIcon />,
      onClick: () => {
        window.location.hash = "#services";
      },
    },
    {
      label: "About",
      icon: <AboutIcon />,
      onClick: () => {
        window.location.hash = "#about";
      },
    },
    {
      label: "Contact",
      icon: <ContactIcon />,
      onClick: () => {
        window.location.hash = "#contact";
      },
    },
  ];

  return (
    <div className={`nav${navVisible ? "" : " nav--hidden"}`}>
      <div className="container nav-inner">
        <div className="brand">
          {brandImageVisible ? (
            <img
              className="brand-avatar"
              src={profileImage}
              alt="MD HASAN MAHMUD"
              onError={onBrandImageError}
            />
          ) : null}
          <div className="dot" aria-hidden="true"></div>
          <div>MD HASAN MAHMUD</div>
        </div>

        <div className="nav-dock-wrap" aria-label="Primary navigation">
          <Dock
            items={dockItems}
            className="nav-dock-panel"
            panelHeight={56}
            dockHeight={80}
            baseItemSize={44}
            magnification={58}
            distance={130}
            disableExpand
          />
        </div>

        <div className="cta">
          <a className="btn" href="#contact">
            <span className="pill">Available</span> Book a Call
          </a>
          <a className="btn primary" href="#work">
            View Portfolio
          </a>
        </div>

        <button
          className="menu-btn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          type="button"
          onClick={onMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  );
}
