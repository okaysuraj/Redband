import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { COLORS, FONTS } from "../theme/colors";

export default function Header({
  activeLocation,
  onToggleLocation,
  onOpenBooking,
  onOpenDrawer,
}) {
  return (
    <View style={styles.headerContainer}>
      {/* Top Announcement Strip */}
      <View style={styles.announcementBar}>
        <View style={styles.announcementContent}>
          <View style={styles.noteBadge}>
            <Text style={styles.noteBadgeText}>Note</Text>
          </View>
          <Text style={styles.announcementText} numberOfLines={1}>
            Fall / Winter 2026 Suites Open · Private Single-Chair
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.announcementCta}
            onPress={() => onOpenBooking()}
          >
            <Text style={styles.announcementCtaText}>Reserve ↗</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Sticky Nav Bar */}
      <View style={styles.mainNav}>
        {/* Brand identity lockup */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.brandLockup}
          onPress={() => {}}
        >
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>Redband</Text>
            <View style={styles.brandDot} />
          </View>
          <Text style={styles.brandSub}>Atelier & Apothecary</Text>
        </TouchableOpacity>

        {/* Right side actions: location pill, book button, drawer menu icon */}
        <View style={styles.navActions}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.locationPill}
            onPress={onToggleLocation}
          >
            <View style={styles.locationPulse} />
            <Text style={styles.locationPillText}>
              {activeLocation === "noho-nyc" ? "NoHo · NY" : "Mayfair · LDN"}
            </Text>
            <Text style={styles.locationChevron}>▾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.reserveBtn}
            onPress={() => onOpenBooking()}
          >
            <Text style={styles.reserveBtnText}>Reserve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.menuBtn}
            onPress={onOpenDrawer}
          >
            <View style={styles.menuLineTop} />
            <View style={styles.menuLineBottom} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.paper,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 100,
  },
  announcementBar: {
    backgroundColor: COLORS.paperDim,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  announcementContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  noteBadge: {
    backgroundColor: COLORS.ink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  noteBadgeText: {
    color: COLORS.paper,
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  announcementText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.inkSecondary,
    letterSpacing: 0.1,
  },
  announcementCta: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  announcementCtaText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.accentRed,
    textDecorationLine: "underline",
  },
  mainNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandLockup: {
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandName: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  brandDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accentRed,
    marginTop: 2,
  },
  brandSub: {
    fontFamily: FONTS.sans,
    fontSize: 9.5,
    color: COLORS.inkMuted,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginTop: 1,
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 19, 17, 0.05)",
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },
  locationPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentRed,
  },
  locationPillText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.ink,
    letterSpacing: 0.3,
  },
  locationChevron: {
    fontSize: 9,
    color: COLORS.inkMuted,
  },
  reserveBtn: {
    backgroundColor: COLORS.ink,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 2,
  },
  reserveBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  menuBtn: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.paperLight,
  },
  menuLineTop: {
    width: 16,
    height: 1.5,
    backgroundColor: COLORS.ink,
  },
  menuLineBottom: {
    width: 12,
    height: 1.5,
    backgroundColor: COLORS.ink,
    alignSelf: "flex-start",
    marginLeft: 9,
  },
});
