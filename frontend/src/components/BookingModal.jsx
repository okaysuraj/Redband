import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useModalFocus from "./useModalFocus";
import useBooking from "./booking/useBooking";
import BookingChoices from "./booking/BookingChoices";
import BookingSchedule from "./booking/BookingSchedule";
import BookingDetails from "./booking/BookingDetails";
import BookingConfirmation from "./booking/BookingConfirmation";

/** Accessible dialog shell; booking state and individual steps live alongside it. */
export default function BookingModal(props) {
  const { onClose, treatments = [], locations = [], favorites = [] } = props;
  const booking = useBooking(props);
  const {
    step,
    setStep,
    confirmation,
    service,
    location,
    practitioner,
    submitError,
    setSubmitError,
    submitting,
    submittingRef,
    canContinue,
    availabilityStatus,
  } = booking;
  const modalRef = useRef(null);
  const headingRef = useRef(null);
  const close = useCallback(() => {
    if (!submittingRef.current) onClose();
  }, [onClose, submittingRef]);
  useModalFocus(modalRef, close);
  useEffect(() => {
    headingRef.current?.focus();
    modalRef.current?.querySelector(".modal-body-scroll")?.scrollTo({ top: 0 });
  }, [step, confirmation]);
  const stepTitles = [
    "Select treatment",
    "Select studio",
    "Choose practitioner",
    "Select date and time",
    "Your details",
  ];
  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !submittingRef.current)
          onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="booking-modal-sheet"
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="modal-top-bar hairline-b">
          <div>
            <span className="eyebrow">Reservation</span>
            <h2
              id="booking-modal-title"
              className="modal-heading"
              ref={headingRef}
              tabIndex={-1}
            >
              {confirmation ? "Reservation confirmed" : stepTitles[step - 1]}
            </h2>
          </div>
          <div className="modal-controls">
            {!confirmation && (
              <span className="step-indicator" aria-label={`Step ${step} of 5`}>
                {step} / 5
              </span>
            )}
            <button
              className="modal-close-btn"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close reservation"
            >
              &times;
            </button>
          </div>
        </div>
        {!confirmation && (
          <div className="booking-summary-strip hairline-b">
            <span>{service?.title}</span>
            <span>{location?.city}</span>
            <span>{practitioner?.name || "First available practitioner"}</span>
          </div>
        )}
        <div className="modal-body-scroll">
          {submitError && (
            <p className="booking-error-banner" role="alert">
              {submitError}
            </p>
          )}
          {confirmation ? (
            <BookingConfirmation
              confirmation={confirmation}
              location={location}
              onClose={onClose}
            />
          ) : (
            <div className="step-container">
              <BookingChoices
                booking={booking}
                treatments={treatments}
                locations={locations}
              />
              {step === 4 && (
                <BookingSchedule booking={booking} favorites={favorites} />
              )}
              {step === 5 && <BookingDetails booking={booking} />}
            </div>
          )}
        </div>
        {!confirmation && (
          <div className="modal-foot-bar hairline-t">
            {step > 1 ? (
              <button
                className="btn-outline foot-prev-btn"
                disabled={submitting}
                onClick={() => {
                  setSubmitError("");
                  setStep((value) => value - 1);
                }}
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 5 && (
              <button
                className="btn-ink foot-next-btn"
                disabled={
                  !canContinue ||
                  (availabilityStatus === "loading" && step === 4)
                }
                onClick={() => setStep((value) => value + 1)}
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
