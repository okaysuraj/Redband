import { useEffect, useRef, useState } from "react";
import { createBooking, fetchAvailability } from "../../api/client";

/** Owns selections, live availability, and the reservation submission lifecycle. */
export default function useBooking({
  initialTreatmentId,
  initialLocationId,
  initialAddon,
  treatments = [],
  locations = [],
  practitioners = [],
  favorites = [],
}) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(
    treatments.some((item) => item.id === initialTreatmentId)
      ? initialTreatmentId
      : treatments[0]?.id || "",
  );
  const [locationId, setLocationId] = useState(
    locations.some((item) => item.id === initialLocationId)
      ? initialLocationId
      : locations[0]?.id || "",
  );
  const [practitionerId, setPractitionerId] = useState("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [silent, setSilent] = useState(false);
  const [addon, setAddon] = useState(
    favorites.some((item) => item.name === initialAddon) ? initialAddon : "",
  );
  const [availability, setAvailability] = useState({
    dates: [],
    time_slots: [],
  });
  const [availabilityStatus, setAvailabilityStatus] = useState("idle");
  const [availabilityError, setAvailabilityError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [guest, setGuest] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const mounted = useRef(true);
  const submittingRef = useRef(false);
  const submitController = useRef(null);
  const submission = useRef(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      submitController.current?.abort();
    };
  }, []);
  const service = treatments.find((item) => item.id === serviceId);
  const location = locations.find((item) => item.id === locationId);
  const practitioner = practitioners.find((item) => item.id === practitionerId);
  const chosenAddon = favorites.find((item) => item.name === addon);
  const totalMinor =
    (service?.price_minor || 0) + (chosenAddon?.price_minor || 0);
  const totalDuration =
    (service?.duration_minutes || 0) + (chosenAddon?.duration_minutes || 0);
  const currencyMatches =
    (!service || !location || service.currency === location.currency) &&
    (!chosenAddon || chosenAddon.currency === service?.currency);
  const eligiblePractitioners = practitioners.filter(
    (item) =>
      (!item.location_ids?.length || item.location_ids.includes(locationId)) &&
      (!item.treatment_ids?.length || item.treatment_ids.includes(serviceId)),
  );

  useEffect(() => {
    if (step !== 4 || !locationId || !serviceId || confirmation) return;
    const controller = new AbortController();
    // Changing any schedule input invalidates the previously selected time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAvailabilityStatus("loading");
    setAvailabilityError("");
    setTime("");
    fetchAvailability(
      {
        date: date || undefined,
        locationId,
        practitionerId,
        treatmentId: serviceId,
        addon: addon || undefined,
      },
      { signal: controller.signal },
    )
      .then((result) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(result.dates) || !Array.isArray(result.time_slots))
          throw new Error("Studio availability could not be read.");
        setAvailability(result);
        if (!date || !result.dates.some((item) => item.date === date)) {
          setDate(result.dates[0]?.date || "");
          setAvailabilityStatus(result.dates.length ? "loading" : "ready");
          return;
        }
        setAvailabilityStatus("ready");
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setAvailability({ dates: [], time_slots: [] });
          setAvailabilityError(error.message);
          setAvailabilityStatus("error");
        }
      });
    return () => controller.abort();
  }, [
    step,
    date,
    locationId,
    practitionerId,
    serviceId,
    addon,
    refresh,
    confirmation,
  ]);

  const slotValid =
    availabilityStatus === "ready" &&
    !!date &&
    availability.dates.some((item) => item.date === date) &&
    availability.time_slots.some(
      (item) => item.time === time && item.available,
    );
  let canContinue = slotValid;
  if (step === 1) canContinue = Boolean(service);
  if (step === 2) canContinue = Boolean(location) && currencyMatches;
  if (step === 3) {
    canContinue =
      practitionerId === "any"
        ? eligiblePractitioners.length > 0
        : eligiblePractitioners.some((item) => item.id === practitionerId);
  }
  function changeSelection(setter, value) {
    setter(value);
    setDate("");
    setTime("");
    setAvailability({ dates: [], time_slots: [] });
    setSubmitError("");
  }
  function changeGuest(key, value) {
    setGuest((current) => ({ ...current, [key]: value }));
  }
  async function submit(event) {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!slotValid || !service || !location || !currencyMatches) {
      setSubmitError(
        "Please choose an available date, time, and compatible studio.",
      );
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
      setSubmitError(
        "Please enter your name, a valid email, and a telephone number with 7 to 15 digits.",
      );
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    const controller = new AbortController();
    submitController.current = controller;
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
      // An unchanged retry must reuse its key even after a lost response.
      const fingerprint = JSON.stringify(payload);
      if (submission.current?.fingerprint !== fingerprint) {
        submission.current = { fingerprint, key: crypto.randomUUID() };
      }
      const result = await createBooking(payload, {
        signal: controller.signal,
        headers: { "Idempotency-Key": submission.current.key },
      });
      if (mounted.current) setConfirmation(result);
    } catch (error) {
      if (mounted.current && error.name !== "AbortError") {
        setSubmitError(error.message);
        if (error.status === 409) {
          setTime("");
          setStep(4);
          setRefresh((value) => value + 1);
        }
      }
    } finally {
      submittingRef.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }

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
    silent,
    setSilent,
    addon,
    setAddon,
    availability,
    availabilityStatus,
    availabilityError,
    setRefresh,
    guest,
    submitError,
    setSubmitError,
    submitting,
    confirmation,
    submittingRef,
    service,
    location,
    practitioner,
    chosenAddon,
    totalMinor,
    totalDuration,
    currencyMatches,
    eligiblePractitioners,
    canContinue,
    changeSelection,
    changeGuest,
    submit,
  };
}
