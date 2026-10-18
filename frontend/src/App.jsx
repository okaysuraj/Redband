// Compose the published studio page and open account-scoped reservation dialogs.
import React, { useCallback, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ConfidenceTicker from "./components/ConfidenceTicker";
import AtelierStory from "./components/AtelierStory";
import TreatmentSelector from "./components/TreatmentSelector";
import SignatureFavorites from "./components/SignatureFavorites";
import StudioLocations from "./components/StudioLocations";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import BookingManager from "./components/BookingManager";
import { AuthProvider, AuthPanel } from "./auth/index.jsx";
import { useAuth } from "./auth/context.js";
import useCatalog from "./hooks/useCatalog";
import useInputModality from "./hooks/useInputModality";
import "./App.css";

function AppContent() {
  const auth = useAuth();
  const [selectedLocation, setActiveLocation] = useState("");
  const [booking, setBooking] = useState(null);
  const [managingBooking, setManagingBooking] = useState(false);
  const { catalog, status, error, retry } = useCatalog();
  useInputModality();
  const { treatments, locations, favorites, practitioners, sections } = catalog;
  const activeLocation = locations.some((item) => item.id === selectedLocation)
    ? selectedLocation
    : locations[0]?.id || "";
  const bookingAvailable =
    status === "ready" &&
    Boolean(treatments.length && locations.length && practitioners.length);
  const openBooking = (options = {}) => {
    if (!auth.user) {
      auth.openAuth();
      return;
    }
    if (bookingAvailable)
      setBooking({
        treatmentId: options.treatmentId || null,
        locationId: options.locationId || activeLocation,
        addon: options.addon || "",
      });
  };
  const openManager = () => {
    if (!auth.user) {
      auth.openAuth();
      return;
    }
    setManagingBooking(true);
  };
  const closeBooking = useCallback(() => setBooking(null), []);
  const closeManager = useCallback(() => setManagingBooking(false), []);
  return (
    <div className="app-root" id="top">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar
        locations={locations}
        brand={sections.brand}
        activeLocation={activeLocation}
        setActiveLocation={setActiveLocation}
        onOpenBooking={() => openBooking()}
        bookingAvailable={bookingAvailable && !auth.loading}
        onManageBooking={openManager}
        auth={auth}
        hasStory={Boolean(sections.story)}
      />
      <main id="main-content" tabIndex={-1}>
        {status === "loading" && (
          <div className="catalog-state" role="status">
            <span className="checking-spinner" aria-hidden="true" /> Loading
            studio information...
          </div>
        )}
        {status === "error" && (
          <div className="catalog-state" role="alert">
            <h1>Studio information is unavailable</h1>
            <p>{error}</p>
            <button className="btn-ink" onClick={retry}>
              Try again
            </button>
          </div>
        )}
        {status === "ready" && (
          <>
            {!sections.hero?.title && (
              <h1 className="catalog-heading">Redband reservations</h1>
            )}
            <Hero
              content={sections.hero}
              onOpenBooking={() => openBooking()}
              bookingAvailable={bookingAvailable}
            />
            <ConfidenceTicker content={sections.ticker} />
            <AtelierStory content={sections.story} />
            <TreatmentSelector
              content={sections.treatments}
              treatments={treatments}
              onSelectTreatmentForBooking={(treatmentId) =>
                openBooking({ treatmentId })
              }
              bookingAvailable={bookingAvailable}
            />
            <SignatureFavorites
              content={sections.favorites}
              favorites={favorites}
              onOpenBookingWithAddon={(addon) => openBooking({ addon })}
              bookingAvailable={bookingAvailable}
            />
            <StudioLocations
              content={sections.studios}
              locations={locations}
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
              onSelectLocationForBooking={(locationId) =>
                openBooking({ locationId })
              }
              bookingAvailable={bookingAvailable}
            />
            {!treatments.length && !locations.length && (
              <div className="catalog-state" role="status">
                <h2>Reservations are not available yet</h2>
                <p>
                  Studio services and locations have not been published. Please
                  check back later.
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer
        brand={sections.brand}
        content={sections.footer}
        legal={sections.legal}
        treatments={treatments}
        locations={locations}
        favorites={favorites}
        onOpenBooking={() => openBooking()}
        bookingAvailable={bookingAvailable}
        onManageBooking={openManager}
      />
      {booking && auth.user && (
        <BookingModal
          key={auth.user.uid}
          onClose={closeBooking}
          initialTreatmentId={booking.treatmentId}
          initialLocationId={booking.locationId}
          initialAddon={booking.addon}
          treatments={treatments}
          locations={locations}
          practitioners={practitioners}
          favorites={favorites}
        />
      )}
      {managingBooking && auth.user && (
        <BookingManager
          key={auth.user.uid}
          onClose={closeManager}
          treatments={treatments}
          locations={locations}
          practitioners={practitioners}
        />
      )}
      <AuthPanel />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
