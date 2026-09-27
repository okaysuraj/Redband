import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS, FONTS } from "../theme/colors";
import { TREATMENTS } from "../data/bookingData";

export default function TreatmentLookbook({ onSelectTreatmentForBooking }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTreatment = TREATMENTS[selectedIndex];

  return (
    <View style={styles.sectionContainer} id="treatments">
      {/* Eyebrow & Titles */}
      <View style={styles.eyebrowWrap}>
        <Text style={styles.eyebrowAccent}>02</Text>
        <Text style={styles.eyebrowText}>The Treatment Lookbook</Text>
      </View>

      <Text style={styles.heading}>Four curated disciplines.</Text>

      <Text style={styles.leadText}>
        One calm stage. Compare duration, diagnostic steps, and biological
        formulations without layout shift.
      </Text>

      <View style={styles.noteBanner}>
        <View style={styles.noteDot} />
        <Text style={styles.noteBannerText}>
          All treatments include complimentary private suite tea ritual & scalp
          camera assessment
        </Text>
      </View>

      {/* Horizontal Tabs for Smooth Mobile Selection */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollTrack}
        >
          {TREATMENTS.map((treatment, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <TouchableOpacity
                key={treatment.id}
                activeOpacity={0.8}
                style={[
                  styles.tabCard,
                  isSelected && styles.tabCardSelected,
                ]}
                onPress={() => setSelectedIndex(idx)}
              >
                <View style={styles.tabTopRow}>
                  <Text
                    style={[
                      styles.tabIndex,
                      isSelected && styles.tabIndexSelected,
                    ]}
                  >
                    {treatment.index}
                  </Text>
                  <Text
                    style={[
                      styles.tabPrice,
                      isSelected && styles.tabPriceSelected,
                    ]}
                  >
                    {treatment.price}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.tabTitle,
                    isSelected && styles.tabTitleSelected,
                  ]}
                  numberOfLines={2}
                >
                  {treatment.title}
                </Text>

                <Text
                  style={[
                    styles.tabDuration,
                    isSelected && styles.tabDurationSelected,
                  ]}
                >
                  {treatment.duration}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Dedicated Preview Stage */}
      <View style={styles.stageCard}>
        {/* Media with Category Tag */}
        <View style={styles.stageMediaWrap}>
          <Image
            source={selectedTreatment.image}
            style={styles.stageImage}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {selectedTreatment.category}
            </Text>
          </View>
        </View>

        {/* Content Box */}
        <View style={styles.stageContent}>
          <View style={styles.stageHeaderRow}>
            <View style={styles.stageTitleCol}>
              <Text style={styles.stageTitle}>{selectedTreatment.title}</Text>
              <Text style={styles.stageSub}>{selectedTreatment.subtitle}</Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.priceVal}>{selectedTreatment.price}</Text>
              <Text style={styles.durationVal}>{selectedTreatment.duration}</Text>
            </View>
          </View>

          <Text style={styles.stageDesc}>{selectedTreatment.description}</Text>

          {/* Formulations */}
          <View style={styles.formulationsBlock}>
            <Text style={styles.blockLabel}>Compound Formulations:</Text>
            {selectedTreatment.formulations.map((formula, i) => (
              <View key={i} style={styles.formulaRow}>
                <Text style={styles.formulaDot}>▪</Text>
                <Text style={styles.formulaText}>{formula}</Text>
              </View>
            ))}
          </View>

          {/* Ritual Sequence */}
          <View style={styles.timelineBlock}>
            <Text style={styles.blockLabel}>Ritual Sequence:</Text>
            {selectedTreatment.steps.map((step, sIdx) => (
              <View key={sIdx} style={styles.stepRow}>
                <View style={styles.stepIdxBadge}>
                  <Text style={styles.stepIdxText}>{sIdx + 1}</Text>
                </View>
                <Text style={styles.stepContentText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Reserve Button for Selected Treatment */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.reserveTreatmentBtn}
            onPress={() => onSelectTreatmentForBooking(selectedTreatment.id)}
          >
            <Text style={styles.reserveTreatmentBtnText}>
              Reserve {selectedTreatment.title}
            </Text>
            <Text style={styles.reserveTreatmentArrow}>→</Text>
          </TouchableOpacity>

          <Text style={styles.cancellationText}>
            Complimentary rescheduling up to 24h prior
          </Text>
        </View>
      </View>

      {/* Private Suite Guarantee Protocol Card */}
      <View style={styles.protocolCard}>
        <View style={styles.protocolHead}>
          <Text style={styles.protocolDot}>●</Text>
          <Text style={styles.protocolTitle}>Private Suite Guarantee</Text>
        </View>

        <Text style={styles.protocolDesc}>
          Every appointment is held in absolute acoustic silence with one master
          artisan per suite. Never overlapping stations or hurried hand-offs.
        </Text>

        <View style={styles.amenityPills}>
          <View style={styles.amenityPill}>
            <Text style={styles.amenityPillText}>1 Guest Per Room</Text>
          </View>
          <View style={styles.amenityPill}>
            <Text style={styles.amenityPillText}>Bio-Lipid Formulations</Text>
          </View>
          <View style={styles.amenityPill}>
            <Text style={styles.amenityPillText}>Silent Chair Optional</Text>
          </View>
        </View>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              HD Scalp Camera & Density Diagnostics
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              Travertine Basin Warm Water Wash
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              Complimentary Herbal Tea Ritual
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
    marginBottom: 16,
  },
  noteBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    borderRadius: 2,
    gap: 8,
    marginBottom: 20,
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentRed,
    marginTop: 4,
  },
  noteBannerText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.inkMuted,
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabScrollTrack: {
    gap: 10,
  },
  tabCard: {
    width: 160,
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 3,
    padding: 12,
  },
  tabCardSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  tabTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tabIndex: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.accentRed,
    fontWeight: "700",
  },
  tabIndexSelected: {
    color: "#e8807a",
  },
  tabPrice: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.inkSecondary,
    fontWeight: "600",
  },
  tabPriceSelected: {
    color: COLORS.paper,
  },
  tabTitle: {
    fontFamily: FONTS.serif,
    fontSize: 13.5,
    fontWeight: "700",
    color: COLORS.ink,
    lineHeight: 18,
    height: 36,
    marginBottom: 6,
  },
  tabTitleSelected: {
    color: COLORS.paper,
  },
  tabDuration: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: COLORS.inkMuted,
  },
  tabDurationSelected: {
    color: "rgba(247, 244, 238, 0.7)",
  },
  stageCard: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 24,
  },
  stageMediaWrap: {
    position: "relative",
    width: "100%",
    height: 220,
    backgroundColor: COLORS.paperDim,
  },
  stageImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(20, 19, 17, 0.85)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 2,
  },
  categoryBadgeText: {
    color: COLORS.paper,
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  stageContent: {
    padding: 16,
  },
  stageHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  stageTitleCol: {
    flex: 1,
  },
  stageTitle: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  stageSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  pricePill: {
    alignItems: "flex-end",
    backgroundColor: COLORS.paperDim,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 2,
  },
  priceVal: {
    fontFamily: FONTS.serif,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.accentRed,
  },
  durationVal: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    color: COLORS.inkMuted,
  },
  stageDesc: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.inkSecondary,
    marginBottom: 16,
  },
  formulationsBlock: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 2,
    marginBottom: 16,
  },
  blockLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    fontWeight: "700",
    color: COLORS.ink,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  formulaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  formulaDot: {
    color: COLORS.accentRed,
    fontSize: 9,
  },
  formulaText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.inkSecondary,
  },
  timelineBlock: {
    marginBottom: 18,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  stepIdxBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.paperDim,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepIdxText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.ink,
  },
  stepContentText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.inkSecondary,
  },
  reserveTreatmentBtn: {
    backgroundColor: COLORS.ink,
    paddingVertical: 14,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  reserveTreatmentBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  reserveTreatmentArrow: {
    color: COLORS.paper,
    fontSize: 15,
  },
  cancellationText: {
    textAlign: "center",
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  protocolCard: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 16,
    borderRadius: 2,
  },
  protocolHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  protocolDot: {
    fontSize: 10,
    color: COLORS.accentRed,
  },
  protocolTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14.5,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  protocolDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.inkSecondary,
    marginBottom: 12,
  },
  amenityPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  amenityPill: {
    backgroundColor: COLORS.paperDim,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  amenityPillText: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    color: COLORS.inkSecondary,
  },
  featuresList: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureIcon: {
    fontSize: 11,
    color: COLORS.accentRed,
    fontWeight: "700",
  },
  featureText: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: COLORS.inkSecondary,
  },
});
