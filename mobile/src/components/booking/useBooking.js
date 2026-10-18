import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { randomUUID } from "expo-crypto";
import { createBooking, fetchAvailability } from "../../api/client";

/** Refreshes live inventory on resume and reuses request keys when retrying. */
export default function useBooking({
  initialTreatmentId,
  initialLocationId,
  initialAddon,
  treatments = [],
  locations = [],
  practitioners = [],
  favorites = [],
  onConfirmed,
}) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(
    initialTreatmentId || treatments[0]?.id || "",
  );
  const [locationId, setLocationId] = useState(
    initialLocationId || locations[0]?.id || "",
  );
  const [practitionerId, setPractitionerId] = useState("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const [addon, setAddon] = useState(initialAddon || "");
  const [silent, setSilent] = useState(false);
  const [guest, setGuest] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [retry, setRetry] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const mounted = useRef(true);
  const inFlight = useRef(false);
  const submitController = useRef(null);
  const submission = useRef(null);
  const service = treatments.find((item) => item.id === serviceId);
  const location = locations.find((item) => item.id === locationId);
  const addition = favorites.find(
    (item) => item.name === addon || item.code === addon,
  );
  const totalMinor = (service?.price_minor || 0) + (addition?.price_minor || 0);
  const totalDuration =
    (service?.duration_minutes || 0) + (addition?.duration_minutes || 0);
  const currencyMatches =
    (!service || !location || service.currency === location.currency) &&
    (!addition || !location || addition.currency === location.currency);
  const practitioner = practitioners.find((item) => item.id === practitionerId);
  const scheduleActive = step >= 4 && !confirmation;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      submitController.current?.abort();
    };
  }, []);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") setRetry((value) => value + 1);
    });
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (!scheduleActive || !serviceId || !locationId) return undefined;
    const controller = new AbortController();
    // Each schedule request invalidates the previous slot before contacting the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecking(true);
    setSlots([]);
    setTime("");
    setAvailabilityError("");
    fetchAvailability(
      { date, locationId, practitionerId, treatmentId: serviceId, addon },
      { signal: controller.signal },
    )
      .then((response) => {
        if (controller.signal.aborted) return;
        if (
          !Array.isArray(response.dates) ||
          !Array.isArray(response.time_slots)
        )
          throw new Error("The server returned an invalid schedule.");
        setDates(response.dates);
        if (!date || !response.dates.some((item) => item.date === date)) {
          setDate(response.dates[0]?.date || "");
          return;
        }
        setSlots(response.time_slots);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setAvailabilityError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => controller.abort();
  }, [
    scheduleActive,
    serviceId,
    locationId,
    practitionerId,
    date,
    addon,
    retry,
  ]);
  const liveSelection = Boolean(
    date &&
      time &&
      slots.some((slot) => slot.time === time && slot.available) &&
      !checking &&
      !availabilityError,
  );
  function next() {
    setError("");
    if (
      (step === 1 && !service) ||
      (step === 2 && !location) ||
      (step === 4 && !liveSelection)
    )
      return;
    setStep((value) => Math.min(value + 1, 5));
  }
  async function confirm() {
    if (inFlight.current) return;
    if (!service || !location || !liveSelection || !currencyMatches) {
      setError("Choose an available date, time, and compatible studio first.");
      setStep(4);
      return;
    }
    const phoneDigits = guest.phone.replace(/\D/g, "");
    if (
      !guest.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim()) ||
      !/^\+?[\d ()\-.]{5,32}$/.test(guest.phone.trim()) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      setError(
        "Enter your name, valid email address, and a phone number with 7 to 15 digits.",
      );
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    setError("");
    submitController.current = new AbortController();
    try {
      const payload = {
        treatment_id: serviceId,
        location_id: locationId,
        practitioner_id: practitionerId,
        date,
        time,
        silent_chair: silent,
        addon: addon || null,
        guest_name: guest.name.trim(),
        guest_email: guest.email.trim(),
        guest_phone: guest.phone.trim(),
        guest_notes: guest.notes.trim() || null,
      };
      const fingerprint = JSON.stringify(payload);
      if (submission.current?.fingerprint !== fingerprint)
        submission.current = { fingerprint, key: randomUUID() };
      const response = await createBooking(payload, {
        signal: submitController.current.signal,
        headers: { "Idempotency-Key": submission.current.key },
      });
      if (!response.reference)
        throw new Error(
          "The server did not return a reservation reference. Check your reservations before retrying.",
        );
      if (mounted.current) {
        setConfirmation(response);
        onConfirmed?.(response);
      }
    } catch (err) {
      if (!mounted.current || submitController.current.signal.aborted) return;
      setError(err.message);
      if (err.status === 409) {
        setTime("");
        setStep(4);
        setRetry((value) => value + 1);
      }
    } finally {
      inFlight.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }
  const changeGuest = (key) => (value) =>
    setGuest((previous) => ({ ...previous, [key]: value }));

  return {
    step,
    setStep,
    serviceId,
    setServiceId,
    locationId,
    setLocationId,
    practitionerId,
    setPractitionerId,
    date,
    setDate,
    time,
    setTime,
    dates,
    slots,
    addon,
    setAddon,
    silent,
    setSilent,
    guest,
    checking,
    error,
    setError,
    availabilityError,
    setRetry,
    submitting,
    confirmation,
    service,
    location,
    addition,
    totalMinor,
    totalDuration,
    currencyMatches,
    practitioner,
    liveSelection,
    next,
    confirm,
    changeGuest,
  };
}
