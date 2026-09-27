import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { COLORS, FONTS } from "../theme/colors";
import { LOCATIONS } from "../data/bookingData";

export default function StudioSanctuaries({
  activeLocation,
  setActiveLocation,
  onSelectLocationForBooking,
}) {
  const callPhone = (phone) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9+]/g, "")}`);
  };

  return (
    <View style={styles.sectionContainer} id="locations">
      {/* Header */}
      <View style={styles.eyebrowWrap}>
        <Text style={styles.eyebrowAccent}>04</Text>
        <Text style={styles.eyebrowText}>Studio Locations & Hours</Text>
      </View>

      <Text style={styles.heading}>Two quiet sanctuaries.</Text>

      <Text style={styles.leadText}>
        Both studios are built with private single-chair acoustic rooms,
        natural north/east daylight, and step-free street or elevator access.
      </Text>

      {/* Location Cards */}
      <View style={styles.cardsContainer}>
        {LOCATIONS.map((loc) => {
          const isSelected = activeLocation === loc.id;
          return (
            <View
              key={loc.id}
              style={[
                styles.locationCard,
                isSelected && styles.locationCardSelected,
              ]}
            >
              {/* Card Top */}
              <View style={styles.cardTopRow}>
                <View style={styles.cityCol}>
                  <Text style={styles.neighborhoodText}>
                    {loc.neighborhood}
                  </Text>
                  <Text style={styles.cityName}>{loc.city} Atelier</Text>
                </View>

                <View style={styles.statusStack}>
                  {isSelected && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeDot}>●</Text>
                      <Text style={styles.activeBadgeText}>Active Choice</Text>
                    </View>
                  )}
                  <View style={styles.statusPill}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{loc.status}</Text>
                  </View>
                </View>
              </View>

              {/* Card Body details */}
              <View style={styles.detailsContainer}>
                {/* Address */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.addressText}>{loc.address}</Text>
                  <Text style={styles.transitText}>{loc.transit}</Text>
                </View>

                {/* Operating Schedule */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Operating Schedule</Text>
                  <Text style={styles.infoValue}>{loc.hours}</Text>
                </View>

                {/* Accessibility */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Accessibility</Text>
                  <Text style={styles.infoValue}>{loc.accessibility}</Text>
                </View>

                {/* Direct Line */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Direct Line</Text>
                  <TouchableOpacity
                    onPress={() => callPhone(loc.phone)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.phoneLink}>{loc.phone}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Button */}
              <View style={styles.cardFoot}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.reserveLocBtn,
                    isSelected && styles.reserveLocBtnActive,
                  ]}
                  onPress={() => {
                    setActiveLocation(loc.id);
                    onSelectLocationForBooking(loc.id);
                  }}
                >
                  <Text
                    style={[
                      styles.reserveLocBtnText,
                      isSelected && styles.reserveLocBtnTextActive,
                    ]}
                  >
                    Reserve in {loc.city}
                  </Text>
                  <Text
                    style={[
                      styles.reserveLocArrow,
                      isSelected && styles.reserveLocArrowActive,
                    ]}
                  >
                    →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: COLORS.paper,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  eyebrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  eyebrowAccent: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.accentRed,
    fontWeight: "700",
  },
  eyebrowText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.inkMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heading: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  leadText: {
    fontFamily: FONTS.sans,
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.inkSecondary,
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  locationCard: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 3,
    padding: 18,
  },
  locationCardSelected: {
    borderColor: COLORS.ink,
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 14,
  },
  cityCol: {
    flex: 1,
  },
  neighborhoodText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cityName: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  statusStack: {
    alignItems: "flex-end",
    gap: 6,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.paperDim,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    gap: 4,
  },
  activeDot: {
    fontSize: 8,
    color: COLORS.accentRed,
  },
  activeBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.ink,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.statusGreenBg,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 2,
    gap: 5,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.statusGreen,
  },
  statusText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.statusGreen,
    fontWeight: "600",
  },
  detailsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addressText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.ink,
  },
  transitText: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  infoValue: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.inkSecondary,
  },
  phoneLink: {
    fontFamily: FONTS.mono,
    fontSize: 12.5,
    color: COLORS.accentRed,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  cardFoot: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 14,
  },
  reserveLocBtn: {
    backgroundColor: COLORS.paperDim,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    paddingVertical: 12,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  reserveLocBtnActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  reserveLocBtnText: {
    color: COLORS.ink,
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  reserveLocBtnTextActive: {
    color: COLORS.paper,
  },
  reserveLocArrow: {
    color: COLORS.ink,
    fontSize: 14,
  },
  reserveLocArrowActive: {
    color: COLORS.paper,
  },
});
