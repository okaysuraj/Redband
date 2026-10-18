// Mobile API endpoints, Firebase authorization, and approved media URLs.
import { Platform } from "react-native";
import { createTransport } from "./transport.mjs";
import { getAccessToken } from "../auth/firebase";

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const isDevelopment = typeof __DEV__ !== "undefined" && __DEV__;
const baseUrl =
  configuredUrl ||
  (isDevelopment
    ? Platform.OS === "android"
      ? "http://10.0.2.2:8000"
      : "http://127.0.0.1:8000"
    : "");
const transport = createTransport({ baseUrl, allowHttp: isDevelopment });

export const fetchTreatments = (options) =>
  transport("/api/treatments", options);
export const fetchLocations = (options) => transport("/api/locations", options);
export const fetchPractitioners = (options) =>
  transport("/api/practitioners", options);
export const fetchContent = (options) => transport("/api/content", options);
export const fetchSignatureFavorites = (options) =>
  transport("/api/availability/favorites", options);
export function fetchAvailability(
  { date, locationId, practitionerId, treatmentId, addon } = {},
  options,
) {
  const entries = {
    date,
    location_id: locationId,
    treatment_id: treatmentId,
    addon,
    practitioner_id: practitionerId === "any" ? undefined : practitionerId,
  };
  const query = Object.entries(entries)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return transport(`/api/availability${query ? `?${query}` : ""}`, options);
}
async function privateRequest(endpoint, options = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error("Sign in to manage reservations.");
  return transport(endpoint, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
}
export const createBooking = (payload, options) =>
  privateRequest("/api/bookings", {
    ...options,
    method: "POST",
    body: JSON.stringify(payload),
  });
export const fetchBooking = (reference, options) =>
  privateRequest(`/api/bookings/${encodeURIComponent(reference)}`, options);
export const fetchMyBookings = ({ limit = 25, offset = 0, ...options } = {}) =>
  privateRequest(`/api/bookings?limit=${limit}&offset=${offset}`, options);
export const cancelBooking = (reference, options) =>
  privateRequest(`/api/bookings/${encodeURIComponent(reference)}`, {
    ...options,
    method: "DELETE",
  });
export const subscribeDispatch = (email, options) =>
  transport("/api/dispatch/subscribe", {
    ...options,
    method: "POST",
    body: JSON.stringify({ email }),
  });

export function resolveMediaUrl(path) {
  if (typeof path !== "string" || !path.trim()) return undefined;
  try {
    const url = new URL(path, `${baseUrl.replace(/\/$/, "")}/`);
    if (
      url.protocol === "https:" ||
      (isDevelopment && url.protocol === "http:")
    )
      return url.href;
  } catch {
    /* Missing media is omitted; no invented image fallback. */
  }
  return undefined;
}
