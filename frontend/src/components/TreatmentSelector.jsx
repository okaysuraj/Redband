import React, { useState, useRef, useEffect } from "react";
import { TREATMENTS } from "../data/bookingData";

export default function TreatmentSelector({ onSelectTreatmentForBooking }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef([]);
  const selectedTreatment = TREATMENTS[selectedIndex];

  // Keyboard navigation for WAI-ARIA tablist
  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (index + 1) % TREATMENTS.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (index - 1 + TREATMENTS.length) % TREATMENTS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = TREATMENTS.length - 1;
    }

    if (nextIndex !== null) {
      setSelectedIndex(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section
      className="treatment-selector hairline-b"
      id="treatments"
      aria-labelledby="treatment-selector-title"
    >
      <div className="editorial-shell selector-grid">
        {/* Column 1: Selector Intro */}
        <div className="selector-intro-col">
          <div className="intro-sticky-wrap">
            <span className="eyebrow">
              <span className="eyebrow-accent">02</span> The Treatment Lookbook
            </span>
            <h2 id="treatment-selector-title" className="selector-heading">
              Four curated disciplines.
            </h2>
            <p className="selector-lead">
              One calm stage. Compare duration, diagnostic steps, and biological formulations without layout shift.
            </p>
            <div className="selector-foot-note">
              <span className="note-dot"></span>
              <span>All treatments include complimentary private suite tea ritual & scalp camera assessment</span>
            </div>
          </div>
        </div>

        {/* Column 2: Accessible Tablist */}
        <div className="selector-tabs-col hairline-l hairline-r">
          <div
            className="treatment-tablist"
            role="tablist"
            aria-label="Atelier Treatment Menu"
            aria-orientation="vertical"
          >
            {TREATMENTS.map((treatment, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={treatment.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  role="tab"
                  id={`tab-${treatment.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${treatment.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  className={`tab-btn ${isSelected ? "is-selected" : ""}`}
                  onClick={() => setSelectedIndex(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <div className="tab-left">
                    <span className="tab-num">{treatment.index}</span>
                    <div className="tab-titles">
                      <strong className="tab-title">{treatment.title}</strong>
                      <span className="tab-category">{treatment.category}</span>
                    </div>
                  </div>

                  <div className="tab-meta">
                    <span className="tab-duration">{treatment.duration}</span>
                    <span className="tab-price">{treatment.price}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Luxury Suite Protocol Card balancing column height */}
          <div className="tablist-protocol-card hairline-t">
            <div className="protocol-card-head">
              <span className="protocol-card-dot" aria-hidden="true">●</span>
              <span className="protocol-card-title">Private Suite Guarantee</span>
            </div>
            <p className="protocol-card-desc">
              Every appointment is held in absolute acoustic silence with one master artisan per suite. Never overlapping stations or hurried hand-offs.
            </p>
            <div className="protocol-amenity-pills">
              <span className="amenity-pill">1 Guest Per Room</span>
              <span className="amenity-pill">Bio-Lipid Formulations</span>
              <span className="amenity-pill">Silent Chair Optional</span>
            </div>
            <div className="protocol-features-list">
              <div className="protocol-feature-item">
                <span className="feature-icon">✓</span>
                <span>HD Scalp Camera & Density Diagnostics</span>
              </div>
              <div className="protocol-feature-item">
                <span className="feature-icon">✓</span>
                <span>Travertine Basin Warm Water Wash</span>
              </div>
              <div className="protocol-feature-item">
                <span className="feature-icon">✓</span>
                <span>Complimentary Herbal Tea Ritual</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Reserved Media & Copy Stage (Zero layout shift) */}
        <div
          className="selector-stage-col"
          id={`panel-${selectedTreatment.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${selectedTreatment.id}`}
          aria-live="polite"
        >
          <div className="stage-content-wrap">
            {/* Visual media header */}
            <div className="stage-media-box">
              <img
                src={selectedTreatment.image}
                alt={selectedTreatment.imageAlt}
                className="stage-preview-img"
              />
              <div className="stage-media-tag">
                <span>{selectedTreatment.category}</span>
              </div>
            </div>

            {/* Treatment Information */}
            <div className="stage-text-box">
              <div className="stage-header-line">
                <div className="stage-title-wrap">
                  <h3 className="stage-title">{selectedTreatment.title}</h3>
                  <span className="stage-sub">{selectedTreatment.subtitle}</span>
                </div>
                <div className="stage-pricing-badge">
                  <span className="stage-price-val">{selectedTreatment.price}</span>
                  <span className="stage-duration-val">{selectedTreatment.duration}</span>
                </div>
              </div>

              <p className="stage-description">{selectedTreatment.description}</p>

              {/* Formulation components */}
              <div className="stage-formulation-wrap">
                <span className="formulation-label">Compound Formulations Used:</span>
                <ul className="formulation-list" aria-label="Ingredients and formulations">
                  {selectedTreatment.formulations.map((formula, i) => (
                    <li key={i} className="formulation-item">
                      <span className="formulation-dot" aria-hidden="true">▪</span>
                      <span>{formula}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ritual Timeline Steps */}
              <div className="stage-timeline-wrap">
                <span className="timeline-label">Ritual Sequence:</span>
                <div className="timeline-steps">
                  {selectedTreatment.steps.map((step, idx) => (
                    <div key={idx} className="timeline-step-row">
                      <span className="step-idx">{idx + 1}</span>
                      <span className="step-text">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="stage-action-row">
                <button
                  type="button"
                  className="btn-ink stage-book-btn"
                  onClick={() => onSelectTreatmentForBooking(selectedTreatment.id)}
                >
                  <span>Reserve {selectedTreatment.title}</span>
                  <span aria-hidden="true">→</span>
                </button>
                <span className="cancellation-microcopy">
                  Complimentary rescheduling up to 24h prior
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
