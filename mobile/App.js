// Compose the native studio screen, section navigation, and account dialogs.
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "./src/theme/colors";
import useCatalog from "./src/hooks/useCatalog";
import { AuthPanel, AuthProvider, useAuth } from "./src/auth";
import AppErrorBoundary from "./src/components/AppErrorBoundary";
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
import BookingManager from "./src/components/BookingManager";
import { Copy, Sheet, Status, useReducedMotion } from "./src/components/ui";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}
function AppContent() {
  const auth = useAuth();
  const reducedMotion = useReducedMotion();
  const { data, loading, error, reload } = useCatalog();
  const [selectedLocationId, setActiveLocation] = useState("");
  const [selectedTreatmentId, setSelectedTreatment] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const [managerOpen, setManagerOpen] = useState(false);
  const [legal, setLegal] = useState(null);
  const list = useRef(null);
  const scrollRetry = useRef(null);
  const pendingIndex = useRef(null);
  const scrollAttempts = useRef(0);
  useEffect(() => () => clearTimeout(scrollRetry.current), []);
  useEffect(() => {
    if (!auth.user) {
      // Drop private dialogs when the account signs out.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBooking(null);
      setManagerOpen(false);
    }
  }, [auth.user]);
  const locations = data?.locations || [];
  const activeLocationId = locations.some(
    (item) => item.id === selectedLocationId,
  )
    ? selectedLocationId
    : locations[0]?.id || "";
  const openBooking = useCallback(
    (options = {}) => {
      if (!auth.user) {
        auth.openAuth();
        return;
      }
      setBooking({
        ...options,
        locationId: options.locationId || activeLocationId,
      });
    },
    [activeLocationId, auth],
  );
  const manageBooking = useCallback(() => {
    if (!auth.user) {
      auth.openAuth();
      return;
    }
    setManagerOpen(true);
  }, [auth]);
  const rows = useMemo(() => {
    if (!data) return [];
    const sections = data.sections;
    return [
      ...(sections.hero ? [{ key: "top", title: "Home" }] : []),
      ...(sections.ticker ? [{ key: "ticker", title: "Principles" }] : []),
      ...(sections.story ? [{ key: "story", title: "Our story" }] : []),
      { key: "treatments", title: "Treatments" },
      { key: "favorites", title: "Additions" },
      { key: "locations", title: "Studios" },
      { key: "footer", title: "Contact and policies" },
    ];
  }, [data]);
  const navigate = useCallback(
    (key) => {
      const index = rows.findIndex((row) => row.key === key);
      if (index < 0) return;
      clearTimeout(scrollRetry.current);
      pendingIndex.current = index;
      scrollAttempts.current = 0;
      list.current?.scrollToIndex({
        index,
        animated: !reducedMotion,
        viewPosition: 0,
      });
    },
    [rows, reducedMotion],
  );
  function onScrollFailed(info) {
    list.current?.scrollToOffset({
      offset: info.averageItemLength * info.index,
      animated: false,
    });
    clearTimeout(scrollRetry.current);
    if (scrollAttempts.current++ >= 3) return;
    scrollRetry.current = setTimeout(() => {
      if (pendingIndex.current === info.index)
        list.current?.scrollToIndex({
          index: info.index,
          animated: !reducedMotion,
        });
    }, 180);
  }
  const scrollToTop = useCallback(() => {
    clearTimeout(scrollRetry.current);
    pendingIndex.current = null;
    list.current?.scrollToOffset({ offset: 0, animated: !reducedMotion });
  }, [reducedMotion]);
  const renderRow = useCallback(
    ({ item }) => {
      if (!data) return null;
      const { sections, treatments, favorites, locations } = data;
      switch (item.key) {
        case "top":
          return (
            <HeroSection
              content={sections.hero}
              onOpenBooking={openBooking}
              onScrollDown={() => navigate("treatments")}
            />
          );
        case "ticker":
          return <Ticker content={sections.ticker} />;
        case "story":
          return <AtelierStory content={sections.story} />;
        case "treatments":
          return (
            <TreatmentLookbook
              content={sections.treatments}
              treatments={treatments}
              selectedTreatmentId={selectedTreatmentId}
              onSelectTreatment={setSelectedTreatment}
              onSelectTreatmentForBooking={(treatmentId) =>
                openBooking({ treatmentId })
              }
            />
          );
        case "favorites":
          return (
            <ApothecaryChapter
              content={sections.favorites}
              favorites={favorites}
              onOpenBookingWithAddon={(addon) => openBooking({ addon })}
            />
          );
        case "locations":
          return (
            <StudioSanctuaries
              content={sections.studios}
              locations={locations}
              activeLocation={activeLocationId}
              setActiveLocation={setActiveLocation}
              onSelectLocationForBooking={(locationId) => {
                setActiveLocation(locationId);
                openBooking({ locationId });
              }}
            />
          );
        case "footer":
          return (
            <FooterSection
              content={sections.footer}
              brand={sections.brand}
              legal={sections.legal}
              locations={locations}
              treatments={treatments}
              favorites={favorites}
              onOpenBooking={openBooking}
              onManageBooking={manageBooking}
              onScrollToTop={scrollToTop}
              onOpenLegal={setLegal}
            />
          );
        default:
          return null;
      }
    },
    [
      data,
      activeLocationId,
      selectedTreatmentId,
      openBooking,
      manageBooking,
      navigate,
      scrollToTop,
    ],
  );
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <Header
        brand={data?.sections.brand}
        activeLocation={data?.locations.find(
          (item) => item.id === activeLocationId,
        )}
        onSelectLocation={() => setDrawerOpen(true)}
        onOpenBooking={openBooking}
        onOpenDrawer={() => setDrawerOpen(true)}
        onScrollToTop={scrollToTop}
        auth={auth}
        onManageBooking={manageBooking}
      />
      {loading && !data ? (
        <Status loading />
      ) : error ? (
        <Status error={error} retry={reload} />
      ) : (
        <FlatList
          ref={list}
          data={rows}
          keyExtractor={(item) => item.key}
          renderItem={renderRow}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={5}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={reload}
              tintColor={COLORS.accentRed}
            />
          }
          onScrollToIndexFailed={onScrollFailed}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            !Object.keys(data?.sections || {}).length ? (
              <Status empty="No editorial content is currently published." />
            ) : null
          }
        />
      )}
      {drawerOpen && (
        <DrawerMenu
          onClose={() => setDrawerOpen(false)}
          locations={data?.locations}
          activeLocation={activeLocationId}
          sections={rows.filter((item) => item.key !== "ticker")}
          onSelectLocation={setActiveLocation}
          onNavigateSection={navigate}
          onOpenBooking={openBooking}
          onManageBooking={manageBooking}
        />
      )}
      {booking && (
        <BookingModal
          onClose={() => setBooking(null)}
          initialTreatmentId={booking.treatmentId}
          initialLocationId={booking.locationId}
          initialAddon={booking.addon}
          treatments={data?.treatments}
          locations={data?.locations}
          practitioners={data?.practitioners}
          favorites={data?.favorites}
        />
      )}
      {managerOpen && (
        <BookingManager
          onClose={() => setManagerOpen(false)}
          treatments={data?.treatments}
          locations={data?.locations}
          practitioners={data?.practitioners}
        />
      )}
      {legal && (
        <Sheet title={legal.title || "Policy"} onClose={() => setLegal(null)}>
          {Array.isArray(legal.body) ? (
            legal.body.map((paragraph, index) => (
              <Copy key={index}>{paragraph}</Copy>
            ))
          ) : (
            <Copy>{legal.body}</Copy>
          )}
        </Sheet>
      )}
      <AuthPanel />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.paper },
  content: { flexGrow: 1, width: "100%", maxWidth: 820, alignSelf: "center" },
});
