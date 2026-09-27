import React from "react";
import { SIGNATURE_FAVORITES } from "../data/bookingData";

export default function SignatureFavorites({ onOpenBookingWithAddon }) {
  return (
    <section className="favorites-chapter hairline-b" id="favorites" aria-labelledby="favorites-title">
      <div className="editorial-shell dark-shell">
        <div className="favorites-header">
          <div className="favorites-title-col">
            <span className="eyebrow dark-eyebrow">
              <span className="eyebrow-accent">03</span> Verified Studio Additions
            </span>
            <h2 id="favorites-title" className="favorites-heading">
              Apothecary Prescriptions & Sensory Calm
            </h2>
          </div>
          <div className="favorites-sub-col">
            <p className="favorites-lead">
              Every guest may tailor their primary treatment with targeted follicle formulas, 
              cranial tension work, or requested acoustic silence.
            </p>
          </div>
        </div>

        <div className="favorites-grid hairline-t">
          {SIGNATURE_FAVORITES.map((item, index) => (
            <div key={item.code} className={`favorite-card ${index > 0 ? "hairline-l-dark" : ""}`}>
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
                  type="button"
                  className="card-select-btn"
                  onClick={() => onOpenBookingWithAddon(item.name)}
                >
                  <span>Select</span>
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
