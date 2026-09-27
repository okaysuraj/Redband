import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS, FONTS } from "../theme/colors";
import {
  TREATMENTS,
  LOCATIONS,
  PRACTITIONERS,
  AVAILABLE_DATES,
  TIME_SLOTS,
} from "../data/bookingData";

export default function BookingModal({
  isOpen,
  onClose,
  initialTreatmentId,
  initialLocationId,
  initialAddon,
}) {
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(
    initialTreatmentId || TREATMENTS[0].id
  );
  const [selectedLocationId, setSelectedLocationId] = useState(
    initialLocationId || LOCATIONS[0].id
  );
  const [selectedPractitionerId, setSelectedPractitionerId] = useState("any");
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0].date);
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [isSilentChair, setIsSilentChair] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(initialAddon || "");

  // Guest registry details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNotes, setGuestNotes] = useState("");

  // States
  const [isCheckingSlot, setIsCheckingSlot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // Sync initial props
  useEffect(() => {
    if (initialTreatmentId) setSelectedServiceId(initialTreatmentId);
    if (initialLocationId) setSelectedLocationId(initialLocationId);
    if (initialAddon) setSelectedAddon(initialAddon);
    if (!isOpen) {
      setStep(1);
      setConfirmationData(null);
    }
  }, [initialTreatmentId, initialLocationId, initialAddon, isOpen]);

  const currentService =
    TREATMENTS.find((t) => t.id === selectedServiceId) || TREATMENTS[0];
  const currentLocation =
    LOCATIONS.find((l) => l.id === selectedLocationId) || LOCATIONS[0];
  const currentPractitioner =
    selectedPractitionerId === "any"
      ? { name: "First Available Master Sculptor", title: "Atelier Assignment" }
      : PRACTITIONERS.find((p) => p.id === selectedPractitionerId);

  const goToNextStep = () => {
    if (step === 3) {
      setIsCheckingSlot(true);
      setTimeout(() => {
        setIsCheckingSlot(false);
        setStep(4);
      }, 300);
    } else {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const goToPrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmReservation = () => {
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      Alert.alert(
        "Incomplete Details",
        "Please fill in your name, email, and mobile telephone."
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingRef = `RBD-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationData({
        ref: bookingRef,
        service: currentService.title,
        price: currentService.price,
        duration: currentService.duration,
        location: `${currentLocation.city} Atelier (${currentLocation.neighborhood})`,
        address: currentLocation.address,
        practitioner: currentPractitioner.name,
        date:
          AVAILABLE_DATES.find((d) => d.date === selectedDate)?.dayName ||
          selectedDate,
        time: selectedTime,
        guestName,
        guestEmail,
        isSilentChair,
        addon: selectedAddon,
      });
    }, 750);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalCard}>
            {/* Modal Top Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleCol}>
                <View style={styles.eyebrowWrap}>
                  <Text style={styles.eyebrowDot}>●</Text>
                  <Text style={styles.eyebrowText}>Reservation Ledger</Text>
                </View>
                <Text style={styles.modalHeading}>
                  {confirmationData ? "Reservation Confirmed" : "Reserve Private Chair"}
                </Text>
              </View>

              <View style={styles.controlsRow}>
                {!confirmationData && (
                  <View style={styles.stepIndicator}>
                    <Text style={styles.stepCurrent}>Step 0{step}</Text>
                    <Text style={styles.stepSep}>/</Text>
                    <Text style={styles.stepTotal}>05</Text>
                  </View>
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.closeBtn}
                  onPress={onClose}
                >
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Persistent Journey Summary Breadcrumb */}
            {!confirmationData && (
              <View style={styles.summaryBreadcrumb}>
                <Text style={styles.breadLabel}>Service: </Text>
                <Text style={styles.breadVal} numberOfLines={1}>
                  {currentService.title} ({currentService.price})
                </Text>
                <Text style={styles.breadSep}>/</Text>
                <Text style={styles.breadLabel}>Atelier: </Text>
                <Text style={styles.breadVal}>{currentLocation.city}</Text>
              </View>
            )}

            {/* Scrollable Body Content */}
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollBodyContent}
              showsVerticalScrollIndicator={true}
            >
              {confirmationData ? (
                /* CONFIRMATION TICKET VIEW */
                <View style={styles.confirmationWrap}>
                  <View style={styles.confBadge}>
                    <Text style={styles.confBadgeCheck}>✓</Text>
                    <Text style={styles.confBadgeText}>Confirmed & Reserved</Text>
                  </View>

                  <Text style={styles.confTitle}>We await your arrival.</Text>
                  <Text style={styles.confDesc}>
                    Your private suite has been secured. A formal calendar invite and
                    preparation guide have been dispatched to{" "}
                    <Text style={styles.boldText}>{confirmationData.guestEmail}</Text>.
                  </Text>

                  {/* Summary Ticket Card */}
                  <View style={styles.ticketCard}>
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Booking Reference</Text>
                      <Text style={styles.ticketRef}>{confirmationData.ref}</Text>
                    </View>
                    <View style={styles.ticketDivider} />

                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Service</Text>
                      <Text style={styles.ticketValue}>
                        {confirmationData.service} ({confirmationData.duration})
                      </Text>
                    </View>
                    <View style={styles.ticketDivider} />

                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Date & Time</Text>
                      <Text style={styles.ticketValue}>
                        {confirmationData.date} at {confirmationData.time}
                      </Text>
                    </View>
                    <View style={styles.ticketDivider} />

                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Master Practitioner</Text>
                      <Text style={styles.ticketValue}>
                        {confirmationData.practitioner}
                      </Text>
                    </View>
                    <View style={styles.ticketDivider} />

                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Location</Text>
                      <Text style={styles.ticketValue}>
                        {confirmationData.location}
                      </Text>
                    </View>
                    <View style={styles.ticketDivider} />

                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Session Atmosphere</Text>
                      <Text style={styles.ticketValue}>
                        {confirmationData.isSilentChair
                          ? "Silent Chair Requested"
                          : "Standard Acoustic Calm"}
                        {confirmationData.addon ? ` + ${confirmationData.addon}` : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.confActions}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.returnBtn}
                      onPress={onClose}
                    >
                      <Text style={styles.returnBtnText}>Return to Lookbook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.calBtn}
                      onPress={() =>
                        Alert.alert("Calendar", "Invitation saved to calendar.")
                      }
                    >
                      <Text style={styles.calBtnText}>Add to Calendar (.ics)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* STEP VIEWS */
                <View style={styles.stepContainer}>
                  {/* STEP 1: SERVICE */}
                  {step === 1 && (
                    <View style={styles.stepView}>
                      <Text style={styles.stepEyebrow}>01 / Discipline</Text>
                      <Text style={styles.stepTitle}>Select Treatment</Text>
                      <Text style={styles.stepDesc}>
                        Choose your dedicated primary service for this visit.
                      </Text>

                      <View style={styles.optionsList}>
                        {TREATMENTS.map((treatment) => {
                          const isChecked = selectedServiceId === treatment.id;
                          return (
                            <TouchableOpacity
                              key={treatment.id}
                              activeOpacity={0.8}
                              style={[
                                styles.optionCard,
                                isChecked && styles.optionCardActive,
                              ]}
                              onPress={() => setSelectedServiceId(treatment.id)}
                            >
                              <View style={styles.radioOuter}>
                                {isChecked && <View style={styles.radioInner} />}
                              </View>
                              <View style={styles.optionContent}>
                                <View style={styles.optionHead}>
                                  <Text style={styles.optionTitle}>
                                    {treatment.title}
                                  </Text>
                                  <Text style={styles.optionPrice}>
                                    {treatment.price}
                                  </Text>
                                </View>
                                <Text style={styles.optionSub}>
                                  {treatment.subtitle}
                                </Text>
                                <Text style={styles.optionMeta}>
                                  {treatment.duration}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* STEP 2: LOCATION */}
                  {step === 2 && (
                    <View style={styles.stepView}>
                      <Text style={styles.stepEyebrow}>02 / Studio Location</Text>
                      <Text style={styles.stepTitle}>Select Sanctuary</Text>
                      <Text style={styles.stepDesc}>
                        Choose between our New York or London private suites.
                      </Text>

                      <View style={styles.optionsList}>
                        {LOCATIONS.map((loc) => {
                          const isChecked = selectedLocationId === loc.id;
                          return (
                            <TouchableOpacity
                              key={loc.id}
                              activeOpacity={0.8}
                              style={[
                                styles.optionCard,
                                isChecked && styles.optionCardActive,
                              ]}
                              onPress={() => setSelectedLocationId(loc.id)}
                            >
                              <View style={styles.radioOuter}>
                                {isChecked && <View style={styles.radioInner} />}
                              </View>
                              <View style={styles.optionContent}>
                                <View style={styles.optionHead}>
                                  <Text style={styles.optionTitle}>
                                    {loc.city} Atelier
                                  </Text>
                                  <View style={styles.statusBadge}>
                                    <Text style={styles.statusBadgeText}>
                                      {loc.status}
                                    </Text>
                                  </View>
                                </View>
                                <Text style={styles.optionSub}>{loc.address}</Text>
                                <Text style={styles.optionMeta}>{loc.hours}</Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* STEP 3: PRACTITIONER */}
                  {step === 3 && (
                    <View style={styles.stepView}>
                      <Text style={styles.stepEyebrow}>03 / The Hand</Text>
                      <Text style={styles.stepTitle}>Choose Practitioner</Text>
                      <Text style={styles.stepDesc}>
                        Select a resident Master Sculptor or allow the atelier to
                        match your hair profile.
                      </Text>

                      <View style={styles.optionsList}>
                        {/* Any option */}
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={[
                            styles.optionCard,
                            selectedPractitionerId === "any" &&
                              styles.optionCardActive,
                          ]}
                          onPress={() => setSelectedPractitionerId("any")}
                        >
                          <View style={styles.radioOuter}>
                            {selectedPractitionerId === "any" && (
                              <View style={styles.radioInner} />
                            )}
                          </View>
                          <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>
                              First Available Master Sculptor
                            </Text>
                            <Text style={styles.optionSub}>
                              Matched automatically to your service profile upon
                              diagnostic arrival
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* Practitioners */}
                        {PRACTITIONERS.map((p) => {
                          const isChecked = selectedPractitionerId === p.id;
                          return (
                            <TouchableOpacity
                              key={p.id}
                              activeOpacity={0.8}
                              style={[
                                styles.optionCard,
                                isChecked && styles.optionCardActive,
                              ]}
                              onPress={() => setSelectedPractitionerId(p.id)}
                            >
                              <View style={styles.radioOuter}>
                                {isChecked && <View style={styles.radioInner} />}
                              </View>
                              <View style={styles.optionContent}>
                                <View style={styles.optionHead}>
                                  <Text style={styles.optionTitle}>{p.name}</Text>
                                  <View style={styles.avatarBadge}>
                                    <Text style={styles.avatarText}>{p.avatar}</Text>
                                  </View>
                                </View>
                                <Text style={styles.optionSub}>
                                  {p.title} · {p.experience}
                                </Text>
                                <Text style={styles.optionMeta}>
                                  Specialty: {p.specialty}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* STEP 4: DATE & TIME */}
                  {step === 4 && (
                    <View style={styles.stepView}>
                      <Text style={styles.stepEyebrow}>04 / Day & Hour</Text>
                      <Text style={styles.stepTitle}>Select Date & Time</Text>
                      <Text style={styles.stepDesc}>
                        Private suite reservations are spaced with 25-minute buffer
                        intervals.
                      </Text>

                      {isCheckingSlot ? (
                        <View style={styles.checkingContainer}>
                          <ActivityIndicator size="small" color={COLORS.accentRed} />
                          <Text style={styles.checkingText}>
                            Verifying live studio chair availability...
                          </Text>
                        </View>
                      ) : (
                        <>
                          {/* Date Selector Pills */}
                          <Text style={styles.subBlockTitle}>Select Date</Text>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.datesRow}
                          >
                            {AVAILABLE_DATES.map((d) => {
                              const isDateSelected = selectedDate === d.date;
                              return (
                                <TouchableOpacity
                                  key={d.date}
                                  activeOpacity={0.8}
                                  style={[
                                    styles.datePill,
                                    isDateSelected && styles.datePillActive,
                                  ]}
                                  onPress={() => setSelectedDate(d.date)}
                                >
                                  <Text
                                    style={[
                                      styles.datePillLabel,
                                      isDateSelected && styles.datePillTextActive,
                                    ]}
                                  >
                                    {d.label}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.datePillName,
                                      isDateSelected && styles.datePillTextActive,
                                    ]}
                                  >
                                    {d.dayName}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>

                          {/* Time Slots Grid */}
                          <Text style={styles.subBlockTitle}>Available Suite Slots</Text>
                          <View style={styles.timeGrid}>
                            {TIME_SLOTS.map((slot) => {
                              const isTimeSelected = selectedTime === slot.time;
                              return (
                                <TouchableOpacity
                                  key={slot.time}
                                  disabled={!slot.available}
                                  activeOpacity={0.8}
                                  style={[
                                    styles.timeSlotBtn,
                                    isTimeSelected && styles.timeSlotBtnActive,
                                    !slot.available && styles.timeSlotBtnDisabled,
                                  ]}
                                  onPress={() => setSelectedTime(slot.time)}
                                >
                                  <Text
                                    style={[
                                      styles.slotClock,
                                      isTimeSelected && styles.slotClockActive,
                                      !slot.available && styles.slotDisabledText,
                                    ]}
                                  >
                                    {slot.time}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.slotPeriod,
                                      isTimeSelected && styles.slotPeriodActive,
                                      !slot.available && styles.slotDisabledText,
                                    ]}
                                  >
                                    {slot.available ? slot.period : slot.reason}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>

                          {/* Silent Session Addon */}
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.silentOptionRow}
                            onPress={() => setIsSilentChair(!isSilentChair)}
                          >
                            <View
                              style={[
                                styles.checkboxOuter,
                                isSilentChair && styles.checkboxOuterActive,
                              ]}
                            >
                              {isSilentChair && (
                                <Text style={styles.checkboxCheck}>✓</Text>
                              )}
                            </View>
                            <View style={styles.silentOptionText}>
                              <Text style={styles.silentOptionTitle}>
                                Request "The Silent Chair Session"
                              </Text>
                              <Text style={styles.silentOptionDesc}>
                                Acoustic quiet after initial diagnostic check. No
                                small talk.
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  )}

                  {/* STEP 5: GUEST REGISTRY */}
                  {step === 5 && (
                    <View style={styles.stepView}>
                      <Text style={styles.stepEyebrow}>05 / Guest Registry</Text>
                      <Text style={styles.stepTitle}>Your Details</Text>
                      <Text style={styles.stepDesc}>
                        Confirmation dispatched privately to your email and SMS.
                      </Text>

                      <View style={styles.formContainer}>
                        <View style={styles.fieldItem}>
                          <Text style={styles.fieldLabel}>Full Name *</Text>
                          <TextInput
                            style={styles.fieldInput}
                            placeholder="e.g. Julian Hayes"
                            placeholderTextColor={COLORS.inkMuted}
                            value={guestName}
                            onChangeText={setGuestName}
                          />
                        </View>

                        <View style={styles.fieldItem}>
                          <Text style={styles.fieldLabel}>Email Address *</Text>
                          <TextInput
                            style={styles.fieldInput}
                            placeholder="julian@domain.com"
                            placeholderTextColor={COLORS.inkMuted}
                            value={guestEmail}
                            onChangeText={setGuestEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        </View>

                        <View style={styles.fieldItem}>
                          <Text style={styles.fieldLabel}>Mobile Telephone *</Text>
                          <TextInput
                            style={styles.fieldInput}
                            placeholder="+1 (555) 019-2834"
                            placeholderTextColor={COLORS.inkMuted}
                            value={guestPhone}
                            onChangeText={setGuestPhone}
                            keyboardType="phone-pad"
                          />
                        </View>

                        <View style={styles.fieldItem}>
                          <Text style={styles.fieldLabel}>
                            Scalp or Texture Notes (Optional)
                          </Text>
                          <TextInput
                            style={styles.fieldInput}
                            placeholder="e.g. Dry winter scalp, sensitive skin"
                            placeholderTextColor={COLORS.inkMuted}
                            value={guestNotes}
                            onChangeText={setGuestNotes}
                          />
                        </View>

                        {/* Review Summary Box */}
                        <View style={styles.reviewBox}>
                          <View style={styles.reviewRow}>
                            <Text style={styles.reviewKey}>Service:</Text>
                            <Text style={styles.reviewVal}>
                              {currentService.title} ({currentService.duration})
                            </Text>
                          </View>
                          <View style={styles.reviewRow}>
                            <Text style={styles.reviewKey}>Studio & Master:</Text>
                            <Text style={styles.reviewVal}>
                              {currentLocation.city} · {currentPractitioner.name}
                            </Text>
                          </View>
                          <View style={styles.reviewRow}>
                            <Text style={styles.reviewKey}>Date & Time:</Text>
                            <Text style={styles.reviewVal}>
                              {
                                AVAILABLE_DATES.find((d) => d.date === selectedDate)
                                  ?.dayName
                              }{" "}
                              at {selectedTime}
                            </Text>
                          </View>
                          <View style={[styles.reviewRow, styles.totalRow]}>
                            <Text style={styles.totalKey}>Total Due on Arrival:</Text>
                            <Text style={styles.totalPrice}>
                              {currentService.price}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.depositNotice}>
                          Deposit policy: No charge is processed today. Redband
                          requests 24 hours notice for cancellations.
                        </Text>

                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.submitBtn}
                          onPress={handleConfirmReservation}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <ActivityIndicator size="small" color={COLORS.paper} />
                          ) : (
                            <>
                              <Text style={styles.submitBtnText}>
                                Complete Reservation
                              </Text>
                              <Text style={styles.submitBtnArrow}>→</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Bottom Step Nav */}
            {!confirmationData && (
              <View style={styles.modalFootBar}>
                {step > 1 ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.prevBtn}
                    onPress={goToPrevStep}
                  >
                    <Text style={styles.prevBtnText}>← Back</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 80 }} />
                )}

                {step < 5 && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.nextBtn}
                    onPress={goToNextStep}
                  >
                    <Text style={styles.nextBtnText}>Continue →</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(18, 17, 15, 0.7)",
    justifyContent: "flex-end",
  },
  safeArea: {
    flex: 1,
  },
  modalCard: {
    flex: 1,
    backgroundColor: COLORS.paper,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.paperLight,
  },
  modalTitleCol: {
    flex: 1,
  },
  eyebrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  eyebrowDot: {
    fontSize: 9,
    color: COLORS.accentRed,
  },
  eyebrowText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.inkMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  modalHeading: {
    fontFamily: FONTS.serif,
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: COLORS.paperDim,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 2,
  },
  stepCurrent: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.accentRed,
  },
  stepSep: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.inkMuted,
  },
  stepTotal: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.inkMuted,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.paper,
  },
  closeBtnText: {
    fontSize: 13,
    color: COLORS.ink,
  },
  summaryBreadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.paperDim,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breadLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.inkMuted,
  },
  breadVal: {
    fontFamily: FONTS.sans,
    fontSize: 10.5,
    fontWeight: "600",
    color: COLORS.ink,
    marginRight: 6,
  },
  breadSep: {
    color: COLORS.inkMuted,
    marginRight: 6,
    fontSize: 10,
  },
  scrollBody: {
    flex: 1,
  },
  scrollBodyContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  stepView: {
    gap: 8,
  },
  stepEyebrow: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: COLORS.accentRed,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  stepTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  stepDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    color: COLORS.inkMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 3,
    padding: 14,
    gap: 12,
  },
  optionCardActive: {
    borderColor: COLORS.ink,
    borderWidth: 1.5,
    backgroundColor: "#faf8f3",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.inkMuted,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accentRed,
  },
  optionContent: {
    flex: 1,
    gap: 3,
  },
  optionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14.5,
    fontWeight: "700",
    color: COLORS.ink,
  },
  optionPrice: {
    fontFamily: FONTS.serif,
    fontSize: 14.5,
    fontWeight: "700",
    color: COLORS.accentRed,
  },
  optionSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.inkSecondary,
    lineHeight: 16,
  },
  optionMeta: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: COLORS.statusGreenBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  statusBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.statusGreen,
    fontWeight: "600",
  },
  avatarBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.paperDim,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.ink,
  },
  checkingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 12,
  },
  checkingText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  subBlockTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.ink,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 10,
    marginBottom: 8,
  },
  datesRow: {
    gap: 8,
    paddingBottom: 14,
  },
  datePill: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  datePillActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  datePillLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
  },
  datePillName: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.ink,
    marginTop: 2,
  },
  datePillTextActive: {
    color: COLORS.paper,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  timeSlotBtn: {
    width: "31%",
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    paddingVertical: 9,
    alignItems: "center",
  },
  timeSlotBtnActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  timeSlotBtnDisabled: {
    backgroundColor: COLORS.paperDim,
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  slotClock: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.ink,
  },
  slotClockActive: {
    color: COLORS.paper,
  },
  slotPeriod: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  slotPeriodActive: {
    color: "rgba(247, 244, 238, 0.7)",
  },
  slotDisabledText: {
    color: COLORS.inkFaint,
  },
  silentOptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    padding: 12,
    gap: 10,
    marginTop: 6,
  },
  checkboxOuter: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: COLORS.inkSecondary,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxOuterActive: {
    backgroundColor: COLORS.accentRed,
    borderColor: COLORS.accentRed,
  },
  checkboxCheck: {
    color: COLORS.paper,
    fontSize: 12,
    fontWeight: "700",
  },
  silentOptionText: {
    flex: 1,
    gap: 2,
  },
  silentOptionTitle: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.ink,
  },
  silentOptionDesc: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.inkMuted,
    lineHeight: 15,
  },
  formContainer: {
    gap: 12,
  },
  fieldItem: {
    gap: 4,
  },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: COLORS.ink,
    letterSpacing: 0.4,
  },
  fieldInput: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.ink,
  },
  reviewBox: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 2,
    padding: 12,
    gap: 6,
    marginVertical: 6,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewKey: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: COLORS.inkMuted,
  },
  reviewVal: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    fontWeight: "600",
    color: COLORS.ink,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginTop: 4,
  },
  totalKey: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.ink,
  },
  totalPrice: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.accentRed,
  },
  depositNotice: {
    fontFamily: FONTS.sans,
    fontSize: 10.5,
    lineHeight: 15,
    color: COLORS.inkMuted,
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: COLORS.ink,
    paddingVertical: 14,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  submitBtnArrow: {
    color: COLORS.paper,
    fontSize: 15,
  },
  confirmationWrap: {
    gap: 14,
    alignItems: "center",
  },
  confBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.statusGreenBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 2,
    gap: 6,
  },
  confBadgeCheck: {
    fontSize: 12,
    color: COLORS.statusGreen,
    fontWeight: "700",
  },
  confBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: COLORS.statusGreen,
    fontWeight: "600",
  },
  confTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.ink,
    textAlign: "center",
  },
  confDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.inkSecondary,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "700",
    color: COLORS.ink,
  },
  ticketCard: {
    width: "100%",
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 3,
    padding: 14,
    gap: 8,
    marginVertical: 8,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketLabel: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: COLORS.inkMuted,
  },
  ticketRef: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.accentRed,
  },
  ticketValue: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.ink,
    textAlign: "right",
    maxWidth: "60%",
  },
  ticketDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  confActions: {
    width: "100%",
    gap: 10,
    marginTop: 10,
  },
  returnBtn: {
    backgroundColor: COLORS.ink,
    paddingVertical: 13,
    borderRadius: 2,
    alignItems: "center",
  },
  returnBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    fontWeight: "700",
  },
  calBtn: {
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    paddingVertical: 12,
    borderRadius: 2,
    alignItems: "center",
  },
  calBtnText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.inkSecondary,
    fontWeight: "600",
  },
  modalFootBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.paperLight,
  },
  prevBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  prevBtnText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.inkMuted,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: COLORS.ink,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 2,
  },
  nextBtnText: {
    color: COLORS.paper,
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
