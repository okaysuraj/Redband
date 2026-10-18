import React from "react";
import { View } from "react-native";
import { Button, Copy, Field, Heading, Label, ui } from "../ui";

/** Guest contact fields and the final reservation review. */

/** Guest contact fields and the final reservation review. */
export default function BookingDetails({ booking }) {
  const {
    step,
    guest,
    changeGuest,
    submitting,
    service,
    location,
    date,
    time,
    practitioner,
    addon,
    addition,
    silent,
    totalMinor,
    totalDuration,
    currencyMatches,
    liveSelection,
    confirm,
  } = booking;
  return (
    <>
      {" "}
      {step === 5 && (
        <>
          <Heading>Your details</Heading>
          <Field
            label="Full name"
            value={guest.name}
            onChangeText={changeGuest("name")}
            maxLength={120}
            autoComplete="name"
            editable={!submitting}
          />
          <Field
            label="Email address"
            value={guest.email}
            onChangeText={changeGuest("email")}
            maxLength={255}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!submitting}
          />
          <Field
            label="Phone number"
            value={guest.phone}
            onChangeText={changeGuest("phone")}
            maxLength={32}
            keyboardType="phone-pad"
            autoComplete="tel"
            editable={!submitting}
          />
          <Field
            label="Notes (optional)"
            value={guest.notes}
            onChangeText={changeGuest("notes")}
            maxLength={2000}
            multiline
            editable={!submitting}
          />
          <View style={ui.card}>
            <Copy>{service?.title}</Copy>
            <Copy>
              {location?.city} · {location?.timezone}
            </Copy>
            <Copy>
              {date} · {time}
            </Copy>
            <Copy>{practitioner?.name || "Any available practitioner"}</Copy>
            <Copy>{addon}</Copy>
            <Copy>
              {addition
                ? `${addition.price} · ${addition.duration}`
                : undefined}
            </Copy>
            <Copy>
              {silent
                ? "Silent appointment requested"
                : "Silent appointment not requested"}
            </Copy>
            <Label>
              Total: {(totalMinor / 100).toFixed(2)} {service?.currency} ·{" "}
              {totalDuration} min
            </Label>
          </View>
          {!currencyMatches && (
            <Copy style={ui.error}>
              This treatment is not offered in the selected studio's currency.
            </Copy>
          )}
          <Button
            loading={submitting}
            disabled={!currencyMatches || !liveSelection}
            onPress={confirm}
          >
            Confirm reservation
          </Button>
        </>
      )}
    </>
  );
}
