// Switch between catalog treatments and show their published details.
import React, { useState, useRef } from "react";
import { mediaUrl } from "../api/client";
import PublishedImage from "./PublishedImage";

function TreatmentProtocol({ content }) {
  return (
    <>
      {(content?.protocol_title || content?.protocol_description) && (
        <div className="tablist-protocol-card hairline-t">
          <strong className="protocol-card-title">
            {content.protocol_title}
          </strong>
          {content.protocol_description && (
            <p className="protocol-card-desc">{content.protocol_description}</p>
          )}
          <div className="protocol-amenity-pills">
            {(content.amenities || []).map((item) => (
              <span className="amenity-pill" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="protocol-features-list">
            {(content.features || []).map((item) => (
              <div className="protocol-feature-item" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function TreatmentSelector({
  content,
  treatments = [],
  onSelectTreatmentForBooking,
  bookingAvailable,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const tabRefs = useRef([]);
  const selectedIndex = Math.max(
    0,
    treatments.findIndex((item) => item.id === selectedId),
  );
  const selectedTreatment = treatments[selectedIndex];
  function handleKeyDown(event, index) {
    const keys = {
      ArrowDown: (index + 1) % treatments.length,
      ArrowRight: (index + 1) % treatments.length,
      ArrowUp: (index - 1 + treatments.length) % treatments.length,
      ArrowLeft: (index - 1 + treatments.length) % treatments.length,
      Home: 0,
      End: treatments.length - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      setSelectedId(treatments[keys[event.key]].id);
      tabRefs.current[keys[event.key]]?.focus();
    }
  }
  return (
    <section
      className="treatment-selector hairline-b"
      id="treatments"
      aria-labelledby="treatment-selector-title"
    >
      <div className="editorial-shell selector-grid">
        <div className="selector-intro-col">
          <div className="intro-sticky-wrap">
            <span className="eyebrow">Treatments</span>
            <h2 id="treatment-selector-title" className="selector-heading">
              {content?.title || "Treatment menu"}
            </h2>
            {content?.description && (
              <p className="selector-lead">{content.description}</p>
            )}
            {content?.note && (
              <div className="selector-foot-note">{content.note}</div>
            )}
          </div>
        </div>
        {!selectedTreatment ? (
          <div className="catalog-state">
            <p>No treatments have been published yet.</p>
            <TreatmentProtocol content={content} />
          </div>
        ) : (
          <>
            <div className="selector-tabs-col hairline-l hairline-r">
              <div
                className="treatment-tablist"
                role="tablist"
                aria-label="Treatment menu"
                aria-orientation="vertical"
              >
                {treatments.map((treatment, index) => (
                  <button
                    key={treatment.id}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    role="tab"
                    id={`tab-${treatment.id}`}
                    aria-selected={selectedIndex === index}
                    aria-controls="treatment-panel"
                    tabIndex={selectedIndex === index ? 0 : -1}
                    className={`tab-btn ${selectedIndex === index ? "is-selected" : ""}`}
                    onClick={() => setSelectedId(treatment.id)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    <span className="tab-left">
                      <span className="tab-num">{treatment.index}</span>
                      <span className="tab-titles">
                        <strong className="tab-title">{treatment.title}</strong>
                        <span className="tab-category">
                          {treatment.category}
                        </span>
                      </span>
                    </span>
                    <span className="tab-meta">
                      <span className="tab-duration">{treatment.duration}</span>
                      <span className="tab-price">{treatment.price}</span>
                    </span>
                  </button>
                ))}
              </div>
              <TreatmentProtocol content={content} />
            </div>
            <div
              className="selector-stage-col"
              id="treatment-panel"
              role="tabpanel"
              aria-labelledby={`tab-${selectedTreatment.id}`}
              tabIndex={0}
            >
              <div className="stage-content-wrap">
                {mediaUrl(selectedTreatment.image_path) && (
                  <div className="stage-media-box">
                    <PublishedImage
                      src={mediaUrl(selectedTreatment.image_path)}
                      alt={selectedTreatment.image_alt || ""}
                      className="stage-preview-img"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="stage-media-tag">
                      {selectedTreatment.category}
                    </div>
                  </div>
                )}
                <div className="stage-text-box">
                  <div className="stage-header-line">
                    <div className="stage-title-wrap">
                      <h3 className="stage-title">{selectedTreatment.title}</h3>
                      <span className="stage-sub">
                        {selectedTreatment.subtitle}
                      </span>
                    </div>
                    <div className="stage-pricing-badge">
                      <span className="stage-price-val">
                        {selectedTreatment.price}
                      </span>
                      <span className="stage-duration-val">
                        {selectedTreatment.duration}
                      </span>
                    </div>
                  </div>
                  <p className="stage-description">
                    {selectedTreatment.description}
                  </p>
                  {!!selectedTreatment.formulations?.length && (
                    <div className="stage-formulation-wrap">
                      <span className="formulation-label">Formulations</span>
                      <ul className="formulation-list">
                        {selectedTreatment.formulations.map(
                          (formula, index) => (
                            <li key={index} className="formulation-item">
                              {formula}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {!!selectedTreatment.steps?.length && (
                    <div className="stage-timeline-wrap">
                      <span className="timeline-label">Treatment sequence</span>
                      <ol className="timeline-steps">
                        {selectedTreatment.steps.map((item, index) => (
                          <li key={index} className="timeline-step-row">
                            <span className="step-idx">{index + 1}</span>
                            <span className="step-text">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <div className="stage-action-row">
                    <button
                      className="btn-ink stage-book-btn"
                      disabled={!bookingAvailable}
                      onClick={() =>
                        onSelectTreatmentForBooking(selectedTreatment.id)
                      }
                    >
                      Reserve {selectedTreatment.title}{" "}
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                    {content?.cancellation_note && (
                      <span className="cancellation-microcopy">
                        {content.cancellation_note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
