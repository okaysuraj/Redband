import React from "react";
import { View } from "react-native";
import { Button, Copy, Heading, ui } from "../ui";

/** Treatment, studio, and practitioner choices. */

/** Treatment, studio, and practitioner choices. */
export default function BookingChoices({
  booking,
  treatments,
  locations,
  practitioners,
}) {
  const {
    step,
    serviceId,
    setServiceId,
    locationId,
    setLocationId,
    practitionerId,
    setPractitionerId,
  } = booking;
  return (
    <>
      {" "}
      {step === 1 && (
        <>
          <Heading>Select treatment</Heading>
          {treatments.map((item) => (
            <View key={item.id} style={ui.card}>
              <Button
                secondary
                selected={item.id === serviceId}
                onPress={() => setServiceId(item.id)}
              >
                {item.title} · {item.duration} · {item.price}
              </Button>
              <Copy>{item.subtitle}</Copy>
            </View>
          ))}
        </>
      )}
      {step === 2 && (
        <>
          <Heading>Select studio</Heading>
          {locations.map((item) => (
            <View key={item.id} style={ui.card}>
              <Button
                secondary
                selected={item.id === locationId}
                onPress={() => setLocationId(item.id)}
              >
                {item.city} · {item.neighborhood}
              </Button>
              <Copy>{item.address}</Copy>
              <Copy>{item.hours}</Copy>
            </View>
          ))}
        </>
      )}
      {step === 3 && (
        <>
          <Heading>Select practitioner</Heading>
          <Button
            secondary
            selected={practitionerId === "any"}
            onPress={() => setPractitionerId("any")}
          >
            Any available practitioner
          </Button>
          {practitioners.map((item) => (
            <View key={item.id} style={ui.card}>
              <Button
                secondary
                selected={item.id === practitionerId}
                onPress={() => setPractitionerId(item.id)}
              >
                {item.name}
              </Button>
              <Copy>{item.title}</Copy>
              <Copy>{item.experience}</Copy>
              <Copy>{item.specialty}</Copy>
              <Copy>{item.days?.join(" · ")}</Copy>
            </View>
          ))}
        </>
      )}
    </>
  );
}
