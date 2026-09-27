import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../theme/colors";

export default function Ticker() {
  const statements = [
    "ARCHITECTURAL DRY SCISSOR CUTTING",
    "OZONE VAPOR SCALP PURIFICATION",
    "SINGLE-CHAIR ACOUSTIC ISOLATION",
    "TRICHOLOGICAL MICROSCOPE DIAGNOSTICS",
    "BIO-LIPID BOTANICAL FORMULATIONS",
    "NO HURRIED CHAIR ROTATIONS",
    "BY APPOINTMENT ONLY",
  ];

  return (
    <View style={styles.tickerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollTrack}
      >
        {statements.concat(statements).map((text, idx) => (
          <View key={idx} style={styles.itemWrap}>
            <Text style={styles.bullet}>/</Text>
            <Text style={styles.text}>{text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tickerContainer: {
    backgroundColor: COLORS.paperDim,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 10,
  },
  scrollTrack: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  itemWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    gap: 8,
  },
  bullet: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.accentRed,
    fontWeight: "700",
  },
  text: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.inkSecondary,
    letterSpacing: 0.8,
  },
});
