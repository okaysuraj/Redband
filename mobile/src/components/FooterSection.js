// Contact actions, dispatch subscription, and published policies.
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { subscribeDispatch } from "../api/client";
import {
  Button,
  Copy,
  Field,
  Heading,
  Label,
  Section,
  callPhone,
  ui,
} from "./ui";

export default React.memo(function FooterSection({
  content,
  brand,
  legal,
  locations = [],
  treatments = [],
  favorites = [],
  onOpenBooking,
  onManageBooking,
  onScrollToTop,
  onOpenLegal,
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const controller = useRef(null);
  const submitting = useRef(false);
  useEffect(() => () => controller.current?.abort(), []);
  async function subscribe() {
    if (submitting.current) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    controller.current = new AbortController();
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await subscribeDispatch(email.trim(), {
        signal: controller.current.signal,
      });
      if (!controller.current.signal.aborted)
        setMessage(response.message || "Subscription saved.");
    } catch (err) {
      if (!controller.current.signal.aborted) setError(err.message);
    } finally {
      submitting.current = false;
      if (!controller.current.signal.aborted) setBusy(false);
    }
  }
  return (
    <Section>
      {content?.dispatch_title && (
        <View style={ui.card}>
          <Heading>{content.dispatch_title}</Heading>
          <Copy>{content.dispatch_description}</Copy>
          {message ? (
            <Copy accessibilityLiveRegion="polite">{message}</Copy>
          ) : (
            <>
              <Field
                label="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                maxLength={255}
                editable={!busy}
              />
              <Button onPress={subscribe} loading={busy}>
                Subscribe
              </Button>
            </>
          )}
          <Copy style={ui.error} accessibilityLiveRegion="polite">
            {error}
          </Copy>
          <Copy>{content.dispatch_fineprint}</Copy>
        </View>
      )}
      <Heading>{brand?.name}</Heading>
      <Copy>{brand?.subtitle}</Copy>
      <Copy>{brand?.description}</Copy>
      {!!locations.length && <Label>Studios</Label>}
      {locations.map((location) => (
        <View key={location.id} style={ui.card}>
          <Heading style={{ fontSize: 22 }}>
            {location.city} · {location.neighborhood}
          </Heading>
          <Copy>{location.address}</Copy>
          <Copy>{location.hours}</Copy>
          {location.phone && (
            <Button secondary onPress={() => callPhone(location.phone)}>
              {location.phone}
            </Button>
          )}
        </View>
      ))}
      {!!treatments.length && <Label>Treatments</Label>}
      {treatments.map((treatment) => (
        <Copy key={treatment.id}>
          {treatment.title} · {treatment.duration} · {treatment.price}
        </Copy>
      ))}
      {!!favorites.length && <Label>Additions</Label>}
      {favorites.map((item) => (
        <Copy key={item.code}>
          {item.name} · {item.duration} · {item.price}
        </Copy>
      ))}
      {content?.protocols?.map((protocol, index) => (
        <View key={index} style={ui.card}>
          <Heading style={{ fontSize: 22 }}>{protocol.title}</Heading>
          <Copy>{protocol.description}</Copy>
        </View>
      ))}
      <Button onPress={onOpenBooking}>Reserve an appointment</Button>
      <Button secondary onPress={onManageBooking}>
        Manage a reservation
      </Button>
      <Copy>{content?.copyright}</Copy>
      <View style={ui.row}>
        {Object.entries(legal || {}).map(
          ([key, value]) =>
            value?.body && (
              <Button key={key} secondary onPress={() => onOpenLegal(value)}>
                {value.title || key}
              </Button>
            ),
        )}
        <Button secondary onPress={onScrollToTop}>
          Top ↑
        </Button>
      </View>
    </Section>
  );
});
