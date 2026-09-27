import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { COLORS, FONTS } from "../theme/colors";
import { IMAGES } from "../data/bookingData";

const { width } = Dimensions.get("window");

export default function HeroSection({ onOpenBooking, onScrollDown }) {
  return (
    <View style={styles.sectionContainer}>
      {/* Eyebrow & Badges */}
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowWrap}>
          <Text style={styles.eyebrowDot}>●</Text>
          <Text style={styles.eyebrowText}>
            Atelier No. 312 · Est. 2021
          </Text>
        </View>
        <View style={styles.badgeTag}>
          <Text style={styles.badgeTagText}>By Appointment Only</Text>
        </View>
      </View>

      {/* Main Editorial Headline */}
      <View style={styles.titleWrap}>
        <Text style={styles.headingMain}>
          Cut with clarity.{"\n"}
          <Text style={styles.headingItalic}>Restored with discipline.</Text>
        </Text>
      </View>

      {/* Lead Copy */}
      <Text style={styles.leadText}>
        A private restorative hair clinic and bespoke cutting room. We diagnose head shape, 
        follicle density, and texture before touching shears—infusing cold-pressed botanical 
        elixirs in single-chair acoustic silence.
      </Text>

      {/* Primary Action Button */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.ctaButton}
          onPress={() => onOpenBooking()}
        >
          <Text style={styles.ctaButtonText}>Reserve Consultation</Text>
          <Text style={styles.ctaButtonArrow}>→</Text>
        </TouchableOpacity>

        {onScrollDown && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.circleScrollBtn}
            onPress={onScrollDown}
          >
            <Text style={styles.circleScrollArrow}>↓</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3-Column Meta Strip */}
      <View style={styles.metaStrip}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Chairs</Text>
          <Text style={styles.metaVal}>1 Guest / Suite</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Formulations</Text>
          <Text style={styles.metaVal}>100% Bio-Lipid</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Pace</Text>
          <Text style={styles.metaVal}>55–115 min</Text>
        </View>
      </View>

      {/* Portrait Media Container */}
      <View style={styles.mediaContainer}>
        <View style={styles.imageFrame}>
          <Image
            source={IMAGES.hero}
            style={styles.portraitImage}
            resizeMode="cover"
          />

          {/* Overlay Tag Top */}
          <View style={styles.topOverlayTag}>
            <View style={styles.tagDot} />
            <Text style={styles.tagText}>
              Quiet Craft · Portrait Study No. 04
            </Text>
          </View>

          {/* Overlay Tag Bottom */}
          <View style={styles.bottomOverlayTag}>
            <Text style={styles.bottomTagText}>
              NoHo Suite · Studio Window East
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.paper,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  eyebrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eyebrowDot: {
    color: COLORS.accentRed,
    fontSize: 10,
  },
  eyebrowText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.inkMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  badgeTag: {
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    backgroundColor: COLORS.paperLight,
  },
  badgeTagText: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    color: COLORS.inkSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  titleWrap: {
    marginBottom: 16,
  },
  headingMain: {
    fontFamily: FONTS.serif,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.6,
  },
  headingItalic: {
    fontStyle: "italic",
    fontWeight: "400",
    color: COLORS.accentRed,
  },
  leadText: {
    fontFamily: FONTS.sans,
    fontSize: 14.5,
    lineHeight: 22,
    color: COLORS.inkSecondary,
    marginBottom: 22,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  ctaButton: {
    flex: 1,
    backgroundColor: COLORS.ink,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  ctaButtonText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  ctaButtonArrow: {
    color: COLORS.paper,
    fontSize: 14,
  },
  circleScrollBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.paperLight,
  },
  circleScrollArrow: {
    fontSize: 16,
    color: COLORS.ink,
  },
  metaStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 24,
  },
  metaItem: {
    flex: 1,
    alignItems: "center",
  },
  metaLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  metaVal: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.ink,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderStrong,
  },
  mediaContainer: {
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageFrame: {
    position: "relative",
    width: "100%",
    height: 380,
    backgroundColor: COLORS.paperDim,
  },
  portraitImage: {
    width: "100%",
    height: "100%",
  },
  topOverlayTag: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 19, 17, 0.85)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentRed,
  },
  tagText: {
    color: COLORS.paper,
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    letterSpacing: 0.5,
  },
  bottomOverlayTag: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "rgba(247, 244, 238, 0.92)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  bottomTagText: {
    color: COLORS.ink,
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});
