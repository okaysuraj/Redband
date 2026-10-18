// Render published studio story content and approved images.
import React from "react";
import { View } from "react-native";
import { Copy, Heading, Label, Media, Section, ui } from "./ui";

export default React.memo(function AtelierStory({ content }) {
  if (!content) return null;
  return (
    <Section>
      <Label>{content.eyebrow}</Label>
      <Heading>{content.title}</Heading>
      {content.paragraphs?.map((paragraph, index) => (
        <Copy key={index}>{paragraph}</Copy>
      ))}
      {content.quote?.text && (
        <View style={[ui.card, { borderLeftWidth: 3 }]}>
          <Copy style={{ fontStyle: "italic" }}>{content.quote.text}</Copy>
          <Label>{content.quote.author}</Label>
          <Copy>{content.quote.role}</Copy>
        </View>
      )}
      {content.pillars?.map((pillar, index) => (
        <View key={index} style={ui.card}>
          <Heading style={{ fontSize: 22 }}>{pillar.title}</Heading>
          <Copy>{pillar.description}</Copy>
        </View>
      ))}
      {content.images?.map((image, index) => (
        <Media
          key={index}
          path={image.url}
          alt={image.alt}
          caption={image.caption}
        />
      ))}
    </Section>
  );
});
