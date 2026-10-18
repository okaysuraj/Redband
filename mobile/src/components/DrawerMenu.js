// Navigate published screen sections and choose the active studio.
import React from "react";

import { Button, Copy, Label, Sheet } from "./ui";

export default function DrawerMenu({
  onClose,
  activeLocation,
  locations = [],
  sections = [],
  onSelectLocation,
  onNavigateSection,
  onOpenBooking,
  onManageBooking,
}) {
  const navigate = (key) => {
    onClose();
    onNavigateSection(key);
  };
  return (
    <Sheet title="Navigation" onClose={onClose}>
      {sections.map((section) => (
        <Button
          key={section.key}
          secondary
          onPress={() => navigate(section.key)}
        >
          {section.title}
        </Button>
      ))}
      <Label>Select studio</Label>
      {locations.length ? (
        locations.map((location) => (
          <Button
            key={location.id}
            secondary
            selected={location.id === activeLocation}
            onPress={() => onSelectLocation(location.id)}
          >
            {location.city} · {location.neighborhood}
          </Button>
        ))
      ) : (
        <Copy>No studios are published.</Copy>
      )}
      <Button
        onPress={() => {
          onClose();
          onOpenBooking();
        }}
      >
        Reserve an appointment
      </Button>
      <Button
        secondary
        onPress={() => {
          onClose();
          onManageBooking();
        }}
      >
        Manage a reservation
      </Button>
    </Sheet>
  );
}
