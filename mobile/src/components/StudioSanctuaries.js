// Display studios and pass location choices to the main screen.
import React from "react";
import { View } from "react-native";
import {
  Button,
  Copy,
  Heading,
  Label,
  Section,
  Status,
  callPhone,
  ui,
} from "./ui";

export default React.memo(function StudioSanctuaries({
  content,
  locations = [],
  activeLocation,
  setActiveLocation,
  onSelectLocationForBooking,
}) {
  return (
    <Section>
      <Label>Studios</Label>
      <Heading>{content?.title}</Heading>
      <Copy>{content?.description}</Copy>
      {!locations.length && (
        <Status empty="No studios are currently published." />
      )}
      {locations.map((location) => (
        <View
          key={location.id}
          style={[ui.card, activeLocation === location.id && ui.selected]}
        >
          <Label>{location.neighborhood}</Label>
          <Heading>{location.city}</Heading>
          <Copy>{location.status}</Copy>
          <Copy>{location.address}</Copy>
          <Copy>{location.transit}</Copy>
          <Copy>{location.hours}</Copy>
          <Copy>{location.accessibility}</Copy>
          <Copy>{location.timezone}</Copy>
          {location.phone && (
            <Button secondary onPress={() => callPhone(location.phone)}>
              {location.phone}
            </Button>
          )}
          <Button
            secondary
            selected={activeLocation === location.id}
            onPress={() => setActiveLocation(location.id)}
          >
            Select studio
          </Button>
          <Button onPress={() => onSelectLocationForBooking(location.id)}>
            Reserve in {location.city}
          </Button>
        </View>
      ))}
    </Section>
  );
});
