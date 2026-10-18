// Contact links, dispatch subscription, and published policy dialogs.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { subscribeDispatch } from "../api/client";
import useModalFocus from "./useModalFocus";

function LegalDialog({ content, onClose }) {
  const ref = useRef(null);
  useModalFocus(ref, onClose);
  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={ref}
        className="booking-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        tabIndex={-1}
      >
        <div className="modal-top-bar hairline-b">
          <h2 className="modal-heading" id="legal-title">
            {content.title}
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close document"
          >
            &times;
          </button>
        </div>
        <div className="modal-body-scroll legal-body">
          {Array.isArray(content.body) ? (
            content.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>{content.body}</p>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}
export default function Footer({
  brand,
  content,
  legal,
  treatments = [],
  locations = [],
  favorites = [],
  onOpenBooking,
  bookingAvailable,
  onManageBooking,
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [document, setDocument] = useState(null);
  const closeDocument = useCallback(() => setDocument(null), []);
  const controller = useRef(null);
  const mounted = useRef(true);
  const submitting = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);
  async function subscribe(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    controller.current = new AbortController();
    try {
      await subscribeDispatch(email.trim(), {
        signal: controller.current.signal,
      });
      if (mounted.current) {
        setSubscribed(true);
        setEmail("");
      }
    } catch (failure) {
      if (mounted.current && failure.name !== "AbortError")
        setError(failure.message);
    } finally {
      submitting.current = false;
      if (mounted.current) setPending(false);
    }
  }
  return (
    <footer className="site-footer">
      <div className="editorial-shell">
        {content?.dispatch_title && (
          <div className="footer-dispatch-row hairline-b">
            <div className="dispatch-copy">
              <h2 className="dispatch-title">{content.dispatch_title}</h2>
              {content.dispatch_description && (
                <p>{content.dispatch_description}</p>
              )}
            </div>
            <div className="dispatch-form-col">
              {subscribed ? (
                <p className="dispatch-success" role="status">
                  Your subscription has been saved.
                </p>
              ) : (
                <form
                  className="dispatch-form"
                  aria-label="Subscribe to dispatch"
                  onSubmit={subscribe}
                >
                  <label className="sr-only" htmlFor="dispatch-email">
                    Email address for dispatch
                  </label>
                  <input
                    className="dispatch-input"
                    id="dispatch-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    placeholder="Email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={pending}
                  />
                  <button
                    type="submit"
                    className="btn-ink dispatch-submit-btn"
                    disabled={pending}
                  >
                    {pending ? "Subscribing..." : "Join dispatch"}
                  </button>
                </form>
              )}
              {error && (
                <p className="booking-error-banner" role="alert">
                  {error}
                </p>
              )}
              {content.dispatch_fineprint && (
                <p className="dispatch-fineprint">
                  {content.dispatch_fineprint}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="footer-directory-grid hairline-b">
          <div className="dir-col brand-col">
            <div className="footer-brand-lockup">
              <span className="footer-brand-name">
                {brand?.name || "Redband"}
              </span>
              {brand?.subtitle && (
                <span className="footer-brand-sub">{brand.subtitle}</span>
              )}
            </div>
            {brand?.description && (
              <p className="dir-ethos">{brand.description}</p>
            )}
          </div>
          <div className="dir-col hairline-l">
            <span className="dir-header">Studios</span>
            {locations.map((location) => (
              <div className="dir-location-block" key={location.id}>
                <strong className="dir-loc-name">
                  {location.neighborhood} · {location.city}
                </strong>
                <p className="dir-loc-addr">{location.address}</p>
                {location.phone && (
                  <a
                    className="dir-link"
                    href={`tel:${location.phone.replace(/[^0-9+]/g, "")}`}
                  >
                    {location.phone}
                  </a>
                )}
                <span className="dir-hours">{location.hours}</span>
              </div>
            ))}
          </div>
          <div className="dir-col hairline-l">
            <span className="dir-header">Treatments and additions</span>
            <ul className="dir-nav-list">
              {treatments.map((item) => (
                <li key={item.id}>
                  <a href="#treatments" className="dir-nav-link">
                    {item.title} · {item.duration} · {item.price}
                  </a>
                </li>
              ))}
              {favorites.map((item) => (
                <li key={item.code}>
                  <a href="#favorites" className="dir-nav-link">
                    {item.name} · {item.duration} · {item.price}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="dir-col hairline-l">
            <span className="dir-header">Reservations</span>
            <div className="dir-protocol-box">
              {(content?.protocols || []).map((item, index) => (
                <div className="protocol-line" key={index}>
                  <strong className="protocol-title">{item.title}</strong>
                  <p className="protocol-desc">{item.description}</p>
                </div>
              ))}
              <button
                className="btn-ink footer-reserve-btn"
                onClick={onOpenBooking}
                disabled={!bookingAvailable}
              >
                Reserve a Chair
              </button>
              <button className="btn-outline" onClick={onManageBooking}>
                Manage booking
              </button>
            </div>
          </div>
        </div>
        <div className="footer-legal-bar">
          <span>
            {content?.copyright ||
              `Copyright ${new Date().getFullYear()} ${brand?.name || "Redband"}`}
          </span>
          <div className="legal-right">
            {["privacy", "accessibility", "terms"].map((key) =>
              legal?.[key]?.title && legal[key].body ? (
                <button
                  className="legal-link"
                  key={key}
                  onClick={() => setDocument(legal[key])}
                >
                  {legal[key].title}
                </button>
              ) : null,
            )}
            <a href="#top" className="back-to-top-link">
              Back to top
            </a>
          </div>
        </div>
      </div>
      {document && <LegalDialog content={document} onClose={closeDocument} />}
    </footer>
  );
}
