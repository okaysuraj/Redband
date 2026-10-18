// Open the device calendar editor using the server's confirmed booking interval.
import { Platform } from "react-native";

export async function addBookingToCalendar(booking) {
  if (!booking.starts_at || !booking.ends_at)
    throw new Error(
      "Calendar timestamps are unavailable for this reservation.",
    );
  const startDate = new Date(booking.starts_at);
  const endDate = new Date(booking.ends_at);
  if (
    !Number.isFinite(startDate.getTime()) ||
    !Number.isFinite(endDate.getTime()) ||
    endDate <= startDate
  )
    throw new Error("The reservation has invalid calendar timestamps.");
  if (Platform.OS === "web")
    throw new Error("Open the native app to use your device calendar.");
  // The legacy namespace remains supported in SDK 57 and opens the OS event editor.
  // The user's save/cancel decision is handled by the operating system.
  const Calendar = await import("expo-calendar/legacy");
  await Calendar.createEventInCalendarAsync({
    title: booking.service || "Appointment",
    startDate,
    endDate,
    location: booking.address || booking.location || "",
    notes: `Reservation reference: ${booking.reference}`,
  });
}
