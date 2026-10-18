import React from "react";

/** Guest contact fields and the final price review before submission. */
export default function BookingDetails({ booking }) {
  const {
    submit,
    guest,
    changeGuest,
    submitting,
    service,
    location,
    practitioner,
    date,
    time,
    chosenAddon,
    silent,
    totalMinor,
    totalDuration,
    currencyMatches,
  } = booking;
  return (
    <form className="step-view" onSubmit={submit}>
      <div className="form-fields-grid">
        <div className="field-group">
          <label className="field-label" htmlFor="guest-name">
            Full name
          </label>
          <input
            className="form-input"
            id="guest-name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={guest.name}
            onChange={(event) => changeGuest("name", event.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="guest-email">
            Email address
          </label>
          <input
            className="form-input"
            id="guest-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={255}
            value={guest.email}
            onChange={(event) => changeGuest("email", event.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="guest-phone">
            Mobile telephone
          </label>
          <input
            className="form-input"
            id="guest-phone"
            name="tel"
            type="tel"
            autoComplete="tel"
            required
            minLength={5}
            maxLength={32}
            value={guest.phone}
            onChange={(event) => changeGuest("phone", event.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="guest-notes">
            Notes (optional)
          </label>
          <textarea
            className="form-input"
            id="guest-notes"
            maxLength={2000}
            value={guest.notes}
            onChange={(event) => changeGuest("notes", event.target.value)}
            disabled={submitting}
          />
        </div>
      </div>
      <dl className="summary-review-box">
        <div className="review-row">
          <dt>Treatment</dt>
          <dd>
            {service?.title} · {service?.duration}
          </dd>
        </div>
        <div className="review-row">
          <dt>Studio and practitioner</dt>
          <dd>
            {location?.city} ·{" "}
            {practitioner?.name || "First available practitioner"}
          </dd>
        </div>
        <div className="review-row">
          <dt>Date and time</dt>
          <dd>
            {date} at {time} {location?.timezone}
          </dd>
        </div>
        <div className="review-row">
          <dt>Treatment price</dt>
          <dd>{service?.price}</dd>
        </div>
        {chosenAddon && (
          <div className="review-row">
            <dt>Addition</dt>
            <dd>
              {chosenAddon.name} · {chosenAddon.price} · {chosenAddon.duration}
            </dd>
          </div>
        )}
        <div className="review-row">
          <dt>Silent chair</dt>
          <dd>{silent ? "Requested" : "Not requested"}</dd>
        </div>
        <div className="review-row total-row">
          <dt>Total</dt>
          <dd>
            {(totalMinor / 100).toFixed(2)} {service?.currency} ·{" "}
            {totalDuration} min
          </dd>
        </div>
      </dl>
      <button
        className="btn-ink submit-booking-btn"
        type="submit"
        disabled={submitting || !currencyMatches}
      >
        {submitting ? "Confirming reservation..." : "Complete reservation"}
      </button>
    </form>
  );
}
