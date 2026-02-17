import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { AboutSection } from "./components/AboutSection";
import ColorBends from "./components/ColorBends";
import { ContactSection } from "./components/ContactSection";
import { HeroSection } from "./components/HeroSection";
import { MobileMenu } from "./components/MobileMenu";
import { NavBar } from "./components/NavBar";
import { PreviewModal } from "./components/PreviewModal";
import { ServicesSection } from "./components/ServicesSection";
import { ShowreelSection } from "./components/ShowreelSection";
import { SiteFooter } from "./components/SiteFooter";
import { WorkSection } from "./components/WorkSection";
import { aiTools, editingTools, showreel, workItems } from "./data/portfolioData";
import { useFadeInOnScroll } from "./hooks/useFadeInOnScroll";
import { isNonEmpty, isStrictEmail } from "./utils/validators";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [instagramPanelOpen, setInstagramPanelOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [brandImageVisible, setBrandImageVisible] = useState(true);
  const [formMessage, setFormMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    details: "",
  });

  useFadeInOnScroll();

  const currentYear = new Date().getFullYear();
  const formIsValid =
    isNonEmpty(formData.name) && isStrictEmail(formData.email) && isNonEmpty(formData.details);

  const emailFeedback = useMemo(() => {
    if (!formData.email) {
      return {
        text: "Enter a full email: name@domain.com",
        color: "rgba(255,255,255,0.65)",
      };
    }

    if (isStrictEmail(formData.email)) {
      return {
        text: "Email looks good.",
        color: "rgba(170,255,200,0.85)",
      };
    }

    return {
      text: "Please enter a full email like name@domain.com",
      color: "rgba(255,200,200,0.90)",
    };
  }, [formData.email]);

  const closeMenu = () => setMenuOpen(false);
  const closeModal = () => setModalItem(null);
  const closeInstagramPanel = () => setInstagramPanelOpen(false);

  const openModal = ({ title, embed, meta }) => {
    setModalItem({ title: title || "Preview", embed, meta: meta || "" });
  };

  const openWorkItem = (item) => {
    openModal({ title: item.title, embed: item.embed, meta: item.description });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormMessage("");
  };

  const trimField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].trim() }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      event.currentTarget.reportValidity();
      return;
    }

    setFormMessage("Message captured. Connect this to Formspree/Netlify Forms when you publish.");
  };

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        closeModal();
        closeInstagramPanel();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || modalItem || instagramPanelOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, modalItem, instagramPanelOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        if (currentY < 80) {
          setNavVisible(true);
        } else if (delta > 6) {
          setNavVisible(false);
        } else if (delta < -6) {
          setNavVisible(true);
        }

        lastScrollY = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setNavVisible(true);
    }
  }, [menuOpen]);

  return (
    <>
      <div id="liquidEtherWrap" aria-hidden="true">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent
          autoRotate={0}
          style={{ width: "100%", height: "100%" }}
        />
        <div id="liquidEtherOverlay"></div>
      </div>

      <NavBar
        navVisible={navVisible}
        menuOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        brandImageVisible={brandImageVisible}
        onBrandImageError={() => setBrandImageVisible(false)}
      />
      <MobileMenu menuOpen={menuOpen} onClose={closeMenu} />
      <PreviewModal modalItem={modalItem} onClose={closeModal} />
      <div
        className={`modal${instagramPanelOpen ? " show" : ""}`}
        aria-hidden={!instagramPanelOpen}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeInstagramPanel();
          }
        }}
      >
        <div className="modal-card" role="dialog" aria-modal="true" aria-label="Instagram profile panel">
          <div className="modal-head">
            <div className="modal-title">Instagram Profile</div>
            <button
              className="modal-close"
              aria-label="Close Instagram panel"
              type="button"
              onClick={closeInstagramPanel}
            >
              x
            </button>
          </div>
          <div className="modal-body">
            <div
              style={{
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                padding: 16,
                display: "grid",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 650 }}>@hasan_m_joy.446__</div>
              <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
                Open the Instagram profile in a new tab.
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a
                  className="btn primary"
                  href="https://www.instagram.com/hasan_m_joy.446__/?utm_source=ig_web_button_share_sheet"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Instagram
                </a>
                <button className="btn" type="button" onClick={closeInstagramPanel}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroSection
        editingTools={editingTools}
        aiTools={aiTools}
        onDownloadResume={() => window.alert("Replace this with your resume/portfolio PDF link.")}
      />

      <main className="container">
        <ShowreelSection showreel={showreel} onOpenShowreel={() => openModal(showreel)} />
        <WorkSection workItems={workItems} onOpenWorkItem={openWorkItem} />
        <ServicesSection />
        <AboutSection onVisitProfile={() => setInstagramPanelOpen(true)} />
        <ContactSection
          formData={formData}
          emailFeedback={emailFeedback}
          formIsValid={formIsValid}
          formMessage={formMessage}
          onUpdateField={updateField}
          onTrimField={trimField}
          onSubmit={handleSubmit}
        />
        <SiteFooter currentYear={currentYear} />
      </main>
    </>
  );
}
