import React from "react";

import { Button, Copy, Heading, Label } from "../ui";

import { Platform } from "react-native";
import { addBookingToCalendar } from "../../api/calendar";
/** The committed reservation and device calendar action. */
export default function BookingConfirmation({ booking, onClose }) {
  const { confirmation, location, setError } = booking;
  return (
    <>
      {" "}
      <>
        <Heading>Your reservation is saved.</Heading>
        <Label>Reference</Label>
        <Copy selectable>{confirmation.reference}</Copy>
        <Copy>
          {confirmation.service} · {confirmation.duration}
        </Copy>
        <Copy>{confirmation.price}</Copy>
        <Copy>{confirmation.location}</Copy>
        <Copy>{confirmation.address}</Copy>
        <Copy>{confirmation.practitioner}</Copy>
        <Copy>
          {confirmation.date} · {confirmation.time}
          {location?.timezone ? ` (${location.timezone})` : ""}
        </Copy>
        <Copy>{confirmation.status}</Copy>
        <Copy>{confirmation.addon}</Copy>
        <Copy>
          {confirmation.silent_chair
            ? "Silent appointment requested"
            : "Silent appointment not requested"}
        </Copy>
        <Copy>View or cancel this booking in your reservations.</Copy>
        {confirmation.starts_at &&
          confirmation.ends_at &&
          Platform.OS !== "web" && (
            <Button
              secondary
              onPress={() =>
                addBookingToCalendar(confirmation).catch((err) =>
                  setError(err.message),
                )
              }
            >
              Add to device calendar
            </Button>
          )}
        <Button onPress={onClose}>Done</Button>
      </>
    </>
  );
}
