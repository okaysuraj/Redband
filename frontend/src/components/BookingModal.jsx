import React, { useState, useEffect, useRef } from "react";
import { TREATMENTS, LOCATIONS, PRACTITIONERS, AVAILABLE_DATES, TIME_SLOTS } from "../data/bookingData";

export default function BookingModal({
  isOpen,
  onClose,
  initialTreatmentId,
  initialLocationId,
  initialAddon
}) {
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(initialTreatmentId || TREATMENTS[0].id);
  const [selectedLocationId, setSelectedLocationId] = useState(initialLocationId || LOCATIONS[0].id);
  const [selectedPractitionerId, setSelectedPractitionerId] = useState("any");
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0].date);
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [isSilentChair, setIsSilentChair] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(initialAddon || "");

  // Guest details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNotes, setGuestNotes] = useState("");

  // Operational states
  const [isCheckingSlot, setIsCheckingSlot] = useState(false);
  const [slotError, setSlotError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Sync initial props when opened
  useEffect(() => {
    if (initialTreatmentId) setSelectedServiceId(initialTreatmentId);
    if (initialLocationId) setSelectedLocationId(initialLocationId);
    if (initialAddon) setSelectedAddon(initialAddon);
  }, [initialTreatmentId, initialLocationId, initialAddon, isOpen]);

  // Trap focus & escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentService = TREATMENTS.find((t) => t.id === selectedServiceId) || TREATMENTS[0];
  const currentLocation = LOCATIONS.find((l) => l.id === selectedLocationId) || LOCATIONS[0];
  const currentPractitioner =
    selectedPractitionerId === "any"
      ? { name: "First Available Master Sculptor", title: "Atelier Assignment" }
      : PRACTITIONERS.find((p) => p.id === selectedPractitionerId);

  // Step navigation with validation
  const goToNextStep = () => {
    if (step === 3) {
      // Slot check simulation
      setIsCheckingSlot(true);
      setSlotError(null);
      setTimeout(() => {
        setIsCheckingSlot(false);
        setStep(4);
      }, 350);
    } else if (step === 4) {
      setStep(5);
    } else {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const goToPrevStep = () => {
    setSlotError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit appointment
  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please complete the essential contact details.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingRef = `RBD-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationData({
        ref: bookingRef,
        service: currentService.title,
        price: currentService.price,
        duration: currentService.duration,
        location: `${currentLocation.city} Atelier (${currentLocation.neighborhood})`,
        address: currentLocation.address,
        practitioner: currentPractitioner.name,
        date: AVAILABLE_DATES.find((d) => d.date === selectedDate)?.dayName || selectedDate,
        time: selectedTime,
        guestName,
        guestEmail,
        isSilentChair,
        addon: selectedAddon
      });
    }, 850);
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="booking-modal-sheet" ref={modalRef}>
        {/* Modal Header */}
        <div className="modal-top-bar hairline-b">
          <div className="modal-title-group">
            <span className="eyebrow">
              <span className="eyebrow-accent">●</span> Reservation Ledger
            </span>
            <h2 id="booking-modal-title" className="modal-heading">
              {confirmationData ? "Reservation Confirmed" : "Reserve Private Chair"}
            </h2>
          </div>

          <div className="modal-controls">
            {!confirmationData && (
              <div className="step-indicator" aria-label={`Step ${step} of 5`}>
                <span className="step-count">Step 0{step}</span>
                <span className="step-divider">/</span>
                <span className="step-total">05</span>
              </div>
            )}
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close reservation ledger"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Persistent Journey Summary Breadcrumb */}
        {!confirmationData && (
          <div className="booking-summary-strip hairline-b">
            <div className="summary-pill">
              <span className="pill-k">Service:</span>
              <span className="pill-v">{currentService.title} ({currentService.price})</span>
            </div>
            <span className="strip-sep">/</span>
            <div className="summary-pill">
              <span className="pill-k">Atelier:</span>
              <span className="pill-v">{currentLocation.city}</span>
            </div>
            <span className="strip-sep">/</span>
            <div className="summary-pill">
              <span className="pill-k">Master:</span>
              <span className="pill-v">{currentPractitioner.name}</span>
            </div>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="modal-body-scroll">
          {confirmationData ? (
            /* Confirmation View */
            <div className="confirmation-stage" tabIndex={-1}>
              <div className="confirmation-badge">
                <span className="conf-icon">✓</span>
                <span>Confirmed & Reserved</span>
              </div>

              <h3 className="conf-headline">We await your arrival.</h3>
              <p className="conf-sub">
                Your private suite has been secured. A formal calendar invite and preparation guide 
                have been dispatched to <strong>{confirmationData.guestEmail}</strong>.
              </p>

              <div className="ticket-card hairline-b hairline-t">
                <div className="ticket-row hairline-b">
                  <span className="ticket-lbl">Booking Reference</span>
                  <span className="ticket-val code-val">{confirmationData.ref}</span>
                </div>
                <div className="ticket-row hairline-b">
                  <span className="ticket-lbl">Service</span>
                  <span className="ticket-val">{confirmationData.service} · {confirmationData.duration}</span>
                </div>
                <div className="ticket-row hairline-b">
                  <span className="ticket-lbl">Date & Time</span>
                  <span className="ticket-val">{confirmationData.date} at {confirmationData.time}</span>
                </div>
                <div className="ticket-row hairline-b">
                  <span className="ticket-lbl">Master Practitioner</span>
                  <span className="ticket-val">{confirmationData.practitioner}</span>
                </div>
                <div className="ticket-row hairline-b">
                  <span className="ticket-lbl">Location</span>
                  <span className="ticket-val">{confirmationData.location} — {confirmationData.address}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-lbl">Session Atmosphere</span>
                  <span className="ticket-val">
                    {confirmationData.isSilentChair ? "Silent Chair Session Requested" : "Standard Acoustic Calm"}
                    {confirmationData.addon ? ` + ${confirmationData.addon}` : ""}
                  </span>
                </div>
              </div>

              <div className="conf-actions-row">
                <button
                  type="button"
                  className="btn-ink conf-close-btn"
                  onClick={onClose}
                >
                  Return to Lookbook
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => alert("Calendar invitation (.ics) downloaded.")}
                >
                  Add to Calendar (.ics)
                </button>
              </div>
            </div>
          ) : (
            /* Step Views */
            <div className="step-container">
              {/* STEP 1: SERVICE */}
              {step === 1 && (
                <div className="step-view">
                  <div className="step-lead-wrap">
                    <span className="step-eyebrow">01 / Discipline</span>
                    <h3 className="step-title">Select Treatment</h3>
                    <p className="step-desc">Choose your dedicated primary service for this visit.</p>
                  </div>

                  <div className="options-list" role="radiogroup" aria-label="Choose Treatment">
                    {TREATMENTS.map((treatment) => {
                      const isChecked = selectedServiceId === treatment.id;
                      return (
                        <label
                          key={treatment.id}
                          className={`option-card ${isChecked ? "is-active-card" : ""}`}
                        >
                          <input
                            type="radio"
                            name="treatment"
                            value={treatment.id}
                            checked={isChecked}
                            onChange={() => setSelectedServiceId(treatment.id)}
                            className="sr-only"
                          />
                          <div className="card-radio-indicator">
                            <span className="radio-circle"></span>
                          </div>
                          <div className="card-text-col">
                            <div className="card-head-line">
                              <strong className="card-item-title">{treatment.title}</strong>
                              <span className="card-item-price">{treatment.price}</span>
                            </div>
                            <span className="card-item-sub">{treatment.subtitle}</span>
                            <span className="card-item-duration">{treatment.duration}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="step-view">
                  <div className="step-lead-wrap">
                    <span className="step-eyebrow">02 / Studio Location</span>
                    <h3 className="step-title">Select Sanctuary</h3>
                    <p className="step-desc">Choose between our New York or London private suites.</p>
                  </div>

                  <div className="options-list" role="radiogroup" aria-label="Choose Location">
                    {LOCATIONS.map((loc) => {
                      const isChecked = selectedLocationId === loc.id;
                      return (
                        <label
                          key={loc.id}
                          className={`option-card ${isChecked ? "is-active-card" : ""}`}
                        >
                          <input
                            type="radio"
                            name="location"
                            value={loc.id}
                            checked={isChecked}
                            onChange={() => setSelectedLocationId(loc.id)}
                            className="sr-only"
                          />
                          <div className="card-radio-indicator">
                            <span className="radio-circle"></span>
                          </div>
                          <div className="card-text-col">
                            <div className="card-head-line">
                              <strong className="card-item-title">{loc.city} Atelier</strong>
                              <span className="badge-tag">{loc.status}</span>
                            </div>
                            <span className="card-item-sub">{loc.address}</span>
                            <span className="card-item-meta">{loc.hours}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: PRACTITIONER */}
              {step === 3 && (
                <div className="step-view">
                  <div className="step-lead-wrap">
                    <span className="step-eyebrow">03 / The Hand</span>
                    <h3 className="step-title">Choose Practitioner</h3>
                    <p className="step-desc">Select a resident Master Sculptor or allow the atelier to match your hair profile.</p>
                  </div>

                  <div className="options-list" role="radiogroup" aria-label="Choose Practitioner">
                    <label className={`option-card ${selectedPractitionerId === "any" ? "is-active-card" : ""}`}>
                      <input
                        type="radio"
                        name="practitioner"
                        value="any"
                        checked={selectedPractitionerId === "any"}
                        onChange={() => setSelectedPractitionerId("any")}
                        className="sr-only"
                      />
                      <div className="card-radio-indicator">
                        <span className="radio-circle"></span>
                      </div>
                      <div className="card-text-col">
                        <strong className="card-item-title">First Available Master Sculptor</strong>
                        <span className="card-item-sub">Matched automatically to your service profile upon diagnostic arrival</span>
                      </div>
                    </label>

                    {PRACTITIONERS.map((p) => {
                      const isChecked = selectedPractitionerId === p.id;
                      return (
                        <label
                          key={p.id}
                          className={`option-card ${isChecked ? "is-active-card" : ""}`}
                        >
                          <input
                            type="radio"
                            name="practitioner"
                            value={p.id}
                            checked={isChecked}
                            onChange={() => setSelectedPractitionerId(p.id)}
                            className="sr-only"
                          />
                          <div className="card-radio-indicator">
                            <span className="radio-circle"></span>
                          </div>
                          <div className="card-text-col">
                            <div className="card-head-line">
                              <strong className="card-item-title">{p.name}</strong>
                              <span className="card-practitioner-init">{p.avatar}</span>
                            </div>
                            <span className="card-item-sub">{p.title} · {p.experience}</span>
                            <span className="card-item-meta">Focus: {p.specialty}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: DATE & TIME */}
              {step === 4 && (
                <div className="step-view">
                  <div className="step-lead-wrap">
                    <span className="step-eyebrow">04 / Day & Hour</span>
                    <h3 className="step-title">Select Date & Time</h3>
                    <p className="step-desc">Private suite reservations are spaced with 25-minute buffer intervals.</p>
                  </div>

                  {isCheckingSlot ? (
                    <div className="slot-checking-state">
                      <span className="checking-spinner"></span>
                      <span>Verifying live studio chair availability...</span>
                    </div>
                  ) : (
                    <>
                      {/* Dates Bar */}
                      <div className="dates-selector-bar" role="radiogroup" aria-label="Choose Date">
                        {AVAILABLE_DATES.map((d) => {
                          const isDateSelected = selectedDate === d.date;
                          return (
                            <button
                              key={d.date}
                              type="button"
                              className={`date-pill-btn ${isDateSelected ? "is-selected-date" : ""}`}
                              onClick={() => setSelectedDate(d.date)}
                            >
                              <span className="date-pill-label">{d.label}</span>
                              <strong className="date-pill-name">{d.dayName}</strong>
                            </button>
                          );
                        })}
                      </div>

                      {/* Time Slots Grid */}
                      <div className="time-slots-group">
                        <span className="slots-group-title">Available Suite Slots</span>
                        <div className="time-grid" role="radiogroup" aria-label="Choose Time Slot">
                          {TIME_SLOTS.map((slot) => {
                            const isTimeSelected = selectedTime === slot.time;
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.available}
                                className={`time-slot-btn ${isTimeSelected ? "is-selected-time" : ""} ${
                                  !slot.available ? "is-slot-disabled" : ""
                                }`}
                                onClick={() => setSelectedTime(slot.time)}
                              >
                                <span className="slot-clock">{slot.time}</span>
                                <span className="slot-period">
                                  {slot.available ? slot.period : slot.reason}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Silent Session Add-on */}
                      <div className="silent-session-checkbox-row">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={isSilentChair}
                            onChange={(e) => setIsSilentChair(e.target.checked)}
                            className="checkbox-input"
                          />
                          <div className="checkbox-text">
                            <strong>Request "The Silent Chair Session"</strong>
                            <span>Acoustic quiet after initial diagnostic check. No small talk.</span>
                          </div>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 5: GUEST DETAILS & CONFIRM */}
              {step === 5 && (
                <form className="step-view" onSubmit={handleConfirmReservation}>
                  <div className="step-lead-wrap">
                    <span className="step-eyebrow">05 / Guest Registry</span>
                    <h3 className="step-title">Your Details</h3>
                    <p className="step-desc">Confirmation dispatched privately to your email and SMS.</p>
                  </div>

                  <div className="form-fields-grid">
                    <div className="field-group">
                      <label htmlFor="guest-name" className="field-label">Full Name *</label>
                      <input
                        id="guest-name"
                        ref={firstInputRef}
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Julian Hayes"
                        className="form-input"
                      />
                    </div>

                    <div className="field-group">
                      <label htmlFor="guest-email" className="field-label">Email Address *</label>
                      <input
                        id="guest-email"
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="julian@domain.com"
                        className="form-input"
                      />
                    </div>

                    <div className="field-group">
                      <label htmlFor="guest-phone" className="field-label">Mobile Telephone *</label>
                      <input
                        id="guest-phone"
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="form-input"
                      />
                    </div>

                    <div className="field-group">
                      <label htmlFor="guest-notes" className="field-label">Scalp or Texture Notes (Optional)</label>
                      <input
                        id="guest-notes"
                        type="text"
                        value={guestNotes}
                        onChange={(e) => setGuestNotes(e.target.value)}
                        placeholder="e.g. Dry winter scalp, sensitive skin, previous color treatment"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="summary-review-box hairline-t hairline-b">
                    <div className="review-row">
                      <span>Reserved Treatment:</span>
                      <strong>{currentService.title} ({currentService.duration})</strong>
                    </div>
                    <div className="review-row">
                      <span>Studio & Master:</span>
                      <strong>{currentLocation.city} · {currentPractitioner.name}</strong>
                    </div>
                    <div className="review-row">
                      <span>Time:</span>
                      <strong>
                        {AVAILABLE_DATES.find((d) => d.date === selectedDate)?.dayName} at {selectedTime}
                      </strong>
                    </div>
                    <div className="review-row total-row">
                      <span>Total Due Upon Completion:</span>
                      <strong className="total-price">{currentService.price}</strong>
                    </div>
                  </div>

                  <div className="policy-note">
                    <span>Deposit policy: No charge is processed today. Redband requests 24 hours notice for cancellations.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-ink submit-booking-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="checking-spinner"></span>
                        <span>Confirming with Studio Registry...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Reservation</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Navigation */}
        {!confirmationData && (
          <div className="modal-foot-bar hairline-t">
            {step > 1 ? (
              <button
                type="button"
                className="btn-outline foot-prev-btn"
                onClick={goToPrevStep}
              >
                ← Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 5 && (
              <button
                type="button"
                className="btn-ink foot-next-btn"
                onClick={goToNextStep}
              >
                Continue →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
