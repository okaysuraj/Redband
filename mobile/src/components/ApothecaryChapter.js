import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../theme/colors";
import { SIGNATURE_FAVORITES } from "../data/bookingData";

export default function ApothecaryChapter({ onOpenBookingWithAddon }) {
  return (
    <View style={styles.sectionContainer} id="favorites">
      {/* Header */}
      <View style={styles.eyebrowWrap}>
        <Text style={styles.eyebrowAccent}>03</Text>
        <Text style={styles.eyebrowText}>Verified Studio Additions</Text>
      </View>

      <Text style={styles.heading}>
        Apothecary Prescriptions & Sensory Calm
      </Text>

      <Text style={styles.leadText}>
        Every guest may tailor their primary treatment with targeted follicle
        formulas, cranial tension work, or requested acoustic silence.
      </Text>

      {/* Cards List */}
      <View style={styles.cardsContainer}>
        {SIGNATURE_FAVORITES.map((item) => (
          <View key={item.code} style={styles.darkCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.codeText}>{item.code}</Text>
              <View style={styles.badgeWrap}>
                <Text style={styles.badgeText}>{item.highlight}</Text>
              </View>
            </View>

            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDetail}>{item.detail}</Text>

            <View style={styles.cardBottomRow}>
              <View style={styles.pricingWrap}>
                <Text style={styles.priceText}>{item.price}</Text>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.selectBtn}
                onPress={() => onOpenBookingWithAddon(item.name)}
              >
                <Text style={styles.selectBtnText}>Select</Text>
                <Text style={styles.selectBtnPlus}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 36,
    backgroundColor: COLORS.darkBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkBorder,
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
    color: "#e8807a",
    fontWeight: "700",
  },
  eyebrowText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.darkTextMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heading: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    color: COLORS.darkText,
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  leadText: {
    fontFamily: FONTS.sans,
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.darkTextMuted,
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 14,
  },
  darkCard: {
    backgroundColor: COLORS.darkCard,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    borderRadius: 3,
    padding: 18,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  codeText: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: "700",
    color: "#e8807a",
  },
  badgeWrap: {
    backgroundColor: "rgba(247, 244, 238, 0.08)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  badgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    color: COLORS.darkTextMuted,
  },
  cardName: {
    fontFamily: FONTS.serif,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.darkText,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  cardDetail: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.darkTextMuted,
    marginBottom: 16,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.darkBorder,
    paddingTop: 14,
  },
  pricingWrap: {
    gap: 2,
  },
  priceText: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.darkText,
  },
  durationText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.darkTextFaint,
  },
  selectBtn: {
    backgroundColor: "rgba(247, 244, 238, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(247, 244, 238, 0.25)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectBtnText: {
    color: COLORS.darkText,
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  selectBtnPlus: {
    color: "#e8807a",
    fontSize: 14,
    fontWeight: "700",
  },
});
