// Display published treatment additions and pass the choice into booking.
import React from "react";
export default function SignatureFavorites({
  content,
  favorites = [],
  onOpenBookingWithAddon,
  bookingAvailable,
}) {
  return (
    <section
      className="favorites-chapter hairline-b"
      id="favorites"
      aria-labelledby="favorites-title"
    >
      <div className="editorial-shell dark-shell">
        <div className="favorites-header">
          <div className="favorites-title-col">
            <span className="eyebrow dark-eyebrow">Apothecary</span>
            <h2 id="favorites-title" className="favorites-heading">
              {content?.title || "Treatment additions"}
            </h2>
          </div>
          {content?.description && (
            <p className="favorites-lead">{content.description}</p>
          )}
        </div>
        {!favorites.length && (
          <p className="catalog-state">No treatment additions are available.</p>
        )}
        <div className="favorites-grid hairline-t">
          {favorites.map((item, index) => (
            <article
              key={item.code}
              className={`favorite-card ${index ? "hairline-l-dark" : ""}`}
            >
              <div className="card-top-row">
                <span className="card-code">{item.code}</span>
                <span className="card-badge">{item.highlight}</span>
              </div>
              <div className="card-middle">
                <h3 className="card-name">{item.name}</h3>
                <p className="card-detail">{item.detail}</p>
              </div>
              <div className="card-bottom">
                <div className="card-pricing">
                  <span className="card-price">{item.price}</span>
                  <span className="card-duration">{item.duration}</span>
                </div>
                <button
                  className="card-select-btn"
                  disabled={!bookingAvailable}
                  aria-label={`Select ${item.name}`}
                  onClick={() => onOpenBookingWithAddon(item.name)}
                >
                  Select <span aria-hidden="true">+</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
