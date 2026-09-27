import React, { useState } from "react";

export default function Footer({ onOpenBooking }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="editorial-shell">
        {/* Top Dispatch Banner */}
        <div className="footer-dispatch-row hairline-b">
          <div className="dispatch-copy">
            <span className="eyebrow">
              <span className="eyebrow-accent">●</span> The Atelier Dispatch
            </span>
            <h3 className="dispatch-title">
              Monthly treatises on hair biology, scalp micro-climates, and unhurried design.
            </h3>
          </div>

          <div className="dispatch-form-col">
            {subscribed ? (
              <div className="dispatch-success" role="status">
                <span className="success-dot">✓</span>
                <span>Thank you. Your address is entered into our quarterly journal list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="dispatch-form" aria-label="Subscribe to Atelier Dispatch">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dispatch-input"
                  aria-label="Email address for dispatch"
                />
                <button type="submit" className="btn-ink dispatch-submit-btn">
                  <span>Join Dispatch</span>
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
            <span className="dispatch-fineprint">
              We send no promotional spam or seasonal sales. Strictly editorial studies and release notices.
            </span>
          </div>
        </div>

        {/* Main 4-column directory */}
        <div className="footer-directory-grid hairline-b">
          {/* Col 1: Brand & Ethos */}
          <div className="dir-col brand-col">
            <div className="footer-brand-lockup">
              <span className="footer-brand-name">Redband</span>
              <span className="footer-brand-sub">Atelier & Apothecary</span>
            </div>
            <p className="dir-ethos">
              A private restorative hair clinic and bespoke cutting room. We diagnose head shape, 
              follicle density, and texture before touching shears—infusing cold-pressed botanical 
              elixirs in single-chair acoustic silence.
            </p>
            <div className="dir-standards">
              <span className="standards-badge">Bespoke Protocol No. 188</span>
              <span className="standards-badge">Cruelty Free & Bio-Lipid</span>
            </div>
          </div>

          {/* Col 2: Sanctuaries */}
          <div className="dir-col hairline-l">
            <span className="dir-header">Sanctuaries</span>
            <div className="dir-location-block">
              <strong className="dir-loc-name">NoHo Atelier</strong>
              <p className="dir-loc-addr">312 Great Jones Street, Suite 3B<br />New York, NY 10012</p>
              <a href="tel:+12125550198" className="dir-link">+1 (212) 555-0198</a>
              <span className="dir-hours">Wed – Sun: 09:00 – 19:00</span>
            </div>

            <div className="dir-location-block dir-loc-second hairline-t">
              <strong className="dir-loc-name">Mayfair Atelier</strong>
              <p className="dir-loc-addr">14 South Audley St, Floor 2<br />London W1K 1HN</p>
              <a href="tel:+442079460912" className="dir-link">+44 (0) 20 7946 0912</a>
              <span className="dir-hours">Tue – Sat: 10:00 – 19:30</span>
            </div>
          </div>

          {/* Col 3: Disciplines */}
          <div className="dir-col hairline-l">
            <span className="dir-header">Disciplines</span>
            <ul className="dir-nav-list">
              <li><a href="#treatments" className="dir-nav-link">The Architectural Cut (75m)</a></li>
              <li><a href="#treatments" className="dir-nav-link">Botanical Scalp Detox (60m)</a></li>
              <li><a href="#treatments" className="dir-nav-link">Natural Texture Mastery (90m)</a></li>
              <li><a href="#treatments" className="dir-nav-link">Atelier Restoration Suite (115m)</a></li>
              <li><a href="#favorites" className="dir-nav-link">Occipital Tension Release</a></li>
              <li><a href="#favorites" className="dir-nav-link">Wild Hinoki Scalp Infusion</a></li>
              <li><a href="#favorites" className="dir-nav-link">Silent Chair Option</a></li>
            </ul>
          </div>

          {/* Col 4: Quiet Protocols & Booking */}
          <div className="dir-col hairline-l">
            <span className="dir-header">Protocol & Reserving</span>
            <div className="dir-protocol-box">
              <div className="protocol-line">
                <span className="protocol-title">Acoustic Silence</span>
                <p className="protocol-desc">Every suite is individual. You may request silent service with zero polite small talk at no cost.</p>
              </div>
              <div className="protocol-line hairline-t">
                <span className="protocol-title">Rescheduling</span>
                <p className="protocol-desc">Full complimentary modification up to 24 hours prior to your scheduled consultation.</p>
              </div>
              <button
                type="button"
                className="btn-ink footer-reserve-btn"
                onClick={() => onOpenBooking()}
              >
                <span>Reserve a Suite</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-footer Copyright & Legal */}
        <div className="footer-legal-bar">
          <div className="legal-left">
            <span>© {new Date().getFullYear()} Redband Atelier LLC. All rights reserved.</span>
            <span className="legal-sep">·</span>
            <span>Designed under Editorial Service Booking Standards</span>
          </div>

          <div className="legal-right">
            <a href="#top" className="legal-link">Privacy Policy</a>
            <a href="#top" className="legal-link">Accessibility</a>
            <a href="#top" className="legal-link">Terms of Service</a>
            <a href="#top" className="back-to-top-link" aria-label="Back to top of page">
              <span>Top</span>
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
