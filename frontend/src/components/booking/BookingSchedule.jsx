import React from "react";

/** Displays only server-provided dates and times in the studio's timezone. */
export default function BookingSchedule({ booking, favorites }) {
  const {
    location,
    availabilityStatus,
    availabilityError,
    availability,
    setRefresh,
    date,
    setDate,
    time,
    setTime,
    silent,
    setSilent,
    addon,
    setAddon,
    changeSelection,
  } = booking;
  return (
    <div className="step-view">
      <p className="step-desc">
        Times are shown in the studio's local time
        {location?.timezone ? ` (${location.timezone})` : ""}.
      </p>
      {availabilityStatus === "loading" && (
        <p role="status" className="slot-checking-state">
          <span className="checking-spinner" aria-hidden="true" /> Checking live
          availability...
        </p>
      )}
      {availabilityError && (
        <div role="alert">
          <p>{availabilityError}</p>
          <button
            className="btn-outline"
            onClick={() => setRefresh((value) => value + 1)}
          >
            Retry availability
          </button>
        </div>
      )}
      {!!availability.dates.length && (
        <div
          className="dates-selector-bar"
          role="group"
          aria-label="Available dates"
        >
          {availability.dates.map((item) => (
            <button
              className={`date-pill-btn ${date === item.date ? "is-selected-date" : ""}`}
              key={item.date}
              aria-pressed={date === item.date}
              onClick={() => {
                setDate(item.date);
                setTime("");
              }}
            >
              <span className="date-pill-label">{item.label}</span>
              <strong>{item.day_name}</strong>
              <span>{item.date}</span>
            </button>
          ))}
        </div>
      )}
      {availabilityStatus === "ready" && (
        <>
          <div className="time-grid" role="group" aria-label="Available times">
            {availability.time_slots.map((item) => (
              <button
                key={item.time}
                className={`time-slot-btn ${time === item.time ? "is-selected-time" : ""}`}
                disabled={!item.available}
                aria-pressed={time === item.time}
                onClick={() => {
                  setTime(item.time);
                }}
              >
                <span className="slot-clock">{item.time}</span>
                <span className="slot-period">
                  {item.available ? item.period : item.reason || "Unavailable"}
                </span>
              </button>
            ))}
          </div>
          {!availability.time_slots.some((item) => item.available) && (
            <p role="status">
              No appointments are available for this selection. Choose another
              date, studio, or practitioner.
            </p>
          )}
        </>
      )}
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={silent}
          onChange={(event) => {
            setSilent(event.target.checked);
          }}
        />
        Request a silent chair
      </label>
      {!!favorites.length && (
        <div className="field-group">
          <label className="field-label" htmlFor="booking-addon">
            Treatment addition
          </label>
          <select
            id="booking-addon"
            className="form-input"
            value={addon}
            onChange={(event) => changeSelection(setAddon, event.target.value)}
          >
            <option value="">No addition</option>
            {favorites.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name} · {item.price} · {item.duration}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
