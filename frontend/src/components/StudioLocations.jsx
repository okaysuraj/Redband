// Display studio details and keep location selection in the page.
import React from "react";
export default function StudioLocations({
  content,
  locations = [],
  activeLocation,
  setActiveLocation,
  onSelectLocationForBooking,
  bookingAvailable,
}) {
  return (
    <section
      className="locations-section hairline-b"
      id="locations"
      aria-labelledby="locations-title"
    >
      <div className="editorial-shell">
        <div className="locations-header">
          <span className="eyebrow">Studio locations and hours</span>
          <h2 id="locations-title" className="locations-heading">
            {content?.title || "Studio locations"}
          </h2>
          {content?.description && (
            <p className="locations-lead">{content.description}</p>
          )}
        </div>
        {!locations.length && (
          <p className="catalog-state">
            No studio locations have been published yet.
          </p>
        )}
        <div className="locations-grid hairline-t">
          {locations.map((location, index) => (
            <article
              key={location.id}
              className={`location-card ${index ? "hairline-l" : ""} ${activeLocation === location.id ? "is-active-location" : ""}`}
            >
              <div className="loc-card-top">
                <div className="loc-city-wrap">
                  <span className="loc-neighborhood">
                    {location.neighborhood}
                  </span>
                  <h3 className="loc-city-name">{location.city}</h3>
                </div>
                <div className="loc-status-stack">
                  {activeLocation === location.id && (
                    <span className="loc-current-badge">Selected studio</span>
                  )}
                  {location.status && (
                    <span className="loc-status-pill">{location.status}</span>
                  )}
                </div>
              </div>
              <div className="loc-card-body">
                <div className="loc-info-row">
                  <span className="info-label">Address</span>
                  <p className="info-value">{location.address}</p>
                  <span className="info-sub">{location.transit}</span>
                </div>
                <div className="loc-info-row">
                  <span className="info-label">Opening hours</span>
                  <p className="info-value">{location.hours}</p>
                  {location.timezone && (
                    <span className="info-sub">{location.timezone}</span>
                  )}
                </div>
                {location.accessibility && (
                  <div className="loc-info-row">
                    <span className="info-label">Accessibility</span>
                    <p className="info-value">{location.accessibility}</p>
                  </div>
                )}
                {location.phone && (
                  <div className="loc-info-row">
                    <span className="info-label">Telephone</span>
                    <a
                      href={`tel:${location.phone.replace(/[^0-9+]/g, "")}`}
                      className="loc-phone-link"
                    >
                      {location.phone}
                    </a>
                  </div>
                )}
              </div>
              <div className="loc-card-foot hairline-t">
                <button
                  className="btn-ink loc-book-btn"
                  disabled={!bookingAvailable}
                  onClick={() => {
                    setActiveLocation(location.id);
                    onSelectLocationForBooking(location.id);
                  }}
                >
                  Reserve in {location.city}{" "}
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
