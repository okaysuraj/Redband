import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "./src/theme/colors";

// Components
import Header from "./src/components/Header";
import DrawerMenu from "./src/components/DrawerMenu";
import HeroSection from "./src/components/HeroSection";
import Ticker from "./src/components/Ticker";
import AtelierStory from "./src/components/AtelierStory";
import TreatmentLookbook from "./src/components/TreatmentLookbook";
import ApothecaryChapter from "./src/components/ApothecaryChapter";
import StudioSanctuaries from "./src/components/StudioSanctuaries";
import FooterSection from "./src/components/FooterSection";
import BookingModal from "./src/components/BookingModal";

export default function App() {
  const [activeLocation, setActiveLocation] = useState("noho-nyc");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState({
    treatmentId: null,
    locationId: null,
    addon: null,
  });

  const scrollViewRef = useRef(null);
  const sectionPositions = useRef({});

  const handleOpenBooking = (options = {}) => {
    setBookingPreselect({
      treatmentId: options.treatmentId || null,
      locationId: options.locationId || activeLocation,
      addon: options.addon || null,
    });
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleToggleLocation = () => {
    setActiveLocation((prev) =>
      prev === "noho-nyc" ? "mayfair-ldn" : "noho-nyc"
    );
  };

  const handleSelectTreatmentForBooking = (treatmentId) => {
    handleOpenBooking({ treatmentId, locationId: activeLocation });
  };

  const handleSelectLocationForBooking = (locationId) => {
    setActiveLocation(locationId);
    handleOpenBooking({ locationId });
  };

  const handleOpenBookingWithAddon = (addon) => {
    handleOpenBooking({ addon, locationId: activeLocation });
  };

  // Section Layout measurement
  const onSectionLayout = (sectionId, event) => {
    const layout = event.nativeEvent.layout;
    sectionPositions.current[sectionId] = layout.y;
  };

  const scrollToSection = (sectionId) => {
    const y = sectionPositions.current[sectionId];
    if (y !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: Math.max(0, y - 20), animated: true });
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="dark" backgroundColor={COLORS.paper} />

      <View style={styles.appContainer}>
        {/* Sticky Header */}
        <Header
          activeLocation={activeLocation}
          onToggleLocation={handleToggleLocation}
          onOpenBooking={() => handleOpenBooking()}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Navigation Drawer Menu */}
        <DrawerMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeLocation={activeLocation}
          onSelectLocation={(locId) => setActiveLocation(locId)}
          onNavigateSection={scrollToSection}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Scrollable Editorial Landing Page */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.mainScrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {/* Hero Section */}
          <View onLayout={(e) => onSectionLayout("top", e)}>
            <HeroSection
              onOpenBooking={() => handleOpenBooking()}
              onScrollDown={() => scrollToSection("treatments")}
            />
          </View>

          {/* Philosophy Principles Ticker */}
          <Ticker />

          {/* 01 Atelier Story & Environment */}
          <View onLayout={(e) => onSectionLayout("story", e)}>
            <AtelierStory />
          </View>

          {/* 02 Treatment Lookbook & Guarantee */}
          <View onLayout={(e) => onSectionLayout("treatments", e)}>
            <TreatmentLookbook
              onSelectTreatmentForBooking={handleSelectTreatmentForBooking}
            />
          </View>

          {/* 03 Midnight Obsidian Apothecary Chapter */}
          <View onLayout={(e) => onSectionLayout("favorites", e)}>
            <ApothecaryChapter
              onOpenBookingWithAddon={handleOpenBookingWithAddon}
            />
          </View>

          {/* 04 Studio Sanctuaries (NoHo NYC & Mayfair LDN) */}
          <View onLayout={(e) => onSectionLayout("locations", e)}>
            <StudioSanctuaries
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
              onSelectLocationForBooking={handleSelectLocationForBooking}
            />
          </View>

          {/* Dispatch Newsletter & Footer Directory */}
          <FooterSection
            onOpenBooking={() => handleOpenBooking()}
            onScrollToTop={scrollToTop}
          />
        </ScrollView>

        {/* Accessible 5-Step Guided Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          initialTreatmentId={bookingPreselect.treatmentId}
          initialLocationId={bookingPreselect.locationId}
          initialAddon={bookingPreselect.addon}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.paper,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.paper,
  },
  mainScrollView: {
    flex: 1,
    backgroundColor: COLORS.paper,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
