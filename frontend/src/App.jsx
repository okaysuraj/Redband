import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ConfidenceTicker from "./components/ConfidenceTicker";
import AtelierStory from "./components/AtelierStory";
import TreatmentSelector from "./components/TreatmentSelector";
import SignatureFavorites from "./components/SignatureFavorites";
import StudioLocations from "./components/StudioLocations";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import "./App.css";

export default function App() {
  const [activeLocation, setActiveLocation] = useState("noho-nyc");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState({
    treatmentId: null,
    locationId: null,
    addon: null,
  });

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

  return (
    <div className="app-root">
      {/* Top Banner Notice */}
      <div className="top-announcement hairline-b">
        <div className="editorial-shell announcement-shell">
          <div className="announcement-content">
            <span className="announcement-badge">Note</span>
            <span className="announcement-text desktop-text">
              Fall / Winter 2026 Reservation Calendar Open · Private Acoustic Suites · Strictly One Guest Per Session
            </span>
            <span className="announcement-text mobile-text">
              Fall / Winter 2026 Suites Open
            </span>
            <button
              type="button"
              className="announcement-cta"
              onClick={() => handleOpenBooking()}
            >
              Reserve Early Slots ↗
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navbar
        activeLocation={activeLocation}
        setActiveLocation={setActiveLocation}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        <Hero onOpenBooking={() => handleOpenBooking()} />
        <ConfidenceTicker />
        <AtelierStory />
        <TreatmentSelector
          onSelectTreatmentForBooking={handleSelectTreatmentForBooking}
        />
        <SignatureFavorites
          onOpenBookingWithAddon={handleOpenBookingWithAddon}
        />
        <StudioLocations
          activeLocation={activeLocation}
          setActiveLocation={setActiveLocation}
          onSelectLocationForBooking={handleSelectLocationForBooking}
        />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Accessible 5-Step Guided Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialTreatmentId={bookingPreselect.treatmentId}
        initialLocationId={bookingPreselect.locationId}
        initialAddon={bookingPreselect.addon}
      />
    </div>
  );
}
