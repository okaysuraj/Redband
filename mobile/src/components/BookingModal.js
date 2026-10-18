import React from "react";
import { View } from "react-native";
import { Button, Copy, Sheet, ui } from "./ui";
import BookingChoices from "./booking/BookingChoices";
import BookingSchedule from "./booking/BookingSchedule";
import BookingDetails from "./booking/BookingDetails";
import BookingConfirmation from "./booking/BookingConfirmation";
import useBooking from "./booking/useBooking";

/** Native reservation screens; the hook owns requests and selection validation. */
export default function BookingModal(props) {
  const {
    onClose,
    treatments = [],
    locations = [],
    practitioners = [],
    favorites = [],
  } = props;
  const booking = useBooking(props);
  const {
    step,
    setStep,
    confirmation,
    submitting,
    service,
    location,
    liveSelection,
    next,
    error,
  } = booking;
  return (
    <Sheet
      title={
        confirmation ? "Reservation confirmed" : `Reserve · Step ${step} of 5`
      }
      onClose={onClose}
      footer={
        !confirmation && (
          <View style={ui.row}>
            {step > 1 && (
              <Button
                secondary
                disabled={submitting}
                onPress={() => setStep((value) => value - 1)}
              >
                ← Back
              </Button>
            )}
            {step < 5 && (
              <Button
                disabled={
                  (step === 1 && !service) ||
                  (step === 2 && !location) ||
                  (step === 4 && !liveSelection)
                }
                onPress={next}
              >
                Continue →
              </Button>
            )}
          </View>
        )
      }
    >
      <Copy style={ui.error} accessibilityLiveRegion="polite">
        {error}
      </Copy>
      {confirmation ? (
        <BookingConfirmation booking={booking} onClose={onClose} />
      ) : (
        <>
          <BookingChoices
            booking={booking}
            treatments={treatments}
            locations={locations}
            practitioners={practitioners}
          />
          <BookingSchedule booking={booking} favorites={favorites} />
          <BookingDetails booking={booking} />
        </>
      )}
    </Sheet>
  );
}
