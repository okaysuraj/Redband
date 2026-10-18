// Select a catalog treatment, inspect its details, and start a reservation.
import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Copy, Heading, Label, Media, Section, Status, ui } from "./ui";

export default React.memo(function TreatmentLookbook({
  content,
  treatments = [],
  selectedTreatmentId,
  onSelectTreatment,
  onSelectTreatmentForBooking,
}) {
  const selected =
    treatments.find((item) => item.id === selectedTreatmentId) || treatments[0];
  return (
    <Section>
      <Label>Treatments</Label>
      <Heading>{content?.title}</Heading>
      <Copy>{content?.description}</Copy>
      <Copy>{content?.note}</Copy>
      {!selected ? (
        <Status empty="No treatments are currently published." />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {treatments.map((treatment) => (
              <Button
                key={treatment.id}
                secondary
                selected={selected.id === treatment.id}
                onPress={() => onSelectTreatment(treatment.id)}
                label={`${treatment.title}, ${treatment.duration}, ${treatment.price}`}
              >
                {treatment.title}
              </Button>
            ))}
          </ScrollView>
          <View style={ui.card}>
            <Media path={selected.image_path} alt={selected.image_alt} />
            <Label>{selected.category}</Label>
            <Heading>{selected.title}</Heading>
            <Copy>{selected.subtitle}</Copy>
            <Label>
              {selected.price} · {selected.duration}
            </Label>
            <Copy>{selected.description}</Copy>
            {!!selected.formulations?.length && <Label>Formulations</Label>}
            {selected.formulations?.map((formula, index) => (
              <Copy key={index}>• {formula}</Copy>
            ))}
            {!!selected.steps?.length && <Label>Treatment sequence</Label>}
            {selected.steps?.map((step, index) => (
              <Copy key={index}>
                {index + 1}. {step}
              </Copy>
            ))}
            <Button onPress={() => onSelectTreatmentForBooking(selected.id)}>
              Reserve {selected.title}
            </Button>
            <Copy>{content?.cancellation_note}</Copy>
          </View>
        </>
      )}
      {(content?.protocol_title || content?.protocol_description) && (
        <View style={ui.card}>
          <Heading style={{ fontSize: 22 }}>{content.protocol_title}</Heading>
          <Copy>{content.protocol_description}</Copy>
          {content.amenities?.map((value, index) => (
            <Copy key={index}>{value}</Copy>
          ))}
          {content.features?.map((value, index) => (
            <Copy key={index}>• {value}</Copy>
          ))}
        </View>
      )}
    </Section>
  );
});
