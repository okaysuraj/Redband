// Display the published additions and select one for a reservation.
import React from "react";
import { View } from "react-native";
import { COLORS } from "../theme/colors";
import { Button, Copy, Heading, Section, ui } from "./ui";

export default React.memo(function ApothecaryChapter({
  content,
  favorites = [],
  onOpenBookingWithAddon,
}) {
  return (
    <Section style={{ backgroundColor: COLORS.darkBg }}>
      <Heading style={{ color: COLORS.darkText }}>
        {content?.title || "Additions"}
      </Heading>
      <Copy style={{ color: COLORS.darkTextMuted }}>
        {content?.description}
      </Copy>
      {!favorites.length && (
        <Copy style={{ color: COLORS.darkTextMuted }}>
          No additions are currently published.
        </Copy>
      )}
      {favorites.map((item) => (
        <View
          key={item.code}
          style={[
            ui.card,
            {
              backgroundColor: COLORS.darkCard,
              borderColor: COLORS.darkBorder,
            },
          ]}
        >
          <Copy style={{ color: COLORS.darkTextMuted }}>
            {item.code} · {item.highlight}
          </Copy>
          <Heading style={{ color: COLORS.darkText, fontSize: 22 }}>
            {item.name}
          </Heading>
          <Copy style={{ color: COLORS.darkTextMuted }}>{item.detail}</Copy>
          <Copy style={{ color: COLORS.darkText }}>
            {item.price} · {item.duration}
          </Copy>
          <Button
            secondary
            onPress={() => onOpenBookingWithAddon(item.name)}
            label={`Select addition: ${item.name}`}
          >
            Select addition +
          </Button>
        </View>
      ))}
    </Section>
  );
});
