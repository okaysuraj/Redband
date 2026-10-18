import React, { useState } from "react";
import { downloadBookingCalendar } from "../../api/calendar";

/** A committed reservation and an optional calendar download. */
export default function BookingConfirmation({
  confirmation,
  location,
  onClose,
}) {
  const [calendarError, setCalendarError] = useState("");
  function calendar() {
    try {
      downloadBookingCalendar(confirmation);
      setCalendarError("");
    } catch (error) {
      setCalendarError(error.message);
    }
  }
  return (
    <div className="confirmation-stage">
      <p className="conf-sub">
        Your reservation is recorded. Save your booking reference and sign in to
        this account to view or cancel your reservation.
      </p>
      <dl className="ticket-card">
        {[
          ["Booking reference", confirmation.reference],
          ["Treatment", confirmation.service],
          ["Total", confirmation.price],
          ["Duration", confirmation.duration],
          ["Date and time", `${confirmation.date} at ${confirmation.time}`],
          ["Time zone", confirmation.timezone || location?.timezone],
          ["Practitioner", confirmation.practitioner],
          ["Studio", confirmation.location],
          ["Address", confirmation.address],
          ["Addition", confirmation.addon],
          [
            "Silent chair",
            confirmation.silent_chair ? "Requested" : "Not requested",
          ],
        ]
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div className="ticket-row" key={label}>
              <dt className="ticket-lbl">{label}</dt>
              <dd className="ticket-val">{value}</dd>
            </div>
          ))}
      </dl>
      {calendarError && <p role="alert">{calendarError}</p>}
      <div className="conf-actions-row">
        <button className="btn-ink" onClick={onClose}>
          Done
        </button>
        {confirmation.starts_at && confirmation.ends_at && (
          <button className="btn-outline" onClick={calendar}>
            Add to calendar (.ics)
          </button>
        )}
      </div>
    </div>
  );
}
