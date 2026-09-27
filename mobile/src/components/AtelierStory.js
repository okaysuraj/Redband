import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../theme/colors";
import { IMAGES } from "../data/bookingData";

export default function AtelierStory() {
  return (
    <View style={styles.sectionContainer} id="story">
      {/* Eyebrow */}
      <View style={styles.eyebrowWrap}>
        <Text style={styles.eyebrowAccent}>01</Text>
        <Text style={styles.eyebrowText}>The Environment & The Discipline</Text>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>
        An architecture created to silence sensory noise.
      </Text>

      {/* Body paragraphs */}
      <Text style={styles.paragraph}>
        Most salons are designed like transit hubs: rows of synchronized
        mirrors, whirring blow dryers, intrusive background playlists, and
        synthetic aerosols that overwhelm the senses. The guest is rushed
        between stations while three stylists rotate through the chair.
      </Text>

      <Text style={styles.paragraph}>
        Redband was constructed as an antidote. Our suites hold exactly one
        guest at a time. The walls are hand-troweled limestone plaster that
        absorbs ambient resonance. The basins are carved from solid travertine
        blocks, plumbed with temperature-stable, de-chlorinated mountain water.
      </Text>

      {/* Pullquote Card */}
      <View style={styles.pullquoteCard}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.quoteText}>
          Hair is living architecture worn in motion every day. When you
          diagnose in silence under natural morning light, you see bone angles
          and growth vectors that busy salons miss.
        </Text>
        <View style={styles.authorRow}>
          <Text style={styles.authorName}>Elena Vane</Text>
          <Text style={styles.authorRole}>Master Sculptor & Founder</Text>
        </View>
      </View>

      {/* Pillars Grid */}
      <View style={styles.pillarsGrid}>
        <View style={styles.pillarCard}>
          <Text style={styles.pillarNum}>A</Text>
          <Text style={styles.pillarTitle}>Diagnostic First</Text>
          <Text style={styles.pillarCopy}>
            Micro-scalp scan & dry head-shape mapping before any scissors open.
          </Text>
        </View>

        <View style={[styles.pillarCard, styles.pillarCardRight]}>
          <Text style={styles.pillarNum}>B</Text>
          <Text style={styles.pillarTitle}>Botanical Apothecary</Text>
          <Text style={styles.pillarCopy}>
            Small-batch bio-lipids, wild hinoki, and organic cold-pressed jojoba.
          </Text>
        </View>
      </View>

      {/* Visual Image Stack */}
      <View style={styles.imageStack}>
        {/* Primary Studio Interior */}
        <View style={styles.imageCard}>
          <Image
            source={IMAGES.studio}
            style={styles.primaryImg}
            resizeMode="cover"
          />
          <View style={styles.captionStrip}>
            <Text style={styles.captionNum}>Pl. 01</Text>
            <Text style={styles.captionDesc}>
              Private Suite 1 — Honed Italian travertine basin & linen screen
            </Text>
          </View>
        </View>

        {/* Secondary Craft Tools */}
        <View style={styles.imageCard}>
          <Image
            source={IMAGES.tools}
            style={styles.secondaryImg}
            resizeMode="cover"
          />
          <View style={styles.captionStrip}>
            <Text style={styles.captionNum}>Pl. 02</Text>
            <Text style={styles.captionDesc}>
              Custom cobalt shears (6.2" Japanese steel) & carved buffalo horn
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
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.paper,
  },
  eyebrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
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
    marginBottom: 16,
  },
  paragraph: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.inkSecondary,
    marginBottom: 14,
  },
  pullquoteCard: {
    backgroundColor: COLORS.paperLight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accentRed,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quoteMark: {
    fontFamily: FONTS.serif,
    fontSize: 32,
    color: COLORS.accentRed,
    lineHeight: 24,
    marginBottom: -4,
  },
  quoteText: {
    fontFamily: FONTS.serif,
    fontStyle: "italic",
    fontSize: 14.5,
    lineHeight: 22,
    color: COLORS.ink,
    marginBottom: 12,
  },
  authorRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  authorName: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.ink,
  },
  authorRole: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.inkMuted,
    marginTop: 1,
  },
  pillarsGrid: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 16,
  },
  pillarCard: {
    flex: 1,
    backgroundColor: COLORS.paperLight,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
  },
  pillarCardRight: {
    borderLeftWidth: 1,
  },
  pillarNum: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accentRed,
    marginBottom: 6,
  },
  pillarTitle: {
    fontFamily: FONTS.serif,
    fontSize: 13.5,
    fontWeight: "700",
    color: COLORS.ink,
    marginBottom: 4,
  },
  pillarCopy: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    lineHeight: 16,
    color: COLORS.inkMuted,
  },
  imageStack: {
    marginTop: 16,
    gap: 16,
  },
  imageCard: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  primaryImg: {
    width: "100%",
    height: 220,
    backgroundColor: COLORS.paperDim,
  },
  secondaryImg: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.paperDim,
  },
  captionStrip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.paperLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    gap: 8,
  },
  captionNum: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.accentRed,
    fontWeight: "700",
  },
  captionDesc: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.inkMuted,
    lineHeight: 14,
  },
});
