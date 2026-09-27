import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from "react-native";
import { COLORS, FONTS } from "../theme/colors";

export default function DrawerMenu({
  isOpen,
  onClose,
  activeLocation,
  onSelectLocation,
  onNavigateSection,
  onOpenBooking,
}) {
  const handleNav = (sectionId) => {
    onClose();
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    }
  };

  const handleBook = () => {
    onClose();
    onOpenBooking();
  };

  const callPhone = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlayBackdrop}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.drawerCard}>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.brandRow}>
                <Text style={styles.brandName}>Redband</Text>
                <View style={styles.brandDot} />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.closeBtn}
                onPress={onClose}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Large Editorial Nav Links */}
            <View style={styles.navBlock}>
              <TouchableOpacity
                style={styles.navItem}
                activeOpacity={0.7}
                onPress={() => handleNav("story")}
              >
                <Text style={styles.navIdx}>01</Text>
                <Text style={styles.navText}>Atelier & Architecture</Text>
                <Text style={styles.navArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                activeOpacity={0.7}
                onPress={() => handleNav("treatments")}
              >
                <Text style={styles.navIdx}>02</Text>
                <Text style={styles.navText}>Treatment Lookbook</Text>
                <Text style={styles.navArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                activeOpacity={0.7}
                onPress={() => handleNav("favorites")}
              >
                <Text style={styles.navIdx}>03</Text>
                <Text style={styles.navText}>Apothecary & Additions</Text>
                <Text style={styles.navArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                activeOpacity={0.7}
                onPress={() => handleNav("locations")}
              >
                <Text style={styles.navIdx}>04</Text>
                <Text style={styles.navText}>Sanctuary Locations</Text>
                <Text style={styles.navArrow}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Studio Selection */}
            <View style={styles.studioBlock}>
              <Text style={styles.blockTitle}>Select Studio Atelier</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.locPill,
                    activeLocation === "noho-nyc" && styles.locPillActive,
                  ]}
                  onPress={() => onSelectLocation("noho-nyc")}
                >
                  <View
                    style={[
                      styles.locDot,
                      activeLocation === "noho-nyc" && styles.locDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.locPillText,
                      activeLocation === "noho-nyc" && styles.locPillTextActive,
                    ]}
                  >
                    NoHo · New York
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.locPill,
                    activeLocation === "mayfair-ldn" && styles.locPillActive,
                  ]}
                  onPress={() => onSelectLocation("mayfair-ldn")}
                >
                  <View
                    style={[
                      styles.locDot,
                      activeLocation === "mayfair-ldn" && styles.locDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.locPillText,
                      activeLocation === "mayfair-ldn" && styles.locPillTextActive,
                    ]}
                  >
                    Mayfair · London
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Drawer Footer CTA */}
            <View style={styles.drawerFoot}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.primaryBookBtn}
                onPress={handleBook}
              >
                <Text style={styles.primaryBookBtnText}>
                  Reserve a Suite / Chair
                </Text>
                <Text style={styles.primaryBookBtnArrow}>→</Text>
              </TouchableOpacity>

              <View style={styles.contactRow}>
                <TouchableOpacity
                  onPress={() => callPhone("+12128449120")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.contactLink}>
                    NoHo: (212) 844-9120
                  </Text>
                </TouchableOpacity>
                <Text style={styles.contactSep}>·</Text>
                <TouchableOpacity
                  onPress={() => callPhone("+442079460882")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.contactLink}>
                    Mayfair: +44 20 7946
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    backgroundColor: "rgba(18, 17, 15, 0.65)",
    justifyContent: "flex-end",
  },
  safeContainer: {
    flex: 1,
  },
  drawerCard: {
    flex: 1,
    backgroundColor: COLORS.paper,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandName: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.ink,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentRed,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.paperLight,
  },
  closeBtnText: {
    fontSize: 14,
    color: COLORS.ink,
  },
  navBlock: {
    marginVertical: 20,
    gap: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navIdx: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.accentRed,
    marginRight: 14,
    fontWeight: "600",
  },
  navText: {
    flex: 1,
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  navArrow: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: COLORS.inkMuted,
  },
  studioBlock: {
    backgroundColor: COLORS.paperLight,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  blockTitle: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: COLORS.inkMuted,
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: "row",
    gap: 10,
  },
  locPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    backgroundColor: COLORS.paper,
    gap: 6,
  },
  locPillActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  locDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.inkMuted,
  },
  locDotActive: {
    backgroundColor: COLORS.accentRed,
  },
  locPillText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.ink,
    fontWeight: "500",
  },
  locPillTextActive: {
    color: COLORS.paper,
    fontWeight: "600",
  },
  drawerFoot: {
    gap: 14,
  },
  primaryBookBtn: {
    backgroundColor: COLORS.ink,
    paddingVertical: 15,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryBookBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  primaryBookBtnArrow: {
    color: COLORS.paper,
    fontSize: 15,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  contactLink: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.inkMuted,
    textDecorationLine: "underline",
  },
  contactSep: {
    color: COLORS.borderStrong,
  },
});
