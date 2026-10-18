// Show the selected studio and provide navigation and account actions.
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../theme/colors";
import { Button, Copy } from "./ui";

export default React.memo(function Header({
  brand,
  activeLocation,
  onSelectLocation,
  onOpenBooking,
  onOpenDrawer,
  onScrollToTop,
  auth,
  onManageBooking,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to top"
          onPress={onScrollToTop}
          style={({ pressed }) => [styles.brand, pressed && styles.pressed]}
        >
          <Text style={styles.name}>
            {brand?.name || "Redband"}
            <Text style={styles.mark}>.</Text>
          </Text>
          <Copy style={styles.subtitle}>{brand?.subtitle}</Copy>
        </Pressable>
        <Button secondary onPress={onOpenDrawer} label="Open navigation">
          ☰
        </Button>
      </View>
      <View style={styles.utilityRow}>
        {activeLocation && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Selected studio: ${activeLocation.city}. Change studio`}
            onPress={onSelectLocation}
            style={({ pressed }) => [styles.studio, pressed && styles.pressed]}
          >
            <Text style={styles.utilityText}>{activeLocation.city} ↓</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: Boolean(auth?.loading) }}
          disabled={auth?.loading}
          onPress={auth?.user ? auth.signOut : auth?.openAuth}
          style={styles.utility}
        >
          <Text style={styles.utilityText}>
            {auth?.user ? "Sign out" : "Sign in"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onManageBooking}
          style={styles.utility}
        >
          <Text style={styles.utilityText}>Your reservations</Text>
        </Pressable>
        <Button onPress={onOpenBooking}>Reserve</Button>
      </View>
    </View>
  );
});
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    backgroundColor: COLORS.paper,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderStrong,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    minHeight: 56,
  },
  brand: { flex: 1, minHeight: 48, justifyContent: "center", gap: 2 },
  name: {
    fontFamily: FONTS.serif,
    fontSize: 25,
    lineHeight: 30,
    color: COLORS.ink,
    letterSpacing: -0.7,
  },
  mark: { color: COLORS.accentRed },
  subtitle: { fontSize: 10, lineHeight: 15, letterSpacing: 0.5 },
  utilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    paddingTop: 6,
    paddingBottom: 8,
  },
  studio: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: "center",
    flexShrink: 1,
    paddingRight: 4,
  },
  utility: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  utilityText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.inkSecondary,
  },
  pressed: { opacity: 0.65 },
});
