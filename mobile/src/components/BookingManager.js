// Look up, paginate, and cancel reservations owned by the signed-in account.
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, View } from "react-native";
import { cancelBooking, fetchBooking, fetchMyBookings } from "../api/client";
import { addBookingToCalendar } from "../api/calendar";
import { Button, Copy, Field, Heading, Label, Sheet, Status, ui } from "./ui";

export default function BookingManager({
  onClose,
  treatments = [],
  locations = [],
  practitioners = [],
}) {
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const pageSize = 25;
  const controller = useRef(null);
  const pending = useRef(false);
  const mounted = useRef(true);
  const treatment = treatments.find(
    (item) => item.id === booking?.treatment_id,
  );
  const location = locations.find((item) => item.id === booking?.location_id);
  const practitioner = practitioners.find(
    (item) => item.id === booking?.practitioner_id,
  );
  useEffect(() => {
    mounted.current = true;
    loadBookings(0);
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);
  async function run(action) {
    if (pending.current && !controller.current?.signal.aborted) return;
    const requestController = new AbortController();
    controller.current = requestController;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await action(requestController.signal);
    } catch (err) {
      if (mounted.current && !requestController.signal.aborted)
        setError(err.message);
    } finally {
      if (controller.current === requestController) {
        pending.current = false;
        if (mounted.current) setBusy(false);
      }
    }
  }
  function loadBookings(nextOffset = offset) {
    return run(async (signal) => {
      const response = await fetchMyBookings({
        signal,
        limit: pageSize,
        offset: nextOffset,
      });
      if (mounted.current && !signal.aborted) {
        if (!Array.isArray(response))
          throw new Error("The server returned an invalid reservation list.");
        setBookings(response);
        setOffset(nextOffset);
      }
    });
  }
  function lookup(value = reference) {
    return run(async (signal) => {
      if (!value.trim()) throw new Error("Enter a reservation reference.");
      const response = await fetchBooking(value.trim(), { signal });
      if (mounted.current && !signal.aborted) setBooking(response);
    });
  }
  function requestCancel() {
    Alert.alert(
      "Cancel this reservation?",
      "This releases the appointment for another guest.",
      [
        { text: "Keep reservation", style: "cancel" },
        {
          text: "Cancel reservation",
          style: "destructive",
          onPress: () =>
            run(async (signal) => {
              const response = await cancelBooking(booking.reference, {
                signal,
              });
              if (mounted.current && !signal.aborted) {
                setBooking((previous) => ({
                  ...previous,
                  status: response.status,
                }));
                setBookings((previous) =>
                  previous.map((item) =>
                    item.reference === booking.reference
                      ? { ...item, status: response.status }
                      : item,
                  ),
                );
              }
            }),
        },
      ],
    );
  }
  return (
    <Sheet title="Your reservations" onClose={onClose}>
      <Field
        label="Reservation reference"
        value={reference}
        onChangeText={setReference}
        autoCapitalize="characters"
        maxLength={80}
      />
      <Button onPress={() => lookup()} loading={busy}>
        Find reservation
      </Button>
      <Copy style={ui.error} accessibilityLiveRegion="polite">
        {error}
      </Copy>
      {booking && (
        <View style={ui.card}>
          <Heading>
            {booking.service || treatment?.title || "Reservation"}
          </Heading>
          <Copy selectable>{booking.reference}</Copy>
          <Copy>
            {booking.date} · {booking.time}
          </Copy>
          <Copy>{booking.location || location?.city}</Copy>
          <Copy>{booking.address || location?.address}</Copy>
          <Copy>{booking.practitioner || practitioner?.name}</Copy>
          <Copy>
            {booking.price ||
              (Number.isInteger(booking.total_price_minor)
                ? `${(booking.total_price_minor / 100).toFixed(2)} ${booking.currency}`
                : undefined)}
          </Copy>
          <Copy>{booking.addon}</Copy>
          <Copy>{location?.timezone}</Copy>
          <Copy>
            {booking.silent_chair
              ? "Silent appointment requested"
              : "Silent appointment not requested"}
          </Copy>
          <Label>{booking.status}</Label>
          {booking.status === "confirmed" &&
            booking.starts_at &&
            booking.ends_at &&
            Platform.OS !== "web" && (
              <Button
                secondary
                onPress={() =>
                  addBookingToCalendar(booking).catch((err) =>
                    setError(err.message),
                  )
                }
              >
                Add to device calendar
              </Button>
            )}
          {booking.status !== "cancelled" && (
            <Button onPress={requestCancel} disabled={busy}>
              Cancel reservation
            </Button>
          )}
        </View>
      )}
      <Label>Saved reservations</Label>
      {bookings.map((item) => (
        <Button
          key={item.reference}
          secondary
          disabled={busy}
          onPress={() => lookup(item.reference)}
        >
          {item.reference} · {item.date} · {item.time} · {item.status}
        </Button>
      ))}
      {!busy && !bookings.length && (
        <Status empty="No reservations were found for your account." />
      )}
      <View style={ui.row}>
        {offset > 0 && (
          <Button
            secondary
            disabled={busy}
            onPress={() => loadBookings(Math.max(0, offset - pageSize))}
          >
            Previous page
          </Button>
        )}
        {bookings.length === pageSize && (
          <Button
            secondary
            disabled={busy || offset + pageSize > 10000}
            onPress={() => loadBookings(offset + pageSize)}
          >
            Next page
          </Button>
        )}
      </View>
      <Button secondary disabled={busy} onPress={() => loadBookings()}>
        Refresh reservations
      </Button>
    </Sheet>
  );
}
