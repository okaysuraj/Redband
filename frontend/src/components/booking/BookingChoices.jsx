import React from "react";

function Choice({ name, value, checked, onChange, children }) {
  return (
    <label className={`option-card ${checked ? "is-active-card" : ""}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="card-radio-indicator" aria-hidden="true">
        <span className="radio-circle" />
      </span>
      <span className="card-text-col">{children}</span>
    </label>
  );
}

/** The first three steps select a treatment, studio, and practitioner. */
export default function BookingChoices({ booking, treatments, locations }) {
  const {
    step,
    serviceId,
    setServiceId,
    locationId,
    setLocationId,
    practitionerId,
    setPractitionerId,
    eligiblePractitioners,
    currencyMatches,
    changeSelection,
  } = booking;
  return (
    <>
      {" "}
      {step === 1 && (
        <div className="step-view">
          <div
            className="options-list"
            role="radiogroup"
            aria-label="Treatment"
          >
            {treatments.map((item) => (
              <Choice
                key={item.id}
                name="treatment"
                value={item.id}
                checked={serviceId === item.id}
                onChange={() => changeSelection(setServiceId, item.id)}
              >
                <>
                  <strong className="card-item-title">{item.title}</strong>
                  <span>{item.subtitle}</span>
                  <span>
                    {item.price} · {item.duration}
                  </span>
                </>
              </Choice>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="step-view">
          <div className="options-list" role="radiogroup" aria-label="Studio">
            {locations.map((item) => (
              <Choice
                key={item.id}
                name="location"
                value={item.id}
                checked={locationId === item.id}
                onChange={() => {
                  changeSelection(setLocationId, item.id);
                  setPractitionerId("any");
                }}
              >
                <>
                  <strong className="card-item-title">{item.city}</strong>
                  <span>{item.neighborhood}</span>
                  <span>{item.address}</span>
                  <span>{item.hours}</span>
                </>
              </Choice>
            ))}
          </div>
          {!currencyMatches && (
            <p className="booking-error-banner" role="status">
              This treatment or addition is not offered in the selected studio's
              currency. Choose a compatible studio or treatment.
            </p>
          )}
        </div>
      )}
      {step === 3 && (
        <div className="step-view">
          <div
            className="options-list"
            role="radiogroup"
            aria-label="Practitioner"
          >
            {
              <Choice
                name="practitioner"
                value="any"
                checked={practitionerId === "any"}
                onChange={() => changeSelection(setPractitionerId, "any")}
              >
                <strong className="card-item-title">
                  First available practitioner
                </strong>
              </Choice>
            }
            {eligiblePractitioners.map((item) => (
              <Choice
                key={item.id}
                name="practitioner"
                value={item.id}
                checked={practitionerId === item.id}
                onChange={() => changeSelection(setPractitionerId, item.id)}
              >
                <>
                  <strong className="card-item-title">{item.name}</strong>
                  <span>
                    {item.title} · {item.experience}
                  </span>
                  <span>{item.specialty}</span>
                  {!!item.days?.length && <span>{item.days.join(" · ")}</span>}
                </>
              </Choice>
            ))}
          </div>
          {!eligiblePractitioners.length && (
            <p role="status">
              No practitioners are available for this studio and treatment.
            </p>
          )}
        </div>
      )}
    </>
  );
}
