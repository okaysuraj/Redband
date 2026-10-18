import React from "react";
import { View } from "react-native";
import { Button, Copy, Heading, Label, Status, ui } from "../ui";

/** Live schedule, additions, and appointment preferences. */

/** Live schedule, additions, and appointment preferences. */
export default function BookingSchedule({ booking, favorites }) {
  const {
    step,
    location,
    checking,
    availabilityError,
    setRetry,
    dates,
    date,
    setDate,
    slots,
    time,
    setTime,
    addon,
    setAddon,
    silent,
    setSilent,
  } = booking;
  return (
    <>
      {" "}
      {step === 4 && (
        <>
          <Heading>Select date and time</Heading>
          <Copy>
            Times are shown in the studio's local time
            {location?.timezone ? ` (${location.timezone})` : ""}.
          </Copy>
          {checking ? (
            <Status loading />
          ) : availabilityError ? (
            <Status
              error={availabilityError}
              retry={() => setRetry((value) => value + 1)}
            />
          ) : (
            <>
              {!dates.length && (
                <Status
                  empty="No bookable dates are currently published."
                  retry={() => setRetry((value) => value + 1)}
                />
              )}
              <Label>Date</Label>
              <View style={ui.row}>
                {dates.map((item) => (
                  <Button
                    key={item.date}
                    secondary
                    selected={date === item.date}
                    onPress={() => setDate(item.date)}
                  >
                    {item.day_name ? `${item.day_name} · ` : ""}
                    {item.date}
                    {item.label ? ` · ${item.label}` : ""}
                  </Button>
                ))}
              </View>
              <Label>Time</Label>
              <View style={ui.row}>
                {slots.map((item) => (
                  <Button
                    key={item.time}
                    secondary
                    disabled={!item.available}
                    selected={time === item.time}
                    onPress={() => setTime(item.time)}
                    label={`${item.time}${item.available ? "" : `, ${item.reason || "Unavailable"}`}`}
                  >
                    {item.time} ·{" "}
                    {item.available
                      ? item.period
                      : item.reason || "Unavailable"}
                  </Button>
                ))}
              </View>
              {date && !slots.some((item) => item.available) && (
                <Status empty="No available appointments on this date." />
              )}
            </>
          )}
          <Label>Addition</Label>
          <Button secondary selected={!addon} onPress={() => setAddon("")}>
            No addition
          </Button>
          {favorites.map((item) => (
            <Button
              key={item.code}
              secondary
              selected={addon === item.name}
              onPress={() => setAddon(item.name)}
            >
              {item.name} · {item.duration} · {item.price}
            </Button>
          ))}
          <Button
            secondary
            accessibilityRole="checkbox"
            accessibilityState={{ checked: silent }}
            onPress={() => setSilent((value) => !value)}
          >
            {silent ? "✓ " : ""}Request a silent appointment
          </Button>
        </>
      )}
    </>
  );
}
