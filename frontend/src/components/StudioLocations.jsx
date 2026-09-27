import React from "react";
import { LOCATIONS } from "../data/bookingData";

export default function StudioLocations({ activeLocation, setActiveLocation, onSelectLocationForBooking }) {
  return (
    <section className="locations-section hairline-b" id="locations" aria-labelledby="locations-title">
      <div className="editorial-shell">
        <div className="locations-header">
          <span className="eyebrow">
            <span className="eyebrow-accent">04</span> Studio Locations & Hours
          </span>
          <h2 id="locations-title" className="locations-heading">
            Two quiet sanctuaries.
          </h2>
          <p className="locations-lead">
            Both studios are built with private single-chair acoustic rooms, natural north/east daylight, 
            and step-free street or elevator access.
          </p>
        </div>

        <div className="locations-grid hairline-t">
          {LOCATIONS.map((loc, idx) => {
            const isSelected = activeLocation === loc.id;
            return (
              <div
                key={loc.id}
                className={`location-card ${idx > 0 ? "hairline-l" : ""} ${isSelected ? "is-active-location" : ""}`}
              >
                <div className="loc-card-top">
                  <div className="loc-city-wrap">
                    <span className="loc-neighborhood">{loc.neighborhood}</span>
                    <h3 className="loc-city-name">{loc.city} Atelier</h3>
                  </div>
                  <div className="loc-status-stack">
                    {isSelected && (
                      <span className="loc-current-badge">
                        <span className="current-dot" aria-hidden="true">●</span> Active Selection
                      </span>
                    )}
                    <span className="loc-status-pill">
                      <span className="status-dot"></span>
                      {loc.status}
                    </span>
                  </div>
                </div>

                <div className="loc-card-body">
                  <div className="loc-info-row">
                    <span className="info-label">Address</span>
                    <p className="info-value address-val">{loc.address}</p>
                    <span className="info-sub">{loc.transit}</span>
                  </div>

                  <div className="loc-info-row">
                    <span className="info-label">Operating Schedule</span>
                    <p className="info-value">{loc.hours}</p>
                  </div>

                  <div className="loc-info-row">
                    <span className="info-label">Accessibility</span>
                    <p className="info-value">{loc.accessibility}</p>
                  </div>

                  <div className="loc-info-row">
                    <span className="info-label">Direct Line</span>
                    <a href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`} className="loc-phone-link">
                      {loc.phone}
                    </a>
                  </div>
                </div>

                <div className="loc-card-foot hairline-t">
                  <button
                    type="button"
                    className={`btn-ink loc-book-btn ${isSelected ? "is-selected-btn" : ""}`}
                    onClick={() => {
                      setActiveLocation(loc.id);
                      onSelectLocationForBooking(loc.id);
                    }}
                  >
                    <span>Reserve in {loc.city}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
