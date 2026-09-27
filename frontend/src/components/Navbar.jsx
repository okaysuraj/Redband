import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Navbar({ activeLocation, setActiveLocation, onOpenBooking }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileBookClick = () => {
    setIsMobileMenuOpen(false);
    onOpenBooking();
  };

  return (
    <header className="site-header hairline-b">
      <div className="editorial-shell">
        <nav className="nav-container" aria-label="Main Navigation">
          {/* Desktop Nav Links */}
          <div className="nav-links">
            <a href="#story" className="nav-link">Atelier</a>
            <a href="#treatments" className="nav-link">Treatments</a>
            <a href="#favorites" className="nav-link">Apothecary</a>
            <a href="#locations" className="nav-link">Locations</a>
          </div>

          {/* Brand Identity Lockup */}
          <div className="brand-wrapper">
            <a href="#top" className="brand-mark" aria-label="Redband Home" onClick={handleNavLinkClick}>
              <span className="brand-name">Redband</span>
              <span className="brand-dot" aria-hidden="true"></span>
            </a>
            <span className="brand-sub">Atelier & Apothecary</span>
          </div>

          {/* Desktop & Mobile Actions */}
          <div className="nav-actions">
            {/* Location Switcher */}
            <div className="location-switcher" title="Toggle current studio location">
              <span className="location-pulse" aria-hidden="true"></span>
              <button
                type="button"
                className="location-btn"
                onClick={() =>
                  setActiveLocation(activeLocation === "noho-nyc" ? "mayfair-ldn" : "noho-nyc")
                }
                aria-label={`Current location: ${activeLocation === "noho-nyc" ? "NoHo, New York" : "Mayfair, London"}. Click to switch.`}
              >
                <span>{activeLocation === "noho-nyc" ? "NoHo · NY" : "Mayfair · LDN"}</span>
                <span className="location-chevron">▾</span>
              </button>
            </div>

            {/* Desktop Reserve Button */}
            <button
              type="button"
              className="btn-ink nav-book-btn"
              onClick={() => onOpenBooking()}
            >
              Reserve a Chair
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className={`mobile-menu-toggle ${isMobileMenuOpen ? "is-open" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="hamburger-line line-top" aria-hidden="true"></span>
              <span className="hamburger-line line-bottom" aria-hidden="true"></span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Overlay Portaled Directly into document.body to avoid backdrop-filter containing block trapping */}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className={`mobile-drawer-overlay ${isMobileMenuOpen ? "is-visible" : ""}`}
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="mobile-drawer-content">
              <div className="mobile-drawer-header">
                <div className="mobile-drawer-brand">
                  <span className="brand-name">Redband</span>
                  <span className="brand-dot" aria-hidden="true"></span>
                </div>
                <button
                  type="button"
                  className="drawer-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  ✕
                </button>
              </div>

              {/* Large Editorial Nav Links */}
              <div className="mobile-drawer-nav">
                <a href="#story" className="mobile-nav-link" onClick={handleNavLinkClick}>
                  <span className="mobile-nav-idx">01</span>
                  <span className="mobile-nav-text">Atelier & Architecture</span>
                  <span className="mobile-nav-arrow" aria-hidden="true">→</span>
                </a>
                <a href="#treatments" className="mobile-nav-link" onClick={handleNavLinkClick}>
                  <span className="mobile-nav-idx">02</span>
                  <span className="mobile-nav-text">Treatment Lookbook</span>
                  <span className="mobile-nav-arrow" aria-hidden="true">→</span>
                </a>
                <a href="#favorites" className="mobile-nav-link" onClick={handleNavLinkClick}>
                  <span className="mobile-nav-idx">03</span>
                  <span className="mobile-nav-text">Apothecary & Additions</span>
                  <span className="mobile-nav-arrow" aria-hidden="true">→</span>
                </a>
                <a href="#locations" className="mobile-nav-link" onClick={handleNavLinkClick}>
                  <span className="mobile-nav-idx">04</span>
                  <span className="mobile-nav-text">Sanctuary Locations</span>
                  <span className="mobile-nav-arrow" aria-hidden="true">→</span>
                </a>
              </div>

              {/* Mobile Studio Selection */}
              <div className="mobile-location-block">
                <span className="mobile-block-title">Select Studio Atelier</span>
                <div className="mobile-location-pills">
                  <button
                    type="button"
                    className={`mobile-loc-pill ${activeLocation === "noho-nyc" ? "is-active" : ""}`}
                    onClick={() => setActiveLocation("noho-nyc")}
                  >
                    <span className="loc-dot" aria-hidden="true">●</span>
                    <span>NoHo · New York</span>
                  </button>
                  <button
                    type="button"
                    className={`mobile-loc-pill ${activeLocation === "mayfair-ldn" ? "is-active" : ""}`}
                    onClick={() => setActiveLocation("mayfair-ldn")}
                  >
                    <span className="loc-dot" aria-hidden="true">●</span>
                    <span>Mayfair · London</span>
                  </button>
                </div>
              </div>

              {/* Mobile Drawer Action */}
              <div className="mobile-drawer-foot">
                <button
                  type="button"
                  className="btn-ink mobile-drawer-book-btn"
                  onClick={handleMobileBookClick}
                >
                  <span>Reserve a Suite / Chair</span>
                  <span aria-hidden="true">→</span>
                </button>

                <div className="mobile-drawer-contacts">
                  <a href="tel:+12128449120" className="mobile-contact-link">
                    NoHo Direct: (212) 844-9120
                  </a>
                  <span className="mobile-contact-sep">·</span>
                  <a href="tel:+442079460882" className="mobile-contact-link">
                    Mayfair Direct: +44 (0)20 7946
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
