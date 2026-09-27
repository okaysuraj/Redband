import React from "react";

export default function Hero({ onOpenBooking }) {
  return (
    <section className="hero-section hairline-b" id="top" aria-label="Introduction">
      <div className="editorial-shell hero-grid">
        <div className="hero-copy-col">
          <div className="hero-eyebrow-row">
            <span className="eyebrow">
              <span className="eyebrow-accent">●</span> Atelier No. 312 · Established 2021
            </span>
            <span className="badge-tag">By Appointment Only</span>
          </div>

          <div className="hero-title-wrap">
            <h1 className="hero-heading">
              Cut with clarity.
              <em className="hero-heading-italic"> Restored with discipline.</em>
            </h1>
          </div>

          <div className="hero-foot-wrap">
            <p className="hero-lead">
              A private restorative hair clinic and bespoke cutting room. We diagnose head shape, 
              follicle density, and texture before touching shears—infusing cold-pressed botanical 
              elixirs in single-chair acoustic silence.
            </p>

            <div className="hero-actions-row">
              <button
                type="button"
                className="btn-ink hero-cta-btn"
                onClick={() => onOpenBooking()}
              >
                <span>Reserve Consultation</span>
                <span aria-hidden="true">→</span>
              </button>

              <a
                href="#treatments"
                className="circle-scroll-btn"
                aria-label="Scroll down to explore treatments"
              >
                <span className="circle-arrow" aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="hero-meta-strip">
              <div className="meta-item">
                <span className="meta-label">Chairs</span>
                <span className="meta-val">1 Guest / Suite</span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <span className="meta-label">Formulations</span>
                <span className="meta-val">100% Bio-Lipid</span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <span className="meta-label">Pace</span>
                <span className="meta-val">Unhurried (55–115 min)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-media-col hairline-l">
          <div className="hero-portrait-frame">
            <img
              src="/images/hero-portrait.jpg"
              alt="Documentary portrait of client seated quietly in warm minimalist studio"
              className="hero-portrait-img"
              loading="eager"
            />
            <div className="portrait-overlay-tag">
              <span className="portrait-tag-dot"></span>
              <span className="portrait-tag-text">Quiet Craft · Portrait Study No. 04</span>
            </div>
            <div className="portrait-location-tag">
              <span>NoHo Suite · Studio Window East</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
