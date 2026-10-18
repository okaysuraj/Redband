// HTTP requests, Firebase authorization, and server error messages for the website.
import { getAccessToken } from "../auth/firebase.js";

/** Public API origin; an empty value uses Vite's local /api proxy. */
const API_BASE = (import.meta.env?.VITE_API_URL || "").replace(/\/$/, "");

function errorMessage(data, status) {
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail))
    return (
      data.detail
        .map((item) => item.msg)
        .filter(Boolean)
        .join(". ") || "Please check your details."
    );
  return status >= 500
    ? "The studio service is unavailable. Please try again."
    : `Request failed (${status}).`;
}

export async function request(endpoint, options = {}) {
  const timeout = AbortSignal.timeout(15000);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeout])
    : timeout;
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      cache: "no-store",
    });
  } catch (cause) {
    if (cause.name === "AbortError") throw cause;
    throw new Error(
      cause.name === "TimeoutError"
        ? "The request timed out. Please try again."
        : "Cannot connect to the studio. Check your connection and try again.",
      { cause },
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(errorMessage(data, response.status));
    error.status = response.status;
    throw error;
  }
  if (data === null && response.status !== 204)
    throw new Error(
      "The studio returned an invalid response. Please try again.",
    );
  return data;
}

export const fetchTreatments = (options) => request("/api/treatments", options);
export const fetchLocations = (options) => request("/api/locations", options);
export const fetchPractitioners = (options) =>
  request("/api/practitioners", options);
export const fetchContent = (options) => request("/api/content", options);
export const fetchSignatureFavorites = (options) =>
  request("/api/availability/favorites", options);

export function fetchAvailability(
  { date, locationId, practitionerId, treatmentId, addon } = {},
  options,
) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (locationId) params.set("location_id", locationId);
  if (practitionerId && practitionerId !== "any")
    params.set("practitioner_id", practitionerId);
  if (treatmentId) params.set("treatment_id", treatmentId);
  if (addon) params.set("addon", addon);
  return request(`/api/availability?${params}`, options);
}

async function privateRequest(endpoint, options = {}) {
  const token = await getAccessToken();
  if (!token) {
    const error = new Error("Sign in to manage your reservations.");
    error.status = 401;
    throw error;
  }
  return request(endpoint, {
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
export function fetchMyBookings({ offset = 0, limit = 50, ...options } = {}) {
  const query = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });
  return privateRequest(`/api/bookings?${query}`, options);
}
export const cancelBooking = (reference, options) =>
  privateRequest(`/api/bookings/${encodeURIComponent(reference)}`, {
    ...options,
    method: "DELETE",
  });
export const subscribeDispatch = (email, options) =>
  request("/api/dispatch/subscribe", {
    ...options,
    method: "POST",
    body: JSON.stringify({ email }),
  });

/** Backend URLs can be relative; only HTTP(S) URLs are accepted for media. */
export function mediaUrl(path) {
  if (typeof path !== "string" || !path.trim()) return undefined;
  if (path.startsWith("/") && !path.startsWith("//"))
    return `${API_BASE}${path}`;
  try {
    const url = new URL(path);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
