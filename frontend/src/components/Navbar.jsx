// Desktop navigation, location selection, and the mobile navigation drawer.
import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useModalFocus from "./useModalFocus";

const navigation = [
  ["#story", "Atelier"],
  ["#treatments", "Treatments"],
  ["#favorites", "Apothecary"],
  ["#locations", "Locations"],
];
function MobileDrawer({
  onClose,
  brand,
  locations,
  activeLocation,
  setActiveLocation,
  onOpenBooking,
  bookingAvailable,
  onManageBooking,
  hasStory,
}) {
  const ref = useRef(null);
  useModalFocus(ref, onClose);
  return createPortal(
    <div
      className="mobile-drawer-overlay is-visible"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="mobile-drawer-content"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        ref={ref}
        tabIndex={-1}
      >
        <div className="mobile-drawer-header">
          <span className="brand-name">{brand?.name || "Redband"}</span>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            &times;
          </button>
        </div>
        <nav className="mobile-drawer-nav" aria-label="Mobile navigation">
          {navigation
            .filter(([href]) => href !== "#story" || hasStory)
            .map(([href, label], index) => (
              <a
                key={href}
                href={href}
                className="mobile-nav-link"
                onClick={onClose}
              >
                <span className="mobile-nav-idx">0{index + 1}</span>
                <span className="mobile-nav-text">{label}</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            ))}
        </nav>
        {!!locations.length && (
          <div className="mobile-location-block">
            <span className="mobile-block-title">Select studio</span>
            <div className="mobile-location-pills">
              {locations.map((location) => (
                <button
                  key={location.id}
                  className={`mobile-loc-pill ${activeLocation === location.id ? "is-active" : ""}`}
                  aria-pressed={activeLocation === location.id}
                  onClick={() => setActiveLocation(location.id)}
                >
                  {location.neighborhood} · {location.city}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mobile-drawer-foot">
          <button
            className="btn-ink"
            disabled={!bookingAvailable}
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
          >
            Reserve a Chair
          </button>
          <button
            className="btn-outline"
            onClick={() => {
              onClose();
              onManageBooking();
            }}
          >
            Manage booking
          </button>
          <div className="mobile-drawer-contacts">
            {locations
              .filter((location) => location.phone)
              .map((location) => (
                <a
                  className="mobile-contact-link"
                  key={location.id}
                  href={`tel:${location.phone.replace(/[^0-9+]/g, "")}`}
                >
                  {location.city}: {location.phone}
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
export default function Navbar(props) {
  const {
    activeLocation,
    setActiveLocation,
    onOpenBooking,
    locations = [],
    brand,
    bookingAvailable,
    onManageBooking,
    auth,
    hasStory,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const close = useCallback(() => setIsOpen(false), []);
  async function accountAction() {
    setAuthError("");
    try {
      if (auth.user) await auth.signOut();
      else auth.openAuth();
    } catch {
      setAuthError("Could not sign out. Please try again.");
    }
  }
  return (
    <header className="site-header hairline-b">
      <div className="editorial-shell">
        <nav className="nav-container" aria-label="Main navigation">
          <div className="nav-links">
            {navigation
              .filter(([href]) => href !== "#story" || hasStory)
              .map(([href, label]) => (
                <a key={href} href={href} className="nav-link">
                  {label}
                </a>
              ))}
          </div>
          <div className="brand-wrapper">
            <a href="#top" className="brand-mark" aria-label="Redband home">
              <span className="brand-name">{brand?.name || "Redband"}</span>
              <span className="brand-dot" aria-hidden="true" />
            </a>
            {brand?.subtitle && (
              <span className="brand-sub">{brand.subtitle}</span>
            )}
          </div>
          <div className="nav-actions">
            {!!locations.length && (
              <div className="location-switcher">
                <label className="sr-only" htmlFor="studio-location">
                  Studio location
                </label>
                <select
                  id="studio-location"
                  className="location-btn"
                  value={activeLocation}
                  onChange={(event) => setActiveLocation(event.target.value)}
                >
                  {locations.map((location) => (
                    <option value={location.id} key={location.id}>
                      {location.neighborhood} · {location.city}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              className="nav-account-btn"
              disabled={auth.loading}
              onClick={accountAction}
              title={auth.user?.email || "Sign in to manage reservations"}
            >
              {auth.user ? "Sign out" : "Sign in"}
              <span className="sr-only">
                {auth.user?.email ? ` ${auth.user.email}` : ""}
              </span>
            </button>
            <button
              className="btn-ink nav-book-btn"
              disabled={!bookingAvailable}
              onClick={onOpenBooking}
            >
              Reserve a Chair
            </button>
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
            >
              <span className="hamburger-line line-top" aria-hidden="true" />
              <span className="hamburger-line line-bottom" aria-hidden="true" />
            </button>
          </div>
        </nav>
        {authError && (
          <p role="alert" className="booking-error-banner">
            {authError}
          </p>
        )}
      </div>
      {isOpen && (
        <MobileDrawer
          {...props}
          onClose={close}
          onManageBooking={onManageBooking}
        />
      )}
    </header>
  );
}
