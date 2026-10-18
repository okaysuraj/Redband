// Display the published introduction and reservation action.
import React from "react";
import { View } from "react-native";
import { Button, Copy, Heading, Label, Media, Section, ui } from "./ui";

export default React.memo(function HeroSection({
  content,
  onOpenBooking,
  onScrollDown,
}) {
  if (!content) return null;
  return (
    <Section>
      <Label>{content.eyebrow}</Label>
      <Label>{content.badge}</Label>
      <Heading style={{ fontSize: 36, lineHeight: 44 }}>
        {content.title}
      </Heading>
      <Heading style={{ fontStyle: "italic" }}>{content.subtitle}</Heading>
      <Copy>{content.description}</Copy>
      <View style={ui.row}>
        <Button onPress={onOpenBooking}>Reserve an appointment</Button>
        <Button secondary onPress={onScrollDown}>
          View treatments ↓
        </Button>
      </View>
      {!!content.stats?.length && (
        <View style={ui.row}>
          {content.stats.map((stat, index) => (
            <View key={index} style={ui.card}>
              <Label>{stat.label}</Label>
              <Copy>{stat.value}</Copy>
            </View>
          ))}
        </View>
      )}
      <Media
        path={content.image_url}
        alt={content.image_alt}
        caption={content.image_caption}
      />
      <Copy>{content.location_caption}</Copy>
    </Section>
  );
});
