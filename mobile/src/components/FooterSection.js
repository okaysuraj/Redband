import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { COLORS, FONTS } from "../theme/colors";

export default function FooterSection({ onOpenBooking, onScrollToTop }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim().length > 0) {
      setSubscribed(true);
    }
  };

  const callPhone = (phone) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9+]/g, "")}`);
  };

  return (
    <View style={styles.footerContainer}>
      {/* Dispatch Section */}
      <View style={styles.dispatchBlock}>
        <View style={styles.eyebrowWrap}>
          <Text style={styles.eyebrowDot}>●</Text>
          <Text style={styles.eyebrowText}>The Atelier Dispatch</Text>
        </View>

        <Text style={styles.dispatchTitle}>
          Monthly treatises on hair biology, scalp micro-climates, and unhurried design.
        </Text>

        {subscribed ? (
          <View style={styles.subscribedBox}>
            <Text style={styles.subscribedCheck}>✓</Text>
            <Text style={styles.subscribedText}>
              Thank you. Your address is entered into our quarterly journal list.
            </Text>
          </View>
        ) : (
          <View style={styles.formRow}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.inkMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.dispatchBtn}
              onPress={handleSubscribe}
            >
              <Text style={styles.dispatchBtnText}>Join Dispatch →</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.dispatchFineprint}>
          We send no promotional spam or seasonal sales. Strictly editorial studies and release notices.
        </Text>
      </View>

      {/* Brand & Directory Stack */}
      <View style={styles.directoryBlock}>
        {/* Brand Col */}
        <View style={styles.brandCol}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>Redband</Text>
            <View style={styles.brandDot} />
          </View>
          <Text style={styles.brandSub}>Atelier & Apothecary</Text>

          <Text style={styles.ethosText}>
            A private restorative hair clinic and bespoke cutting room. We diagnose head shape, 
            follicle density, and texture before touching shears—infusing cold-pressed botanical 
            elixirs in single-chair acoustic silence.
          </Text>

          <View style={styles.badgesRow}>
            <View style={styles.badgeItem}>
              <Text style={styles.badgeItemText}>Bespoke Protocol No. 188</Text>
            </View>
            <View style={styles.badgeItem}>
              <Text style={styles.badgeItemText}>Cruelty Free & Bio-Lipid</Text>
            </View>
          </View>
        </View>

        {/* Sanctuaries Col */}
        <View style={styles.dirSection}>
          <Text style={styles.dirHeader}>Sanctuaries</Text>
          <View style={styles.sanctuaryBox}>
            <Text style={styles.sanctuaryName}>NoHo Atelier</Text>
            <Text style={styles.sanctuaryAddr}>
              312 Great Jones Street, Suite 3B{"\n"}New York, NY 10012
            </Text>
            <TouchableOpacity
              onPress={() => callPhone("+12125550198")}
              activeOpacity={0.7}
            >
              <Text style={styles.sanctuaryPhone}>+1 (212) 555-0198</Text>
            </TouchableOpacity>
            <Text style={styles.sanctuaryHours}>Wed – Sun: 09:00 – 19:00</Text>
          </View>

          <View style={[styles.sanctuaryBox, styles.sanctuarySecond]}>
            <Text style={styles.sanctuaryName}>Mayfair Atelier</Text>
            <Text style={styles.sanctuaryAddr}>
              14 South Audley St, Floor 2{"\n"}London W1K 1HN
            </Text>
            <TouchableOpacity
              onPress={() => callPhone("+442079460912")}
              activeOpacity={0.7}
            >
              <Text style={styles.sanctuaryPhone}>+44 (0) 20 7946 0912</Text>
            </TouchableOpacity>
            <Text style={styles.sanctuaryHours}>Tue – Sat: 10:00 – 19:30</Text>
          </View>
        </View>

        {/* Disciplines Col */}
        <View style={styles.dirSection}>
          <Text style={styles.dirHeader}>Disciplines</Text>
          <View style={styles.linksList}>
            <Text style={styles.linkItem}>• The Architectural Cut (55 min)</Text>
            <Text style={styles.linkItem}>• Botanical Scalp & Follicle Ritual (70 min)</Text>
            <Text style={styles.linkItem}>• Texture Mastery & Movement (85 min)</Text>
            <Text style={styles.linkItem}>• The Atelier Restoration Suite (115 min)</Text>
            <Text style={styles.linkItem}>• Occipital Tension Release (Add-on)</Text>
            <Text style={styles.linkItem}>• The Silent Chair Session (Option)</Text>
          </View>
        </View>

        {/* Protocols & Reservation CTA */}
        <View style={styles.dirSection}>
          <Text style={styles.dirHeader}>Protocol & Reserving</Text>
          <View style={styles.protocolBox}>
            <Text style={styles.protocolName}>Acoustic Silence</Text>
            <Text style={styles.protocolDesc}>
              Every suite is individual. You may request silent service with zero polite small talk at no cost.
            </Text>

            <View style={styles.protocolSep} />

            <Text style={styles.protocolName}>Rescheduling</Text>
            <Text style={styles.protocolDesc}>
              Full complimentary modification up to 24 hours prior to your scheduled consultation.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.footerReserveBtn}
              onPress={() => onOpenBooking()}
            >
              <Text style={styles.footerReserveBtnText}>Reserve a Suite</Text>
              <Text style={styles.footerReserveBtnArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sub-footer Copyright */}
      <View style={styles.legalBar}>
        <Text style={styles.legalCopy}>
          © {new Date().getFullYear()} Redband Atelier LLC. All rights reserved.{"\n"}
          Designed under Editorial Service Booking Standards
        </Text>

        <View style={styles.legalLinksRow}>
          <Text style={styles.legalLink}>Privacy</Text>
          <Text style={styles.legalSep}>·</Text>
          <Text style={styles.legalLink}>Accessibility</Text>
          <Text style={styles.legalSep}>·</Text>
          <Text style={styles.legalLink}>Terms</Text>
          {onScrollToTop && (
            <>
              <Text style={styles.legalSep}>·</Text>
              <TouchableOpacity onPress={onScrollToTop} activeOpacity={0.7}>
                <Text style={styles.topLink}>Top ↑</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: COLORS.paperDim,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  dispatchBlock: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 3,
    padding: 18,
    marginBottom: 28,
  },
  eyebrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  eyebrowDot: {
    fontSize: 10,
    color: COLORS.accentRed,
  },
  eyebrowText: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: COLORS.inkMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  dispatchTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.2,
    marginBottom: 16,
  },
  formRow: {
    gap: 10,
    marginBottom: 10,
  },
  emailInput: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.ink,
  },
  dispatchBtn: {
    backgroundColor: COLORS.ink,
    paddingVertical: 12,
    borderRadius: 2,
    alignItems: "center",
  },
  dispatchBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  subscribedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.paper,
    padding: 12,
    borderRadius: 2,
    gap: 8,
    marginBottom: 10,
  },
  subscribedCheck: {
    fontSize: 14,
    color: COLORS.statusGreen,
    fontWeight: "700",
  },
  subscribedText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.inkSecondary,
  },
  dispatchFineprint: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.inkMuted,
  },
  directoryBlock: {
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderStrong,
    paddingBottom: 28,
    marginBottom: 20,
  },
  brandCol: {
    gap: 6,
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
  brandSub: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: COLORS.inkMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  ethosText: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: COLORS.inkSecondary,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badgeItem: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  badgeItemText: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    color: COLORS.inkMuted,
  },
  dirSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 18,
  },
  dirHeader: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.ink,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sanctuaryBox: {
    backgroundColor: COLORS.paperLight,
    padding: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  sanctuarySecond: {
    marginTop: 10,
  },
  sanctuaryName: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.ink,
  },
  sanctuaryAddr: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: COLORS.inkMuted,
    lineHeight: 16,
  },
  sanctuaryPhone: {
    fontFamily: FONTS.mono,
    fontSize: 11.5,
    color: COLORS.accentRed,
    textDecorationLine: "underline",
    marginTop: 2,
  },
  sanctuaryHours: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: COLORS.inkMuted,
  },
  linksList: {
    gap: 8,
  },
  linkItem: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    color: COLORS.inkSecondary,
  },
  protocolBox: {
    backgroundColor: COLORS.paperLight,
    padding: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  protocolName: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.ink,
  },
  protocolDesc: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    lineHeight: 16,
    color: COLORS.inkMuted,
  },
  protocolSep: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  footerReserveBtn: {
    backgroundColor: COLORS.ink,
    paddingVertical: 12,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  footerReserveBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  footerReserveBtnArrow: {
    color: COLORS.paper,
    fontSize: 14,
  },
  legalBar: {
    gap: 12,
  },
  legalCopy: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.inkMuted,
  },
  legalLinksRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  legalLink: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.inkMuted,
    textDecorationLine: "underline",
  },
  legalSep: {
    color: COLORS.inkMuted,
    fontSize: 10,
  },
  topLink: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.accentRed,
    fontWeight: "700",
  },
});
