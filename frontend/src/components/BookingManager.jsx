// Look up, paginate, cancel, and export the signed-in guest's reservations.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cancelBooking, fetchBooking, fetchMyBookings } from "../api/client";
import { downloadBookingCalendar } from "../api/calendar";
import useModalFocus from "./useModalFocus";

const PAGE_SIZE = 50;
export default function BookingManager({
  onClose,
  treatments = [],
  locations = [],
  practitioners = [],
}) {
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [offset, setOffset] = useState(0);
  const [listReload, setListReload] = useState(0);
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const requestController = useRef(null);
  const operationPending = useRef(false);
  const ref = useRef(null);
  const mounted = useRef(true);
  useModalFocus(ref, onClose);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestController.current?.abort();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetchMyBookings({ offset, limit: PAGE_SIZE, signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(result))
          throw new Error("The studio returned an invalid reservation list.");
        setBookings((current) =>
          offset === 0
            ? result
            : [
                ...current,
                ...result.filter(
                  (item) =>
                    !current.some(
                      (existing) => existing.reference === item.reference,
                    ),
                ),
              ],
        );
        setHasMore(result.length === PAGE_SIZE && offset < 10000);
        setListStatus("ready");
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setListError(failure.message);
          setListStatus("error");
        }
      });
    return () => controller.abort();
  }, [offset, listReload]);
  function refreshList() {
    setListStatus("loading");
    setListError("");
    setOffset(0);
    setListReload((value) => value + 1);
  }
  async function run(action) {
    if (operationPending.current) return;
    operationPending.current = true;
    const controller = new AbortController();
    requestController.current = controller;
    setPending(true);
    setError("");
    try {
      const result = await action(controller.signal);
      if (mounted.current && !controller.signal.aborted) return result;
    } catch (failure) {
      if (mounted.current && failure.name !== "AbortError")
        setError(failure.message);
    } finally {
      operationPending.current = false;
      if (mounted.current) setPending(false);
    }
  }
  async function lookup(value) {
    if (!value.trim() || operationPending.current) return;
    setReference(value);
    setBooking(null);
    setConfirmCancel(false);
    const result = await run((signal) =>
      fetchBooking(value.trim(), { signal }),
    );
    if (result)
      setBooking({
        ...result,
        service:
          result.service ||
          treatments.find((item) => item.id === result.treatment_id)?.title ||
          result.treatment_id,
        location:
          result.location ||
          locations.find((item) => item.id === result.location_id)?.city ||
          result.location_id,
        address:
          result.address ||
          locations.find((item) => item.id === result.location_id)?.address,
        timezone:
          result.timezone ||
          locations.find((item) => item.id === result.location_id)?.timezone,
        practitioner:
          result.practitioner ||
          practitioners.find((item) => item.id === result.practitioner_id)
            ?.name ||
          result.practitioner_id,
      });
  }
  async function cancel() {
    const result = await run((signal) =>
      cancelBooking(booking.reference, { signal }),
    );
    if (result) {
      setBooking((current) => ({ ...current, status: result.status }));
      setBookings((current) =>
        current.map((item) =>
          item.reference === result.reference
            ? { ...item, status: result.status }
            : item,
        ),
      );
      setConfirmCancel(false);
    }
  }
  function calendar() {
    try {
      downloadBookingCalendar(booking);
    } catch (failure) {
      setError(failure.message);
    }
  }
  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
    >
      <div
        className="booking-modal-sheet"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-booking-title"
        tabIndex={-1}
      >
        <div className="modal-top-bar hairline-b">
          <h2 className="modal-heading" id="manage-booking-title">
            Manage booking
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close booking manager"
          >
            &times;
          </button>
        </div>
        <div className="modal-body-scroll">
          <p>
            View reservations made with your signed-in account, or enter a
            booking reference.
          </p>
          <form
            className="step-view management-form"
            onSubmit={(event) => {
              event.preventDefault();
              lookup(reference);
            }}
          >
            <div className="field-group">
              <label className="field-label" htmlFor="booking-reference">
                Booking reference
              </label>
              <input
                id="booking-reference"
                className="form-input"
                required
                maxLength={64}
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                disabled={pending}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn-ink" disabled={pending}>
              {pending ? "Please wait..." : "Find booking"}
            </button>
          </form>
          {error && (
            <p role="alert" className="booking-error-banner">
              {error}
            </p>
          )}
          {booking && (
            <div className="step-view management-result" role="status">
              <dl className="ticket-card">
                {[
                  ["Reference", booking.reference],
                  ["Status", booking.status],
                  ["Treatment", booking.service],
                  ["Studio", booking.location],
                  ["Address", booking.address],
                  ["Date and time", `${booking.date} at ${booking.time}`],
                  ["Time zone", booking.timezone],
                  ["Practitioner", booking.practitioner],
                  [
                    "Total",
                    booking.price ||
                      (Number.isInteger(booking.total_price_minor)
                        ? `${(booking.total_price_minor / 100).toFixed(2)} ${booking.currency}`
                        : ""),
                  ],
                  ["Addition", booking.addon],
                  [
                    "Silent chair",
                    booking.silent_chair ? "Requested" : "Not requested",
                  ],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label} className="ticket-row">
                      <dt className="ticket-lbl">{label}</dt>
                      <dd className="ticket-val">{value}</dd>
                    </div>
                  ))}
              </dl>
              {booking.status !== "cancelled" && (
                <>
                  {booking.starts_at && booking.ends_at && (
                    <button className="btn-outline" onClick={calendar}>
                      Add to calendar (.ics)
                    </button>
                  )}
                  {confirmCancel ? (
                    <div className="cancellation-confirmation">
                      <p>
                        Cancel this reservation? This releases your appointment.
                      </p>
                      <div className="conf-actions-row">
                        <button
                          className="btn-ink"
                          disabled={pending}
                          onClick={cancel}
                        >
                          Confirm cancellation
                        </button>
                        <button
                          className="btn-outline"
                          disabled={pending}
                          onClick={() => setConfirmCancel(false)}
                        >
                          Keep reservation
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn-outline"
                      disabled={pending}
                      onClick={() => setConfirmCancel(true)}
                    >
                      Cancel reservation
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          <section
            className="step-view management-result"
            aria-labelledby="saved-reservations-title"
          >
            <h3 id="saved-reservations-title">Saved reservations</h3>
            {bookings.map((item) => (
              <button
                className="btn-outline"
                key={item.reference}
                disabled={pending}
                onClick={() => lookup(item.reference)}
              >
                {item.reference} · {item.date} · {item.time} · {item.status}
              </button>
            ))}
            {listStatus === "loading" && (
              <p role="status">Loading reservations...</p>
            )}
            {listStatus === "error" && (
              <p className="booking-error-banner" role="alert">
                {listError}
              </p>
            )}
            {listStatus === "ready" && !bookings.length && (
              <p role="status">No reservations were found for your account.</p>
            )}
            {hasMore && (
              <button
                className="btn-outline"
                disabled={listStatus !== "ready"}
                onClick={() => {
                  setListStatus("loading");
                  setOffset((value) => value + PAGE_SIZE);
                }}
              >
                Load more reservations
              </button>
            )}
            <button
              className="btn-outline"
              disabled={listStatus === "loading"}
              onClick={refreshList}
            >
              Refresh reservations
            </button>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
