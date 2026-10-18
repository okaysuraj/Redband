// Export confirmed UTC booking times as an escaped, UTF-8-safe calendar file.
function escapeValue(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
function timestamp(value) {
  if (typeof value !== "string" || !/(?:Z|[+-]\d{2}:\d{2})$/.test(value))
    throw new Error("Calendar times are not available for this reservation.");
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    throw new Error("Calendar times are not available for this reservation.");
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}
function fold(line) {
  const encoder = new TextEncoder();
  let current = "";
  let size = 0;
  const lines = [];
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (size + bytes > 75) {
      lines.push(current);
      current = " ";
      size = 1;
    }
    current += character;
    size += bytes;
  }
  lines.push(current);
  return lines.join("\r\n");
}
export function bookingCalendar(booking, now = new Date()) {
  if (!(new Date(booking.ends_at) > new Date(booking.starts_at)))
    throw new Error("Calendar times are not available for this reservation.");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Redband//Reservations//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${escapeValue(booking.reference)}@redband`,
    `DTSTAMP:${timestamp(now.toISOString())}`,
    `DTSTART:${timestamp(booking.starts_at)}`,
    `DTEND:${timestamp(booking.ends_at)}`,
    `SUMMARY:${escapeValue(booking.service || "Reservation")}`,
    `LOCATION:${escapeValue([booking.location, booking.address].filter(Boolean).join(", "))}`,
    `DESCRIPTION:${escapeValue("Booking reference: " + booking.reference)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ]
    .map(fold)
    .join("\r\n");
}
export function downloadBookingCalendar(booking) {
  const url = URL.createObjectURL(
    new Blob([bookingCalendar(booking)], {
      type: "text/calendar;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "redband-reservation.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
